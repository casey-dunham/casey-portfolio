'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] as const },
});

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-start justify-center px-6 md:px-10 max-w-[1400px] mx-auto">
      <motion.p
        {...fade(0.1)}
        className="font-body text-xs text-fg-dim uppercase tracking-widest mb-6"
      >
        404
      </motion.p>

      <motion.h1
        {...fade(0.2)}
        className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.08] tracking-tight mb-6 max-w-[600px]"
      >
        This page doesn&rsquo;t exist.
      </motion.h1>

      <motion.p
        {...fade(0.35)}
        className="font-body text-fg-muted text-[0.95rem] md:text-[1.1rem] leading-[1.7] max-w-[420px] mb-12"
      >
        The page you&rsquo;re looking for may have been moved or no longer exists.
      </motion.p>

      <motion.div {...fade(0.5)}>
        <Link
          href="/"
          className="group font-body text-sm text-fg hover:text-accent transition-colors duration-300 inline-flex items-center gap-2 uppercase tracking-widest"
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
            className="translate-x-1 group-hover:translate-x-0 transition-transform duration-300"
          >
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          Back to home
        </Link>
      </motion.div>
    </main>
  );
}
