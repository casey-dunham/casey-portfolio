'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CursorGlowProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
  oz: number;
  size: number;
}

function CursorGlowCanvas({ containerRef }: CursorGlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d')!;
    let animFrame: number;
    let mouseX = -9999;
    let mouseY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;
    let prevSmoothX = -9999;
    let prevSmoothY = -9999;
    let time = 0;
    let currentSpeed = 0;
    let hasInit = false;

    const PARTICLE_COUNT = 300;
    const ORB_RADIUS = 24;
    const particles: Particle[] = [];

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const reposition = () => {
      const rect = container.getBoundingClientRect();
      canvas.style.top = rect.top + 'px';
      canvas.style.left = rect.left + 'px';
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      // Snap on first move into container
      if (!hasInit && mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
        hasInit = true;
        smoothX = mouseX;
        smoothY = mouseY;
        prevSmoothX = mouseX;
        prevSmoothY = mouseY;
        for (const p of particles) {
          const perspective = 200;
          const scale = perspective / (perspective + p.oz);
          p.x = mouseX + p.ox * scale;
          p.y = mouseY + p.oy * scale;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', reposition, { passive: true });

    // Fibonacci sphere distribution
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = ORB_RADIUS * (0.6 + Math.random() * 0.4);

      particles.push({
        x: -9999,
        y: -9999,
        vx: 0,
        vy: 0,
        ox: r * Math.sin(phi) * Math.cos(theta),
        oy: r * Math.sin(phi) * Math.sin(theta),
        oz: r * Math.cos(phi),
        size: 0.8 + Math.random() * 1.0,
      });
    }

    const draw = () => {
      reposition();
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      time++;

      if (Math.abs(canvas.width - w * dpr) > 2 || Math.abs(canvas.height - h * dpr) > 2) {
        resize();
      }

      ctx.clearRect(0, 0, w, h);

      if (!hasInit || rect.bottom < 0 || rect.top > window.innerHeight) {
        animFrame = requestAnimationFrame(draw);
        return;
      }

      // Check if mouse is in container bounds
      const inBounds = mouseX >= -50 && mouseX <= w + 50 && mouseY >= -50 && mouseY <= h + 50;

      // Smooth cursor tracking
      prevSmoothX = smoothX;
      prevSmoothY = smoothY;
      smoothX += (mouseX - smoothX) * 0.1;
      smoothY += (mouseY - smoothY) * 0.1;

      const dx = smoothX - prevSmoothX;
      const dy = smoothY - prevSmoothY;
      const instantSpeed = Math.sqrt(dx * dx + dy * dy);
      currentSpeed += (instantSpeed - currentSpeed) * 0.08;

      const dispersion = Math.min(1, currentSpeed / 8);
      const moveAngle = Math.atan2(dy, dx);

      // Slowly rotate the sphere
      const rotSpeed = 0.005;
      const cosR = Math.cos(rotSpeed);
      const sinR = Math.sin(rotSpeed);
      const cosR2 = Math.cos(rotSpeed * 0.7);
      const sinR2 = Math.sin(rotSpeed * 0.7);

      const edgeFade = 50;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Y-axis rotation
        const newOx = p.ox * cosR - p.oz * sinR;
        const newOz = p.ox * sinR + p.oz * cosR;
        p.ox = newOx;
        p.oz = newOz;

        // X-axis rotation
        const newOy = p.oy * cosR2 - p.oz * sinR2;
        const newOz2 = p.oy * sinR2 + p.oz * cosR2;
        p.oy = newOy;
        p.oz = newOz2;

        // 3D → 2D projection
        const perspective = 200;
        const scale = perspective / (perspective + p.oz);
        const sphereX = p.ox * scale;
        const sphereY = p.oy * scale;

        let targetX = smoothX + sphereX;
        let targetY = smoothY + sphereY;

        // Trail dispersion when moving
        if (dispersion > 0.01) {
          const dist = Math.sqrt(p.ox * p.ox + p.oy * p.oy + p.oz * p.oz);
          const trail = dispersion * (dist / ORB_RADIUS) * 3;
          targetX -= Math.cos(moveAngle) * trail * ORB_RADIUS * 0.8;
          targetY -= Math.sin(moveAngle) * trail * ORB_RADIUS * 0.8;

          const perp = moveAngle + Math.PI / 2;
          const scatter = dispersion * Math.sin(time * 0.03 + i * 0.5) * 0.5 * dist * 0.3;
          targetX += Math.cos(perp) * scatter;
          targetY += Math.sin(perp) * scatter;
        }

        // Spring physics
        const spring = 0.06 + (1 - dispersion) * 0.06;
        p.vx += (targetX - p.x) * spring;
        p.vy += (targetY - p.y) * spring;
        p.vx *= 0.78;
        p.vy *= 0.78;
        p.x += p.vx;
        p.y += p.vy;

        if (!inBounds) continue;

        // Edge fade only (no transparency otherwise — solid dots)
        let alpha = 1;
        if (p.x < edgeFade) alpha = Math.min(alpha, p.x / edgeFade);
        if (p.x > w - edgeFade) alpha = Math.min(alpha, (w - p.x) / edgeFade);
        if (p.y < edgeFade) alpha = Math.min(alpha, p.y / edgeFade);
        if (p.y > h - edgeFade) alpha = Math.min(alpha, (h - p.y) / edgeFade);
        alpha = Math.max(0, alpha);
        if (alpha < 0.01) continue;

        const drawSize = p.size * scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        if (alpha < 1) {
          ctx.fillStyle = `rgba(225, 225, 225, ${alpha.toFixed(2)})`;
        } else {
          ctx.fillStyle = '#e1e1e1';
        }
        ctx.fill();
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
        zIndex: 5,
      }}
    />
  );
}

export default function CursorGlow({ containerRef }: CursorGlowProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <CursorGlowCanvas containerRef={containerRef} />,
    document.body
  );
}
