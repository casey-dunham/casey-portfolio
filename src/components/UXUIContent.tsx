'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoItem {
  src: string;
  label: string;
}

interface VideoRow {
  cols: 2 | 3;
  videos: VideoItem[];
}

const rows: VideoRow[] = [
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/dossi-welcome-flow-1a.mp4', label: 'Dossi Welcome Flow' },
      { src: '/videos/uxui/cgm-selection-1b.mp4', label: 'CGM Selection' },
    ],
  },
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/rewired-value-props-2a.mp4', label: 'Rewired Value Props' },
      { src: '/videos/uxui/rewired-onboarding-2b.mp4', label: 'Rewired Onboarding' },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/insights-scroll-3a.mp4', label: 'Insights Scroll' },
      { src: '/videos/uxui/quick-action-bolus-3b.mp4', label: 'Quick Action Bolus' },
      { src: '/videos/uxui/notifications-toggle-3c.mp4', label: 'Notifications Toggle' },
    ],
  },
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/nutrition-page-scroll-4a.mp4', label: 'Nutrition Page' },
      { src: '/videos/uxui/meal-entry-scroll-4b.mp4', label: 'Meal Entry' },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/ai-chat-text-5b.mp4', label: 'AI Chat — Text' },
      { src: '/videos/uxui/ai-chat-photo-5a.mp4', label: 'AI Chat — Photo' },
      { src: '/videos/uxui/ai-chat-insights-5c.mp4', label: 'AI Chat — Insights' },
    ],
  },
  {
    cols: 2,
    videos: [
      { src: '/videos/uxui/avatar-selection-6a.mp4', label: 'Avatar Selection' },
      { src: '/videos/uxui/ai-orb-6b.mp4', label: 'AI Orb' },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/rewired-questions-7a.mp4', label: 'Rewired Questions' },
      { src: '/videos/uxui/rewired-finished-7b.mp4', label: 'Rewired — Complete' },
      { src: '/videos/uxui/rewired-lesson-7c.mp4', label: 'Rewired Lesson' },
    ],
  },
  {
    cols: 3,
    videos: [
      { src: '/videos/uxui/dossi-metabolic-profile-8a.mp4', label: 'Metabolic Profile' },
      { src: '/videos/uxui/dossi-onboarding-8b.mp4', label: 'Dossi Onboarding' },
      { src: '/videos/uxui/dossi-account-8c.mp4', label: 'Dossi Account' },
    ],
  },
];

function VideoCell({
  video,
  onClick,
}: {
  video: VideoItem;
  onClick: (rect: DOMRect) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);


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

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={video.src}
          initial={getInitial()}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -slideX : slideX }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="video-lightbox-content"
          onClick={(e) => e.stopPropagation()}
        >
          <video src={video.src} autoPlay loop muted playsInline className="video-lightbox-video" />
        </motion.div>
      </AnimatePresence>

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
