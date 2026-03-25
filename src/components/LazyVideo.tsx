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
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(vid);
    return () => obs.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}
