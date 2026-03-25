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

    // React doesn't reliably apply the muted attribute on initial render
    vid.muted = true;

    let loaded = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loaded) {
            vid.src = src;
            vid.load();
            loaded = true;
          }
          vid.play().catch(() => {});
        } else if (loaded) {
          vid.pause();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(vid);
    return () => obs.disconnect();
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
