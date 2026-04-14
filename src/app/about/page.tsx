'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

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
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[360px_1fr] gap-10 md:gap-12 lg:gap-16 items-start">
          <Portrait />
          <div>
            <motion.h1
              {...fade(0.2)}
              className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.08] tracking-tight mb-6 md:mb-8"
            >
              Hi, I&rsquo;m Casey
            </motion.h1>

            <motion.div {...fade(0.35)}>
              <p className="font-body text-fg text-[1.15rem] md:text-[1.25rem] leading-[1.6] font-light mb-6">
                I&rsquo;m studying Industrial Design at Georgia&nbsp;Tech. I&rsquo;m
                obsessed with building things and making them&nbsp;beautiful.
              </p>
              <p className="font-body text-fg-muted text-[0.95rem] leading-[1.7] mb-6">
                I&rsquo;m fascinated by how designers can now participate in the full
                creation of a product using tools like AI. I believe in a holistic
                workflow&mdash;not just shaping the exterior, but understanding and
                designing the interior. With AI, designers can contribute to both the
                structure and the experience of a product in ways that weren&rsquo;t
                possible&nbsp;before.
              </p>
              <p className="font-body text-fg-muted text-[0.95rem] leading-[1.7] mb-8">
                I have explored this myself in web development, building and designing
                full stack apps on my own, which you can learn more
                about{' '}<a href="/#projects" className="text-fg-muted hover:text-fg transition-colors underline underline-offset-2">here</a>.
              </p>
              <motion.a
                href="/resume"
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
                  <rect x="2" y="1.5" width="12" height="13" rx="1.5" />
                  <path d="M5 5h6M5 8h6M5 11h3" />
                </svg>
                View Resume
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Resume ── */}
      <section className="px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto pt-8 pb-24">

        {/* Education */}
        <ResumeGroup label="Education" groupIndex={0}>
          <ResumeItem index={0} name="Georgia Institute of Technology" role="BS Industrial Design · GPA 3.80" date="May 2028" />
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
              { label: 'Industrial Design', tag: 'Product Design' },
              { label: 'UX / UI', tag: 'UX/UI' },
              { label: 'Figma' },
              { label: 'Illustrator' },
              { label: 'InDesign' },
              { label: 'Procreate' },
              { label: 'Fusion 360' },
              { label: 'Branding' },
              { label: 'Web Design', tag: 'Framer' },
              { label: 'SwiftUI' },
              { label: 'Photography' },
              { label: 'Fine Art' },
              { label: 'Claude' },
              { label: 'Codex', tag: 'Claude' },
              { label: 'Gemini' },
              { label: 'English' },
              { label: 'Conversational German' },
            ].map(({ label, tag }, i) => (
              <motion.a
                key={label}
                href={`/skills?t=${encodeURIComponent(tag ?? label)}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.03, ease: [0.25, 1, 0.5, 1] }}
                className="px-5 py-2.5 text-[0.82rem] font-body text-fg-dim border border-border rounded-full hover:text-fg hover:border-border-light transition-all duration-300"
              >
                {label}
              </motion.a>
            ))}
          </div>
        </ResumeGroup>

      </section>

      <footer className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-16 border-t border-border">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          <div>
            <h3 className="font-display text-xl font-bold text-fg mb-5">Get in touch</h3>
            <div className="flex flex-col gap-2 font-body text-sm text-fg-muted">
              <a href="mailto:caseyedunham@gmail.com" className="hover:text-fg transition-colors">caseyedunham@gmail.com</a>
              <a href="tel:302-377-5638" className="hover:text-fg transition-colors">302-377-5638</a>
              <a href="https://www.linkedin.com/in/casey-dunham/" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">LinkedIn</a>
              <span>Atlanta, GA</span>
            </div>
          </div>
          <div className="md:self-end flex flex-col items-start md:items-end gap-3 font-body text-sm text-fg-dim">
            <ThemeToggle />
            <div className="flex items-center gap-4">
              <span>&copy; {new Date().getFullYear()} Casey Dunham</span>
              <a href="/privacy" className="hover:text-fg-muted transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ── Components ── */

function Portrait() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.4)', transition: { duration: 0.2, ease: 'easeOut' } }}
      className="aspect-[3/4] rounded-lg overflow-hidden"
    >
      <Image
        src="/images/headshot/portrait.jpeg"
        alt="Casey Dunham"
        width={1909}
        height={1909}
        quality={90}
        className="w-full h-full object-cover object-top scale-[1.5] origin-[65%_0%] block"
        priority
      />
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
      className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-0 md:gap-12 border-t border-border py-10 md:py-14"
    >
      {/* Left label */}
      <div className="self-start mb-4 md:mb-0">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-fg-dim font-medium">{label}</h2>
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
        <h3 className="font-display text-base md:text-[1.1rem] font-semibold text-fg leading-snug tracking-[-0.005em]">
          {name}
        </h3>
        {role && (
          <p className="font-body text-sm text-fg-muted mt-1 leading-relaxed">{role}</p>
        )}
        {desc && (
          <p className="font-body text-[0.84rem] text-fg-dim leading-[1.75] mt-2.5 max-w-[520px]">{desc}</p>
        )}
      </div>
      {date && (
        <span className="font-body text-xs text-fg-dim tabular-nums whitespace-nowrap sm:mt-[3px] tracking-wide">{date}</span>
      )}
    </motion.div>
  );
}
