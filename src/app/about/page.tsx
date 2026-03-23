'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] as const },
});

const stagger = (index: number) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-30px' as const },
  transition: { duration: 0.5, delay: index * 0.06, ease: [0.25, 1, 0.5, 1] as const },
});

export default function About() {
  return (
    <main className="min-h-screen pb-0">
      {/* ── Hero ── */}
      <section className="pt-28 md:pt-36 pb-20 md:pb-28 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 md:gap-20 items-start">
          <Portrait />

          <div>
            <motion.h1
              {...fade(0.2)}
              className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.08] tracking-tight mb-14 md:mb-16"
            >
              Hi, I&rsquo;m Casey
            </motion.h1>

            <motion.div {...fade(0.35)}>
              <p className="font-body text-fg text-[1.15rem] md:text-[1.25rem] leading-[1.6] font-light mb-6">
                I&rsquo;m a designer and engineer studying Industrial Design at
                Georgia&nbsp;Tech. I build products at the intersection of health,
                technology, and human behavior.
              </p>
              <p className="font-body text-fg-muted text-[0.95rem] leading-[1.7] mb-10">
                I care deeply about craft &mdash; the way an interface feels, the
                logic behind a flow, the moment something clicks for a user. Most
                recently I&rsquo;ve been building tools for people managing diabetes
                and exploring how AI can make health decisions feel less
                overwhelming.
              </p>
              <motion.a
                href="/Casey_Dunham_Resume.pdf"
                download
                className="group inline-flex items-center gap-3 px-6 py-3 text-sm font-body font-medium text-fg border border-border-light rounded-full hover:border-accent hover:text-accent transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-40 group-hover:opacity-100 transition-opacity"
                >
                  <path d="M8 2v9M4.5 7.5 8 11l3.5-3.5M3 14h10" />
                </svg>
                Download Resume
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Resume ── */}
      <section className="px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto pt-8 pb-24">

        {/* Education */}
        <ResumeGroup label="Education" groupIndex={0}>
          <ResumeItem index={0} name="Georgia Institute of Technology" role="BS Industrial Design · GPA 4.00" date="May 2027" />
          <ResumeItem index={1} name="Wilmington Christian School" role="Valedictorian · 1 of 50 · GPA 4.70" date="June 2025" />
        </ResumeGroup>

        {/* Experience */}
        <ResumeGroup label="Experience" groupIndex={1}>
          <ResumeItem index={0} name="Breakthrough T1D" role="Youth Ambassador" date="2023 – 2025" desc="Advocated to Congressional members on diabetes legislation and insulin pricing. Mentored younger patients navigating life with Type 1 diabetes." />
          <ResumeItem index={1} name="Fontspring" role="Administrative Assistant" date="2021 – 2022" desc="Assisted with database organization — extracting, cleaning, and sorting data. Managed email communications and internal workflows." />
        </ResumeGroup>

        {/* Honors */}
        <ResumeGroup label="Honors" groupIndex={2}>
          <ResumeItem index={0} name="College of Design Dean's Scholarship" role="Georgia Tech" />
          <ResumeItem index={1} name="Most Valuable Student Scholarship" role="Elks National Foundation" />
          <ResumeItem index={2} name="Coca-Cola Scholar Semifinalist" role="Coca-Cola Scholars Foundation" />
          <ResumeItem index={3} name="National Silver Medal" role="Scholastic Art & Writing Awards" />
          <ResumeItem index={4} name="Charles M. Hebner Memorial Scholarship" role="Delaware Higher Education Office" />
          <ResumeItem index={5} name="Delaware Diabetes Coalition Scholarship" role="Delaware Diabetes Coalition" />
        </ResumeGroup>

        {/* Skills */}
        <ResumeGroup label="Skills" groupIndex={3}>
          <div className="flex flex-wrap gap-2.5">
            {[
              'Industrial Design', 'Product Design', 'UX / UI', 'Figma',
              'Adobe Creative Suite', 'Fusion 360', 'Prototyping', 'Branding',
              'Web Design', 'React', 'SwiftUI', 'English', 'Conversational German',
            ].map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.03, ease: [0.25, 1, 0.5, 1] }}
                className="px-5 py-2.5 text-[0.82rem] font-body text-[#999] border border-[#2A2A2A] rounded-full hover:text-fg hover:border-[#555] transition-all duration-300 cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </ResumeGroup>

      </section>

      <footer className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-16 border-t border-border">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          <div>
            <h3 className="font-display text-xl font-bold text-fg mb-4">Get in touch</h3>
            <div className="flex flex-col gap-2 font-body text-sm text-fg-muted">
              <a href="mailto:caseyedunham@gmail.com" className="hover:text-fg transition-colors">caseyedunham@gmail.com</a>
              <a href="tel:302-377-5638" className="hover:text-fg transition-colors">302-377-5638</a>
              <a href="https://www.linkedin.com/in/casey-dunham/" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">LinkedIn</a>
              <span>Atlanta, GA</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-body text-sm text-fg-dim">
            <span>&copy; {new Date().getFullYear()} Casey Dunham</span>
            <span>Designed & built by hand</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ── Components ── */

function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className="rounded-lg overflow-hidden"
    >
      <motion.div style={{ y }}>
        <Image
          src="/images/headshot/portrait.jpeg"
          alt="Casey Dunham"
          width={1909}
          height={1909}
          quality={90}
          className="w-full block scale-110 transition-transform duration-500 ease-out hover:scale-[1.15]"
          priority
        />
      </motion.div>
    </motion.div>
  );
}

function ResumeGroup({ label, groupIndex, children }: { label: string; groupIndex: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: groupIndex * 0.05, ease: [0.25, 1, 0.5, 1] }}
      className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-0 md:gap-12 border-t border-[#2A2A2A] py-10 md:py-14"
    >
      {/* Left label */}
      <div className="self-start mb-4 md:mb-0">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-[#666] font-medium">{label}</h2>
      </div>

      {/* Right content */}
      <div>{children}</div>
    </motion.div>
  );
}

function ResumeItem({
  index,
  name,
  role,
  date,
  desc,
}: {
  index: number;
  name: string;
  role?: string;
  date?: string;
  desc?: string;
}) {
  return (
    <motion.div
      {...stagger(index)}
      className="group flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-8 py-4 first:pt-0 last:pb-0"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-base md:text-[1.1rem] font-semibold text-[#e0e0e0] leading-snug tracking-[-0.005em]">
          {name}
        </h3>
        {role && (
          <p className="font-body text-sm text-[#777] mt-1 leading-relaxed">{role}</p>
        )}
        {desc && (
          <p className="font-body text-[0.84rem] text-[#666] leading-[1.75] mt-2.5 max-w-[520px]">{desc}</p>
        )}
      </div>
      {date && (
        <span className="font-body text-xs text-[#555] tabular-nums whitespace-nowrap sm:mt-[3px] tracking-wide">{date}</span>
      )}
    </motion.div>
  );
}
