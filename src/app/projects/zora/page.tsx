'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  // Pitch slide
  { src: '/images/zora/pitch-slide.jpg', alt: 'Startup Exchange pitch slide', w: 3420, h: 2046, type: 'image',
    title: 'Startup Exchange Genesis', caption: 'Pitch slide from Georgia Tech Startup Exchange. The premise: smart earrings that track your health without compromising your style.', tags: ['Georgia Tech', 'Startup Exchange'] },
  // Product overview
  { src: '/images/zora/product-overview.png', alt: 'Zora product overview', w: 1545, h: 2000, type: 'image',
    title: 'Product Overview', caption: 'One-pager covering the problem, solution, health tracking functions (PPG, temperature, IMU), app experience, market opportunity, and why the ear is the ideal sensor location.', tags: ['Product Strategy', 'Research'] },
  // PPG waveform
  { src: '/images/zora/ppg-waveform.png', alt: 'PPG waveform diagram', w: 685, h: 746, type: 'image',
    title: 'PPG Waveform', caption: 'Photoplethysmography signal morphology from academic research (Nature, 2023). Each heartbeat produces a distinct waveform — systolic peak, dicrotic notch, diastolic peak — from which heart rate, SpO2, HRV, and blood pressure can be derived.', tags: ['Research', 'PPG Sensor'] },
  // Build photos
  { src: '/images/zora/prototype-1.jpg', alt: 'Arduino breadboard with LED', w: 4032, h: 3024, type: 'image',
    title: 'First Circuit', caption: 'Arduino Uno R4 wired to a breadboard with an LED. Day one of learning circuits from scratch — no prior electronics experience.', tags: ['Arduino', 'The Hive'] },
  { src: '/images/zora/prototype-4.jpg', alt: 'Hand wiring breadboard', w: 4032, h: 3024, type: 'image',
    title: 'Wiring the Pulse Sensor', caption: 'Connecting the PPG pulse sensor to the Arduino at Georgia Tech\'s Hive makerspace. Each wire maps to power, ground, and analog signal.', tags: ['Arduino', 'The Hive'] },
  { src: '/images/zora/prototype-2.jpg', alt: 'Pulse sensor data on screen', w: 4032, h: 3024, type: 'image',
    title: 'First Heartbeat', caption: 'Live PPG data streaming through the Arduino IDE serial plotter. The first time I saw my own heartbeat rendered on screen from a sensor I wired myself.', tags: ['Arduino', 'PPG Sensor'] },
  { src: '/images/zora/prototype-3.jpg', alt: 'Sensor clipped to ear', w: 3088, h: 2316, type: 'image',
    title: 'Ear Fit Test', caption: 'Testing the sensor on the earlobe at The Hive. Research shows the ear provides up to 6.3x higher PPG signal quality than the wrist — validating the core thesis of the project.', tags: ['PPG Sensor', 'The Hive'] },
  { src: '/images/zora/prototype-5.jpg', alt: 'Prototype assembly front', w: 4032, h: 3024, type: 'image',
    title: 'Prototype — Front', caption: 'Seeed Studio XIAO BLE board with PPG sensor and wiring mounted to a clip-on earring form factor. The front houses the LED emitter and Bluetooth antenna.', tags: ['Seeed XIAO', 'Soldering'] },
  { src: '/images/zora/prototype-6.jpg', alt: 'Prototype assembly back', w: 4032, h: 3024, type: 'image',
    title: 'Prototype — Back', caption: 'Hand-soldered perfboard with photodiode, connections, and processor wiring. The back clasp carries all sensing and compute components.', tags: ['Soldering', 'Hardware'] },
  { src: '/images/zora/prototype-7.jpg', alt: 'Completed prototype in hand', w: 4032, h: 3024, type: 'image',
    title: 'Working Prototype', caption: 'The finished earring prototype — clip-on form factor with stacked PCBs, PPG sensor, and Seeed XIAO microcontroller. Reads heart rate, SpO2, HRV, and temperature from the earlobe in real time.', tags: ['Hardware', 'PPG Sensor'] },
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
              <Link href="/" className="font-body text-xs text-[#555] uppercase tracking-[0.2em] hover:text-fg transition-colors">
                &larr; Home
              </Link>
            </motion.div>

            <motion.h1
              {...fade(0.15)}
              className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.08] tracking-tight mb-10"
            >
              Zora
            </motion.h1>

            <motion.p {...fade(0.2)} className="font-body text-fg text-[1.15rem] md:text-[1.3rem] leading-[1.55] font-light mb-5">
              Smart earrings that track your health without compromising your style.
            </motion.p>
            <motion.p {...fade(0.25)} className="font-body text-[#999] text-[0.92rem] leading-[1.7] mb-8">
              I had this idea and didn&rsquo;t know the first thing about circuits,
              Arduino, or embedded systems. So I enrolled in courses, taught myself
              electronics, ordered components off Amazon, walked into Georgia Tech&rsquo;s
              Hive makerspace, and built a working prototype that tracks heart rate,
              SpO2, HRV, and temperature from the earlobe in real time.
            </motion.p>
            <motion.div {...fade(0.32)} className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 text-[0.75rem] font-body text-[#333] bg-[#ddd] rounded-full">2025</span>
              {['Arduino', 'PPG Sensors', 'Circuit Design', 'Soldering', 'Product Strategy'].map((t) => (
                <span key={t} className="px-4 py-1.5 text-[0.75rem] font-body text-[#888] border border-[#2A2A2A] rounded-full">{t}</span>
              ))}
            </motion.div>
          </div>

          {/* Hero image — the ear fit test, the most compelling shot */}
          <motion.div
            {...fade(0.2)}
            className="rounded-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => open('/images/zora/prototype-3.jpg')}
          >
            <Image src="/images/zora/prototype-3.jpg" alt="Earring prototype tested on ear" width={3088} height={2316} quality={85} className="w-full h-auto block" />
          </motion.div>
        </div>
      </section>

      {/* ═══ PITCH ═══ */}
      <Sect label="The Problem">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8 md:gap-12 items-start">
          <motion.div {...fade(0)} className="rounded-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => open('/images/zora/pitch-slide.jpg')}
          >
            <Image src="/images/zora/pitch-slide.jpg" alt="Startup Exchange pitch" width={3420} height={2046} quality={85} className="w-full h-auto block" />
          </motion.div>
          <div>
            <motion.p {...fade(0.05)} className="font-body text-fg text-[0.95rem] leading-[1.7] mb-4">
              Nearly a third of fitness trackers end up in a drawer &mdash; users get
              bored or stop finding them useful. What if a wearable didn&rsquo;t feel
              like a gadget at all?
            </motion.p>
            <motion.p {...fade(0.1)} className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-6">
              The earlobe is a better place to sense anyway &mdash; PPG signals are
              up to 6.3x higher quality than the wrist, and the ear captures valid
              heart-rate data 91.7% of exercise time vs. 67.2% for a wrist tracker.
              So why not put the sensor where it works best and make it something you
              actually want to wear?
            </motion.p>
            <motion.div {...fade(0.15)} className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { val: '6.3x', label: 'Signal quality vs. wrist' },
                { val: '91.7%', label: 'Valid HR during exercise' },
                { val: '<2.8g', label: 'Per earring' },
                { val: '72hr', label: 'Battery (alternating)' },
              ].map((s) => (
                <div key={s.label}>
                  <span className="font-display text-xl md:text-2xl font-bold text-fg tracking-tight">{s.val}</span>
                  <p className="font-body text-[0.7rem] text-[#666] mt-0.5 leading-[1.4]">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </Sect>

      {/* ═══ THE BUILD — visual timeline ═══ */}
      <Sect label="The Build">
        <motion.p {...fade(0)} className="font-body text-[#999] text-[0.92rem] leading-[1.7] mb-10 max-w-[620px]">
          Zero electronics experience to working prototype. I ordered an Arduino
          starter kit off Amazon, took online courses on circuits and Python, and
          spent weeks at Georgia Tech&rsquo;s <span className="text-fg font-medium">Hive</span> makerspace
          learning by building.
        </motion.p>

        {/* Step 1 + 2 side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <motion.div {...pop(0)} className="relative">
            <Img src="/images/zora/prototype-1.jpg" alt="First circuit" w={4032} h={3024} onClick={open} />
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[0.65rem] font-body font-medium text-white/80 bg-black/50 backdrop-blur-sm rounded-full">01 — First circuit</span>
          </motion.div>
          <motion.div {...pop(1)} className="relative">
            <Img src="/images/zora/prototype-4.jpg" alt="Wiring pulse sensor" w={4032} h={3024} onClick={open} />
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[0.65rem] font-body font-medium text-white/80 bg-black/50 backdrop-blur-sm rounded-full">02 — Wiring the sensor</span>
          </motion.div>
        </div>

        {/* Step 3 — wide */}
        <motion.div {...pop(2)} className="relative mb-3">
          <Img src="/images/zora/prototype-2.jpg" alt="First heartbeat on screen" w={4032} h={3024} onClick={open} />
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[0.65rem] font-body font-medium text-white/80 bg-black/50 backdrop-blur-sm rounded-full">03 — First heartbeat on screen</span>
        </motion.div>

        {/* Step 4, 5, 6 — three up */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.div {...pop(3)} className="relative">
            <Img src="/images/zora/prototype-5.jpg" alt="Prototype front" w={4032} h={3024} onClick={open} />
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[0.65rem] font-body font-medium text-white/80 bg-black/50 backdrop-blur-sm rounded-full">04 — Assembly</span>
          </motion.div>
          <motion.div {...pop(4)} className="relative">
            <Img src="/images/zora/prototype-6.jpg" alt="Prototype back" w={4032} h={3024} onClick={open} />
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[0.65rem] font-body font-medium text-white/80 bg-black/50 backdrop-blur-sm rounded-full">05 — Soldering</span>
          </motion.div>
          <motion.div {...pop(5)} className="relative">
            <Img src="/images/zora/prototype-7.jpg" alt="Completed prototype" w={4032} h={3024} onClick={open} />
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[0.65rem] font-body font-medium text-white/80 bg-black/50 backdrop-blur-sm rounded-full">06 — Working prototype</span>
          </motion.div>
        </div>
      </Sect>

      {/* ═══ HOW IT WORKS ═══ */}
      <Sect label="How It Works">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1.2fr] gap-8 md:gap-10 items-start">
          {/* Product overview doc */}
          <motion.div {...fade(0)}>
            <Img src="/images/zora/product-overview.png" alt="Zora product overview" w={1545} h={2000} onClick={open} />
          </motion.div>

          <div className="hidden md:block w-px bg-[#2A2A2A] self-stretch" />

          {/* Explanation */}
          <motion.div {...fade(0.08)}>
            <div className="space-y-6">
              {[
                { t: 'Three-Part System', d: 'Front stud houses the LED and Bluetooth antenna. The post conducts power and data. The back clasp carries the photodiode, IMU, temperature sensor, battery, and processor — all under 2.8 grams.' },
                { t: 'PPG Sensing', d: 'Green light shines through the earlobe. A photodiode reads the reflected signal — each pulse of blood modulates it, yielding continuous heart rate, SpO2, and HRV.' },
                { t: 'Swappable Shells', d: 'Quarter-turn bayonet lock separates the tech core from decorative shells. One device, infinite styles — studs, drops, statement pieces.' },
                { t: 'Alternating Ears', d: 'Two earrings share the load. While one monitors, the other charges in a compact jewelry-box case. Extends battery to 72 hours.' },
              ].map((item, i) => (
                <div key={item.t}>
                  <h3 className="font-display text-[0.88rem] font-semibold text-fg mb-1">{item.t}</h3>
                  <p className="font-body text-[0.8rem] text-[#777] leading-[1.7]">{item.d}</p>
                </div>
              ))}
            </div>
          </motion.div>
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
            <div className="flex items-center gap-4">
              <span>&copy; {new Date().getFullYear()} Casey Dunham</span>
              <a href="/privacy" className="hover:text-fg-muted transition-colors">Privacy Policy</a>
            </div>
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
  const dirRef = useRef(direction);
  dirRef.current = direction;
  const isVideo = m.type === 'video';

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

  const ar = m.w / m.h;
  const orientClass = ar > 2 ? ' art-lightbox-ultrawide' : ar >= 1 ? ' art-lightbox-landscape' : ' art-lightbox-portrait';
  const backdropClass = isVideo ? 'video-lightbox-backdrop' : 'art-lightbox-backdrop';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className={backdropClass} onClick={onClose}
    >
      {/* Close */}
      <motion.button className="video-lightbox-close" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.15 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </motion.button>

      {/* Prev */}
      {hasPrev && (
        <motion.button className="video-lightbox-nav video-lightbox-prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.15 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </motion.button>
      )}

      {/* Content */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={m.src} initial={getInitial()} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ x: dirRef.current > 0 ? -600 : 600, opacity: 0, position: 'absolute' as const }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as const }}
            className={`art-lightbox-content${orientClass}`}
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo ? (
              <div className="video-lightbox-video-wrap" onClick={(e) => {
                const vid = e.currentTarget.querySelector('video');
                if (vid) vid.paused ? vid.play() : vid.pause();
              }}>
                <video src={m.src} autoPlay loop muted playsInline className="video-lightbox-video" style={{ cursor: 'pointer' }} />
              </div>
            ) : (
              <div className="art-lightbox-image-wrap">
                <Image src={m.src} alt={m.alt} width={m.w} height={m.h} quality={90}
                  className="art-lightbox-image" />
              </div>
            )}

            {/* Detail panel */}
            <div className="video-lightbox-detail">
              <a href="/projects/zora" className="video-lightbox-detail-header">
                <span className="video-lightbox-detail-name" style={{ fontSize: '0.95rem' }}>Zora</span>
                <svg className="video-lightbox-detail-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </a>
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

      {/* Next */}
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
