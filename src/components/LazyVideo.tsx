'use client';

import { useRef, useEffect } from 'react';

export default function LazyVideo({
  src,
  className,
  style,
  onClick,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLVideoElement>;
  loadMargin?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = ref.current;
    if (!vid) return;
    vid.muted = true;

    let visible = false;
    let rafId = 0;

    // Keep retrying play() via rAF while visible.
    // This handles framer-motion containers that start at opacity:0 —
    // Chrome blocks play() until the element is actually painted visible.
    const tryPlay = () => {
      cancelAnimationFrame(rafId);
      if (!visible) return;
      if (vid.paused && vid.readyState >= 3) {
        vid.play().catch(() => {});
      }
      // If still paused, keep polling until the animation reveals the video
      if (vid.paused) {
        rafId = requestAnimationFrame(tryPlay);
      }
    };

    vid.addEventListener('canplay', tryPlay);

    const obs = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) tryPlay();
        else {
          cancelAnimationFrame(rafId);
          vid.pause();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(vid);

    return () => {
      cancelAnimationFrame(rafId);
      vid.removeEventListener('canplay', tryPlay);
      obs.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="auto"
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}
