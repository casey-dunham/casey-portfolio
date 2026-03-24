'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] as const },
});

const projects = [
  {
    slug: 'dossi',
    title: 'Dossi',
    tagline: 'Smart Insulin Delivery',
    tags: ['iOS', 'Health Tech', 'Product Design', 'AI/ML'],
    color: '#6366F1',
    screens: [
      { src: '/images/dossi/screens/4b.png', alt: 'Dossi nutrition' },
      { src: '/images/dossi/screens/1b.png', alt: 'Dossi dashboard' },
    ],
    phoneSize: { back: 'w-[70%] md:w-[64%]', front: 'w-[75%] md:w-[68%]' },
    flipped: false,
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
    phoneSize: { back: 'w-[70%] md:w-[64%]', front: 'w-[75%] md:w-[68%]' },
    flipped: true,
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
      <Link href={`/projects/${project.slug}`} className="group block">
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
                  <path d="M4 12L12 4M12 4H6M12 4v6" />
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

            {/* Back phone (tilted, behind) */}
            <div
              className={`absolute left-1/2 top-10 ${project.phoneSize.back} z-10`}
              style={{
                transform: project.flipped
                  ? 'translateX(-25%) rotate(6deg)'
                  : 'translateX(-70%) rotate(-6deg)',
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              onMouseEnter={(e) => {
                const base = project.flipped
                  ? 'translateX(-25%) rotate(6deg)'
                  : 'translateX(-70%) rotate(-6deg)';
                e.currentTarget.style.transform = base + ' scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = project.flipped
                  ? 'translateX(-25%) rotate(6deg)'
                  : 'translateX(-70%) rotate(-6deg)';
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

            {/* Front phone (overlapping) */}
            <div
              className={`absolute left-1/2 top-4 ${project.phoneSize.front} z-20`}
              style={{
                transform: project.flipped
                  ? 'translateX(-65%)'
                  : 'translateX(-25%)',
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              onMouseEnter={(e) => {
                const base = project.flipped
                  ? 'translateX(-65%)'
                  : 'translateX(-25%)';
                e.currentTarget.style.transform = base + ' scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = project.flipped
                  ? 'translateX(-65%)'
                  : 'translateX(-25%)';
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
        <motion.p {...fade(0.25)} className="font-body text-[#999] text-[0.95rem] leading-[1.6]">
          A few things I&apos;ve been building.
        </motion.p>
      </section>

      <section className="px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}

          {/* Zora — mini project, photo-based card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.25, 1, 0.5, 1] }}
          >
            <Link href="/projects/zora" className="group block">
              <div className="relative bg-bg-raised rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:border-border-light">
                <div className="p-7 md:p-8 pb-0 md:pb-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-fg leading-[1.1] tracking-tight">
                        Zora
                      </h2>
                      <p className="font-body text-sm text-fg-muted mt-1.5">
                        Smart Earring Prototype
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-border-light group-hover:bg-bg transition-all duration-300 mt-1">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-dim group-hover:text-fg transition-colors duration-300">
                        <path d="M4 12L12 4M12 4H6M12 4v6" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {['Arduino', 'Hardware', 'PPG Sensors', 'Product Strategy'].map((tag) => (
                      <span key={tag} className="px-3 py-1 text-[0.7rem] font-body font-medium text-fg-dim border border-border rounded-full transition-colors duration-300 group-hover:border-border-light group-hover:text-fg-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="w-full h-px bg-border" />
                </div>
                <div className="relative h-[340px] md:h-[400px] overflow-hidden">
                  <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-700" style={{ background: 'radial-gradient(ellipse at 50% 90%, #B76E7960 0%, transparent 60%)' }} />
                  <div className="grid grid-cols-2 gap-3 p-6 pt-4 h-full">
                    <div className="rounded-lg overflow-hidden">
                      <Image src="/images/zora/prototype-3.jpg" alt="Earring on ear" width={3088} height={2316} quality={85} className="w-full h-full object-cover pointer-events-none" />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                      <Image src="/images/zora/prototype-7.jpg" alt="Prototype close-up" width={4032} height={3024} quality={85} className="w-full h-full object-cover pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-16 mt-20 border-t border-border">
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
            <span>&copy; {new Date().getFullYear()} Casey Dunham</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
