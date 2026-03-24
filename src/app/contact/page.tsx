'use client';

import { motion } from 'framer-motion';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] as const },
});

const stagger = (index: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.4 + index * 0.08, ease: [0.25, 1, 0.5, 1] as const },
});

export default function Contact() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
      <motion.h1
        {...fade(0.2)}
        className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.08] tracking-tight mb-8 md:mb-10 max-w-[600px]"
      >
        Get in Touch
      </motion.h1>

      <motion.p
        {...fade(0.35)}
        className="font-body text-fg-muted text-[0.95rem] md:text-[1.1rem] leading-[1.7] max-w-[480px] mb-16"
      >
        I&rsquo;m always open to new projects, collaborations, and
        conversations. Feel free to reach out.
      </motion.p>

      <motion.div
        {...fade(0.4)}
        className="border-t border-[#2A2A2A] mb-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <motion.div {...stagger(0)}>
            <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-2">
              Email
            </p>
            <a
              href="mailto:caseyedunham@gmail.com"
              className="group font-body text-lg text-fg hover:text-accent transition-colors duration-300 inline-flex items-center gap-2"
            >
              caseyedunham@gmail.com
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </motion.div>
          <motion.div {...stagger(1)}>
            <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-2">
              Phone
            </p>
            <a
              href="tel:302-377-5638"
              className="group font-body text-lg text-fg hover:text-accent transition-colors duration-300 inline-flex items-center gap-2"
            >
              302-377-5638
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </motion.div>
          <motion.div {...stagger(2)}>
            <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-2">
              LinkedIn
            </p>
            <a
              href="https://www.linkedin.com/in/casey-dunham/"
              target="_blank"
              rel="noopener noreferrer"
              className="group font-body text-lg text-fg hover:text-accent transition-colors duration-300 inline-flex items-center gap-2"
            >
              linkedin.com/in/casey-dunham
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </motion.div>
          <motion.div {...stagger(3)}>
            <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-2">
              Location
            </p>
            <p className="font-body text-lg text-fg-muted">
              Atlanta, GA
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
