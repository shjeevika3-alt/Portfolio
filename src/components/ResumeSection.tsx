import { Download, FileText, Printer, Upload } from 'lucide-react';
import type { PortfolioData, ResumeStatus } from '../types/portfolio';

interface ResumeSectionProps {
  data: PortfolioData;
  resumeStatus: ResumeStatus;
  onDownloadResume: () => void;
  onOpenEditor: () => void;
}

export default function ResumeSection({
  data,
  resumeStatus,
  onDownloadResume,
  onOpenEditor,
}: ResumeSectionProps) {
  const { profile, education, skills, projects, achievements, social } = data;
  const filledAchievements = achievements.filter((a) => !a.isPlaceholder);

  const groupedSkills = {
    Programming: skills.filter((s) => s.category === 'Programming').map((s) => s.name),
    'Web Development': skills.filter((s) => s.category === 'Web Development').map((s) => s.name),
    'Tools & Technologies': skills.filter((s) => s.category === 'Tools and Technologies').map((s) => s.name),
    'AI & Development': skills.filter((s) => s.category === 'AI and Development').map((s) => s.name),
  };

  return (
    <section id="resume" className="border-b border-white/8 py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="no-print flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#D46B48]">07. Resume</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F4F2]">
              Curriculum Vitae Preview
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#A8A39E]">
              {resumeStatus.uploaded
                ? `Uploaded PDF ready (${resumeStatus.fileName}). Preview key highlights below or download the full file.`
                : 'Live structured resume preview synced with portfolio data. Upload a PDF version in the Portfolio Editor to enable direct PDF downloads.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onDownloadResume}
              className="inline-flex items-center gap-2 rounded-lg bg-[#D46B48] px-5 py-2.5 text-sm font-semibold text-[#0B0A0A] whitespace-nowrap shrink-0 transition-colors hover:bg-[#E07A58]"
            >
              <Download className="h-4 w-4" />
              <span>{resumeStatus.uploaded ? 'Download Resume PDF' : 'Download / Print Resume'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-2.5 text-sm font-medium text-[#F5F4F2] whitespace-nowrap shrink-0 transition-colors hover:border-[#D46B48]/50"
            >
              <Printer className="h-4 w-4 text-[#D46B48]" />
              <span>Print Preview</span>
            </button>

            <button
              type="button"
              onClick={onOpenEditor}
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-2.5 text-sm font-medium text-[#D6D2CE] whitespace-nowrap shrink-0 transition-colors hover:border-[#D46B48]/50"
            >
              <Upload className="h-4 w-4 text-[#D46B48]" />
              <span>{resumeStatus.uploaded ? 'Replace PDF' : 'Upload PDF'}</span>
            </button>
          </div>
        </div>

        {/* Structured Resume Sheet */}
        <div className="print-only-resume glass-surface mt-10 rounded-2xl p-6 sm:p-10">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F4F2]">
                {profile.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-[#D46B48]">
                {profile.identityLine}
              </p>
            </div>
            <div className="text-xs sm:text-right text-[#A8A39E] space-y-1">
              <p>{social.email}</p>
              <p>{social.location}</p>
              <p className="font-mono text-[#D6D2CE]">
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#D46B48]">
                  LinkedIn
                </a>
                {' · '}
                <a href={social.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#D46B48]">
                  GitHub
                </a>
              </p>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="mt-6">
            <h4 className="font-display text-xs font-semibold tracking-wider text-[#D46B48]">
              PROFILE SUMMARY
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[#D6D2CE]">
              {profile.resumeSummary}
            </p>
          </div>

          {/* Two-column body */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: Education & Skills */}
            <div className="space-y-8 lg:col-span-5">
              <div>
                <h4 className="font-display text-xs font-semibold tracking-wider text-[#D46B48]">
                  EDUCATION
                </h4>
                <div className="mt-3 space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="border-b border-white/8 pb-3 last:border-b-0">
                      <p className="text-sm font-semibold text-[#F5F4F2]">{edu.degree}</p>
                      <p className="mt-0.5 text-xs text-[#D6D2CE]">{edu.institution}, {edu.location}</p>
                      <p className="mt-0.5 font-mono text-xs text-[#A8A39E]">{edu.period}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-display text-xs font-semibold tracking-wider text-[#D46B48]">
                  TECHNICAL SKILLS
                </h4>
                <div className="mt-3 space-y-3 text-sm">
                  {Object.entries(groupedSkills).map(([group, items]) => (
                    <div key={group}>
                      <p className="text-xs font-semibold text-[#F5F4F2]">{group}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#A8A39E]">
                        {items.length > 0 ? items.join(' · ') : 'None listed'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Projects & Certifications */}
            <div className="space-y-8 lg:col-span-7">
              <div>
                <h4 className="font-display text-xs font-semibold tracking-wider text-[#D46B48]">
                  PROJECTS
                </h4>
                <div className="mt-3 space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="border-b border-white/8 pb-4 last:border-b-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-[#F5F4F2]">{proj.title}</p>
                        <a
                          href={proj.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#D46B48] hover:underline"
                        >
                          Live Demo
                        </a>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#A8A39E]">{proj.summary}</p>
                      <p className="mt-1.5 text-xs text-[#D6D2CE]">
                        {proj.technologies.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-display text-xs font-semibold tracking-wider text-[#D46B48]">
                  CERTIFICATIONS &amp; ACHIEVEMENTS
                </h4>
                {filledAchievements.length > 0 ? (
                  <ul className="mt-3 space-y-2.5 text-xs text-[#D6D2CE]">
                    {filledAchievements.map((ach) => (
                      <li key={ach.id}>
                        <span className="font-semibold text-[#F5F4F2]">{ach.title}</span> — {ach.issuerOrEvent} ({ach.dateLabel})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-3 flex items-center gap-2.5 text-xs text-[#A8A39E]">
                    <FileText className="h-4 w-4 text-[#D46B48] shrink-0" />
                    <span>No verified certificates added yet — use the Portfolio Editor to add workshops, hackathons, or certifications as you complete them.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
