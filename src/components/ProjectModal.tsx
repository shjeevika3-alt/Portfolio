import { useEffect, useState } from 'react';
import { ExternalLink, FolderGit2, Layers, X } from 'lucide-react';
import type { ProjectItem } from '../types/portfolio';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass-surface relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#121010] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-5">
          <div>
            <p className="text-xs font-medium text-[#D46B48]">{project.category}</p>
            <h3 id="project-modal-title" className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#F5F4F2]">
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-[#A8A39E] transition-colors hover:border-[#D46B48]/50 hover:text-[#F5F4F2]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Screenshot */}
        <div className="mt-6 overflow-hidden rounded-xl border border-white/8 bg-[#181515]">
          {!imgError && project.screenshotUrl ? (
            <img
              src={project.screenshotUrl}
              alt={`${project.title} interface preview`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="aspect-[16/10] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/10] w-full flex-col items-center justify-center bg-gradient-to-br from-[#1C1716] to-[#111010] p-6 text-center">
              <Layers className="h-10 w-10 text-[#D46B48]" />
              <p className="mt-3 font-display text-lg font-semibold text-[#F5F4F2]">{project.title}</p>
              <p className="mt-1 text-xs text-[#A8A39E]">{project.category}</p>
            </div>
          )}
        </div>

        {/* Problem & Solution */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-display text-sm font-semibold text-[#F5F4F2]">Problem Statement</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#A8A39E]">{project.problemStatement}</p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-[#F5F4F2]">Proposed Solution</h4>
            <p className="mt-2 text-sm leading-relaxed text-[#A8A39E]">{project.proposedSolution}</p>
          </div>
        </div>

        {/* Key Features & Role */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 border-t border-white/8 pt-6">
          <div>
            <h4 className="font-display text-sm font-semibold text-[#F5F4F2]">Key Features</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#D6D2CE]">
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#D46B48] shrink-0" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-display text-sm font-semibold text-[#F5F4F2]">My Role &amp; Contributions</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#A8A39E]">
                {project.roleAndContributions}
              </p>
            </div>

            <div>
              <h4 className="font-display text-sm font-semibold text-[#F5F4F2]">Technologies Used</h4>
              <p className="mt-2 text-sm text-[#D6D2CE]">
                {project.technologies.join(' · ')}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/8 pt-6">
          <a
            href={project.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#D46B48] px-5 py-2.5 text-sm font-semibold text-[#0B0A0A] whitespace-nowrap shrink-0 transition-colors hover:bg-[#E07A58]"
          >
            <span>Open Live Demo</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-5 py-2.5 text-sm font-medium text-[#F5F4F2] whitespace-nowrap shrink-0 transition-colors hover:border-[#D46B48]/50"
            >
              <FolderGit2 className="h-4 w-4 text-[#D46B48]" />
              <span>GitHub Repository</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
