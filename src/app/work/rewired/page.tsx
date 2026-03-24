'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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
interface MediaItem { src: string; alt: string; w: number; h: number; type: 'image' | 'video'; caption?: string }
const media: MediaItem[] = [
  // Screenshots
  { src: '/images/rewired/screenshots/welcome.png', alt: 'Welcome', w: 1242, h: 2688, type: 'image', caption: 'Welcome screen — the rewired brain hero illustration.' },
  { src: '/images/rewired/screenshots/dashboard.png', alt: 'Dashboard', w: 1242, h: 2688, type: 'image', caption: 'Daily dashboard — today\'s session, current focus, and streak.' },
  { src: '/images/rewired/screenshots/npi.png', alt: 'Assessment', w: 1242, h: 2688, type: 'image', caption: 'Neuroplasticity assessment — behavioral pattern questions.' },
  { src: '/images/rewired/screenshots/results.png', alt: 'Results', w: 1242, h: 2688, type: 'image', caption: 'Preparing your results — AI analysis of core themes and belief patterns.' },
  { src: '/images/rewired/screenshots/profile.png', alt: 'Neuroprofile', w: 1242, h: 2688, type: 'image', caption: 'Your Neuroprofile — ideal self, core traits, and growth tracking.' },
  { src: '/images/rewired/screenshots/lesson.png', alt: 'Lesson', w: 1242, h: 2688, type: 'image', caption: 'Psychoeducation lesson — awareness, practice, integration.' },
  { src: '/images/rewired/screenshots/lessonintro.png', alt: 'Lesson intro', w: 1242, h: 2688, type: 'image', caption: 'Lesson introduction with progress tracking.' },
  { src: '/images/rewired/screenshots/aichattext.png', alt: 'AI Coach', w: 1242, h: 2688, type: 'image', caption: 'AI coaching — the orb responds with personalized guidance.' },
  { src: '/images/rewired/screenshots/notifications.png', alt: 'Notifications', w: 1242, h: 2688, type: 'image', caption: 'Notification preferences — session reminders and check-ins.' },
  { src: '/images/rewired/screenshots/screen1.png', alt: 'Screen 1', w: 1242, h: 2688, type: 'image' },
  // Videos
  { src: '/videos/uxui/rewired-value-props-2a.mp4', alt: 'Value props', w: 886, h: 1920, type: 'video', caption: 'Onboarding — animated value propositions.' },
  { src: '/videos/uxui/rewired-onboarding-2b.mp4', alt: 'Onboarding', w: 886, h: 1920, type: 'video', caption: 'Onboarding flow — personalization questions.' },
  { src: '/videos/uxui/rewired-questions-7a.mp4', alt: 'Questions', w: 886, h: 1920, type: 'video', caption: 'Assessment — behavioral pattern questionnaire.' },
  { src: '/videos/uxui/rewired-finished-7b.mp4', alt: 'Finished', w: 886, h: 1920, type: 'video', caption: 'Results — AI-generated neuroprofile.' },
  { src: '/videos/uxui/rewired-lesson-7c.mp4', alt: 'Lesson flow', w: 886, h: 1920, type: 'video', caption: 'Daily session — lesson and therapeutic exercise.' },
  { src: '/videos/rewired/animation-process.mp4', alt: 'Animation process', w: 1920, h: 1080, type: 'video', caption: 'Creating the onboarding animation in Procreate.' },
  // Branding
  { src: '/images/rewired/branding/primary-orb.png', alt: 'AI Orb', w: 497, h: 497, type: 'image', caption: 'The AI orb — gradient sphere representing the coaching presence.' },
  { src: '/images/rewired/branding/ribbon.png', alt: 'Ribbon', w: 3897, h: 974, type: 'image', caption: 'The ribbon — a flowing gradient line that runs through the app.' },
  { src: '/images/rewired/branding/logo.png', alt: 'Logo', w: 922, h: 765, type: 'image', caption: 'Rewired brain logo — neural pathways as gradient lines.' },
  { src: '/images/rewired/branding/app-icon-1024.png', alt: 'App icon', w: 1024, h: 1024, type: 'image', caption: 'App icon — brain with gradient neural pathways.' },
  { src: '/images/rewired/branding/app-icon-charcoal-1024.png', alt: 'App icon dark', w: 1024, h: 1024, type: 'image', caption: 'App icon — dark variant.' },
  { src: '/images/rewired/rewired-app.jpg', alt: 'App overview', w: 6856, h: 3306, type: 'image', caption: 'Rewired — app icon explorations and branding.' },
  { src: '/images/rewired/line-artblack.jpg', alt: 'Line art', w: 3936, h: 984, type: 'image', caption: 'The ribbon as continuous line art.' },
  // Orb frames
  ...Array.from({ length: 36 }, (_, i) => ({
    src: `/images/rewired/orbs/orb-${String(i + 1).padStart(2, '0')}.png`,
    alt: `Orb frame ${i + 1}`, w: 350, h: 350, type: 'image' as const,
    caption: `Orb animation frame ${i + 1} of 36.`,
  })),
  // Avatars
  ...Array.from({ length: 97 }, (_, i) => ({
    src: `/images/rewired/avatars/avatar_${String(i + 1).padStart(3, '0')}.png`,
    alt: `Avatar ${i + 1}`, w: 376, h: 435, type: 'image' as const,
    caption: `Avatar ${i + 1} of 97.`,
  })),
  // Illustrations (selection)
  ...['brain-tree', 'brain-door', 'brain-puzzle', 'knight', 'potted-plant', 'lightbulb', 'telescope', 'brain-heart', 'stone-cairn', 'umbrella', 'star', 'anvil-with-balloon', 'broken-ladder', 'brain-topographic', 'fingerprint', 'hour-glass', 'key', 'shield', 'trophy', 'flame', 'bird-head', 'magnifying-glass', 'cracked-pot-with-sprout', 'ladder-out-of-head', 'brain-wind-toy', 'sad-illustration', 'calendar', 'clock', 'notebook', 'neural-network', 'knitting-brain', 'spark-brain', 'book-stack', 'statue-with-headphones', 'eraser', 'hand-with-thread', 'tree-with-optic-roots', 'closing-door', 'cracked-bell', 'ear', 'brain-cut-out', 'brain-map', 'cracked-rook', 'topographic-brain', 'wired-brain', 'brain-turtle', 'check', 'knotted-rope', 'gears'].map((name) => ({
    src: `/images/rewired/illustrations/${name}.png`,
    alt: name.replace(/-/g, ' '), w: 1024, h: 1024, type: 'image' as const,
    caption: `Illustration — ${name.replace(/-/g, ' ')}.`,
  })),
];

function idx(src: string) { return media.findIndex((m) => m.src === src); }

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function RewiredProject() {
  const [li, setLi] = useState<number | null>(null);
  const [dir, setDir] = useState(0);
  const open = useCallback((src: string) => { setDir(0); setLi(idx(src)); }, []);
  const close = useCallback(() => { setLi(null); setDir(0); }, []);
  const prev = useCallback(() => { setDir(-1); setLi((i) => (i !== null && i > 0 ? i - 1 : i)); }, []);
  const next = useCallback(() => { setDir(1); setLi((i) => (i !== null && i < media.length - 1 ? i + 1 : i)); }, []);

  return (
    <main className="min-h-screen pb-0">

      {/* ═══ HERO ═══ */}
      <section className="pt-28 md:pt-36 pb-20 md:pb-28 px-4 md:px-8 lg:px-12 max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.9fr] gap-10 md:gap-12 items-start">
          <div>
            <motion.div {...fade(0.1)} className="mb-8">
              <Link href="/work" className="font-body text-xs text-[#555] uppercase tracking-[0.2em] hover:text-fg transition-colors">
                &larr; Work
              </Link>
            </motion.div>

            <motion.h1
              {...fade(0.15)}
              className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-fg leading-[1.08] tracking-tight mb-10"
            >
              Rewired
            </motion.h1>

            <motion.p {...fade(0.2)} className="font-body text-fg text-[1.15rem] md:text-[1.3rem] leading-[1.55] font-light mb-5">
              Neuroplasticity, made personal.
            </motion.p>
            <motion.p {...fade(0.25)} className="font-body text-[#999] text-[0.92rem] leading-[1.7] mb-5">
              Rewired is a science-backed app that helps users transform limiting beliefs
              through personalized daily sessions. It combines psychoeducation, therapeutic
              exercises, and AI coaching &mdash; all grounded in neuroplasticity research.
            </motion.p>
            <motion.p {...fade(0.28)} className="font-body text-[#999] text-[0.92rem] leading-[1.7] mb-8">
              Solo-designed and solo-built. Every illustration, animation, and interaction
              crafted by hand.
            </motion.p>
            <motion.div {...fade(0.32)} className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 text-[0.75rem] font-body text-[#333] bg-[#ddd] rounded-full">Sep – Dec 2025</span>
              {['SwiftUI', 'SwiftData', 'Gemini AI', 'Figma', 'Procreate', 'CloudKit'].map((t) => (
                <span key={t} className="px-4 py-1.5 text-[0.75rem] font-body text-[#888] border border-[#2A2A2A] rounded-full">{t}</span>
              ))}
            </motion.div>
            <motion.a
              {...fade(0.36)}
              href="https://joinrewired.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm text-accent hover:text-fg transition-colors"
            >
              joinrewired.com
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h8v8M13 3 5 11" /></svg>
            </motion.a>
          </div>

          <motion.div
            {...fade(0.2)}
            className="rounded-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <video src="/videos/uxui/rewired-value-props-2a.mp4" autoPlay muted loop playsInline className="w-full block scale-[1.02]" onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }} />
          </motion.div>
        </div>
      </section>

      {/* ═══ WHAT IT DOES ═══ */}
      <Sect label="What It Does">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mb-14">
          {[
            { n: '01', t: 'Neuroplasticity Assessment', d: 'An 8-question behavioral assessment that identifies your core limiting beliefs. AI reads your story, finds themes, and detects belief patterns to build your neuroprofile.' },
            { n: '02', t: 'Personalized Sessions', d: 'Daily 8-minute sessions combining psychoeducation and therapeutic exercises. Each session targets your specific belief pattern through awareness, practice, and integration.' },
            { n: '03', t: 'AI Coaching', d: 'A conversational AI coach (the orb) that responds with personalized guidance. Text or voice — it knows your patterns, your progress, and your goals.' },
            { n: '04', t: 'Growth Tracking', d: 'Neuroprofile with core traits, ideal self vision, streak tracking, and progress insights. Watch your neural pathways actually rewire over time.' },
          ].map((item, i) => (
            <motion.div key={item.n} {...fade(i * 0.05)}>
              <span className="font-body text-[0.6rem] text-accent tracking-[0.2em] tabular-nums">{item.n}</span>
              <h3 className="font-display text-[0.95rem] font-semibold text-fg mt-1 mb-1.5">{item.t}</h3>
              <p className="font-body text-[0.82rem] text-[#777] leading-[1.7]">{item.d}</p>
            </motion.div>
          ))}
        </div>

        {/* App walkthrough videos */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {([
            ['/videos/uxui/rewired-onboarding-2b.mp4', 'Onboarding'],
            ['/videos/uxui/rewired-questions-7a.mp4', 'Assessment'],
            ['/videos/uxui/rewired-finished-7b.mp4', 'Results'],
            ['/videos/uxui/rewired-lesson-7c.mp4', 'Lesson'],
            ['/videos/uxui/rewired-value-props-2a.mp4', 'Value Props'],
          ] as const).map(([src, label], i) => (
            <motion.div key={src} {...pop(i)} className="rounded-lg overflow-hidden cursor-pointer"
              onClick={() => { }}
            >
              <video src={src} autoPlay muted loop playsInline className="w-full block scale-[1.02]"
                onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }} />
            </motion.div>
          ))}
        </div>
      </Sect>

      {/* ═══ THE AI ORB ═══ */}
      <Sect label="The AI Orb">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-stretch">
          {/* Left: text + orb frames */}
          <div className="flex flex-col justify-between">
            <motion.div {...fade(0)} className="mb-3">
              <p className="font-body text-fg text-[0.95rem] leading-[1.7] mb-4">
                The orb is Rewired&rsquo;s AI coaching presence &mdash; a softly animated gradient
                sphere that listens, responds, and guides. It&rsquo;s designed to feel warm and
                approachable rather than robotic.
              </p>
              <p className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-4">
                Users can speak or type to the orb. It knows their neuroprofile, their current
                belief focus, and their session history. Responses are grounded in CBT and
                neuroplasticity principles.
              </p>
              <p className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-4">
                Each of the 36 frames was individually painted in Procreate &mdash; layering
                soft airbrush gradients, adjusting hue rotation, and shifting the light source
                frame by frame to create a seamless looping animation. The frames were exported
                as a sprite sheet and driven by a SwiftUI timer that interpolates between them.
              </p>
              <p className="font-body text-[#888] text-[0.85rem] leading-[1.7]">
                The result feels alive &mdash; the orb pulses, breathes, and shifts color
                in response to conversation state. Purple for listening, gold for warmth,
                blue for calm.
              </p>
            </motion.div>
            <div className="border-t border-[#2A2A2A] mb-4" />
            {/* 36 orb frames — 9x4 grid */}
            <div className="grid grid-cols-9 gap-2">
              {Array.from({ length: 36 }, (_, i) => (
                <motion.div key={i} {...pop(i)}
                  whileHover={{ scale: 1.35, zIndex: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="cursor-pointer"
                  onClick={() => open(`/images/rewired/orbs/orb-${String(i + 1).padStart(2, '0')}.png`)}
                >
                  <Image
                    src={`/images/rewired/orbs/orb-${String(i + 1).padStart(2, '0')}.png`}
                    alt={`Orb frame ${i + 1}`} width={350} height={350} quality={85}
                    className="w-full h-auto block rounded-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>
          {/* Right: live video */}
          <motion.div {...fade(0.1)} className="rounded-lg overflow-hidden cursor-pointer">
            <video src="/videos/uxui/ai-orb-6b.mp4" autoPlay muted loop playsInline className="w-full block scale-[1.02]"
              onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }} />
          </motion.div>
        </div>
      </Sect>

      {/* ═══ centered pull quote ═══ */}
      <motion.div
        {...fade(0)}
        className="px-4 md:px-8 lg:px-12 max-w-[1000px] mx-auto border-t border-[#2A2A2A] py-16 md:py-20"
      >
        <p className="font-display text-2xl md:text-3xl font-bold text-fg text-center leading-[1.25] tracking-tight whitespace-nowrap mx-auto">
          Your brain isn&rsquo;t broken. It just needs <em className="font-serif italic text-accent">rewiring</em>.
        </p>
      </motion.div>

      {/* ═══ THE WEBSITE ═══ */}
      <Sect label="The Website">
        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-8 items-start">
          <motion.div {...fade(0)} className="rounded-lg overflow-hidden">
            <video src="/videos/uxui/rewired-website-scroll.mp4" autoPlay muted loop playsInline className="w-full block" />
          </motion.div>
          <motion.div {...fade(0.1)}>
            <p className="font-body text-fg text-[0.95rem] leading-[1.7] mb-4">
              The marketing site for Rewired &mdash; a scrolling single-page experience
              that introduces the product, explains the science, and converts visitors.
            </p>
            <p className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-6">
              Built with Next.js and Framer&nbsp;Motion. Every section uses scroll-triggered
              animations to reveal content progressively as the user moves through the page.
            </p>
            <a
              href="https://joinrewired.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm text-accent hover:text-fg transition-colors"
            >
              Visit joinrewired.com
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h8v8M13 3 5 11" /></svg>
            </a>
          </motion.div>
        </div>
      </Sect>

      {/* ═══ AVATARS ═══ */}
      <Sect label="Avatar System">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 items-stretch">
          {/* Left: avatar selection video */}
          <motion.div {...fade(0.1)} className="rounded-lg overflow-hidden cursor-pointer">
            <video src="/videos/uxui/avatar-selection-6a.mp4" autoPlay muted loop playsInline className="w-full block scale-[1.02]"
              onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }} />
          </motion.div>
          {/* Right: text + avatar grid */}
          <div className="flex flex-col">
            <motion.div {...fade(0)} className="mb-6">
              <p className="font-body text-fg text-[0.95rem] leading-[1.7] mb-4">
                97 unique avatar illustrations &mdash; every character drawn with the
                app&rsquo;s signature purple palette. Users pick their avatar during
                onboarding and it becomes their identity throughout the experience.
              </p>
              <p className="font-body text-[#888] text-[0.85rem] leading-[1.7]">
                Diversity was a priority: different hairstyles, accessories, and
                expressions. Generated with AI, then curated and color-graded to
                maintain visual consistency.
              </p>
            </motion.div>
            <div className="border-t border-[#2A2A2A] mb-4" />
            <div className="grid grid-cols-9 gap-x-1.5 gap-y-3 mt-auto">
              {Array.from({ length: 45 }, (_, i) => {
                const skip = [61, 62, 63]; // oddly sized avatars
                let idx = i + 9;
                for (const s of skip) { if (idx >= s) idx++; }
                return (
                  <motion.div key={i} {...pop(i)}
                    className="aspect-[4/5] overflow-hidden rounded-sm cursor-pointer"
                    onClick={() => open(`/images/rewired/avatars/avatar_${String(idx).padStart(3, '0')}.png`)}
                  >
                    <Image
                      src={`/images/rewired/avatars/avatar_${String(idx).padStart(3, '0')}.png`}
                      alt={`Avatar ${idx}`} width={376} height={435} quality={85}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Sect>

      {/* ═══ KEY SCREENS ═══ */}
      <Sect label="Key Screens">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {([
            ['/images/rewired/screenshots/welcome.png', 'Welcome'],
            ['/images/rewired/screenshots/npi.png', 'Assessment'],
            ['/images/rewired/screenshots/results.png', 'Results'],
            ['/images/rewired/screenshots/dashboard.png', 'Dashboard'],
            ['/images/rewired/screenshots/profile.png', 'Neuroprofile'],
            ['/images/rewired/screenshots/lessonintro.png', 'Lesson Intro'],
            ['/images/rewired/screenshots/lesson.png', 'Lesson'],
            ['/images/rewired/screenshots/aichattext.png', 'AI Coach'],
            ['/images/rewired/screenshots/notifications.png', 'Notifications'],
            ['/images/rewired/screenshots/screen1.png', 'Onboarding'],
          ] as const).map(([src, alt], i) => (
            <motion.div key={src} {...pop(i)}>
              <Img src={src} alt={alt} w={1242} h={2688} onClick={open} />
            </motion.div>
          ))}
        </div>
      </Sect>

      {/* ═══ ILLUSTRATION GALLERY ═══ */}
      <Sect label="Illustration Library">
        <motion.p {...fade(0)} className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-8 max-w-[520px]">
          60+ original illustrations used throughout lessons, onboarding, and the coaching
          experience. Each drawn in Procreate with the app&rsquo;s textured, hand-crafted aesthetic.
        </motion.p>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-x-1.5 gap-y-6">
          {[
            'brain-tree', 'brain-door', 'brain-puzzle', 'knight', 'potted-plant', 'lightbulb', 'telescope',
            'brain-heart', 'stone-cairn', 'umbrella', 'star', 'anvil-with-balloon', 'broken-ladder', 'brain-topographic',
            'fingerprint', 'hour-glass', 'key', 'shield', 'trophy', 'flame', 'bird-head',
            'magnifying-glass', 'cracked-pot-with-sprout', 'ladder-out-of-head', 'brain-wind-toy', 'sad-illustration', 'calendar', 'clock',
            'notebook', 'neural-network', 'knitting-brain', 'spark-brain', 'book-stack', 'statue-with-headphones', 'eraser',
            'hand-with-thread', 'tree-with-optic-roots', 'brain-cut-out', 'closing-door', 'cracked-bell', 'ear', 'gears',
            'cracked-rook', 'check', 'topographic-brain', 'knotted-rope', 'wired-brain', 'brain-map', 'brain-turtle',
          ].map((name, i) => (
            <motion.div key={name} {...pop(i)}
              className="aspect-square w-full overflow-hidden cursor-pointer relative"
              onClick={() => open(`/images/rewired/illustrations/${name}.png`)}
            >
              <motion.div
                className="w-full h-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Image
                  src={`/images/rewired/illustrations/${name}.png`}
                  alt={name.replace(/-/g, ' ')}
                  width={1024}
                  height={1024}
                  quality={85}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </Sect>

      {/* ═══ FOOTER ═══ */}
      <footer className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-16 border-t border-border">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          <div>
            <h3 className="font-display text-xl font-bold text-fg mb-4">Get in touch</h3>
            <div className="flex flex-col gap-2 font-body text-sm text-fg-muted">
              <a href="mailto:caseyedunham@gmail.com" className="hover:text-fg transition-colors">caseyedunham@gmail.com</a>
              <a href="tel:302-377-5638" className="hover:text-fg transition-colors">302-377-5638</a>
              <a href="https://www.linkedin.com/in/casey-dunham/" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">LinkedIn</a>
              <span>Atlanta, GA</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-body text-sm text-fg-dim">
            <span>&copy; {new Date().getFullYear()} Casey Dunham</span>
            <span>Designed & built by hand</span>
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
      className="px-4 md:px-8 lg:px-12 max-w-[1000px] mx-auto border-t border-[#2A2A2A] py-20 md:py-28"
    >
      <h2 className="font-display text-xs uppercase tracking-[0.2em] text-[#555] font-medium mb-8">{label}</h2>
      <div>{children}</div>
    </motion.section>
  );
}

function Img({ src, alt, w, h, onClick, rounded = 'rounded-lg', maxH, fit }: {
  src: string; alt: string; w: number; h: number; onClick: (s: string) => void; rounded?: string; maxH?: string; fit?: boolean;
}) {
  return (
    <motion.div
      className={`${rounded} overflow-hidden cursor-pointer ${fit ? 'h-full' : ''}`}
      onClick={() => onClick(src)}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Image src={src} alt={alt} width={w} height={h} quality={85} className={`block ${fit ? 'w-full h-full object-cover' : `w-full h-auto ${maxH ?? ''} ${maxH ? 'object-cover' : ''}`}`} />
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

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const init = () => direction === 0 ? { opacity: 0, scale: 0.9 } : { x: direction > 0 ? 600 : -600, opacity: 0 };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease }}
      className="art-lightbox-backdrop" onClick={onClose}
    >
      <motion.button className="video-lightbox-close" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.15 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </motion.button>

      {hasPrev && (
        <motion.button className="video-lightbox-nav video-lightbox-prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </motion.button>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={m.src} initial={init()} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ x: dirRef.current > 0 ? -600 : 600, opacity: 0, position: 'absolute' as const }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as const }}
            className="art-lightbox-content"
            style={m.w / m.h > 2 ? { flexDirection: 'column', alignItems: 'flex-start' } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            {m.type === 'video' ? (
              <video src={m.src} autoPlay controls playsInline className="art-lightbox-image"
                style={m.w > m.h ? { maxWidth: '80vw', width: '80vw' } : { maxHeight: '85vh' }} />
            ) : (
              <Image src={m.src} alt={m.alt} width={m.w} height={m.h} className="art-lightbox-image" quality={90}
                style={m.w / m.h > 2 ? { maxWidth: '80vw', width: '80vw' } : undefined} />
            )}
            {m.caption && (
              <div className="video-lightbox-detail" style={m.w / m.h > 1.5 ? { maxWidth: 'none', paddingTop: '0.75rem' } : undefined}>
                <p className="video-lightbox-detail-desc">{m.caption}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {hasNext && (
        <motion.button className="video-lightbox-nav video-lightbox-next"
          onClick={(e) => { e.stopPropagation(); onNext(); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </motion.button>
      )}
    </motion.div>
  );
}
