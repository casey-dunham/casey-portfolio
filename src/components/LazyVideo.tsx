'use client';

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
  return (
    <video
      src={src}
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
