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
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Lazy-load: set src only when element is near the viewport
  useEffect(() => {
    const el = wrapRef.current;
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
  }, [loadMargin]);

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

  return (
    <div ref={wrapRef} style={{ display: 'contents' }}>
      {loaded ? (
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
      ) : (
        <div className={className} style={{ ...style, background: 'transparent' }} />
      )}
    </div>
  );
}
