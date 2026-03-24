'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

/* ── Animation ── */
const ease = [0.25, 1, 0.5, 1] as const;
const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' as const },
  transition: { duration: 0.7, delay, ease },
});
const pop = (i: number) => ({
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.35, delay: i * 0.03, ease },
});

/* ── Lightbox media registry ── */
interface MediaItem {
  src: string; alt: string; w: number; h: number; type: 'image' | 'video';
  title: string; caption: string; tags: string[];
}
const media: MediaItem[] = [
  { src: '/images/zora/prototype-1.jpg', alt: 'Arduino breadboard', w: 4032, h: 3024, type: 'image',
    title: 'First Circuit', caption: 'Arduino Uno R4 wired to a breadboard with an LED — learning the fundamentals of circuits and embedded programming from scratch.', tags: ['Arduino', 'Hardware'] },
  { src: '/images/zora/prototype-4.jpg', alt: 'Breadboard wiring', w: 4032, h: 3024, type: 'image',
    title: 'Breadboard Prototyping', caption: 'Wiring pulse sensor connections to the Arduino. Each wire color maps to power, ground, and signal.', tags: ['Arduino', 'Hardware'] },
  { src: '/images/zora/prototype-2.jpg', alt: 'Pulse sensor readings', w: 4032, h: 3024, type: 'image',
    title: 'First Heartbeat', caption: 'Reading live PPG data from a pulse sensor through the Arduino IDE serial plotter — the first time I saw my own heartbeat on screen.', tags: ['Arduino', 'PPG Sensor'] },
  { src: '/images/zora/prototype-3.jpg', alt: 'Earring prototype on ear', w: 3088, h: 2316, type: 'image',
    title: 'Ear Fit Test', caption: 'Testing the sensor form factor on the earlobe. The ear provides a PPG signal roughly 100x cleaner than the wrist with 24.5% better accuracy.', tags: ['PPG Sensor', 'Hardware'] },
  { src: '/images/zora/prototype-5.jpg', alt: 'Prototype front', w: 4032, h: 3024, type: 'image',
    title: 'Prototype Assembly — Front', caption: 'Seeed Studio XIAO board with PPG sensor and wiring mounted to a clip-on earring form. The front houses the LED and Bluetooth antenna.', tags: ['Hardware', 'Seeed XIAO'] },
  { src: '/images/zora/prototype-6.jpg', alt: 'Prototype back', w: 4032, h: 3024, type: 'image',
    title: 'Prototype Assembly — Back', caption: 'Hand-soldered perfboard with photodiode, IMU, and processor connections. The back clasp holds all sensing and compute components.', tags: ['Hardware', 'Soldering'] },
  { src: '/images/zora/prototype-7.jpg', alt: 'Full prototype', w: 4032, h: 3024, type: 'image',
    title: 'Working Prototype', caption: 'The complete earring prototype — clip-on form factor with stacked PCBs, PPG sensor, and microcontroller. Reads heart rate in real time.', tags: ['Hardware', 'PPG Sensor'] },
];

function idx(src: string) {
  return media.findIndex((m) => m.src === src);
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function ZoraProject() {
  const [li, setLi] = useState<number | null>(null);
  const [dir, setDir] = useState(0);
  const open = useCallback((src: string) => { setDir(0); setLi(idx(src)); }, []);
  const close = useCallback(() => { setLi(null); setDir(0); }, []);
  const prev = useCallback(() => { setDir(-1); setLi((i) => (i !== null && i > 0 ? i - 1 : i)); }, []);
  const next = useCallback(() => { setDir(1); setLi((i) => (i !== null && i < media.length - 1 ? i + 1 : i)); }, []);

  return (
    <main className="min-h-screen pb-0">

      {/* ═══ HERO ═══ */}
      <section className="pt-28 md:pt-36 pb-16 md:pb-24 px-4 md:px-8 lg:px-12 max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.9fr] gap-10 md:gap-12 items-start">
          <div>
            <motion.div {...fade(0.1)} className="mb-8">
              <Link href="/projects" className="font-body text-xs text-[#555] uppercase tracking-[0.2em] hover:text-fg transition-colors">
                &larr; Projects
              </Link>
            </motion.div>

            <motion.h1
              {...fade(0.15)}
              className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.08] tracking-tight mb-10"
            >
              Zora
            </motion.h1>

            <motion.p {...fade(0.2)} className="font-body text-fg text-[1.15rem] md:text-[1.3rem] leading-[1.55] font-light mb-5">
              A smart earring for health tracking &mdash; without compromising style.
            </motion.p>
            <motion.p {...fade(0.25)} className="font-body text-[#999] text-[0.92rem] leading-[1.7] mb-5">
              I had this idea and didn&rsquo;t know the first thing about circuits or
              Arduino. So I took courses, learned embedded programming from scratch,
              purchased components, and built a working prototype that reads heart rate
              from the earlobe in real time.
            </motion.p>
            <motion.div {...fade(0.32)} className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 text-[0.75rem] font-body text-[#333] bg-[#ddd] rounded-full">2025</span>
              {['Arduino', 'PPG Sensors', 'Circuit Design', 'Soldering', 'Product Strategy'].map((t) => (
                <span key={t} className="px-4 py-1.5 text-[0.75rem] font-body text-[#888] border border-[#2A2A2A] rounded-full">{t}</span>
              ))}
            </motion.div>
          </div>

          <motion.div
            {...fade(0.2)}
            className="rounded-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => open('/images/zora/prototype-7.jpg')}
          >
            <Image src="/images/zora/prototype-7.jpg" alt="Zora prototype" width={4032} height={3024} quality={85} className="w-full h-auto block" />
          </motion.div>
        </div>
      </section>

      {/* ═══ THE BUILD ═══ */}
      <Sect label="The Build">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {([
            ['/images/zora/prototype-1.jpg', 'First circuit', 4032, 3024],
            ['/images/zora/prototype-2.jpg', 'First heartbeat', 4032, 3024],
            ['/images/zora/prototype-3.jpg', 'Ear fit test', 3088, 2316],
            ['/images/zora/prototype-5.jpg', 'Prototype assembly', 4032, 3024],
          ] as const).map(([src, alt, w, h], i) => (
            <motion.div key={src} {...pop(i)}>
              <Img src={src} alt={alt} w={w} h={h} onClick={open} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-8 items-start">
          <motion.div {...fade(0)}>
            <p className="font-body text-fg text-[0.95rem] leading-[1.7] mb-4">
              Started from zero &mdash; LED blink tests on a breadboard, then analog
              sensor reads, then pulse detection from a PPG sensor, then soldering
              a custom PCB to fit an earring form factor.
            </p>
            <p className="font-body text-[#888] text-[0.85rem] leading-[1.7]">
              The gap between reading a datasheet and getting a clean signal off a
              perfboard is where the real learning happened.
            </p>
          </motion.div>
          <div className="hidden md:block w-px bg-[#2A2A2A] self-stretch" />
          <div className="grid grid-cols-2 gap-3">
            <motion.div {...pop(0)}>
              <Img src="/images/zora/prototype-6.jpg" alt="Prototype back" w={4032} h={3024} onClick={open} />
            </motion.div>
            <motion.div {...pop(1)}>
              <Img src="/images/zora/prototype-7.jpg" alt="Full prototype" w={4032} h={3024} onClick={open} />
            </motion.div>
          </div>
        </div>
      </Sect>

      {/* ═══ THE VISION ═══ */}
      <Sect label="The Vision">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          {[
            { val: '30%', label: 'Fitness tracker abandonment rate' },
            { val: '24.5%', label: 'Better accuracy from earlobe' },
            { val: '100x', label: 'Cleaner PPG signal from ear' },
            { val: '<2.8g', label: 'Target weight per earring' },
          ].map((s, i) => (
            <motion.div key={s.label} {...fade(i * 0.04)}>
              <span className="font-display text-2xl md:text-3xl font-bold text-fg tracking-tight">{s.val}</span>
              <p className="font-body text-[0.75rem] text-[#777] mt-1 leading-[1.5]">{s.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          {[
            { t: 'PPG Sensing', d: 'Green LED shines into the earlobe, a photodiode reads reflected light. Each pulse of blood changes the signal — continuous heart rate, SpO2, and HRV.' },
            { t: 'Swappable Shells', d: 'Quarter-turn bayonet lock separates the tech core from decorative shells. One piece of technology, infinite styles.' },
            { t: 'Alternating Ears', d: 'Two earrings share the workload. While one monitors, the other charges — extending battery life to 72 hours.' },
            { t: 'Women-First Design', d: 'Algorithms trained for women\'s biology. Lightweight, waterproof, hypoallergenic. Fine jewelry that happens to track your health.' },
          ].map((item, i) => (
            <motion.div key={item.t} {...fade(i * 0.05)}>
              <h3 className="font-display text-[0.95rem] font-semibold text-fg mb-1.5">{item.t}</h3>
              <p className="font-body text-[0.82rem] text-[#777] leading-[1.7]">{item.d}</p>
            </motion.div>
          ))}
        </div>
      </Sect>

      {/* ═══ FOOTER ═══ */}
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
            <span>&copy; {new Date().getFullYear()} Casey Dunham</span>
          </div>
        </div>
      </footer>

      {/* ═══ LIGHTBOX ═══ */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {li !== null && <LB index={li} direction={dir} onClose={close} onPrev={prev} onNext={next} />}
        </AnimatePresence>,
        document.body
      )}
    </main>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

function Sect({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
      className="px-4 md:px-8 lg:px-12 max-w-[1000px] mx-auto border-t border-[#2A2A2A] py-14 md:py-20"
    >
      <h2 className="font-display text-xs uppercase tracking-[0.2em] text-[#555] font-medium mb-8">{label}</h2>
      <div>{children}</div>
    </motion.section>
  );
}

function Img({ src, alt, w, h, onClick }: {
  src: string; alt: string; w: number; h: number; onClick: (s: string) => void;
}) {
  return (
    <motion.div
      className="rounded-lg overflow-hidden cursor-pointer"
      onClick={() => onClick(src)}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Image src={src} alt={alt} width={w} height={h} quality={85} className="block w-full h-auto" />
    </motion.div>
  );
}

function LB({ index, direction, onClose, onPrev, onNext }: {
  index: number; direction: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const m = media[index];
  const hasPrev = index > 0;
  const hasNext = index < media.length - 1;
  const dirRef = { current: direction };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const getInitial = () => {
    if (direction !== 0) return { x: direction > 0 ? 600 : -600, opacity: 0 };
    return { opacity: 0, scale: 0.9 };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className="art-lightbox-backdrop" onClick={onClose}
    >
      <motion.button className="video-lightbox-close" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.15 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </motion.button>

      {hasPrev && (
        <motion.button className="video-lightbox-nav video-lightbox-prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.15 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </motion.button>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={m.src} initial={getInitial()} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ x: dirRef.current > 0 ? -600 : 600, opacity: 0, position: 'absolute' as const }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as const }}
            className="art-lightbox-content art-lightbox-landscape"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={m.src} alt={m.alt} width={m.w} height={m.h} quality={90} className="block w-full h-auto" style={{ borderRadius: '8px 8px 0 0' }} />
            <div className="video-lightbox-detail">
              <div style={{ height: '1px', background: 'var(--border)', marginBottom: '0.75rem' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)', display: 'block', marginBottom: '0.5rem' }}>{m.title}</span>
              <p className="video-lightbox-detail-desc">{m.caption}</p>
              {m.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {m.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--border-light)', color: 'var(--fg-muted)', fontFamily: 'var(--font-body)' }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {hasNext && (
        <motion.button className="video-lightbox-nav video-lightbox-next"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.15 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </motion.button>
      )}
    </motion.div>
  );
}
