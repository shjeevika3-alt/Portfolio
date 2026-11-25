import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { DEFAULT_PORTFOLIO_DATA } from './src/data/defaultPortfolio.ts';
import type { PortfolioData, ContactSubmission, ResumeStatus } from './src/types/portfolio.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Confine all persistent server files inside DATA_DIR
const DATA_DIR = path.resolve(process.cwd(), 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

function safeDataPath(fileName: string): string {
  const resolved = path.resolve(DATA_DIR, fileName);
  if (!resolved.startsWith(DATA_DIR + path.sep)) {
    throw new Error('Invalid file path');
  }
  return resolved;
}

const PORTFOLIO_FILE = safeDataPath('portfolio.json');
const MESSAGES_FILE = safeDataPath('messages.json');
const AUTH_FILE = safeDataPath('auth.json');
const RESUME_FILE = safeDataPath('resume.pdf');
const RESUME_META_FILE = safeDataPath('resume-meta.json');
const PHOTO_META_FILE = safeDataPath('photo-meta.json');

// Ephemeral fallback signing key when SESSION_SECRET is unset
const TOKEN_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// Middleware
app.set('trust proxy', 1);
app.use(express.json({ limit: '8mb' }));

// Simple per-IP rate limiter for contact submissions and auth attempts
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateBuckets.get(key);
  if (!entry || now > entry.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

// Helpers for JSON storage
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// URL & text sanitization helpers
function isSafeUrl(url: string | undefined, allowRelative = false): boolean {
  if (!url) return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (allowRelative && trimmed.startsWith('/')) {
    return !trimmed.startsWith('//');
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function sanitizeText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

// Auth helpers (supports process.env.PORTFOLIO_ADMIN_PASSCODE or first-run scrypt claim)
interface StoredAuth {
  salt: string;
  hash: string;
  createdAt: string;
}

function hashPasscode(passcode: string, salt: string): string {
  return crypto.scryptSync(passcode, salt, 64).toString('hex');
}

function verifyPasscode(passcode: string): boolean {
  const envPasscode = process.env.PORTFOLIO_ADMIN_PASSCODE?.trim();
  if (envPasscode) {
    const a = Buffer.from(passcode);
    const b = Buffer.from(envPasscode);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
  const stored = readJsonFile<StoredAuth | null>(AUTH_FILE, null);
  if (!stored) return false;
  const candidate = Buffer.from(hashPasscode(passcode, stored.salt), 'hex');
  const expected = Buffer.from(stored.hash, 'hex');
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

function isAuthConfigured(): boolean {
  if (process.env.PORTFOLIO_ADMIN_PASSCODE?.trim()) return true;
  return fs.existsSync(AUTH_FILE);
}

function signSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      role: 'owner',
      exp: Date.now() + 1000 * 60 * 60 * 12, // 12h
      nonce: crypto.randomBytes(8).toString('hex'),
    })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'owner' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function requireOwnerAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  if (!verifySessionToken(token)) {
    res.status(401).json({ error: 'Owner authentication required.' });
    return;
  }
  next();
}

// --- API Routes ---

// Auth status & setup/login
app.get('/api/auth/status', (_req, res) => {
  res.json({
    configured: isAuthConfigured(),
    envManaged: Boolean(process.env.PORTFOLIO_ADMIN_PASSCODE?.trim()),
  });
});

app.post('/api/auth/setup', (req, res) => {
  const ip = req.ip || 'unknown';
  if (!checkRateLimit(`auth-setup:${ip}`, 10, 15 * 60 * 1000)) {
    res.status(429).json({ error: 'Too many requests. Please wait a few minutes.' });
    return;
  }
  if (isAuthConfigured()) {
    res.status(409).json({ error: 'Owner passcode is already configured. Please sign in.' });
    return;
  }
  const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
  if (passcode.length < 4 || passcode.length > 64) {
    res.status(400).json({ error: 'Passcode must be between 4 and 64 characters.' });
    return;
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPasscode(passcode, salt);
  writeJsonFile(AUTH_FILE, {
    salt,
    hash,
    createdAt: new Date().toISOString(),
  } satisfies StoredAuth);

  res.status(201).json({
    ok: true,
    token: signSessionToken(),
  });
});

app.post('/api/auth/login', (req, res) => {
  const ip = req.ip || 'unknown';
  if (!checkRateLimit(`auth-login:${ip}`, 15, 15 * 60 * 1000)) {
    res.status(429).json({ error: 'Too many sign-in attempts. Please wait a few minutes.' });
    return;
  }
  if (!isAuthConfigured()) {
    res.status(400).json({ error: 'Owner passcode is not set up yet.' });
    return;
  }
  const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
  if (!verifyPasscode(passcode)) {
    res.status(401).json({ error: 'Invalid passcode.' });
    return;
  }
  res.json({
    ok: true,
    token: signSessionToken(),
  });
});

// Portfolio GET & PUT
app.get('/api/portfolio', (_req, res) => {
  const saved = readJsonFile<PortfolioData | null>(PORTFOLIO_FILE, null);
  res.json(saved ?? DEFAULT_PORTFOLIO_DATA);
});

app.put('/api/portfolio', requireOwnerAuth, (req, res) => {
  const body = req.body as Partial<PortfolioData> | undefined;
  if (!body || !body.profile || !Array.isArray(body.skills) || !Array.isArray(body.projects)) {
    res.status(400).json({ error: 'Invalid portfolio payload.' });
    return;
  }

  // Validate URLs across projects, social links, and profile photo
  if (!isSafeUrl(body.profile.profilePhotoUrl, true)) {
    res.status(400).json({ error: 'Invalid profile photo URL.' });
    return;
  }
  if (body.social) {
    if (!isSafeUrl(body.social.linkedin) || !isSafeUrl(body.social.github)) {
      res.status(400).json({ error: 'Social links must use http:// or https://.' });
      return;
    }
  }
  for (const proj of body.projects) {
    if (!isSafeUrl(proj.liveDemoUrl) || !isSafeUrl(proj.githubUrl) || !isSafeUrl(proj.screenshotUrl, true)) {
      res.status(400).json({ error: `Invalid URL detected in project "${sanitizeText(proj.title, 60)}".` });
      return;
    }
  }

  const sanitized: PortfolioData = {
    profile: {
      name: sanitizeText(body.profile.name, 80) || DEFAULT_PORTFOLIO_DATA.profile.name,
      headline: sanitizeText(body.profile.headline, 180),
      identityLine: sanitizeText(body.profile.identityLine, 180),
      degreeShort: sanitizeText(body.profile.degreeShort, 100),
      department: sanitizeText(body.profile.department, 120),
      year: sanitizeText(body.profile.year, 40),
      college: sanitizeText(body.profile.college, 140),
      city: sanitizeText(body.profile.city, 100),
      profilePhotoUrl: sanitizeText(body.profile.profilePhotoUrl, 500) || DEFAULT_PORTFOLIO_DATA.profile.profilePhotoUrl,
      aboutParagraphs: Array.isArray(body.profile.aboutParagraphs)
        ? body.profile.aboutParagraphs.map((p) => sanitizeText(p, 1200)).filter(Boolean)
        : [],
      careerGoal: sanitizeText(body.profile.careerGoal, 1200),
      resumeSummary: sanitizeText(body.profile.resumeSummary, 1200),
    },
    skills: body.skills.slice(0, 60).map((s) => ({
      id: sanitizeText(s.id, 60) || crypto.randomUUID(),
      name: sanitizeText(s.name, 80),
      category: s.category,
      level: Math.max(0, Math.min(100, Number(s.level) || 0)),
      status: s.status,
      note: sanitizeText(s.note, 240),
    })),
    projects: body.projects.slice(0, 30).map((p) => ({
      id: sanitizeText(p.id, 60) || crypto.randomUUID(),
      title: sanitizeText(p.title, 100),
      category: p.category || 'AI Application',
      summary: sanitizeText(p.summary, 600),
      problemStatement: sanitizeText(p.problemStatement, 800),
      proposedSolution: sanitizeText(p.proposedSolution, 800),
      features: Array.isArray(p.features) ? p.features.map((f) => sanitizeText(f, 200)).filter(Boolean) : [],
      technologies: Array.isArray(p.technologies) ? p.technologies.map((t) => sanitizeText(t, 60)).filter(Boolean) : [],
      roleAndContributions: sanitizeText(p.roleAndContributions, 600),
      screenshotUrl: sanitizeText(p.screenshotUrl, 500),
      liveDemoUrl: sanitizeText(p.liveDemoUrl, 500),
      githubUrl: sanitizeText(p.githubUrl, 500) || undefined,
    })),
    education: Array.isArray(body.education) ? body.education.slice(0, 15) : DEFAULT_PORTFOLIO_DATA.education,
    experience: Array.isArray(body.experience) ? body.experience.slice(0, 20) : DEFAULT_PORTFOLIO_DATA.experience,
    achievements: Array.isArray(body.achievements) ? body.achievements.slice(0, 40) : DEFAULT_PORTFOLIO_DATA.achievements,
    social: {
      email: sanitizeText(body.social?.email, 140),
      linkedin: sanitizeText(body.social?.linkedin, 300),
      github: sanitizeText(body.social?.github, 300),
      location: sanitizeText(body.social?.location, 120),
    },
  };

  writeJsonFile(PORTFOLIO_FILE, sanitized);
  res.json(sanitized);
});

// Resume Upload / Status / Download
app.get('/api/resume/status', (_req, res) => {
  if (!fs.existsSync(RESUME_FILE)) {
    res.json({ uploaded: false } satisfies ResumeStatus);
    return;
  }
  const meta = readJsonFile<Partial<ResumeStatus>>(RESUME_META_FILE, {});
  const stats = fs.statSync(RESUME_FILE);
  res.json({
    uploaded: true,
    fileName: meta.fileName || 'Jeevika_Resume.pdf',
    uploadedAt: meta.uploadedAt || stats.mtime.toISOString(),
    sizeBytes: stats.size,
  } satisfies ResumeStatus);
});

app.get('/api/resume', (_req, res) => {
  if (!fs.existsSync(RESUME_FILE)) {
    res.status(404).json({ error: 'No resume PDF has been uploaded yet.' });
    return;
  }
  const meta = readJsonFile<Partial<ResumeStatus>>(RESUME_META_FILE, {});
  const downloadName = (meta.fileName || 'Jeevika_Resume.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  fs.createReadStream(RESUME_FILE).pipe(res);
});

app.post('/api/resume', requireOwnerAuth, (req, res) => {
  const fileName = sanitizeText(req.body?.fileName, 120) || 'Jeevika_Resume.pdf';
  const dataBase64 = typeof req.body?.dataBase64 === 'string' ? req.body.dataBase64 : '';
  if (!dataBase64) {
    res.status(400).json({ error: 'Missing PDF file data.' });
    return;
  }

  const cleaned = dataBase64.replace(/^data:application\/pdf;base64,/, '');
  const buffer = Buffer.from(cleaned, 'base64');

  // Verify PDF magic header (%PDF-) and size limit (5MB)
  if (buffer.length < 5 || buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
    res.status(400).json({ error: 'Uploaded file must be a valid PDF document.' });
    return;
  }
  if (buffer.length > 5 * 1024 * 1024) {
    res.status(400).json({ error: 'Resume PDF must be 5 MB or smaller.' });
    return;
  }

  fs.writeFileSync(RESUME_FILE, buffer);
  const status: ResumeStatus = {
    uploaded: true,
    fileName: fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`,
    uploadedAt: new Date().toISOString(),
    sizeBytes: buffer.length,
  };
  writeJsonFile(RESUME_META_FILE, status);
  res.status(201).json(status);
});

app.delete('/api/resume', requireOwnerAuth, (_req, res) => {
  if (fs.existsSync(RESUME_FILE)) fs.unlinkSync(RESUME_FILE);
  if (fs.existsSync(RESUME_META_FILE)) fs.unlinkSync(RESUME_META_FILE);
  res.json({ uploaded: false } satisfies ResumeStatus);
});

// Profile Photo Upload / Serve
app.post('/api/profile-photo', requireOwnerAuth, (req, res) => {
  const dataBase64 = typeof req.body?.dataBase64 === 'string' ? req.body.dataBase64 : '';
  if (!dataBase64) {
    res.status(400).json({ error: 'Missing image data.' });
    return;
  }
  const match = dataBase64.match(/^data:(image\/(png|jpeg|webp));base64,(.+)$/);
  if (!match) {
    res.status(400).json({ error: 'Photo must be a PNG, JPEG, or WebP image.' });
    return;
  }
  const mime = match[1];
  const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
  const buffer = Buffer.from(match[3], 'base64');
  if (buffer.length > 3 * 1024 * 1024) {
    res.status(400).json({ error: 'Profile photo must be 3 MB or smaller.' });
    return;
  }

  // Validate image magic bytes
  const isPng = buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  const isJpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isWebp = buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  if (!isPng && !isJpg && !isWebp) {
    res.status(400).json({ error: 'Invalid image file signature.' });
    return;
  }

  const photoFile = safeDataPath(`profile-photo.${ext}`);
  fs.writeFileSync(photoFile, buffer);
  writeJsonFile(PHOTO_META_FILE, { fileName: `profile-photo.${ext}`, mime });

  const photoUrl = `/api/profile-photo?v=${Date.now()}`;
  const current = readJsonFile<PortfolioData>(PORTFOLIO_FILE, DEFAULT_PORTFOLIO_DATA);
  current.profile.profilePhotoUrl = photoUrl;
  writeJsonFile(PORTFOLIO_FILE, current);

  res.status(201).json({ ok: true, profilePhotoUrl: photoUrl });
});

app.get('/api/profile-photo', (_req, res) => {
  const meta = readJsonFile<{ fileName?: string; mime?: string } | null>(PHOTO_META_FILE, null);
  if (!meta?.fileName || !meta.mime) {
    res.status(404).end();
    return;
  }
  try {
    const filePath = safeDataPath(meta.fileName);
    if (!fs.existsSync(filePath)) {
      res.status(404).end();
      return;
    }
    res.setHeader('Content-Type', meta.mime);
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.status(404).end();
  }
});

// Contact Form Submission & Owner Message Inbox
app.post('/api/contact', (req, res) => {
  const ip = req.ip || 'unknown';
  if (!checkRateLimit(`contact:${ip}`, 10, 15 * 60 * 1000)) {
    res.status(429).json({ error: 'Too many messages sent recently. Please try again later.' });
    return;
  }

  const name = sanitizeText(req.body?.name, 100);
  const email = sanitizeText(req.body?.email, 140);
  const subject = sanitizeText(req.body?.subject, 160);
  const message = sanitizeText(req.body?.message, 2500);

  if (name.length < 2) {
    res.status(400).json({ error: 'Please enter your name (at least 2 characters).' });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }
  if (message.length < 10) {
    res.status(400).json({ error: 'Please enter a message of at least 10 characters.' });
    return;
  }

  const submission: ContactSubmission = {
    id: crypto.randomUUID(),
    name,
    email,
    subject: subject || 'Portfolio Inquiry',
    message,
    submittedAt: new Date().toISOString(),
  };

  const existing = readJsonFile<ContactSubmission[]>(MESSAGES_FILE, []);
  existing.unshift(submission);
  writeJsonFile(MESSAGES_FILE, existing.slice(0, 200));

  res.status(201).json({
    ok: true,
    id: submission.id,
    submittedAt: submission.submittedAt,
  });
});

app.get('/api/messages', requireOwnerAuth, (_req, res) => {
  const messages = readJsonFile<ContactSubmission[]>(MESSAGES_FILE, []);
  res.json({ messages });
});

app.delete('/api/messages/:id', requireOwnerAuth, (req, res) => {
  const id = sanitizeText(req.params.id, 80);
  const messages = readJsonFile<ContactSubmission[]>(MESSAGES_FILE, []);
  const filtered = messages.filter((m) => m.id !== id);
  writeJsonFile(MESSAGES_FILE, filtered);
  res.json({ ok: true });
});

// Vite dev middleware or static production serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
