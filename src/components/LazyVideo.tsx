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

    let srcSet = false;

    // Start loading video data early, before it's visible
    const loadObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !srcSet) {
          vid.src = src;
          srcSet = true;
          loadObs.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );

    // Play/pause based on visibility
    const playObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else if (srcSet) {
          vid.pause();
        }
      },
      { threshold: 0.1 },
    );

    loadObs.observe(vid);
    playObs.observe(vid);

    return () => {
      loadObs.disconnect();
      playObs.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={ref}
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
