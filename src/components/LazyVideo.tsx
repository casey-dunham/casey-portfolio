'use client';

import { useRef, useEffect } from 'react';

/**
 * Video that lazy-loads when near the viewport and plays/pauses based on visibility.
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
  loadMargin?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    let hasPlayed = false;

    // When near viewport, set the src to start loading
    const loadObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.src = src;
          vid.load();
          loadObs.disconnect();
        }
      },
      { rootMargin: loadMargin },
    );

    // Play/pause based on visibility
    const playObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else if (hasPlayed) {
          vid.pause();
        }
      },
      { threshold: 0.15 },
    );

    const onPlaying = () => { hasPlayed = true; };
    vid.addEventListener('playing', onPlaying);

    loadObs.observe(vid);
    playObs.observe(vid);

    return () => {
      vid.removeEventListener('playing', onPlaying);
      loadObs.disconnect();
      playObs.disconnect();
    };
  }, [src, loadMargin]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}
