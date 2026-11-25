import { useState, FormEvent } from 'react';
import { Check, Copy, Github, Linkedin, Mail, MapPin, Send } from 'lucide-react';
import type { SocialLinks } from '../types/portfolio';

interface ContactSectionProps {
  social: SocialLinks;
}

export default function ContactSection({ social }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(social.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatusMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setStatusMessage({
          type: 'error',
          text: payload.error || 'Could not send your message. Please check your details and try again.',
        });
        return;
      }

      setStatusMessage({
        type: 'success',
        text: 'Thank you! Your message has been received and saved.',
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error while sending your message. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Contact Info */}
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#D46B48]">08. Contact</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F4F2] [text-wrap:balance]">
              Have an idea or opportunity? Let&apos;s connect and build something meaningful.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#A8A39E]">
              Open to software engineering internships, hackathon teams, technical collaborations, and learning opportunities in Bengaluru or remote.
            </p>

            <div className="mt-8 space-y-4">
              <div className="glass-surface flex items-center justify-between gap-3 rounded-xl px-4 py-3.5">
                <a
                  href={`mailto:${social.email}`}
                  className="flex items-center gap-3 text-sm text-[#F5F4F2] hover:text-[#D46B48] transition-colors truncate"
                >
                  <Mail className="h-4 w-4 text-[#D46B48] shrink-0" />
                  <span className="truncate">{social.email}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2.5 py-1 text-xs text-[#A8A39E] hover:border-[#D46B48]/50 hover:text-[#F5F4F2] shrink-0"
                >
                  {copiedEmail ? <Check className="h-3.5 w-3.5 text-[#D46B48]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-surface glass-surface-hover flex items-center justify-between rounded-xl px-4 py-3.5 text-sm text-[#F5F4F2]"
              >
                <span className="flex items-center gap-3">
                  <Linkedin className="h-4 w-4 text-[#D46B48]" />
                  <span>LinkedIn Profile</span>
                </span>
                <span className="text-xs text-[#A8A39E]">Open →</span>
              </a>

              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-surface glass-surface-hover flex items-center justify-between rounded-xl px-4 py-3.5 text-sm text-[#F5F4F2]"
              >
                <span className="flex items-center gap-3">
                  <Github className="h-4 w-4 text-[#D46B48]" />
                  <span>GitHub Profile</span>
                </span>
                <span className="text-xs text-[#A8A39E]">Open →</span>
              </a>

              <div className="glass-surface flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-[#A8A39E]">
                <MapPin className="h-4 w-4 text-[#D46B48] shrink-0" />
                <span>{social.location}</span>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="glass-surface rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-[#D6D2CE]">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Sharma"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0E0D0D] px-4 py-2.5 text-sm text-[#F5F4F2] placeholder:text-[#6B6661] focus:border-[#D46B48] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-[#D6D2CE]">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={140}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0E0D0D] px-4 py-2.5 text-sm text-[#F5F4F2] placeholder:text-[#6B6661] focus:border-[#D46B48] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-medium text-[#D6D2CE]">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  maxLength={160}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Internship inquiry / Hackathon collaboration"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0E0D0D] px-4 py-2.5 text-sm text-[#F5F4F2] placeholder:text-[#6B6661] focus:border-[#D46B48] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-medium text-[#D6D2CE]">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  minLength={10}
                  maxLength={2500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details about the opportunity, project idea, or question..."
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0E0D0D] px-4 py-2.5 text-sm text-[#F5F4F2] placeholder:text-[#6B6661] focus:border-[#D46B48] focus:outline-none"
                />
              </div>

              {statusMessage && (
                <div
                  role="status"
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    statusMessage.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-red-500/30 bg-red-500/10 text-red-200'
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D46B48] px-6 py-3 text-sm font-semibold text-[#0B0A0A] transition-colors hover:bg-[#E07A58] disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
