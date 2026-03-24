'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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
          <div className="relative h-[340px] md:h-[400px] overflow-hidden">
            <div
              className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-700"
              style={{
                background: `radial-gradient(ellipse at 50% 90%, ${project.color}60 0%, transparent 60%)`,
              }}
            />
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

export default function ProjectsContent() {
  return (
    <div className="px-4 md:px-8 lg:px-12 pb-12 pt-7 md:pt-10 lg:pt-12 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      {/* Mini projects — half width, below main cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.25, 1, 0.5, 1] }}
        >
          <Link href="/projects/zora" className="group block">
            <div className="relative bg-bg-raised rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:border-border-light">
              <div className="p-5 md:p-6 pb-0 md:pb-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <h2 className="font-display text-lg md:text-xl font-bold text-fg leading-[1.1] tracking-tight">
                      Zora
                    </h2>
                    <p className="font-body text-xs text-fg-muted mt-1">
                      Smart Earring Prototype
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-border-light group-hover:bg-bg transition-all duration-300 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-dim group-hover:text-fg transition-colors duration-300">
                      <path d="M4 12L12 4M12 4H6M12 4v6" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                  {['Arduino', 'Hardware', 'PPG Sensors', 'Product Strategy'].map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 text-[0.6rem] font-body font-medium text-fg-dim border border-border rounded-full transition-colors duration-300 group-hover:border-border-light group-hover:text-fg-muted">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="w-full h-px bg-border" />
              </div>

              <div className="relative h-[200px] md:h-[220px] overflow-hidden">
                <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-700" style={{ background: 'radial-gradient(ellipse at 50% 90%, #B76E7960 0%, transparent 60%)' }} />
                <div className="grid grid-cols-3 gap-2 p-4 pt-3 h-full">
                  <div className="rounded-lg overflow-hidden">
                    <Image src="/images/zora/prototype-3.jpg" alt="Earring on ear" width={3088} height={2316} quality={85} className="w-full h-full object-cover pointer-events-none" />
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <Image src="/images/zora/prototype-5.jpg" alt="Prototype front" width={4032} height={3024} quality={85} className="w-full h-full object-cover pointer-events-none" />
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <Image src="/images/zora/prototype-7.jpg" alt="Working prototype" width={4032} height={3024} quality={85} className="w-full h-full object-cover pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
