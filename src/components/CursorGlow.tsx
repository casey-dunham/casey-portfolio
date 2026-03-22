'use client';

import { useEffect, useRef } from 'react';

interface CursorGlowProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
}

export default function CursorGlow({ containerRef }: CursorGlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d')!;
    let animFrame: number;
    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    const sparks: Spark[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Reposition canvas on scroll
    const reposition = () => {
      const rect = container.getBoundingClientRect();
      canvas.style.top = rect.top + 'px';
      canvas.style.left = rect.left + 'px';
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    const handleMouseMove = (e: MouseEvent) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      // Convert to container-relative coordinates
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', reposition, { passive: true });

    const draw = () => {
      reposition();
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Check if canvas needs resize
      const dpr = window.devicePixelRatio || 1;
      if (Math.abs(canvas.width - w * dpr) > 2 || Math.abs(canvas.height - h * dpr) > 2) {
        resize();
      }

      ctx.clearRect(0, 0, w, h);

      // Check if container is even visible
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        animFrame = requestAnimationFrame(draw);
        return;
      }

      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Only spawn if cursor is within container bounds
      const inBounds = mouseX >= 0 && mouseX <= w && mouseY >= 0 && mouseY <= h;

      if (inBounds) {
        const count = Math.min(6, Math.floor(speed * 0.4) + 2);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const vel = 1 + Math.random() * 3;
          const maxLife = 25 + Math.random() * 50;
          const hues = [330, 280, 220, 300, 190, 260, 340];
          const hue = hues[Math.floor(Math.random() * hues.length)];

          sparks.push({
            x: mouseX + (Math.random() - 0.5) * 30,
            y: mouseY + (Math.random() - 0.5) * 30,
            vx: Math.cos(angle) * vel + dx * 0.15,
            vy: Math.sin(angle) * vel + dy * 0.15 - 0.8,
            size: 2 + Math.random() * 4.5,
            life: maxLife,
            maxLife,
            hue,
          });
        }
      }

      // Edge fade distances
      const edgeFade = 80;

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life--;

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.03;
        s.vx *= 0.97;
        s.vy *= 0.97;

        const t = s.life / s.maxLife;

        // Compute edge fade factor
        let edgeAlpha = 1;
        if (s.x < edgeFade) edgeAlpha = Math.min(edgeAlpha, Math.max(0, s.x / edgeFade));
        if (s.x > w - edgeFade) edgeAlpha = Math.min(edgeAlpha, Math.max(0, (w - s.x) / edgeFade));
        if (s.y < edgeFade) edgeAlpha = Math.min(edgeAlpha, Math.max(0, s.y / edgeFade));
        if (s.y > h - edgeFade) edgeAlpha = Math.min(edgeAlpha, Math.max(0, (h - s.y) / edgeFade));

        // Skip if fully outside
        if (s.x < -10 || s.x > w + 10 || s.y < -10 || s.y > h + 10) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = t * edgeAlpha;
        const r = s.size * (0.4 + t * 0.6);

        // Outer glow
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 4);
        glow.addColorStop(0, `hsla(${s.hue}, 100%, 70%, ${alpha * 0.25})`);
        glow.addColorStop(1, `hsla(${s.hue}, 100%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 100%, 75%, ${alpha * 0.9})`;
        ctx.fill();

        // White center
        if (t > 0.4) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
          ctx.fill();
        }
      }

      if (sparks.length > 300) {
        sparks.splice(0, sparks.length - 300);
      }

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', reposition);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
