'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HIDDEN_PILL_TAGS } from '@/data/projects';
import ThemeToggle from '@/components/ThemeToggle';
import LazyVideo from '@/components/LazyVideo';

const visibleTags = (tags: string[]) =>
  tags.filter((t) => !HIDDEN_PILL_TAGS.includes(t as typeof HIDDEN_PILL_TAGS[number]));

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
  groupSrcs?: { src: string; alt: string; w: number; h: number }[];
}
const media: MediaItem[] = [
  // Hero video
  { src: '/videos/uxui/rewired-value-props-2a.mp4', alt: 'Value props', w: 886, h: 1920, type: 'video',
    title: 'Value Propositions', caption: 'Animated onboarding sequence introducing Rewired\'s core promise — personalized neuroplasticity sessions, AI coaching, and growth tracking.', tags: ['SwiftUI', 'Figma'] },
  // Walkthrough videos
  { src: '/videos/uxui/rewired-onboarding-2b.mp4', alt: 'Onboarding', w: 886, h: 1920, type: 'video',
    title: 'Onboarding Flow', caption: 'Personalization questions that collect user goals, preferences, and current mindset to tailor the experience.', tags: ['SwiftUI', 'Figma'] },
  { src: '/videos/uxui/rewired-questions-7a.mp4', alt: 'Questions', w: 886, h: 1920, type: 'video',
    title: 'Assessment', caption: '8-question behavioral assessment that identifies core limiting beliefs and builds a neuroprofile.', tags: ['SwiftUI', 'Gemini AI'] },
  { src: '/videos/uxui/rewired-finished-7b.mp4', alt: 'Finished', w: 886, h: 1920, type: 'video',
    title: 'Results', caption: 'AI reads your story, finds themes, and detects belief patterns to generate your personalized neuroprofile.', tags: ['SwiftUI', 'Gemini AI'] },
  { src: '/videos/uxui/rewired-lesson-7c.mp4', alt: 'Lesson flow', w: 886, h: 1920, type: 'video',
    title: 'Daily Session', caption: '8-minute session combining psychoeducation and therapeutic exercises. Each targets a specific belief pattern.', tags: ['SwiftUI'] },
  // AI Orb video
  { src: '/videos/uxui/ai-orb-6b.mp4', alt: 'AI Orb', w: 886, h: 1920, type: 'video',
    title: 'AI Orb', caption: 'The animated orb coaching interaction — it pulses, breathes, and shifts color in response to conversation state.', tags: ['SwiftUI', 'Gemini AI'] },
  // Orb frames — grouped
  { src: '/images/rewired/orbs/orb-01.png', alt: 'Orb frames', w: 350, h: 350, type: 'image',
    title: 'Orb Animation Frames', caption: '36 individually created frames. Hue rotation and light source shifted frame by frame to create a seamless looping animation.', tags: ['Procreate'],
    groupSrcs: Array.from({ length: 36 }, (_, i) => ({
      src: `/images/rewired/orbs/orb-${String(i + 1).padStart(2, '0')}.png`, alt: `Orb ${i + 1}`, w: 350, h: 350,
    })),
  },
  // Website video
  { src: '/videos/uxui/rewired-website-scroll.mp4', alt: 'Website', w: 1920, h: 1080, type: 'video',
    title: 'Marketing Website', caption: 'Scrolling single-page experience built with Next.js and Framer Motion. Scroll-triggered animations reveal content progressively.', tags: ['Next.js', 'Framer Motion'] },
  // Avatar selection video
  { src: '/videos/uxui/avatar-selection-6a.mp4', alt: 'Avatar selection', w: 886, h: 1920, type: 'video',
    title: 'Avatar Selection', caption: 'Personalization screen where users choose from 97 unique avatars to represent them throughout the experience.', tags: ['SwiftUI'] },
  // Key screens
  { src: '/images/rewired/screenshots/welcome.png', alt: 'Welcome', w: 1242, h: 2688, type: 'image',
    title: 'Welcome Screen', caption: 'The rewired brain hero illustration sets the tone — warm, approachable, and grounded in neuroscience.', tags: ['SwiftUI', 'Procreate'] },
  { src: '/images/rewired/screenshots/npi.png', alt: 'Assessment', w: 1242, h: 2688, type: 'image',
    title: 'Assessment', caption: 'Neuroplasticity assessment — behavioral pattern questions that surface core limiting beliefs.', tags: ['SwiftUI', 'Gemini AI'] },
  { src: '/images/rewired/screenshots/results.png', alt: 'Results', w: 1242, h: 2688, type: 'image',
    title: 'Results', caption: 'AI analysis of core themes and belief patterns — generating a personalized neuroprofile.', tags: ['SwiftUI', 'Gemini AI'] },
  { src: '/images/rewired/screenshots/dashboard.png', alt: 'Dashboard', w: 1242, h: 2688, type: 'image',
    title: 'Dashboard', caption: 'Daily dashboard — today\'s session, current belief focus, streak tracking, and progress.', tags: ['SwiftUI', 'SwiftData'] },
  { src: '/images/rewired/screenshots/profile.png', alt: 'Neuroprofile', w: 1242, h: 2688, type: 'image',
    title: 'Neuroprofile', caption: 'Your ideal self, core traits, and growth tracking — the central view of your progress.', tags: ['SwiftUI', 'SwiftData'] },
  { src: '/images/rewired/screenshots/lessonintro.png', alt: 'Lesson intro', w: 1242, h: 2688, type: 'image',
    title: 'Lesson Intro', caption: 'Session introduction with progress tracking and the day\'s belief focus.', tags: ['SwiftUI'] },
  { src: '/images/rewired/screenshots/lesson.png', alt: 'Lesson', w: 1242, h: 2688, type: 'image',
    title: 'Lesson', caption: 'Psychoeducation content — awareness, practice, and integration phases for each session.', tags: ['SwiftUI'] },
  { src: '/images/rewired/screenshots/aichattext.png', alt: 'AI Coach', w: 1242, h: 2688, type: 'image',
    title: 'AI Coach', caption: 'The orb responds with personalized guidance grounded in CBT and neuroplasticity principles.', tags: ['SwiftUI', 'Gemini AI'] },
  { src: '/images/rewired/screenshots/notifications.png', alt: 'Notifications', w: 1242, h: 2688, type: 'image',
    title: 'Notifications', caption: 'Session reminders and check-in preferences — customizable to support habit formation.', tags: ['SwiftUI'] },
  { src: '/images/rewired/screenshots/screen1.png', alt: 'Onboarding', w: 1242, h: 2688, type: 'image',
    title: 'Onboarding', caption: 'First screen of the onboarding flow — setting expectations and building trust.', tags: ['SwiftUI', 'Figma'] },
  // Illustrations — individual entries
  ...([
    ['brain-tree', 'Brain Tree', 'A tree growing from neural pathways — representing organic growth and neuroplasticity.'],
    ['brain-door', 'Brain Door', 'An open door within the mind — symbolizing new mental pathways and possibilities.'],
    ['brain-puzzle', 'Brain Puzzle', 'Puzzle pieces forming a brain — the process of understanding and restructuring thought patterns.'],
    ['knight', 'Knight', 'A chess knight — strategic thinking and the courage to challenge limiting beliefs.'],
    ['potted-plant', 'Potted Plant', 'A growing plant — nurturing new neural connections with patience and care.'],
    ['lightbulb', 'Lightbulb', 'A glowing lightbulb — moments of insight during the rewiring process.'],
    ['telescope', 'Telescope', 'A telescope — gaining perspective and seeing beyond current belief patterns.'],
    ['brain-heart', 'Brain Heart', 'A brain intertwined with a heart — the connection between thought and emotion.'],
    ['stone-cairn', 'Stone Cairn', 'Stacked stones — balance, mindfulness, and building progress one step at a time.'],
    ['umbrella', 'Umbrella', 'An umbrella — protection and resilience against negative thought patterns.'],
    ['star', 'Star', 'A guiding star — aspiration and the ideal self that drives transformation.'],
    ['anvil-with-balloon', 'Anvil with Balloon', 'An anvil lifted by a balloon — lightening heavy mental burdens.'],
    ['broken-ladder', 'Broken Ladder', 'A broken ladder — recognizing and rebuilding flawed belief structures.'],
    ['brain-topographic', 'Topographic Brain', 'A brain rendered as a topographic map — exploring the landscape of the mind.'],
    ['fingerprint', 'Fingerprint', 'A fingerprint — the uniqueness of each person\'s neural patterns.'],
    ['hour-glass', 'Hourglass', 'An hourglass — patience in the neuroplasticity process.'],
    ['key', 'Key', 'A key — unlocking new ways of thinking.'],
    ['shield', 'Shield', 'A shield — building mental resilience and self-protection.'],
    ['trophy', 'Trophy', 'A trophy — celebrating progress and growth milestones.'],
    ['flame', 'Flame', 'A flame — the spark of motivation and transformation.'],
    ['bird-head', 'Bird', 'A bird — freedom from limiting beliefs and mental constraints.'],
    ['magnifying-glass', 'Magnifying Glass', 'A magnifying glass — examining thoughts and patterns with curiosity.'],
    ['cracked-pot-with-sprout', 'Cracked Pot with Sprout', 'A cracked pot with a sprout growing through — beauty and growth from imperfection.'],
    ['ladder-out-of-head', 'Ladder Out of Head', 'A ladder emerging from a head — climbing out of old thought patterns.'],
    ['brain-wind-toy', 'Brain Wind Toy', 'A wind-up brain — the mechanics of habit formation and neural rewiring.'],
    ['sad-illustration', 'Reflection', 'A contemplative figure — acknowledging difficult emotions as part of growth.'],
    ['calendar', 'Calendar', 'A calendar — consistency and daily practice in building new pathways.'],
    ['clock', 'Clock', 'A clock — the timing and rhythm of neural change.'],
    ['notebook', 'Notebook', 'A notebook — journaling and self-reflection as tools for awareness.'],
    ['neural-network', 'Neural Network', 'A neural network — the interconnected web of thoughts and beliefs.'],
    ['knitting-brain', 'Knitting Brain', 'A brain being knitted — carefully constructing new neural patterns.'],
    ['spark-brain', 'Spark Brain', 'A brain with sparks — the electricity of new neural connections forming.'],
    ['book-stack', 'Book Stack', 'A stack of books — psychoeducation and learning as foundations for change.'],
    ['statue-with-headphones', 'Statue with Headphones', 'A statue wearing headphones — combining timeless wisdom with modern approaches.'],
    ['eraser', 'Eraser', 'An eraser — letting go of old beliefs that no longer serve you.'],
    ['hand-with-thread', 'Hand with Thread', 'A hand holding thread — the delicate work of rewiring thought patterns.'],
    ['tree-with-optic-roots', 'Tree with Roots', 'A tree with visible roots — deep-rooted beliefs and the foundation of change.'],
    ['brain-cut-out', 'Brain Cutout', 'A brain cutout — examining the mind from a new angle.'],
    ['closing-door', 'Closing Door', 'A closing door — leaving behind old patterns and moving forward.'],
    ['cracked-bell', 'Cracked Bell', 'A cracked bell — imperfection and the beauty of being a work in progress.'],
    ['ear', 'Ear', 'An ear — active listening and tuning into your inner voice.'],
    ['gears', 'Gears', 'Interlocking gears — the mechanics of cognitive restructuring.'],
    ['cracked-rook', 'Cracked Rook', 'A cracked chess rook — strategic defenses that need rebuilding.'],
    ['check', 'Checkmark', 'A checkmark — completion, validation, and progress affirmation.'],
    ['topographic-brain', 'Brain Landscape', 'A topographic brain landscape — mapping the terrain of personal growth.'],
    ['knotted-rope', 'Knotted Rope', 'A knotted rope — untangling complex thought patterns.'],
    ['wired-brain', 'Wired Brain', 'A brain with visible wiring — the literal rewiring of neural connections.'],
    ['brain-map', 'Brain Map', 'A brain map — charting the journey of cognitive transformation.'],
    ['brain-turtle', 'Brain Turtle', 'A brain turtle — slow, steady progress in building lasting change.'],
  ] as const).map(([name, title, caption]) => ({
    src: `/images/rewired/illustrations/${name}.png`, alt: title, w: 1024, h: 1024, type: 'image' as const,
    title, caption, tags: ['AI Generation', 'Illustration', 'Illustrator'],
  })),
  // Avatars — grouped
  { src: '/images/rewired/avatars/avatar_009.png', alt: 'Avatars', w: 376, h: 435, type: 'image',
    title: 'Avatar Library', caption: '97 unique avatar illustrations drawn in the app\'s signature purple palette. Users select one during onboarding to represent them throughout the experience.', tags: ['AI Generation', 'Procreate'],
    groupSrcs: Array.from({ length: 97 }, (_, i) => ({
      src: `/images/rewired/avatars/avatar_${String(i + 1).padStart(3, '0')}.png`, alt: `Avatar ${i + 1}`, w: 376, h: 435,
    })),
  },
  // Animation process
  { src: '/videos/rewired/animation-process.mp4', alt: 'Animation process', w: 1920, h: 1080, type: 'video',
    title: 'Animation Process', caption: 'Creating the onboarding illustrations frame by frame in Procreate.', tags: ['Procreate'] },
];

function idx(src: string) {
  const direct = media.findIndex((m) => m.src === src);
  if (direct !== -1) return direct;
  return media.findIndex((m) => m.groupSrcs?.some((g) => g.src === src));
}

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
              <Link href="/projects" className="font-body text-xs text-[#555] uppercase tracking-[0.2em] hover:text-fg transition-colors">
                &larr; Projects
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
            <motion.p {...fade(0.25)} className="font-body text-[#999] text-[0.92rem] leading-[1.7] mb-8">
              Rewired is a science-backed app that helps users transform limiting beliefs through personalized daily sessions. It combines psychoeducation, therapeutic exercises, and AI coaching. All grounded in neuroplasticity research. Solo-designed and solo-built. Awaiting App Store approval.
            </motion.p>
            <motion.div {...fade(0.32)} className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 text-[0.75rem] font-body text-[#333] bg-[#ddd] rounded-full">Sep – Dec 2025</span>
              {['SwiftUI', 'SwiftData', 'Gemini AI', 'Figma', 'Procreate', 'CloudKit'].map((t) => (
                <Link key={t} href={`/skills?t=${encodeURIComponent(t)}`} className="px-4 py-1.5 text-[0.75rem] font-body text-[#888] border border-[#2A2A2A] rounded-full hover:text-fg hover:border-[#555] transition-colors">{t}</Link>
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
            <LazyVideo src="/videos/uxui/rewired-value-props-2a.mp4" className="w-full block scale-[1.02]" onClick={() => open('/videos/uxui/rewired-value-props-2a.mp4')} loadMargin="0px" />
          </motion.div>
        </div>
      </section>

      {/* ═══ WHAT IT DOES ═══ */}
      <Sect label="What It Does">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 mb-14">
          {[
            { n: '01.', t: 'Neuroplasticity Assessment', d: 'An 8-question behavioral assessment that identifies your core limiting beliefs. AI reads your story, finds themes, and detects belief patterns to build your neuroprofile.' },
            { n: '02.', t: 'Personalized Sessions', d: 'Daily 8-minute sessions combining psychoeducation and therapeutic exercises. Each session targets your specific belief pattern through awareness, practice, and integration.' },
            { n: '03.', t: 'AI Coaching', d: 'A conversational AI coach (the orb) that responds with personalized guidance. Text or voice — it knows your patterns, your progress, and your goals.' },
            { n: '04.', t: 'Growth Tracking', d: 'Neuroprofile with core traits, ideal self vision, streak tracking, and progress insights. Watch your neural pathways actually rewire over time.' },
          ].map((item, i) => (
            <motion.div key={item.n} {...fade(i * 0.05)}>
              <span className="font-body text-[0.6rem] text-accent tracking-[0.2em] tabular-nums">{item.n}</span>
              <h3 className="font-display text-[0.95rem] font-semibold text-fg mt-1 mb-1.5">{item.t}</h3>
              <p className="font-body text-[0.82rem] text-[#777] leading-[1.7]">{item.d}</p>
            </motion.div>
          ))}
        </div>

        {/* App walkthrough videos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          {([
            ['/videos/uxui/rewired-onboarding-2b.mp4', 'Onboarding'],
            ['/videos/uxui/rewired-questions-7a.mp4', 'Assessment'],
            ['/videos/uxui/rewired-finished-7b.mp4', 'Results'],
            ['/videos/uxui/rewired-lesson-7c.mp4', 'Lesson'],
            ['/videos/uxui/rewired-value-props-2a.mp4', 'Value Props'],
          ] as const).map(([src, label], i) => (
            <motion.div key={src} {...pop(i)} className="rounded-lg overflow-hidden cursor-pointer"
              onClick={() => open(src)}
            >
              <LazyVideo src={src} className="w-full block scale-[1.02]" />
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
              <p className="font-body text-fg text-[0.95rem] leading-[1.7] mb-5">
                The orb is Rewired&rsquo;s AI coaching presence &mdash; a softly animated gradient
                sphere that listens, responds, and guides. It&rsquo;s designed to feel warm and
                approachable rather than robotic.
              </p>
              <p className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-5">
                Users can speak or type to the orb. It knows their neuroprofile, their current
                belief focus, and their session history. Responses are grounded in CBT and
                neuroplasticity principles.
              </p>
              <p className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-5">
                Each of the 36 frames were individually created. Adjusting hue rotation
                and shifted the light source frame by frame to create a seamless looping
                animation. The frames were exported as a sprite sheet and driven by a SwiftUI
                timer that interpolates between them.
              </p>
              <p className="font-body text-[#888] text-[0.85rem] leading-[1.7]">
                The result feels alive. The orb pulses, breathes, and shifts color
                in response to conversation state. Purple for listening, gold for warmth,
                blue for calm.
              </p>
            </motion.div>
            <div className="border-t border-[#2A2A2A] mb-4" />
            {/* 36 orb frames — 9x4 grid */}
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {Array.from({ length: 36 }, (_, i) => (
                <motion.div key={i} {...pop(i)}
                  whileHover={{ scale: 1.35, zIndex: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="cursor-pointer"
                  onClick={() => open('/images/rewired/orbs/orb-01.png')}
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
          <motion.div {...fade(0.1)} className="rounded-lg overflow-hidden cursor-pointer" onClick={() => open('/videos/uxui/ai-orb-6b.mp4')}>
            <LazyVideo src="/videos/uxui/ai-orb-6b.mp4" className="w-full block scale-[1.02]" />
          </motion.div>
        </div>
      </Sect>

      {/* ═══ centered pull quote ═══ */}
      <motion.div
        {...fade(0)}
        className="px-4 md:px-8 lg:px-12 max-w-[1000px] mx-auto border-t border-[#2A2A2A] py-16 md:py-20"
      >
        <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-fg text-center leading-[1.25] tracking-tight mx-auto max-w-[800px] whitespace-nowrap">
          Your brain isn&rsquo;t broken. It just needs <em className="font-serif italic text-accent">rewiring</em>.
        </p>
      </motion.div>

      {/* ═══ THE WEBSITE ═══ */}
      <Sect label="The Website">
        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-8 items-start">
          <motion.div {...fade(0)} className="rounded-lg overflow-hidden cursor-pointer" onClick={() => open('/videos/uxui/rewired-website-scroll.mp4')}>
            <LazyVideo src="/videos/uxui/rewired-website-scroll.mp4" className="w-full block" />
          </motion.div>
          <motion.div {...fade(0.1)}>
            <p className="font-body text-fg text-[0.95rem] leading-[1.7] mb-5">
              The marketing site for Rewired &mdash; a scrolling single-page experience
              that introduces the product, explains the science, and converts visitors.
            </p>
            <p className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-5">
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
          <motion.div {...fade(0.1)} className="rounded-lg overflow-hidden cursor-pointer" onClick={() => open('/videos/uxui/avatar-selection-6a.mp4')}>
            <LazyVideo src="/videos/uxui/avatar-selection-6a.mp4" className="w-full block scale-[1.02]" />
          </motion.div>
          {/* Right: text + avatar grid */}
          <div className="flex flex-col">
            <motion.div {...fade(0)} className="mb-6">
              <p className="font-body text-fg text-[0.95rem] leading-[1.7] mb-5">
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
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-x-1.5 gap-y-3 mt-auto">
              {Array.from({ length: 45 }, (_, i) => {
                const skip = [61, 62, 63]; // oddly sized avatars
                let idx = i + 9;
                for (const s of skip) { if (idx >= s) idx++; }
                return (
                  <motion.div key={i} {...pop(i)}
                    className="aspect-[4/5] overflow-hidden rounded-sm cursor-pointer"
                    onClick={() => open('/images/rewired/avatars/avatar_009.png')}
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

      {/* ═══ ILLUSTRATION GALLERY ═══ */}
      <Sect label="Illustration Library">
        <motion.p {...fade(0)} className="font-body text-[#888] text-[0.85rem] leading-[1.7] mb-8">
          60+ original illustrations used throughout lessons, onboarding, and the coaching experience.
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
                className="w-full h-full flex items-center justify-center p-2"
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

      {/* ═══ KEY SCREENS ═══ */}
      <Sect label="Key Screens">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
  const isGroup = !!m.groupSrcs;
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

  const getOrientationClass = () => {
    if (isVideo || isGroup) return '';
    const ar = m.w / m.h;
    if (ar > 2) return ' art-lightbox-ultrawide';
    if (ar >= 1) return ' art-lightbox-landscape';
    return ' art-lightbox-portrait';
  };

  const getContentStyle = () => {
    if (isGroup) return { flexDirection: 'column' as const, alignItems: 'stretch' as const, maxWidth: '80vw' };
    return undefined;
  };

  const backdropClass = isVideo ? 'video-lightbox-backdrop' : 'art-lightbox-backdrop';
  const contentClass = isVideo ? 'video-lightbox-content' : `art-lightbox-content${getOrientationClass()}`;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className={backdropClass} onClick={onClose}
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
            className={contentClass}
            style={getContentStyle()}
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo ? (
              <>
                <div className="video-lightbox-video-wrap" onClick={(e) => {
                  const vid = e.currentTarget.querySelector('video');
                  if (vid) vid.paused ? vid.play() : vid.pause();
                }}>
                  <video src={m.src} autoPlay loop muted playsInline className="video-lightbox-video" style={{ cursor: 'pointer' }} />
                </div>
                <div className="video-lightbox-detail">
                  <a href="/projects/rewired" className="video-lightbox-detail-header">
                    <img src="/images/rewired-app-icon.png" alt="Rewired" className="video-lightbox-detail-icon" />
                    <span className="video-lightbox-detail-name">Rewired</span>
                    <svg className="video-lightbox-detail-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </a>
                  <div style={{ height: '1px', background: 'var(--border)', marginBottom: '0.75rem' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)', display: 'block', marginBottom: '0.5rem' }}>{m.title}</span>
                  <p className="video-lightbox-detail-desc">{m.caption}</p>
                  {visibleTags(m.tags).length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {visibleTags(m.tags).map((tag) => (
                        <a key={tag} href={`/skills?t=${encodeURIComponent(tag)}`} style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--border-light)', color: 'var(--fg-muted)', fontFamily: 'var(--font-body)', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--fg-dim)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>{tag}</a>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : isGroup ? (
              <>
                <div className={`art-lightbox-grid ${m.alt === 'Avatars' ? 'art-lightbox-grid--avatars' : ''}`} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {m.groupSrcs!.map((gp, i) => (
                    <motion.div
                      key={gp.src}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.03, ease: [0.25, 1, 0.5, 1] }}
                      className={m.alt === 'Avatars' ? 'aspect-[4/5] overflow-hidden rounded-sm' : ''}
                    >
                      <Image src={gp.src} alt={gp.alt} width={gp.w} height={gp.h} quality={90}
                        style={{ width: '100%', height: m.alt === 'Avatars' ? '100%' : 'auto', objectFit: m.alt === 'Avatars' ? 'cover' : 'contain', borderRadius: m.alt === 'Avatars' ? '2px' : '6px' }} />
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className="video-lightbox-detail"
                  style={{ maxWidth: 'none', paddingTop: '1rem' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                >
                  <span className="video-lightbox-detail-name">{m.title}</span>
                  <p className="video-lightbox-detail-desc">{m.caption}</p>
                  {visibleTags(m.tags).length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {visibleTags(m.tags).map((tag) => (
                        <a key={tag} href={`/skills?t=${encodeURIComponent(tag)}`} style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--border-light)', color: 'var(--fg-muted)', fontFamily: 'var(--font-body)', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--fg-dim)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>{tag}</a>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            ) : (
              <>
                <div className="art-lightbox-image-wrap">
                  <Image src={m.src} alt={m.alt} width={m.w} height={m.h} className="art-lightbox-image" quality={90}
                    style={m.w / m.h > 2 ? { maxWidth: '80vw' } : undefined} />
                </div>
                <div className="video-lightbox-detail" style={m.w / m.h > 2 ? { maxWidth: 'none', paddingTop: '0.75rem' } : undefined}>
                  <a href="/projects/rewired" className="video-lightbox-detail-header">
                    <img src="/images/rewired-app-icon.png" alt="Rewired" className="video-lightbox-detail-icon" />
                    <span className="video-lightbox-detail-name">Rewired</span>
                    <svg className="video-lightbox-detail-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </a>
                  <div style={{ height: '1px', background: 'var(--border)', marginBottom: '0.75rem' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)', display: 'block', marginBottom: '0.5rem' }}>{m.title}</span>
                  <p className="video-lightbox-detail-desc">{m.caption}</p>
                  {visibleTags(m.tags).length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {visibleTags(m.tags).map((tag) => (
                        <a key={tag} href={`/skills?t=${encodeURIComponent(tag)}`} style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--border-light)', color: 'var(--fg-muted)', fontFamily: 'var(--font-body)', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--fg-dim)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>{tag}</a>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
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
