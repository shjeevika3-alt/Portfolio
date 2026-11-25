import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Check,
  FileUp,
  Lock,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type {
  AchievementCategory,
  AchievementItem,
  ContactSubmission,
  PortfolioData,
  ProjectItem,
  ResumeStatus,
  SkillCategoryKey,
  SkillItem,
} from '../types/portfolio';

interface PortfolioEditorModalProps {
  open: boolean;
  onClose: () => void;
  data: PortfolioData;
  resumeStatus: ResumeStatus;
  authToken: string | null;
  onAuthenticated: (token: string) => void;
  onSaveData: (updated: PortfolioData) => Promise<void>;
  onResumeUpdated: (status: ResumeStatus) => void;
}

type EditorTab = 'profile' | 'projects' | 'skills' | 'achievements' | 'resume' | 'inbox';

const SKILL_CATEGORIES: SkillCategoryKey[] = [
  'Programming',
  'Web Development',
  'Tools and Technologies',
  'AI and Development',
];

const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  'Technical Workshops',
  'Hackathons',
  'AI Club Participation',
  'Certifications',
  'Academic Achievements',
  'Technical Competitions',
];

export default function PortfolioEditorModal({
  open,
  onClose,
  data,
  resumeStatus,
  authToken,
  onAuthenticated,
  onSaveData,
  onResumeUpdated,
}: PortfolioEditorModalProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('profile');
  const [draft, setDraft] = useState<PortfolioData>(data);

  // Auth states
  const [authConfigured, setAuthConfigured] = useState<boolean | null>(null);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  // Save / upload feedback
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Inbox messages
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    setDraft(structuredClone(data));
  }, [data, open]);

  useEffect(() => {
    if (!open) return;
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((payload: { configured: boolean }) => setAuthConfigured(payload.configured))
      .catch(() => setAuthConfigured(true));
  }, [open]);

  useEffect(() => {
    if (!open || !authToken || activeTab !== 'inbox') return;
    setLoadingMessages(true);
    fetch('/api/messages', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((payload: { messages?: ContactSubmission[] }) => {
        setMessages(payload.messages ?? []);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
  }, [open, authToken, activeTab]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handleAuthSubmit(e: FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthBusy(true);

    const endpoint = authConfigured ? '/api/auth/login' : '/api/auth/setup';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput }),
      });
      const payload = (await res.json()) as { ok?: boolean; token?: string; error?: string };
      if (!res.ok || !payload.token) {
        setAuthError(payload.error || 'Authentication failed.');
        return;
      }
      setPasscodeInput('');
      setAuthConfigured(true);
      onAuthenticated(payload.token);
    } catch {
      setAuthError('Network error during authentication.');
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSaveAll() {
    setSaving(true);
    setFeedback(null);
    try {
      await onSaveData(draft);
      setFeedback({ type: 'success', text: 'Portfolio changes saved.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save portfolio.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !authToken) return;
    if (file.size > 3 * 1024 * 1024) {
      setFeedback({ type: 'error', text: 'Profile photo must be 3 MB or smaller.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataBase64 = typeof reader.result === 'string' ? reader.result : '';
      try {
        const res = await fetch('/api/profile-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ dataBase64 }),
        });
        const payload = (await res.json()) as { profilePhotoUrl?: string; error?: string };
        if (!res.ok || !payload.profilePhotoUrl) {
          setFeedback({ type: 'error', text: payload.error || 'Could not upload photo.' });
          return;
        }
        const updated = {
          ...draft,
          profile: { ...draft.profile, profilePhotoUrl: payload.profilePhotoUrl },
        };
        setDraft(updated);
        await onSaveData(updated);
        setFeedback({ type: 'success', text: 'Profile photo updated.' });
      } catch {
        setFeedback({ type: 'error', text: 'Failed to upload profile photo.' });
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleResumeUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !authToken) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFeedback({ type: 'error', text: 'Please select a valid PDF file.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', text: 'Resume PDF must be 5 MB or smaller.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataBase64 = typeof reader.result === 'string' ? reader.result : '';
      try {
        const res = await fetch('/api/resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ fileName: file.name, dataBase64 }),
        });
        const payload = (await res.json()) as ResumeStatus & { error?: string };
        if (!res.ok || !payload.uploaded) {
          setFeedback({ type: 'error', text: payload.error || 'Resume upload failed.' });
          return;
        }
        onResumeUpdated(payload);
        setFeedback({ type: 'success', text: `Uploaded ${payload.fileName}.` });
      } catch {
        setFeedback({ type: 'error', text: 'Network error uploading resume.' });
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleDeleteResume() {
    if (!authToken) return;
    try {
      const res = await fetch('/api/resume', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const payload = (await res.json()) as ResumeStatus;
      onResumeUpdated(payload);
      setFeedback({ type: 'success', text: 'Uploaded PDF resume removed.' });
    } catch {
      setFeedback({ type: 'error', text: 'Failed to remove resume PDF.' });
    }
  }

  async function handleDeleteMessage(id: string) {
    if (!authToken) return;
    try {
      await fetch(`/api/messages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // Ignore error
    }
  }

  // Project helpers
  function addProject() {
    const newProject: ProjectItem = {
      id: `project-${Date.now()}`,
      title: 'New Project',
      category: 'AI Application',
      summary: 'Brief overview of what the project does and who it helps.',
      problemStatement: 'Describe the core problem being solved.',
      proposedSolution: 'Describe your proposed solution.',
      features: ['Core feature 1', 'Core feature 2'],
      technologies: ['Python', 'JavaScript'],
      roleAndContributions: 'Solo developer — design, implementation, and deployment.',
      screenshotUrl: '/src/assets/images/project_smartfood_ai_1795578448920.jpg',
      liveDemoUrl: 'https://example.com',
      githubUrl: '',
    };
    setDraft((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  }

  function updateProject(index: number, patch: Partial<ProjectItem>) {
    setDraft((prev) => {
      const next = [...prev.projects];
      next[index] = { ...next[index], ...patch };
      return { ...prev, projects: next };
    });
  }

  function removeProject(index: number) {
    setDraft((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  }

  // Skill helpers
  function addSkill() {
    const newSkill: SkillItem = {
      id: `skill-${Date.now()}`,
      name: 'New Skill',
      category: 'Programming',
      level: 50,
      status: 'Learning',
      note: '',
    };
    setDraft((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
  }

  function updateSkill(index: number, patch: Partial<SkillItem>) {
    setDraft((prev) => {
      const next = [...prev.skills];
      next[index] = { ...next[index], ...patch };
      return { ...prev, skills: next };
    });
  }

  function removeSkill(index: number) {
    setDraft((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  }

  // Achievement helpers
  function addAchievement() {
    const newAch: AchievementItem = {
      id: `ach-${Date.now()}`,
      category: 'Certifications',
      title: 'New Achievement or Certificate',
      issuerOrEvent: 'Organization / Event Name',
      dateLabel: '2026',
      description: 'Short description of what you built or earned.',
      isPlaceholder: false,
    };
    setDraft((prev) => ({ ...prev, achievements: [...prev.achievements, newAch] }));
  }

  function updateAchievement(index: number, patch: Partial<AchievementItem>) {
    setDraft((prev) => {
      const next = [...prev.achievements];
      next[index] = { ...next[index], ...patch };
      return { ...prev, achievements: next };
    });
  }

  function removeAchievement(index: number) {
    setDraft((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio Editor"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass-surface relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#121010] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#F5F4F2]">Portfolio Editor</h2>
            <p className="text-xs text-[#A8A39E]">
              Manage projects, skill levels, social links, achievements, resume PDF, and messages.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Portfolio Editor"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#A8A39E] hover:border-[#D46B48]/50 hover:text-[#F5F4F2]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Auth Gate */}
        {!authToken ? (
          <div className="p-8 sm:p-12">
            <form onSubmit={handleAuthSubmit} className="mx-auto max-w-md space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D46B48]/30 bg-[#D46B48]/10 text-[#D46B48]">
                <Lock className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-[#F5F4F2]">
                  {authConfigured === false ? 'Set Up Owner Passcode' : 'Unlock Portfolio Editor'}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#A8A39E]">
                  {authConfigured === false
                    ? 'Create your private owner passcode once to protect portfolio edits, resume uploads, and contact messages.'
                    : 'Enter your owner passcode to save edits, manage projects, upload your resume, or view contact messages.'}
                </p>
              </div>

              <div>
                <label htmlFor="owner-passcode" className="block text-xs font-medium text-[#D6D2CE]">
                  {authConfigured === false ? 'Choose Passcode (min 4 characters)' : 'Owner Passcode'}
                </label>
                <input
                  id="owner-passcode"
                  type="password"
                  required
                  minLength={4}
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter passcode..."
                  className="mt-2 w-full rounded-lg border border-white/12 bg-[#0B0A0A] px-4 py-2.5 text-sm text-[#F5F4F2] focus:border-[#D46B48] focus:outline-none"
                />
              </div>

              {authError && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-200">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={authBusy}
                className="w-full rounded-lg bg-[#D46B48] px-5 py-2.5 text-sm font-semibold text-[#0B0A0A] transition-colors hover:bg-[#E07A58] disabled:opacity-60"
              >
                {authBusy
                  ? 'Verifying...'
                  : authConfigured === false
                    ? 'Claim Owner Passcode & Unlock'
                    : 'Unlock Editor'}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-white/8 px-6 py-3 bg-white/[0.015]">
              {(
                [
                  ['profile', 'Profile & Links'],
                  ['projects', `Projects (${draft.projects.length})`],
                  ['skills', `Skills (${draft.skills.length})`],
                  ['achievements', 'Achievements'],
                  ['resume', 'Resume PDF'],
                  ['inbox', 'Contact Inbox'],
                ] as [EditorTab, string][]
              ).map(([tabKey, label]) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveTab(tabKey)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    activeTab === tabKey
                      ? 'bg-[#D46B48] text-[#0B0A0A] font-semibold'
                      : 'text-[#A8A39E] hover:text-[#F5F4F2] hover:bg-white/[0.04]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {feedback && (
                <div
                  className={`rounded-lg border px-4 py-3 text-xs ${
                    feedback.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-red-500/30 bg-red-500/10 text-red-200'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              {/* PROFILE & LINKS TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#D6D2CE]">Name</label>
                      <input
                        type="text"
                        value={draft.profile.name}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, profile: { ...p.profile, name: e.target.value } }))
                        }
                        className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3.5 py-2 text-sm text-[#F5F4F2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#D6D2CE]">Academic Year</label>
                      <input
                        type="text"
                        value={draft.profile.year}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, profile: { ...p.profile, year: e.target.value } }))
                        }
                        className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3.5 py-2 text-sm text-[#F5F4F2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#D6D2CE]">Headline</label>
                    <input
                      type="text"
                      value={draft.profile.headline}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, profile: { ...p.profile, headline: e.target.value } }))
                      }
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3.5 py-2 text-sm text-[#F5F4F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#D6D2CE]">Professional Identity</label>
                    <input
                      type="text"
                      value={draft.profile.identityLine}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, profile: { ...p.profile, identityLine: e.target.value } }))
                      }
                      className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3.5 py-2 text-sm text-[#F5F4F2]"
                    />
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#F5F4F2]">Profile Portrait Photo</p>
                      <p className="text-xs text-[#A8A39E]">Upload a PNG, JPG, or WebP portrait (max 3 MB).</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {draft.profile.profilePhotoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((p) => ({
                              ...p,
                              profile: { ...p.profile, profilePhotoUrl: '' },
                            }))
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-2 text-xs font-medium text-red-300 hover:border-red-400/50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/12 px-4 py-2 text-xs font-medium text-[#F5F4F2] hover:border-[#D46B48]/50">
                        <Upload className="h-3.5 w-3.5 text-[#D46B48]" />
                        <span>Upload Photo</span>
                        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="border-t border-white/8 pt-5">
                    <h3 className="font-display text-sm font-semibold text-[#F5F4F2]">Social &amp; Contact Links</h3>
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-[#A8A39E]">Email Address</label>
                        <input
                          type="email"
                          value={draft.social.email}
                          onChange={(e) =>
                            setDraft((p) => ({ ...p, social: { ...p.social, email: e.target.value } }))
                          }
                          className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3.5 py-2 text-sm text-[#F5F4F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A8A39E]">Location</label>
                        <input
                          type="text"
                          value={draft.social.location}
                          onChange={(e) =>
                            setDraft((p) => ({ ...p, social: { ...p.social, location: e.target.value } }))
                          }
                          className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3.5 py-2 text-sm text-[#F5F4F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A8A39E]">LinkedIn URL</label>
                        <input
                          type="url"
                          value={draft.social.linkedin}
                          onChange={(e) =>
                            setDraft((p) => ({ ...p, social: { ...p.social, linkedin: e.target.value } }))
                          }
                          className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3.5 py-2 text-sm text-[#F5F4F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A8A39E]">GitHub URL</label>
                        <input
                          type="url"
                          value={draft.social.github}
                          onChange={(e) =>
                            setDraft((p) => ({ ...p, social: { ...p.social, github: e.target.value } }))
                          }
                          className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3.5 py-2 text-sm text-[#F5F4F2]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#A8A39E]">Add, edit, or remove portfolio projects.</p>
                    <button
                      type="button"
                      onClick={addProject}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#D46B48] px-3.5 py-2 text-xs font-semibold text-[#0B0A0A]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  {draft.projects.map((proj, idx) => (
                    <div key={proj.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-display text-base font-semibold text-[#F5F4F2]">{proj.title || 'Untitled Project'}</h4>
                        <button
                          type="button"
                          onClick={() => removeProject(idx)}
                          className="inline-flex items-center gap-1 text-xs text-red-300 hover:text-red-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-[#A8A39E]">Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => updateProject(idx, { title: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3 py-2 text-sm text-[#F5F4F2]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#A8A39E]">Category</label>
                          <select
                            value={proj.category}
                            onChange={(e) =>
                              updateProject(idx, { category: e.target.value as ProjectItem['category'] })
                            }
                            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3 py-2 text-sm text-[#F5F4F2]"
                          >
                            <option value="AI Application">AI Application</option>
                            <option value="Web Platform">Web Platform</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#A8A39E]">Live Demo URL</label>
                          <input
                            type="url"
                            value={proj.liveDemoUrl}
                            onChange={(e) => updateProject(idx, { liveDemoUrl: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3 py-2 text-sm text-[#F5F4F2]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#A8A39E]">GitHub URL (Optional)</label>
                          <input
                            type="url"
                            value={proj.githubUrl ?? ''}
                            placeholder="Leave blank if private/unavailable"
                            onChange={(e) => updateProject(idx, { githubUrl: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3 py-2 text-sm text-[#F5F4F2]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-[#A8A39E]">Summary</label>
                        <textarea
                          rows={2}
                          value={proj.summary}
                          onChange={(e) => updateProject(idx, { summary: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3 py-2 text-sm text-[#F5F4F2]"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-[#A8A39E]">Problem Statement</label>
                          <textarea
                            rows={2}
                            value={proj.problemStatement}
                            onChange={(e) => updateProject(idx, { problemStatement: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3 py-2 text-sm text-[#F5F4F2]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#A8A39E]">Proposed Solution</label>
                          <textarea
                            rows={2}
                            value={proj.proposedSolution}
                            onChange={(e) => updateProject(idx, { proposedSolution: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3 py-2 text-sm text-[#F5F4F2]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-[#A8A39E]">Key Features (one per line)</label>
                          <textarea
                            rows={3}
                            value={proj.features.join('\n')}
                            onChange={(e) =>
                              updateProject(idx, {
                                features: e.target.value.split('\n').map((f) => f.trim()).filter(Boolean),
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3 py-2 text-xs text-[#F5F4F2]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#A8A39E]">Technologies (comma-separated)</label>
                          <input
                            type="text"
                            value={proj.technologies.join(', ')}
                            onChange={(e) =>
                              updateProject(idx, {
                                technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3 py-2 text-xs text-[#F5F4F2]"
                          />
                          <label className="mt-3 block text-xs text-[#A8A39E]">Role &amp; Contributions</label>
                          <input
                            type="text"
                            value={proj.roleAndContributions}
                            onChange={(e) => updateProject(idx, { roleAndContributions: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0A0A] px-3 py-2 text-xs text-[#F5F4F2]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SKILLS TAB */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#A8A39E]">Adjust skill levels honestly or add new skills.</p>
                    <button
                      type="button"
                      onClick={addSkill}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#D46B48] px-3.5 py-2 text-xs font-semibold text-[#0B0A0A]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Skill</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {draft.skills.map((skill, idx) => (
                      <div key={skill.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => updateSkill(idx, { name: e.target.value })}
                            className="w-full rounded-md border border-white/10 bg-[#0B0A0A] px-2.5 py-1.5 text-sm font-semibold text-[#F5F4F2]"
                          />
                          <button
                            type="button"
                            onClick={() => removeSkill(idx)}
                            aria-label={`Remove ${skill.name}`}
                            className="text-red-300 hover:text-red-200 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={skill.category}
                            onChange={(e) =>
                              updateSkill(idx, { category: e.target.value as SkillCategoryKey })
                            }
                            className="rounded-md border border-white/10 bg-[#0B0A0A] px-2.5 py-1.5 text-xs text-[#D6D2CE]"
                          >
                            {SKILL_CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>

                          <select
                            value={skill.status}
                            onChange={(e) =>
                              updateSkill(idx, { status: e.target.value as SkillItem['status'] })
                            }
                            className="rounded-md border border-white/10 bg-[#0B0A0A] px-2.5 py-1.5 text-xs text-[#D6D2CE]"
                          >
                            <option value="Proficient">Proficient</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Foundational">Foundational</option>
                            <option value="Learning">Learning</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-[#A8A39E]">
                            <span>Proficiency Level</span>
                            <span className="font-mono text-[#D46B48] tabular-nums">{skill.level}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={skill.level}
                            onChange={(e) => updateSkill(idx, { level: Number(e.target.value) })}
                            className="mt-1 w-full accent-[#D46B48]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACHIEVEMENTS TAB */}
              {activeTab === 'achievements' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#A8A39E]">
                      Replace placeholder slots with your verified certificates, hackathons, and workshops.
                    </p>
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#D46B48] px-3.5 py-2 text-xs font-semibold text-[#0B0A0A]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Milestone</span>
                    </button>
                  </div>

                  {draft.achievements.map((ach, idx) => (
                    <div key={ach.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="inline-flex items-center gap-2 text-xs text-[#D6D2CE]">
                          <input
                            type="checkbox"
                            checked={!ach.isPlaceholder}
                            onChange={(e) => updateAchievement(idx, { isPlaceholder: !e.target.checked })}
                            className="accent-[#D46B48]"
                          />
                          <span>Verified Entry (uncheck to keep as editable placeholder)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeAchievement(idx)}
                          className="inline-flex items-center gap-1 text-xs text-red-300 hover:text-red-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <select
                          value={ach.category}
                          onChange={(e) =>
                            updateAchievement(idx, { category: e.target.value as AchievementCategory })
                          }
                          className="rounded-md border border-white/10 bg-[#0B0A0A] px-3 py-2 text-xs text-[#F5F4F2]"
                        >
                          {ACHIEVEMENT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={ach.title}
                          onChange={(e) => updateAchievement(idx, { title: e.target.value })}
                          placeholder="Title"
                          className="rounded-md border border-white/10 bg-[#0B0A0A] px-3 py-2 text-xs text-[#F5F4F2]"
                        />
                        <input
                          type="text"
                          value={ach.dateLabel}
                          onChange={(e) => updateAchievement(idx, { dateLabel: e.target.value })}
                          placeholder="Date / Year"
                          className="rounded-md border border-white/10 bg-[#0B0A0A] px-3 py-2 text-xs text-[#F5F4F2]"
                        />
                      </div>

                      <input
                        type="text"
                        value={ach.issuerOrEvent}
                        onChange={(e) => updateAchievement(idx, { issuerOrEvent: e.target.value })}
                        placeholder="Organizer / Institution"
                        className="w-full rounded-md border border-white/10 bg-[#0B0A0A] px-3 py-2 text-xs text-[#F5F4F2]"
                      />

                      <textarea
                        rows={2}
                        value={ach.description}
                        onChange={(e) => updateAchievement(idx, { description: e.target.value })}
                        placeholder="Description"
                        className="w-full rounded-md border border-white/10 bg-[#0B0A0A] px-3 py-2 text-xs text-[#F5F4F2]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* RESUME PDF TAB */}
              {activeTab === 'resume' && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-base font-semibold text-[#F5F4F2]">
                          Upload Resume PDF
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-[#A8A39E]">
                          Once uploaded, visitors clicking &ldquo;Download Resume&rdquo; anywhere on your portfolio will directly download your PDF file.
                        </p>
                      </div>
                      {resumeStatus.uploaded && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                          <Check className="h-3.5 w-3.5" />
                          <span>Uploaded</span>
                        </span>
                      )}
                    </div>

                    {resumeStatus.uploaded && (
                      <div className="rounded-lg border border-white/8 bg-[#0B0A0A] px-4 py-3 text-xs text-[#D6D2CE] flex flex-wrap items-center justify-between gap-3">
                        <span>
                          Active file: <strong className="text-[#F5F4F2]">{resumeStatus.fileName}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={handleDeleteResume}
                          className="inline-flex items-center gap-1 text-red-300 hover:text-red-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove PDF</span>
                        </button>
                      </div>
                    )}

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/18 bg-[#0B0A0A]/70 px-6 py-8 text-center transition-colors hover:border-[#D46B48]/60">
                      <FileUp className="h-8 w-8 text-[#D46B48]" />
                      <span className="mt-3 text-sm font-medium text-[#F5F4F2]">
                        {resumeStatus.uploaded ? 'Click to replace resume PDF' : 'Click to choose a PDF file'}
                      </span>
                      <span className="mt-1 text-xs text-[#A8A39E]">PDF only · Max 5 MB</span>
                      <input type="file" accept="application/pdf,.pdf" onChange={handleResumeUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {/* CONTACT INBOX TAB */}
              {activeTab === 'inbox' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#A8A39E]">
                    Messages submitted through the Contact Me form appear here.
                  </p>

                  {loadingMessages ? (
                    <p className="text-sm text-[#A8A39E]">Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-8 text-center">
                      <p className="text-sm text-[#D6D2CE]">No messages received yet.</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-5 space-y-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[#F5F4F2]">{msg.subject}</p>
                            <p className="text-xs text-[#D46B48]">
                              {msg.name} · {msg.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-[#A8A39E]">
                              {new Date(msg.submittedAt).toLocaleDateString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id)}
                              aria-label="Delete message"
                              className="text-red-300 hover:text-red-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="pt-2 text-sm leading-relaxed text-[#D6D2CE] border-t border-white/8">
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer Save Bar */}
            {activeTab !== 'resume' && activeTab !== 'inbox' && (
              <div className="flex items-center justify-end gap-3 border-t border-white/8 px-6 py-4 bg-[#0E0D0D]">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-white/12 px-4 py-2 text-xs font-medium text-[#D6D2CE] hover:text-[#F5F4F2]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D46B48] px-5 py-2 text-xs font-semibold text-[#0B0A0A] hover:bg-[#E07A58] disabled:opacity-60"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Portfolio Changes'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
