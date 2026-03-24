'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  { src: '/images/dossi/dossi-splash-widget.png', alt: 'Dossi splash', w: 1934, h: 1902, type: 'image' },
  { src: '/images/dossi/jdrf-group.jpg', alt: 'JDRF group', w: 2806, h: 2764, type: 'image', caption: 'JDRF Children\'s Congress — advocating for diabetes legislation on Capitol Hill.' },
  { src: '/images/dossi/jdrf-selfie.jpg', alt: 'JDRF selfie', w: 2268, h: 2279, type: 'image', caption: 'With fellow Youth Ambassadors at Breakthrough T1D.' },
  { src: '/images/dossi/t1d-flyer.jpg', alt: 'Research flyer', w: 5009, h: 6667, type: 'image', caption: 'Research flyer distributed through Georgia Tech Disability Services.' },
  { src: '/images/dossi/flow-diagram.png', alt: 'Feedback loop', w: 2752, h: 1536, type: 'image', caption: 'Dossi\'s learning loop: Collect → Predict → Adjust → Analyze.' },
  { src: '/images/dossi/before-and-after.jpg', alt: 'Before & after', w: 4000, h: 4000, type: 'image', caption: 'Complete redesign — sign-in, dashboard, analytics, and nutrition.' },
  { src: '/images/dossi/frame-7.jpg', alt: 'Sign-in redesign', w: 2000, h: 2000, type: 'image', caption: 'Sign-in — before and after.' },
  { src: '/images/dossi/frame-8.jpg', alt: 'Dashboard redesign', w: 2000, h: 2000, type: 'image', caption: 'Dashboard — before and after.' },
  { src: '/images/dossi/frame-9.jpg', alt: 'Analytics redesign', w: 2000, h: 2000, type: 'image', caption: 'Analytics — before and after.' },
  { src: '/images/dossi/frame-10.jpg', alt: 'Nutrition redesign', w: 2000, h: 2000, type: 'image', caption: 'Nutrition — before and after.' },
  { src: '/videos/dossi/landscape.mp4', alt: 'Dashboard', w: 1920, h: 1080, type: 'video', caption: 'Dashboard — real-time glucose with contextual factor cards.' },
  { src: '/videos/dossi/11a.mov', alt: 'AI chat', w: 886, h: 1920, type: 'video', caption: 'AI chat — natural language meal logging and bolus.' },
  { src: '/videos/dossi/11b.mov', alt: 'Nutrition AI', w: 886, h: 1920, type: 'video', caption: 'Photo meal recognition — snap, identify, log.' },
  { src: '/videos/dossi/insights-scroll-3a.mp4', alt: 'Insights', w: 886, h: 1920, type: 'video', caption: 'Insights — glucose score, time in range, pattern analysis.' },
  { src: '/videos/dossi/5b.mp4', alt: 'Quick action', w: 886, h: 1920, type: 'video', caption: 'Quick bolus delivery.' },
  { src: '/videos/dossi/meal-entry-scroll-4b.mp4', alt: 'Meal entry', w: 886, h: 1920, type: 'video', caption: 'Meal entry — scroll through nutrition details.' },
  { src: '/videos/dossi/10a.mp4', alt: 'Prediction', w: 1920, h: 1080, type: 'video', caption: 'Prediction screen — glucose trajectory and confidence interval.' },
  { src: '/images/dossi/screens/dashboard-live-1.png', alt: 'Live 162', w: 1170, h: 2532, type: 'image', caption: 'Live on my phone — glucose at 162, delivering insulin.' },
  { src: '/images/dossi/screens/dashboard-live-2.png', alt: 'Live 182', w: 1170, h: 2532, type: 'image', caption: 'Live — 182 mg/dL with post-meal prediction curve.' },
  { src: '/images/dossi/figma-workspace-1.png', alt: 'Figma overview', w: 3184, h: 2232, type: 'image', caption: 'Figma workspace — full screen inventory.' },
  { src: '/images/dossi/figma-workspace-2.png', alt: 'Figma detail', w: 3184, h: 2232, type: 'image', caption: 'Figma — onboarding flow and screen states.' },
  { src: '/images/dossi/screens/welcome-iterations.png', alt: 'Welcome iterations', w: 2872, h: 1244, type: 'image', caption: 'Five directions for "Get started" — balancing warmth with medical credibility.' },
  { src: '/images/dossi/dossi-welcome-screen-ideation.jpg', alt: 'Welcome ideation', w: 1732, h: 1756, type: 'image', caption: 'Welcome screen ideation — layout, tone, hierarchy.' },
  { src: '/images/dossi/dossi-app-icon-ideation.jpg', alt: 'Icon ideation', w: 1732, h: 1756, type: 'image', caption: 'App icon ideation — gradient and orb explorations.' },
  { src: '/images/dossi/dossi-color-palette.jpg', alt: 'Color palette', w: 1980, h: 2640, type: 'image', caption: 'Dossi color system — purple gradients and accent palette.' },
  { src: '/images/dossi/ideation-1.jpg', alt: 'Ideation 1', w: 390, h: 844, type: 'image', caption: 'Early screen exploration.' },
  { src: '/images/dossi/ideation-2.jpg', alt: 'Ideation 2', w: 390, h: 844, type: 'image', caption: 'Early screen exploration.' },
  ...Array.from({ length: 16 }, (_, i) => ({
    src: `/images/dossi/icons/icon-${String(i + 1).padStart(2, '0')}.jpg`,
    alt: `Icon ${i + 1}`, w: 4267, h: 4267, type: 'image' as const,
    caption: `App icon variation ${i + 1} of 16.`,
  })),
  { src: '/images/dossi/startup-exchange.png', alt: 'Startup Exchange', w: 3420, h: 1897, type: 'image', caption: 'Georgia Tech Startup Exchange Genesis.' },
  // Key screens
  { src: '/images/dossi/screens/welcome.png', alt: 'Welcome', w: 1170, h: 2532, type: 'image', caption: 'Welcome screen.' },
  { src: '/images/dossi/screens/dash.png', alt: 'Dashboard', w: 1170, h: 2532, type: 'image', caption: 'Dashboard — real-time glucose and contextual factors.' },
  { src: '/images/dossi/screens/insights.png', alt: 'Insights', w: 1170, h: 2532, type: 'image', caption: 'Insights — glucose score, time in range, pattern analysis.' },
  { src: '/images/dossi/screens/nutrition.png', alt: 'Nutrition', w: 1170, h: 2532, type: 'image', caption: 'Nutrition — meal logging and macro breakdown.' },
  { src: '/images/dossi/screens/quickaction.png', alt: 'Quick Action', w: 1170, h: 2532, type: 'image', caption: 'Quick bolus delivery.' },
  { src: '/images/dossi/screens/omnipod.png', alt: 'Omnipod', w: 1170, h: 2532, type: 'image', caption: 'Omnipod management — pod status and controls.' },
  { src: '/images/dossi/screens/settings.png', alt: 'Settings', w: 1170, h: 2532, type: 'image', caption: 'Settings and configuration.' },
  { src: '/images/dossi/screens/aichat.jpg', alt: 'AI Chat', w: 1170, h: 2532, type: 'image', caption: 'AI chat — natural language meal logging and guidance.' },
  // Before & after pairs
  ...(['1', '2', '3', '4'] as const).flatMap((n) => [
    { src: `/images/dossi/screens/${n}a.png`, alt: `Screen ${n} before`, w: 892, h: 1639, type: 'image' as const, caption: `Screen ${n} — before redesign.` },
    { src: `/images/dossi/screens/${n}b.png`, alt: `Screen ${n} after`, w: 870, h: 1603, type: 'image' as const, caption: `Screen ${n} — after redesign.` },
  ]),
];

function idx(src: string) { return media.findIndex((m) => m.src === src); }

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function DossiProject() {
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
              Dossi
            </motion.h1>

            <motion.p {...fade(0.2)} className="font-body text-fg text-[1.15rem] md:text-[1.3rem] leading-[1.55] font-light mb-5">
              Where insulin dosing meets predictive intelligence.
            </motion.p>
            <motion.p {...fade(0.25)} className="font-body text-[#999] text-[0.92rem] leading-[1.7] mb-5">
              Dossi is an AI-powered insulin delivery system for Type&nbsp;1 Diabetes.
              It considers multiple contextual factors &mdash; sleep, exercise, meal composition,
              site age, hormones &mdash; and learns your unique metabolic patterns over time.
              Not just what happened, but <em>why</em>.
            </motion.p>
            <motion.p {...fade(0.28)} className="font-body text-[#999] text-[0.92rem] leading-[1.7] mb-8">
              Solo-designed and solo-built from the ground up. Currently functional
              and delivering insulin on my phone daily.
            </motion.p>
            <motion.div {...fade(0.32)} className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 text-[0.75rem] font-body text-[#333] bg-[#ddd] rounded-full">Jan – Mar 2026</span>
              {['SwiftUI', 'SwiftData', 'Bluetooth LE', 'Bayesian ML', 'HealthKit', 'Gemini AI', 'Figma', 'Claude Code'].map((t) => (
                <span key={t} className="px-4 py-1.5 text-[0.75rem] font-body text-[#888] border border-[#2A2A2A] rounded-full">{t}</span>
              ))}
            </motion.div>
            <motion.a
              {...fade(0.36)}
              href="https://hellodossi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm text-accent hover:text-fg transition-colors"
            >
              hellodossi.com
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h8v8M13 3 5 11" /></svg>
            </motion.a>
          </div>

          <motion.div
            {...fade(0.2)}
            className="rounded-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <video src="/videos/dossi/dossi-welcome-flow-1a.mp4" autoPlay muted loop playsInline className="w-full block" onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }} />
          </motion.div>
        </div>
      </section>

      {/* ═══ SLIDE DECK + WHY ═══ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="px-4 md:px-8 lg:px-12 max-w-[1000px] mx-auto border-t border-[#2A2A2A] py-14 md:py-20"
      >
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-[#555] font-medium mb-8">The Pitch</h2>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_0.8fr] gap-10 items-start">
          <motion.div {...fade(0)} className="rounded-xl overflow-hidden">
            <video src="/videos/dossi/dossi-slide-deck-recording.mov" autoPlay muted loop playsInline className="block w-[112%] max-w-none ml-[-6%]" onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }} />
          </motion.div>
          <div>
            <motion.p {...fade(0.1)} className="font-body text-fg text-[0.95rem] leading-[1.7] mb-4">
              I have Type&nbsp;1 Diabetes. I was diagnosed at age 10 and have been
              managing insulin delivery every day since &mdash; and I saw a gap in
              the technology that no one was filling.
            </motion.p>
            <motion.p {...fade(0.15)} className="font-body text-[#888] text-[0.9rem] leading-[1.7] mb-6">
              Current pumps only see glucose and carbs. They don&rsquo;t know if you
              slept four hours, ran this morning, or ate pizza instead of salad.
              I decided to build what I wished existed.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* ═══ BEFORE & AFTER ═══ */}
      <BeforeAfter open={open} />

      {/* Landscape + AI Chat side by side */}
      <div className="px-4 md:px-8 lg:px-12 max-w-[1000px] mx-auto pt-3 pb-6">
        <div className="flex gap-3 h-[280px] md:h-[340px]">
          <motion.div {...fade(0)} className="flex-1 rounded-lg overflow-hidden cursor-pointer min-w-0">
            <video src="/videos/dossi/landscape.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover block" onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }} />
          </motion.div>
          <motion.div {...fade(0.04)} className="rounded-lg overflow-hidden cursor-pointer h-full">
            <video src="/videos/dossi/11a.mov" autoPlay muted loop playsInline className="h-full w-auto block" onClick={(e) => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }} />
          </motion.div>
        </div>
      </div>

      {/* ═══ DESIGN ═══ */}
      <Sect label="Design Process">
        {/* 01 — Onboarding */}
        <div className="mb-20">
          <motion.div {...fade(0)} className="mb-6">
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="font-display text-[1.1rem] font-light text-accent/40 tabular-nums">01</span>
              <h3 className="font-display text-[1rem] font-semibold text-[#ccc] tracking-[-0.01em]">Onboarding</h3>
            </div>
            <p className="font-body text-[0.85rem] text-[#777] leading-[1.6] ">Five directions exploring tone, hierarchy, and how to balance warmth with medical credibility.</p>
          </motion.div>
          <div className="grid grid-cols-5 gap-2.5">
            {Array.from({ length: 5 }, (_, i) => (
              <motion.div key={i} {...pop(i)} className="relative">
                <Img
                  src={`/images/dossi/screens/create-account-${i + 3}.jpg`}
                  alt={`Onboarding ${i + 3}`} w={1280} h={2778} onClick={open}
                />
                {i === 4 && (
                  <motion.svg
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute pointer-events-none"
                    style={{ top: '-7%', right: '-12%', width: '40%', height: 'auto' }}
                    animate={{ rotate: [-6, 6, -6] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <path
                      d="M25 3 L30 19 L47 19 L33 29 L39 46 L25 35 L11 46 L17 29 L3 19 L20 19 Z"
                      transform="rotate(12, 25, 25)"
                      stroke="var(--accent)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.85"
                      style={{ filter: 'url(#roughStar)' }}
                    />
                    <defs>
                      <filter id="roughStar">
                        <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" seed="5" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
                      </filter>
                    </defs>
                  </motion.svg>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 02 — Screen design */}
        <div className="mb-20">
          <motion.div {...fade(0)} className="mb-6">
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="font-display text-[1.1rem] font-light text-accent/40 tabular-nums">02</span>
              <h3 className="font-display text-[1rem] font-semibold text-[#ccc] tracking-[-0.01em]">Screen Design</h3>
            </div>
            <p className="font-body text-[0.85rem] text-[#777] leading-[1.6] ">Every screen, component, and micro-interaction designed solo in Figma.</p>
          </motion.div>
          <motion.div {...fade(0)} className="rounded-lg border border-[#2A2A2A] overflow-hidden">
            <Img src="/images/dossi/figma-workspace-1.png" alt="Figma workspace" w={3184} h={2232} onClick={open} rounded="rounded-none" />
          </motion.div>
        </div>

        {/* 03 — App icon */}
        <div>
          <motion.div {...fade(0)} className="mb-6">
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="font-display text-[1.1rem] font-light text-accent/40 tabular-nums">03</span>
              <h3 className="font-display text-[1rem] font-semibold text-[#ccc] tracking-[-0.01em]">App Icon</h3>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-[320px_1px_1fr] gap-8 items-start">
            <div className="grid grid-cols-4 gap-2">
              <motion.div {...pop(0)} className="col-span-2 row-span-2">
                <Img src="/images/dossi/icons/icon-01.jpg" alt="Final icon" w={4267} h={4267} onClick={open} rounded="rounded-[14%]" />
              </motion.div>
              {[2,3,4,7,8,9,10,11,12,13,14,15].map((n, i) => (
                <motion.div key={n} {...pop(i + 1)}>
                  <Img
                    src={`/images/dossi/icons/icon-${String(n).padStart(2, '0')}.jpg`}
                    alt={`Icon ${n}`} w={4267} h={4267} onClick={open} rounded="rounded-[22%]"
                  />
                </motion.div>
              ))}
            </div>
            <div className="hidden md:block w-px bg-[#2A2A2A] self-stretch" />
            <motion.div {...fade(0.1)}>
              <p className="font-body text-fg text-[0.95rem] leading-[1.7] mb-4">
                Dossi went through extensive iteration before any code was written.
                The onboarding flow alone had five distinct directions exploring tone,
                hierarchy, and how to balance warmth with medical credibility.
              </p>
              <p className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-4">
                Every screen, component, and micro-interaction was designed solo in
                Figma &mdash; from brand identity and color system through final
                production assets. 13 app icon explorations tested gradient treatments,
                orb forms, and wordmark placement at every size.
              </p>
              <p className="font-body text-[#888] text-[0.85rem] leading-[1.7]">
                The result is a visual language that feels approachable rather than
                clinical &mdash; soft purple gradients and organic shapes that make
                health data feel human.
              </p>
            </motion.div>
          </div>
        </div>
      </Sect>

      {/* ═══ centered pull quote ═══ */}
      <motion.div
        {...fade(0)}
        className="px-4 md:px-8 lg:px-12 max-w-[1000px] mx-auto border-t border-[#2A2A2A] py-16 md:py-20"
      >
        <p className="font-display text-2xl md:text-3xl font-bold text-fg text-center leading-[1.25] tracking-tight max-w-[600px] mx-auto">
          Not just what happened, but <em className="font-serif italic text-accent">why</em>.
        </p>
      </motion.div>

      {/* ═══ HOW IT WORKS ═══ */}
      <Sect label="How It Works">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
          {[
            { n: '01', t: 'Continuous Monitoring', d: 'Reads glucose every 5 minutes via Dexcom Bluetooth. Syncs sleep, exercise, and heart rate from Apple HealthKit — no manual logging.' },
            { n: '02', t: 'Contextual Learning', d: 'A Bayesian engine learns your individual patterns across sleep quality, infusion site age, dawn phenomenon, menstrual cycle, exercise, and caffeine.' },
            { n: '03', t: 'Predictive Intelligence', d: 'Models glucose trajectories 4 hours ahead. Quantifies uncertainty. Adjusts insulin delivery in real time through closed-loop control.' },
            { n: '04', t: 'Plain-Language Insights', d: '"Coming down from a high carb lunch. Morning workout increased insulin sensitivity." Not numbers — explanations.' },
          ].map((item, i) => (
            <motion.div key={item.n} {...fade(i * 0.05)}>
              <span className="font-body text-[0.6rem] text-accent tracking-[0.2em] tabular-nums">{item.n}</span>
              <h3 className="font-display text-[0.95rem] font-semibold text-fg mt-1 mb-1.5">{item.t}</h3>
              <p className="font-body text-[0.82rem] text-[#777] leading-[1.7]">{item.d}</p>
            </motion.div>
          ))}
        </div>
      </Sect>

      {/* ═══ KEY SCREENS ═══ */}
      <Sect label="Key Screens">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {([
            ['/images/dossi/screens/welcome.png', 'Welcome'],
            ['/images/dossi/screens/aichat.jpg', 'AI Chat'],
            ['/images/dossi/screens/nutrition.png', 'Nutrition'],
            ['/images/dossi/screens/insights.png', 'Insights'],
            ['/images/dossi/screens/quickaction.png', 'Quick Action'],
            ['/images/dossi/screens/omnipod.png', 'Omnipod'],
            ['/images/dossi/screens/settings.png', 'Settings'],
            ['/images/dossi/screens/dash.png', 'Dashboard'],
          ] as const).map(([src, alt], i) => (
            <motion.div key={src} {...pop(i)}>
              <Img src={src} alt={alt} w={1170} h={2532} onClick={open} />
            </motion.div>
          ))}
        </div>
      </Sect>

      {/* ═══ BY THE NUMBERS ═══ */}
      <Sect label="By the Numbers">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {[
            { val: '346K', label: 'Lines of Swift' },
            { val: '1', label: 'Developer' },
            { val: '60+', label: 'Contextual Factors' },
            { val: '4hr', label: 'Prediction Horizon' },
          ].map((s, i) => (
            <motion.div key={s.label} {...fade(i * 0.06)}>
              <span className="font-display text-3xl md:text-4xl font-bold text-fg tracking-tight">{s.val}</span>
              <p className="font-body text-[0.78rem] text-[#777] mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-0">
          {[
            { t: 'Bayesian Learning', d: 'Learns individual glucose patterns across 5+ contextual factors. Only applies effects after 15+ observations with 50%+ confidence. Baseline drift detection triggers recalibration.' },
            { t: 'BLE Pump Driver', d: 'Native Bluetooth LE driver for Omnipod DASH. Pod pairing, encrypted sessions, status monitoring, basal adjustments, and bolus delivery — all from scratch.' },
            { t: '5-Layer Safety', d: 'Hard-coded limits, physiological bounds, hypo prediction, anomaly detection, and immutable audit logging. Biometric auth required for every dose. TOCTOU protection at delivery time.' },
            { t: 'AI Nutrition', d: 'Photo meal recognition via Gemini API. Snap a photo, identify foods, estimate macros, and predict glucose impact — no manual carb counting.' },
            { t: 'Closed-Loop Control', d: 'Model predictive control optimizes dosing decisions continuously. Reads glucose every 5 minutes and adjusts basal rates in real time.' },
            { t: 'Full-Stack', d: 'SwiftUI + SwiftData locally, Supabase for auth and cloud sync, WidgetKit for home screen, watchOS companion app. Swift 6 strict concurrency throughout.' },
          ].map((item, i) => (
            <motion.div key={item.t} {...fade(i * 0.04)} className="py-4 border-t border-[#2A2A2A]">
              <h3 className="font-display text-[0.85rem] font-semibold text-[#e0e0e0] mb-1.5">{item.t}</h3>
              <p className="font-body text-[0.8rem] text-[#777] leading-[1.7]">{item.d}</p>
            </motion.div>
          ))}
        </div>
      </Sect>

      {/* ═══ CONTEXT ═══ */}
      <Sect label="Context">
        {/* Lead + photos */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-start mb-6">
          <motion.div {...fade(0)}>
            <p className="font-body text-fg text-[0.92rem] leading-[1.7] mb-3">
              I have Type&nbsp;1 Diabetes. I was diagnosed at age 10 and have been
              managing insulin delivery every day since. I&rsquo;ve advocated to
              Congress through Breakthrough&nbsp;T1D and mentored younger diabetics.
            </p>
            <p className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-4">
              The app is fully functional and I have been using it for insulin
              delivery for the past several weeks. Every line of code, every pixel,
              every interaction was designed and built by me alone.
            </p>
            <a
              href="https://hellodossi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm text-accent hover:text-fg transition-colors"
            >
              Visit hellodossi.com
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h8v8M13 3 5 11" /></svg>
            </a>
          </motion.div>
          <div className="grid grid-cols-2 gap-2">
            <motion.div {...pop(0)}>
              <Img src="/images/dossi/jdrf-group.jpg" alt="JDRF group" w={2806} h={2764} onClick={open} />
            </motion.div>
            <motion.div {...pop(1)}>
              <Img src="/images/dossi/jdrf-selfie.jpg" alt="JDRF selfie" w={2268} h={2279} onClick={open} />
            </motion.div>
          </div>
        </div>

        {/* Programs + Research */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#2A2A2A] pt-6">
          {[
            { t: 'Programs', d: <>Built through Georgia Tech&rsquo;s <span className="text-fg font-medium">InVenture Prize</span> and <span className="text-fg font-medium">Startup Exchange</span>. Mentored by Rosa Arriaga, Senior Research Scientist in Interactive Computing (Harvard PhD).</>, img: '/images/dossi/startup-exchange.png', alt: 'Startup Exchange', w: 3420, h: 1897 },
            { t: 'Research', d: <>Distributed flyers through Georgia Tech Disability Services to survey T1D students. The most consistent feedback: people wanted to understand <em className="text-fg not-italic font-medium">patterns</em>, not just numbers.</>, img: '/images/dossi/t1d-flyer.jpg', alt: 'Research flyer', w: 5009, h: 6667 },
          ].map((item, i) => (
            <motion.div key={item.t} {...fade(i * 0.04)} className="py-4">
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="font-display text-[1.1rem] font-light text-accent/40 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-[1rem] font-semibold text-[#ccc] tracking-[-0.01em]">{item.t}</h3>
              </div>
              <p className="font-body text-[0.82rem] text-[#777] leading-[1.7] mb-4">{item.d}</p>
              <Img src={item.img} alt={item.alt} w={item.w} h={item.h} onClick={open} />
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

const BA_LABELS = ['Sign-in', 'Dashboard', 'Insights', 'Nutrition'] as const;

function BeforeAfter({ open }: { open: (src: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const slideY = useTransform(scrollYProgress, [0.3, 0.55], ['55%', '4%']);
  const oldOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0.8]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
      className="px-4 md:px-8 lg:px-12 max-w-[1000px] mx-auto border-t border-[#2A2A2A] pt-14 md:pt-20 pb-3"
    >
      <h2 className="font-display text-xs uppercase tracking-[0.2em] text-[#555] font-medium mb-8">Before &amp; After</h2>
      <div>
        <p className="font-body text-fg text-[0.92rem] leading-[1.7] mb-2 max-w-[520px]">
          A complete redesign of an earlier prototype. Every screen rethought to feel
          approachable rather than clinical.
        </p>
        <p className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-10 max-w-[520px]">
          Soft purple gradients and organic orb shapes. Data density increased while
          perceived complexity went down.
        </p>

        <div ref={containerRef} className="relative rounded-lg overflow-hidden bg-[#B0ABFF] p-3 md:p-4">
          {/* Old phones row */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-1" style={{ opacity: oldOpacity }}>
            {(['1', '2', '3', '4'] as const).map((n, i) => (
              <div
                key={n}
                className="cursor-pointer"
                onClick={() => open(`/images/dossi/screens/${n}a.png`)}
              >
                <Image
                  src={`/images/dossi/screens/${n}a.png`}
                  alt={`${BA_LABELS[i]} before`}
                  width={892} height={1639} quality={85}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </motion.div>
          {/* New phones — overlay that slides up */}
          <motion.div
            className="absolute inset-x-0 bottom-0 p-3 md:p-4"
            style={{ y: slideY, x: '-2%' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {(['1', '2', '3', '4'] as const).map((n, i) => (
                <div
                  key={n}
                  className="cursor-pointer"
                  onClick={() => open(`/images/dossi/screens/${n}b.png`)}
                >
                  <Image
                    src={`/images/dossi/screens/${n}b.png`}
                    alt={`${BA_LABELS[i]} after`}
                    width={870} height={1603} quality={85}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

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

function Vid({ src, onClick }: { src: string; onClick: (s: string) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <motion.div
      className="rounded-lg overflow-hidden cursor-pointer"
      onClick={() => {
        const v = ref.current;
        if (v) { v.paused ? v.play() : v.pause(); }
      }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <video ref={ref} src={src} autoPlay muted loop playsInline className="w-full block" />
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
