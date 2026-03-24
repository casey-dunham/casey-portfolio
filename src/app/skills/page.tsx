'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { media, getAllTags, getMediaByTags } from '@/data/projects';

export default function SkillsPage() {
  return (
    <Suspense>
      <SkillsContent />
    </Suspense>
  );
}

function SkillsContent() {
  const [allTags] = useState(() => getAllTags());
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const t = searchParams.get('t');
    if (t) {
      const tags = t.split(',').filter((tag) => allTags.some((at) => at.toLowerCase() === tag.toLowerCase()));
      if (tags.length > 0) setSelected(tags);
    }
  }, [searchParams, allTags]);

  const toggle = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const matched = getMediaByTags(selected);

  return (
    <main className="min-h-screen pb-20">
      <section className="pt-28 md:pt-36 pb-14 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
          className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.08] tracking-tight mb-4"
        >
          Skills
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="font-body text-fg-muted text-[1rem] mb-10"
        >
          Select one or more skills to filter pieces.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-wrap gap-2.5"
        >
          {allTags.map((tag) => {
            const isActive = selected.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggle(tag)}
                className={`px-5 py-2.5 text-[0.82rem] font-body border rounded-full transition-all duration-300 ${
                  isActive
                    ? 'text-fg border-fg bg-fg/10'
                    : 'text-fg-dim border-border hover:text-fg hover:border-border-light'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </motion.div>

        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="mt-4 text-[0.8rem] font-body text-fg-dim hover:text-fg transition-colors"
          >
            Clear all
          </button>
        )}
      </section>

      <AnimatePresence mode="wait">
        {selected.length > 0 && (
          <motion.section
            key={selected.join(',')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto"
          >
            <p className="font-body text-fg-muted text-sm mb-6">
              {matched.length > 0
                ? `${matched.length} piece${matched.length > 1 ? 's' : ''} matching ${selected.join(' + ')}`
                : 'No pieces match all selected skills.'}
            </p>

            {matched.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {matched.map((item, i) => (
                  <motion.div
                    key={item.src}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <Link href={`/work/${item.projectSlug}`} className="group block">
                      <div className="bg-bg-raised rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-border-light">
                        <div className="overflow-hidden bg-bg">
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
                          <h3 className="font-display text-sm font-semibold text-fg leading-snug">
                            {item.title}
                          </h3>
                          <p className="font-body text-xs text-fg-dim mt-0.5">{item.project}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {item.tags.map((t) => (
                              <span
                                key={t}
                                className={`px-2 py-0.5 text-[0.65rem] font-body border rounded-full ${
                                  selected.includes(t)
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
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
