'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { media, getAllTags, findTagBySlug, slugify } from '@/data/projects';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] as const },
});

export default function SkillPage() {
  const { skill } = useParams<{ skill: string }>();
  const tag = findTagBySlug(skill);
  const matched = tag
    ? media.filter((m) => m.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
    : [];

  const allTags = getAllTags();

  return (
    <main className="min-h-screen pb-20">
      <section className="pt-28 md:pt-36 pb-14 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <motion.div {...fade(0.1)}>
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 text-sm font-body text-fg-dim hover:text-fg transition-colors mb-8"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 12L6 8l4-4" />
            </svg>
            All Skills
          </Link>
        </motion.div>

        <motion.h1
          {...fade(0.15)}
          className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.08] tracking-tight mb-4"
        >
          {tag ?? skill}
        </motion.h1>

        <motion.p {...fade(0.25)} className="font-body text-fg-muted text-[1rem] mb-10">
          {matched.length > 0
            ? `${matched.length} piece${matched.length > 1 ? 's' : ''} using ${tag}`
            : 'No pieces tagged with this skill yet.'}
        </motion.p>

        <motion.div {...fade(0.3)} className="flex flex-wrap gap-2.5 mb-14">
          {allTags.map((t) => {
            const isActive = tag && t.toLowerCase() === tag.toLowerCase();
            return (
              <Link
                key={t}
                href={`/skills/${slugify(t)}`}
                className={`px-4 py-2 text-[0.8rem] font-body border rounded-full transition-all duration-300 ${
                  isActive
                    ? 'text-fg border-fg bg-fg/5'
                    : 'text-[#666] border-[#2A2A2A] hover:text-fg hover:border-[#555]'
                }`}
              >
                {t}
              </Link>
            );
          })}
        </motion.div>
      </section>

      {matched.length > 0 && (
        <section className="px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {matched.map((item, i) => (
              <motion.div
                key={item.src}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: [0.25, 1, 0.5, 1] }}
              >
                <Link href={`/projects/${item.projectSlug}`} className="group block">
                  <div className="bg-bg-raised rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-border-light">
                    <div className="overflow-hidden bg-[#111]">
                      {item.type === 'image' ? (
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={item.w}
                          height={item.h}
                          className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      ) : (
                        <video
                          src={item.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-auto block"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm font-semibold text-fg leading-snug">{item.title}</h3>
                      <p className="font-body text-xs text-fg-dim mt-0.5">{item.project}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className={`px-2 py-0.5 text-[0.65rem] font-body border rounded-full ${
                              tag && t.toLowerCase() === tag.toLowerCase()
                                ? 'text-fg border-fg/30 bg-fg/5'
                                : 'text-fg-dim border-border'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
