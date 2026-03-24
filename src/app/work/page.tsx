'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] as const },
});

const projects = [
  {
    slug: 'dossi',
    title: 'Dossi',
    tagline: 'Contextual Metabolic Intelligence',
    tags: ['iOS', 'Health Tech', 'Product Design', 'AI/ML'],
    color: '#6366F1',
    screens: [
      { src: '/images/dossi/screens/4b.png', alt: 'Dossi nutrition' },
      { src: '/images/dossi/screens/1b.png', alt: 'Dossi dashboard' },
    ],
    phoneSize: { back: 'w-[62%] md:w-[58%]', front: 'w-[67%] md:w-[62%]' },
  },
  {
    slug: 'rewired',
    title: 'Rewired',
    tagline: 'Neuroplasticity Transformation',
    tags: ['iOS', 'SwiftUI', 'Branding', 'AI Coaching'],
    color: '#8B5CF6',
    screens: [
      { src: '/images/rewired/group39.png', alt: 'Rewired screen' },
      { src: '/images/rewired/group40.png', alt: 'Rewired screen' },
    ],
    phoneSize: { back: 'w-[62%] md:w-[58%]', front: 'w-[67%] md:w-[62%]' },
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      <Link href={`/work/${project.slug}`} className="group block">
        <div className="relative bg-bg-raised rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:border-border-light">
          {/* Header area */}
          <div className="p-7 md:p-8 pb-0 md:pb-0">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-fg leading-[1.1] tracking-tight">
                  {project.title}
                </h2>
                <p className="font-body text-sm text-fg-muted mt-1.5">
                  {project.tagline}
                </p>
              </div>

              <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-border-light group-hover:bg-bg transition-all duration-300 mt-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-fg-dim group-hover:text-fg transition-colors duration-300"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[0.7rem] font-body font-medium text-fg-dim border border-border rounded-full transition-colors duration-300 group-hover:border-border-light group-hover:text-fg-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-full h-px bg-border" />
          </div>

          {/* Phone mockups area */}
          <div className="relative h-[340px] md:h-[400px] overflow-hidden">
            {/* Ambient glow */}
            <div
              className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-700"
              style={{
                background: `radial-gradient(ellipse at 50% 90%, ${project.color}60 0%, transparent 60%)`,
              }}
            />

            {/* Back phone (left, tilted) */}
            <div
              className={`absolute left-1/2 top-10 ${project.phoneSize.back} z-10`}
              style={{ transform: 'translateX(-75%) rotate(-6deg)', transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-75%) rotate(-6deg) scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(-75%) rotate(-6deg)';
              }}
            >
              <Image
                src={project.screens[0].src}
                alt={project.screens[0].alt}
                width={870}
                height={1603}
                quality={90}
                className="w-full h-auto block drop-shadow-[0_8px_40px_rgba(0,0,0,0.4)] pointer-events-none"
              />
            </div>

            {/* Front phone (right, overlapping) */}
            <div
              className={`absolute left-1/2 top-4 ${project.phoneSize.front} z-20`}
              style={{ transform: 'translateX(-35%)', transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-35%) scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(-35%)';
              }}
            >
              <Image
                src={project.screens[1].src}
                alt={project.screens[1].alt}
                width={870}
                height={1603}
                quality={90}
                className="w-full h-auto block drop-shadow-[0_12px_50px_rgba(0,0,0,0.5)] pointer-events-none"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Work() {
  return (
    <main className="min-h-screen pb-20">
      <section className="pt-28 md:pt-36 pb-14 md:pb-18 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <motion.h1
          {...fade(0.2)}
          className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.08] tracking-tight mb-4"
        >
          Projects
        </motion.h1>
        <motion.p
          {...fade(0.35)}
          className="font-body text-fg-muted text-[0.95rem] md:text-[1.1rem] leading-[1.7] max-w-[520px]"
        >
          Products at the intersection of health, technology, and human
          behavior.
        </motion.p>
      </section>

      <section className="px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
