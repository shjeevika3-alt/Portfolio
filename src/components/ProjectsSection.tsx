import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ExternalLink, FolderGit2, Layers, Plus } from 'lucide-react';
import type { ProjectItem } from '../types/portfolio';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenEditor: () => void;
}

const FILTERS = ['All', 'AI Application', 'Web Platform', 'Cybersecurity'] as const;

export default function ProjectsSection({
  projects,
  onSelectProject,
  onOpenEditor,
}: ProjectsSectionProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const visibleProjects =
    filter === 'All' ? projects : projects.filter((project) => project.category === filter);

  return (
    <section id="projects" className="border-b border-white/8 py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#D46B48]">03. Selected Projects</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F4F2]">
              Practical Applications &amp; Live Prototypes
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#A8A39E]">
              End-to-end digital solutions focused on sustainability, community utility, and intelligent security monitoring.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenEditor}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-white/12 px-4 py-2 text-xs font-medium text-[#D6D2CE] whitespace-nowrap shrink-0 transition-colors hover:border-[#D46B48]/50 hover:text-[#F5F4F2]"
          >
            <Plus className="h-3.5 w-3.5 text-[#D46B48]" />
            <span>Add or Manage Projects</span>
          </button>
        </div>

        {/* Interactive Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter projects by domain"
          className="mt-8 flex flex-wrap items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.02] p-1.5 w-fit"
        >
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  active
                    ? 'bg-[#D46B48] text-[#0B0A0A] font-semibold'
                    : 'text-[#A8A39E] hover:text-[#F5F4F2] hover:bg-white/[0.04]'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        {visibleProjects.length === 0 ? (
          <div className="glass-surface mt-10 rounded-2xl p-10 text-center">
            <p className="font-display text-lg font-semibold text-[#F5F4F2]">No projects in this category yet</p>
            <p className="mt-2 text-sm text-[#A8A39E]">
              Switch filters or add a new project from the Portfolio Editor.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {visibleProjects.map((project, index) => {
              const hasFailed = Boolean(failedImages[project.id]);
              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.24) }}
                  className="glass-surface glass-surface-hover flex flex-col overflow-hidden rounded-2xl p-4"
                >
                  {/* Visual Preview */}
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    aria-label={`Inspect case study for ${project.title}`}
                    className="group relative overflow-hidden rounded-xl border border-white/8 bg-[#151313] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D46B48]"
                  >
                    {!hasFailed && project.screenshotUrl ? (
                      <img
                        src={project.screenshotUrl}
                        alt={`${project.title} application preview`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [project.id]: true }))
                        }
                        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-gradient-to-br from-[#1C1716] to-[#111010] p-6 text-center">
                        <Layers className="h-9 w-9 text-[#D46B48]" />
                        <span className="mt-3 font-display text-base font-semibold text-[#F5F4F2]">
                          {project.title}
                        </span>
                      </div>
                    )}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent"
                    />
                    <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 text-xs font-medium text-[#F5F4F2] opacity-90 group-hover:text-[#D46B48] transition-colors">
                      <span>Case Study</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  {/* Card Body */}
                  <div className="mt-5 flex flex-1 flex-col justify-between px-1">
                    <div>
                      <p className="text-xs font-medium text-[#D46B48]">
                        {project.category}
                      </p>

                      <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight text-[#F5F4F2]">
                        {project.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-[#A8A39E]">
                        {project.summary}
                      </p>

                      {/* Key Highlights (top 3 concise) */}
                      <ul className="mt-4 space-y-1.5 border-t border-white/8 pt-4 text-xs text-[#D6D2CE]">
                        {project.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 rounded-full bg-[#D46B48] shrink-0" aria-hidden="true" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5">
                      {/* Zero-pill unboxed technologies */}
                      <p className="text-xs text-[#8D8883]">
                        {project.technologies.join(' · ')}
                      </p>

                      {/* Action Row */}
                      <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-white/8 pt-4">
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#D46B48] px-3.5 py-2 text-xs font-semibold text-[#0B0A0A] whitespace-nowrap shrink-0 transition-colors hover:bg-[#E07A58]"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => onSelectProject(project)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-3.5 py-2 text-xs font-medium text-[#F5F4F2] whitespace-nowrap shrink-0 transition-colors hover:border-[#D46B48]/50"
                        >
                          <span>Details</span>
                        </button>

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} GitHub repository`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-2 text-xs font-medium text-[#D6D2CE] whitespace-nowrap shrink-0 transition-colors hover:border-[#D46B48]/50 hover:text-[#F5F4F2]"
                          >
                            <FolderGit2 className="h-3.5 w-3.5 text-[#D46B48]" />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
