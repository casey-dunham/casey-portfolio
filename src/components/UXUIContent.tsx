'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoDetail {
  icon: string;
  name: string;
  description: string;
  href: string;
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

const dossiDetail: VideoDetail = {
  icon: '/images/dossi-app-icon.png',
  name: 'Dossi',
  description: 'A diabetes management app designed to help people make sense of their blood sugar data. Dossi combines continuous glucose monitoring with intelligent insights, making it easier to understand patterns, adjust dosing, and feel more confident in daily health decisions.',
  href: '/work/dossi',
};

const rewiredDetail: VideoDetail = {
  icon: '/images/rewired-app-icon.png',
  name: 'Rewired',
  description: 'A neuroplasticity-based wellness app that helps users build healthier mental habits through guided exercises, cognitive reframing, and personalized lesson plans rooted in behavioral science.',
  href: '/work/rewired',
};

const rows: VideoRow[] = [
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/dossi-welcome-flow-1a.mp4', label: 'Dossi Welcome Flow', detail: dossiDetail },
      { src: '/videos/uxui/cgm-selection-1b.mp4', label: 'CGM Selection', detail: dossiDetail },
    ],
  },
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/rewired-value-props-2a.mp4', label: 'Rewired Value Props', detail: rewiredDetail },
      { src: '/videos/uxui/rewired-onboarding-2b.mp4', label: 'Rewired Onboarding', detail: rewiredDetail },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/insights-scroll-3a.mp4', label: 'Insights Scroll', detail: dossiDetail },
      { src: '/videos/uxui/quick-action-bolus-3b.mp4', label: 'Quick Action Bolus', detail: dossiDetail },
      { src: '/videos/uxui/notifications-toggle-3c.mp4', label: 'Notifications Toggle', detail: dossiDetail },
    ],
  },
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/avatar-selection-6a.mp4', label: 'Avatar Selection', detail: dossiDetail },
      { src: '/videos/uxui/ai-orb-6b.mp4', label: 'AI Orb', detail: dossiDetail },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/ai-chat-text-5b.mp4', label: 'AI Chat — Text', detail: dossiDetail },
      { src: '/videos/uxui/ai-chat-photo-5a.mp4', label: 'AI Chat — Photo', detail: dossiDetail },
      { src: '/videos/uxui/ai-chat-insights-5c.mp4', label: 'AI Chat — Insights', detail: dossiDetail },
    ],
  },
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/nutrition-page-scroll-4a.mp4', label: 'Nutrition Page', detail: dossiDetail },
      { src: '/videos/uxui/meal-entry-scroll-4b.mp4', label: 'Meal Entry', detail: dossiDetail },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/rewired-questions-7a.mp4', label: 'Rewired Questions', detail: rewiredDetail },
      { src: '/videos/uxui/rewired-finished-7b.mp4', label: 'Rewired — Complete', detail: rewiredDetail },
      { src: '/videos/uxui/rewired-lesson-7c.mp4', label: 'Rewired Lesson', detail: rewiredDetail },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/dossi-metabolic-profile-8a.mp4', label: 'Metabolic Profile', detail: dossiDetail },
      { src: '/videos/uxui/dossi-onboarding-8b.mp4', label: 'Dossi Onboarding', detail: dossiDetail },
      { src: '/videos/uxui/dossi-account-8c.mp4', label: 'Dossi Account', detail: dossiDetail },
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
              <a href={video.detail.href} className="video-lightbox-detail-header">
                <img src={video.detail.icon} alt={video.detail.name} className="video-lightbox-detail-icon" />
                <span className="video-lightbox-detail-name">{video.detail.name}</span>
              </a>
              <p className="video-lightbox-detail-desc">{video.detail.description}</p>
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
