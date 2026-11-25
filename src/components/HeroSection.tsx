import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Download, Mail, SlidersHorizontal, User } from 'lucide-react';
import type { ProfileInfo, ResumeStatus } from '../types/portfolio';

interface HeroSectionProps {
  profile: ProfileInfo;
  resumeStatus: ResumeStatus;
  onDownloadResume: () => void;
  onOpenEditor: () => void;
}

export default function HeroSection({
  profile,
  resumeStatus,
  onDownloadResume,
  onOpenEditor,
}: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="relative overflow-hidden border-b border-white/8 pt-14 pb-16 lg:pt-20 lg:pb-24">
      {/* Subtle radial terracotta atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-[#D46B48]/10 blur-[140px]"
      />

      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch">
          {/* Left Typographic Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between lg:col-span-7"
          >
            <div>
              <p className="text-sm font-medium text-[#D46B48]">
                {profile.degreeShort} <span aria-hidden="true" className="text-white/30">·</span> {profile.department}
              </p>

              <h1 className="mt-4 font-display text-[clamp(2.5rem,4.8vw,4.25rem)] font-bold leading-[1.06] tracking-tight text-[#F5F4F2] [text-wrap:balance]">
                {profile.name}
              </h1>

              <p className="mt-4 font-display text-[clamp(1.35rem,2.4vw,2rem)] font-medium leading-snug text-[#D6D2CE] [text-wrap:balance]">
                {profile.headline}
              </p>

              <p className="mt-5 text-sm font-medium text-[#A8A39E]">
                {profile.identityLine}
              </p>

              <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-[#A8A39E]">
                {profile.aboutParagraphs[0]}
              </p>
            </div>

            {/* Primary CTA Cluster */}
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D46B48] px-5 py-3 text-sm font-semibold text-[#0B0A0A] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#E07A58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D46B48] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0A0A]"
                >
                  <span>View My Projects</span>
                  <ArrowDownRight className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={onDownloadResume}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-[#F5F4F2] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#D46B48]/50 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D46B48]"
                >
                  <Download className="h-4 w-4 text-[#D46B48]" />
                  <span>{resumeStatus.uploaded ? 'Download Resume' : 'Resume & CV'}</span>
                </button>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-5 py-3 text-sm font-medium text-[#D6D2CE] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-white/25 hover:text-[#F5F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D46B48]"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Me</span>
                </a>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onOpenEditor}
                  className="inline-flex items-center gap-2 py-1.5 text-xs font-medium text-[#A8A39E] transition-colors hover:text-[#D46B48] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D46B48] rounded-sm"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Edit Portfolio, Skills &amp; Upload Resume</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Profile Photo / Placeholder Column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="glass-surface relative h-full min-h-[380px] overflow-hidden rounded-2xl p-3">
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#161414]">
                {!imgError && profile.profilePhotoUrl ? (
                  <img
                    key={profile.profilePhotoUrl}
                    src={profile.profilePhotoUrl}
                    alt={`${profile.name} — Computer Science & Engineering Student`}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full max-h-[490px] lg:max-h-none object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full min-h-[360px] flex-col items-center justify-center bg-gradient-to-br from-[#191514] via-[#121010] to-[#0E0D0D] p-8 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#D46B48]/35 bg-[#D46B48]/10 text-[#D46B48]">
                      <User className="h-10 w-10" />
                    </div>
                    <p className="mt-5 font-display text-lg font-semibold text-[#F5F4F2]">
                      Profile Photo Placeholder
                    </p>
                    <p className="mt-1.5 max-w-[26ch] text-xs leading-relaxed text-[#A8A39E]">
                      Add your personal portrait anytime using the Portfolio Editor.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenEditor}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-2 text-xs font-medium text-[#D6D2CE] transition-colors hover:border-[#D46B48]/50 hover:text-[#F5F4F2]"
                    >
                      <span>Upload Photo</span>
                    </button>
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0A0A]/85 via-[#0B0A0A]/35 to-transparent"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-xs text-[#E2DFDB]">
                  <span>{profile.college}</span>
                  <span className="font-mono text-[#D46B48]">{profile.year}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-width 4-Column Academic Fact Strip */}
        <div className="mt-14 grid grid-cols-1 gap-4 border-t border-white/8 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-surface rounded-xl px-5 py-4">
            <p className="text-xs text-[#A8A39E]">Degree Program</p>
            <p className="mt-1 font-display text-base font-semibold text-[#F5F4F2]">{profile.degreeShort}</p>
          </div>
          <div className="glass-surface rounded-xl px-5 py-4">
            <p className="text-xs text-[#A8A39E]">Specialization</p>
            <p className="mt-1 font-display text-base font-semibold text-[#F5F4F2]">Computer Science &amp; Eng.</p>
          </div>
          <div className="glass-surface rounded-xl px-5 py-4">
            <p className="text-xs text-[#A8A39E]">Current Standing</p>
            <p className="mt-1 font-display text-base font-semibold text-[#F5F4F2]">{profile.year} Undergraduate</p>
          </div>
          <div className="glass-surface rounded-xl px-5 py-4">
            <p className="text-xs text-[#A8A39E]">Location</p>
            <p className="mt-1 font-display text-base font-semibold text-[#F5F4F2]">{profile.city}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
