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

  // React doesn't reliably apply the `muted` attribute on initial render
  // (https://github.com/facebook/react/issues/10389).
  // Without it the browser treats the video as unmuted and blocks autoplay.
  useEffect(() => {
    if (ref.current) ref.current.muted = true;
  }, []);

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
