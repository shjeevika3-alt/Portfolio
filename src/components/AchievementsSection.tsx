import { motion } from 'motion/react';
import { PencilLine } from 'lucide-react';
import type { AchievementItem } from '../types/portfolio';

interface AchievementsSectionProps {
  achievements: AchievementItem[];
  onOpenEditor: () => void;
}

export default function AchievementsSection({
  achievements,
  onOpenEditor,
}: AchievementsSectionProps) {
  return (
    <section id="achievements" className="border-b border-white/8 py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#D46B48]">06. Achievements &amp; Certifications</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F4F2]">
              Milestones &amp; Editable Records
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#A8A39E]">
              Dedicated sections for workshops, hackathons, AI club work, certifications, and competitions. Open slots remain honest placeholders until verified entries are added.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenEditor}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-white/12 px-4 py-2 text-xs font-medium text-[#D6D2CE] whitespace-nowrap shrink-0 transition-colors hover:border-[#D46B48]/50 hover:text-[#F5F4F2]"
          >
            <PencilLine className="h-3.5 w-3.5 text-[#D46B48]" />
            <span>Update Achievements</span>
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
              className={`rounded-2xl p-6 flex flex-col justify-between ${
                item.isPlaceholder
                  ? 'border border-dashed border-white/14 bg-white/[0.015]'
                  : 'glass-surface glass-surface-hover'
              }`}
            >
              <div>
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="font-medium text-[#D46B48]">{item.category}</span>
                  <span className="font-mono text-[#A8A39E]">{item.dateLabel}</span>
                </div>

                <h3 className="mt-2.5 font-display text-lg font-semibold text-[#F5F4F2]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs font-medium text-[#D6D2CE]">
                  {item.issuerOrEvent}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-[#A8A39E]">
                  {item.description}
                </p>
              </div>

              {item.isPlaceholder && (
                <div className="mt-5 border-t border-white/8 pt-3">
                  <button
                    type="button"
                    onClick={onOpenEditor}
                    className="text-xs font-medium text-[#D46B48] hover:underline focus-visible:outline-none"
                  >
                    Fill in this milestone →
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
