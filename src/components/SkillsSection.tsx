import { useState } from 'react';
import { motion } from 'motion/react';
import { SlidersHorizontal } from 'lucide-react';
import type { SkillCategoryKey, SkillItem } from '../types/portfolio';

interface SkillsSectionProps {
  skills: SkillItem[];
  onOpenEditor: () => void;
}

const CATEGORIES: ('All' | SkillCategoryKey)[] = [
  'All',
  'Programming',
  'Web Development',
  'Tools and Technologies',
  'AI and Development',
];

export default function SkillsSection({ skills, onOpenEditor }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategoryKey>('All');

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((skill) => skill.category === selectedCategory);

  return (
    <section id="skills" className="border-b border-white/8 py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#D46B48]">02. Technical Skills</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F4F2]">
              Honest Foundation &amp; Active Stack
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#A8A39E]">
              An accurate view of my current programming, web, tooling, and AI skill levels—continuously updated as I learn and build.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenEditor}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-white/12 px-4 py-2 text-xs font-medium text-[#D6D2CE] whitespace-nowrap shrink-0 transition-colors hover:border-[#D46B48]/50 hover:text-[#F5F4F2]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#D46B48]" />
            <span>Edit Skill Levels</span>
          </button>
        </div>

        {/* Interactive Category Tabs */}
        <div
          role="tablist"
          aria-label="Filter skills by category"
          className="mt-8 flex flex-wrap items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.02] p-1.5 w-fit"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  active
                    ? 'bg-[#D46B48] text-[#0B0A0A] font-semibold'
                    : 'text-[#A8A39E] hover:text-[#F5F4F2] hover:bg-white/[0.04]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.2) }}
              className="glass-surface glass-surface-hover rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-base font-semibold text-[#F5F4F2]">
                    {skill.name}
                  </h3>
                  <span className="font-mono text-xs text-[#D46B48] tabular-nums shrink-0">
                    {skill.level}%
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs text-[#A8A39E]">
                  <span>{skill.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className={skill.status === 'Learning' ? 'text-[#E09B7F]' : 'text-[#D6D2CE]'}>
                    {skill.status}
                  </span>
                </div>

                {skill.note && (
                  <p className="mt-3 text-xs leading-relaxed text-[#A8A39E]">
                    {skill.note}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <div
                  aria-label={`${skill.name} proficiency ${skill.level} percent`}
                  className="h-1.5 w-full overflow-hidden rounded-full bg-white/8"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#B85233] to-[#D46B48] transition-all duration-300"
                    style={{ width: `${Math.max(4, Math.min(100, skill.level))}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
