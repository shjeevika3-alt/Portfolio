import { motion } from 'motion/react';
import type { ProfileInfo } from '../types/portfolio';

interface AboutSectionProps {
  profile: ProfileInfo;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="border-b border-white/8 py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-sm font-medium text-[#D46B48]">01. About Me</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F4F2] [text-wrap:balance]">
              Curious Builder. Grounded in Fundamentals.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#A8A39E]">
              {profile.college} · {profile.city}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 lg:col-span-8"
          >
            <div className="glass-surface rounded-2xl p-6 sm:p-8 space-y-5">
              {profile.aboutParagraphs.map((paragraph, idx) => (
                <p key={idx} className="text-base leading-relaxed text-[#D6D2CE]">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="glass-surface rounded-2xl p-6">
                <h3 className="font-display text-base font-semibold text-[#F5F4F2]">
                  Interest in Computer Science &amp; AI
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#A8A39E]">
                  Drawn to the intersection of structured software logic and practical AI tools—turning ideas around sustainability, campus utility, and security monitoring into real, usable web applications.
                </p>
              </div>

              <div className="glass-surface rounded-2xl p-6">
                <h3 className="font-display text-base font-semibold text-[#F5F4F2]">
                  Future Career Aspirations
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#A8A39E]">
                  {profile.careerGoal}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
