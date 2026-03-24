'use client';

import { useEffect, useRef } from 'react';

// Simple 2D noise implementation (value noise with smoothstep)
function hash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) & 0x7fffffff) / 0x7fffffff;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function noise2D(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = smoothstep(fx);
  const sy = smoothstep(fy);
  const n00 = hash(ix, iy);
  const n10 = hash(ix + 1, iy);
  const n01 = hash(ix, iy + 1);
  const n11 = hash(ix + 1, iy + 1);
  const nx0 = n00 + (n10 - n00) * sx;
  const nx1 = n01 + (n11 - n01) * sx;
  return nx0 + (nx1 - nx0) * sy;
}

function fbm(x: number, y: number, octaves: number): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
}

export default function HeroBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const animRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse lerp
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.02;
      m.y += (m.targetY - m.y) * 0.02;

      const t = (Date.now() - startTimeRef.current) * 0.0001;

      // Blob center — slightly offset by mouse
      const cx = w * 0.55 + (m.x - 0.5) * w * 0.08;
      const cy = h * 0.42 + (m.y - 0.5) * h * 0.06;

      // Base radius
      const baseR = Math.min(w, h) * 0.32;

      // Draw blob with layered radial fills for depth
      const layers = [
        { scale: 1.15, color1: 'rgba(80, 60, 120, 0.12)', color2: 'rgba(40, 50, 90, 0.0)', noiseScale: 0.8, speed: 0.7 },
        { scale: 1.0,  color1: 'rgba(120, 90, 160, 0.15)', color2: 'rgba(60, 80, 140, 0.0)', noiseScale: 1.0, speed: 1.0 },
        { scale: 0.75, color1: 'rgba(156, 165, 255, 0.1)',  color2: 'rgba(100, 70, 140, 0.0)', noiseScale: 1.3, speed: 1.4 },
      ];

      for (const layer of layers) {
        const r = baseR * layer.scale;
        const points = 120;

        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const nx = Math.cos(angle) * 2 + t * layer.speed;
          const ny = Math.sin(angle) * 2 + t * layer.speed * 0.7;
          const noiseVal = fbm(nx * layer.noiseScale, ny * layer.noiseScale, 4);
          const offset = r * (0.8 + noiseVal * 0.45);

          const px = cx + Math.cos(angle) * offset;
          const py = cy + Math.sin(angle) * offset * 0.85; // slight vertical squash

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Radial gradient fill
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.2);
        grad.addColorStop(0, layer.color1);
        grad.addColorStop(1, layer.color2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
