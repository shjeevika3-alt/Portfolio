import { motion } from 'motion/react';
import { BookOpen, GraduationCap } from 'lucide-react';
import type { EducationItem, ExperienceItem } from '../types/portfolio';

interface JourneySectionProps {
  education: EducationItem[];
  experience: ExperienceItem[];
}

export default function JourneySection({ education, experience }: JourneySectionProps) {
  return (
    <section id="journey" className="border-b border-white/8 py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          {/* Left Column: Education Timeline */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2.5 text-sm font-medium text-[#D46B48]">
              <GraduationCap className="h-4 w-4" />
              <span>04. Education</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F4F2]">
              Academic Timeline
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#A8A39E]">
              Building computer science depth step by step in Bengaluru.
            </p>

            <div className="mt-8 space-y-5">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="glass-surface rounded-2xl p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-[#A8A39E]">
                    <span className="font-mono text-[#D46B48]">{edu.period}</span>
                    <span>{edu.status}</span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-[#F5F4F2]">
                    {edu.degree}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-[#D6D2CE]">
                    {edu.institution} <span aria-hidden="true" className="text-white/30">·</span> {edu.location}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-white/8 pt-4 text-sm text-[#A8A39E]">
                    {edu.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1 w-1 rounded-full bg-[#D46B48] shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Experience & Learning Journey */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2.5 text-sm font-medium text-[#D46B48]">
              <BookOpen className="h-4 w-4" />
              <span>05. Experience &amp; Learning Journey</span>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F4F2]">
              Practical Project Building
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#A8A39E]">
              Hands-on learning through real prototypes, technical exploration, and collaborative coursework.
            </p>

            <div className="mt-8 space-y-5">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="glass-surface rounded-2xl p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-[#A8A39E]">
                    <span className="text-[#D46B48] font-medium">{exp.context}</span>
                    <span className="font-mono">{exp.period}</span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-[#F5F4F2]">
                    {exp.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#A8A39E]">
                    {exp.description}
                  </p>

                  <p className="mt-4 border-t border-white/8 pt-3 text-xs text-[#D6D2CE]">
                    {exp.focusAreas.join(' · ')}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
