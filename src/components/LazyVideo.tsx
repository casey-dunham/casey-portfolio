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

    const tryPlay = () => {
      if (visible && vid.paused) vid.play().catch(() => {});
    };

    vid.addEventListener('canplay', tryPlay);

    const obs = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) tryPlay();
        else vid.pause();
      },
      { threshold: 0.1 },
    );
    obs.observe(vid);

    return () => {
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
