'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoProject {
  icon: string;
  name: string;
  href: string;
}

interface VideoDetail {
  project: VideoProject;
  subtitle: string;
  description: string;
  tags: string[];
}

interface VideoItem {
  src: string;
  label: string;
  detail?: VideoDetail;
}

interface VideoRow {
  cols: 2 | 3;
  videos: VideoItem[];
}

const dossi: VideoProject = {
  icon: '/images/dossi-app-icon.png',
  name: 'Dossi',
  href: '/work/dossi',
};

const rewired: VideoProject = {
  icon: '/images/rewired-app-icon.png',
  name: 'Rewired',
  href: '/work/rewired',
};

const tags = { figma: 'Figma', swift: 'SwiftUI' };

const rows: VideoRow[] = [
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/dossi-welcome-flow-1a.mp4', label: 'Dossi Welcome Flow', detail: { project: dossi, subtitle: 'Welcome Flow', description: 'First-launch onboarding sequence that introduces core features and collects user health preferences to personalize the experience.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/cgm-selection-1b.mp4', label: 'CGM Selection', detail: { project: dossi, subtitle: 'CGM Selection', description: 'Device pairing flow that guides users through selecting and connecting their continuous glucose monitor.', tags: [tags.figma, tags.swift] } },
    ],
  },
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/rewired-value-props-2a.mp4', label: 'Rewired Value Props', detail: { project: rewired, subtitle: 'Value Props', description: 'Animated onboarding cards that communicate the app\'s core benefits before sign-up.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/rewired-onboarding-2b.mp4', label: 'Rewired Onboarding', detail: { project: rewired, subtitle: 'Onboarding', description: 'Multi-step onboarding that assesses the user\'s mental wellness goals and tailors their initial lesson plan.', tags: [tags.figma, tags.swift] } },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/insights-scroll-3a.mp4', label: 'Insights Scroll', detail: { project: dossi, subtitle: 'Insights Feed', description: 'Scrollable feed of personalized glucose insights, surfacing patterns and trends from the user\'s data.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/quick-action-bolus-3b.mp4', label: 'Quick Action Bolus', detail: { project: dossi, subtitle: 'Quick Action Bolus', description: 'One-tap bolus logging with haptic confirmation, designed to minimize friction for frequent insulin doses.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/notifications-toggle-3c.mp4', label: 'Notifications Toggle', detail: { project: dossi, subtitle: 'Notifications', description: 'Granular notification controls that let users customize alert types, thresholds, and quiet hours.', tags: [tags.figma, tags.swift] } },
    ],
  },
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/avatar-selection-6a.mp4', label: 'Avatar Selection', detail: { project: dossi, subtitle: 'Avatar Selection', description: 'Personalization screen where users choose an avatar to represent them across the app.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/ai-orb-6b.mp4', label: 'AI Orb', detail: { project: dossi, subtitle: 'AI Orb', description: 'Animated orb interaction that serves as the entry point to Dossi\'s AI assistant.', tags: [tags.figma, tags.swift] } },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/ai-chat-text-5b.mp4', label: 'AI Chat — Text', detail: { project: dossi, subtitle: 'AI Chat — Text', description: 'Conversational AI interface for asking health questions and getting personalized guidance in natural language.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/ai-chat-photo-5a.mp4', label: 'AI Chat — Photo', detail: { project: dossi, subtitle: 'AI Chat — Photo', description: 'Photo-based meal logging through the AI chat — snap a photo and get estimated nutritional data and glucose impact.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/ai-chat-insights-5c.mp4', label: 'AI Chat — Insights', detail: { project: dossi, subtitle: 'AI Chat — Insights', description: 'AI-generated insights delivered conversationally, connecting glucose patterns to meals, activity, and dosing.', tags: [tags.figma, tags.swift] } },
    ],
  },
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/nutrition-page-scroll-4a.mp4', label: 'Nutrition Page', detail: { project: dossi, subtitle: 'Nutrition Page', description: 'Daily nutrition summary showing macros, meal timeline, and glucose overlay to visualize food-blood sugar relationships.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/meal-entry-scroll-4b.mp4', label: 'Meal Entry', detail: { project: dossi, subtitle: 'Meal Entry', description: 'Streamlined meal logging flow with search, recent meals, and portion adjustment.', tags: [tags.figma, tags.swift] } },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/rewired-questions-7a.mp4', label: 'Rewired Questions', detail: { project: rewired, subtitle: 'Daily Check-in', description: 'Interactive questionnaire that tracks mood and cognitive state, adapting lesson recommendations based on responses.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/rewired-finished-7b.mp4', label: 'Rewired — Complete', detail: { project: rewired, subtitle: 'Lesson Complete', description: 'Completion screen with progress visualization and encouragement to build streaks.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/rewired-lesson-7c.mp4', label: 'Rewired Lesson', detail: { project: rewired, subtitle: 'Lesson View', description: 'Guided lesson interface with step-by-step exercises rooted in cognitive behavioral techniques.', tags: [tags.figma, tags.swift] } },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/dossi-metabolic-profile-8a.mp4', label: 'Metabolic Profile', detail: { project: dossi, subtitle: 'Metabolic Profile', description: 'User health profile displaying key metabolic metrics, insulin sensitivity factors, and treatment settings.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/dossi-onboarding-8b.mp4', label: 'Dossi Onboarding', detail: { project: dossi, subtitle: 'Onboarding', description: 'Step-by-step setup flow that collects diabetes type, treatment method, and target ranges to configure the app.', tags: [tags.figma, tags.swift] } },
      { src: '/videos/uxui/dossi-account-8c.mp4', label: 'Dossi Account', detail: { project: dossi, subtitle: 'Account Settings', description: 'Account management screen with profile editing, data export, and connected device management.', tags: [tags.figma, tags.swift] } },
    ],
  },
];

function VideoCell({
  video,
  onClick,
  paused,
}: {
  video: VideoItem;
  onClick: (rect: DOMRect) => void;
  paused?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !paused) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [paused]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (paused) {
      el.pause();
    } else if (isVisibleRef.current) {
      el.play().catch(() => {});
    }
  }, [paused]);


  const handleClick = () => {
    if (cellRef.current) {
      onClick(cellRef.current.getBoundingClientRect());
    }
  };

  return (
    <div ref={cellRef} className="video-cell" onClick={handleClick}>
      <video
        ref={videoRef}
        src={video.src}
        loop
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}

// Flatten all videos for lightbox navigation
const allVideos = rows.flatMap((r) => r.videos);

function VideoLightbox({
  videoIndex,
  direction,
  originRect,
  onClose,
  onPrev,
  onNext,
}: {
  videoIndex: number;
  direction: number;
  originRect: DOMRect | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const video = allVideos[videoIndex];
  const hasPrev = videoIndex > 0;
  const hasNext = videoIndex < allVideos.length - 1;
  const isInitialOpen = originRect !== null && direction === 0;
  const dirRef = useRef(direction);
  dirRef.current = direction;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
  const originX = originRect ? originRect.x + originRect.width / 2 - centerX : 0;
  const originY = originRect ? originRect.y + originRect.height / 2 - centerY : 0;
  const originScale = originRect ? originRect.width / 500 : 0.5;

  // Slide amount for prev/next navigation
  const slideX = 300;

  const getInitial = () => {
    if (isInitialOpen) {
      return { opacity: 0, scale: originScale, x: originX, y: originY };
    }
    // Slide in from direction
    return { opacity: 0, x: direction > 0 ? slideX : -slideX };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="video-lightbox-backdrop"
      onClick={onClose}
    >
      <motion.button
        className="video-lightbox-close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </motion.button>

      {hasPrev && (
        <motion.button
          className="video-lightbox-nav video-lightbox-prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={video.src}
          initial={direction === 0 ? getInitial() : { x: direction > 0 ? 600 : -600, opacity: 0 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={() => ({ x: dirRef.current > 0 ? -600 : 600, opacity: 0, position: 'absolute' as const })}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="video-lightbox-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="video-lightbox-video-wrap" onClick={(e) => {
            const vid = e.currentTarget.querySelector('video');
            if (vid) vid.paused ? vid.play() : vid.pause();
          }}>
            <video src={video.src} autoPlay loop muted playsInline className="video-lightbox-video" style={{ cursor: 'pointer' }} />
          </div>
          {video.detail && (
            <div className="video-lightbox-detail">
              <a href={video.detail.project.href} className="video-lightbox-detail-header">
                <img src={video.detail.project.icon} alt={video.detail.project.name} className="video-lightbox-detail-icon" />
                <span className="video-lightbox-detail-name">{video.detail.project.name}</span>
              </a>
              <div style={{ height: '1px', background: 'var(--border)', marginBottom: '0.75rem' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)', display: 'block', marginBottom: '0.5rem' }}>{video.detail.subtitle}</span>
              <p className="video-lightbox-detail-desc">{video.detail.description}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {video.detail.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--border-light)', color: 'var(--fg-muted)', fontFamily: 'var(--font-body)' }}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      </div>

      {hasNext && (
        <motion.button
          className="video-lightbox-nav video-lightbox-next"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
}

export default function UXUIContent() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next, 0 = initial

  const closeLightbox = useCallback(() => { setActiveIndex(null); setDirection(0); }, []);
  const goPrev = useCallback(() => { setDirection(-1); setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)); }, []);
  const goNext = useCallback(() => { setDirection(1); setActiveIndex((i) => (i !== null && i < allVideos.length - 1 ? i + 1 : i)); }, []);

  const handleVideoClick = useCallback((video: VideoItem, rect: DOMRect) => {
    const idx = allVideos.findIndex((v) => v.src === video.src);
    setOriginRect(rect);
    setDirection(0);
    setActiveIndex(idx);
  }, []);

  return (
    <>
      <div className="video-rows">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`video-grid cols-${row.cols}`}>
            {row.videos.map((video, vidIndex) => (
              <VideoCell
                key={vidIndex}
                video={video}
                onClick={(rect) => handleVideoClick(video, rect)}
                paused={activeIndex !== null}
              />
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <VideoLightbox
            videoIndex={activeIndex}
            direction={direction}
            originRect={originRect}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </>
  );
}
