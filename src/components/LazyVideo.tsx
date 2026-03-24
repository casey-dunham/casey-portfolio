'use client';

import { useRef, useState, useEffect } from 'react';

/**
 * Video that only loads when near the viewport and plays/pauses based on visibility.
 * Drop-in replacement for <video autoPlay muted loop playsInline>.
 */
export default function LazyVideo({
  src,
  className,
  style,
  onClick,
  loadMargin = '400px 0px',
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLVideoElement>;
  /** IntersectionObserver rootMargin for triggering the download */
  loadMargin?: string;
}) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Lazy-load: observe the placeholder element directly (not a display:contents wrapper)
  useEffect(() => {
    if (loaded) return;
    const el = placeholderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          obs.disconnect();
        }
      },
      { rootMargin: loadMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMargin, loaded]);

  // Play/pause based on visibility
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(vid);
    return () => obs.disconnect();
  }, [loaded]);

  if (loaded) {
    return (
      <video
        ref={videoRef}
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

  return (
    <div
      ref={placeholderRef}
      className={className}
      style={{ ...style, background: 'transparent', minHeight: 1 }}
    />
  );
}
