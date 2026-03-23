'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CursorGlowProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  width: number;
}

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  phase: number;
}

function CursorGlowCanvas({ containerRef }: CursorGlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true })!;
    let animFrame: number;
    let mouseX = -9999;
    let mouseY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;
    let prevSmoothX = -9999;
    let prevSmoothY = -9999;
    let currentSpeed = 0;
    let hasInit = false;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Trail history
    const trail: TrailPoint[] = [];
    const MAX_TRAIL = 50;
    const TRAIL_LIFETIME = 60;

    // Orbiting motes
    const MOTE_COUNT = 18;
    const motes: Mote[] = [];
    for (let i = 0; i < MOTE_COUNT; i++) {
      const angle = (i / MOTE_COUNT) * Math.PI * 2;
      motes.push({
        x: 0, y: 0,
        vx: 0, vy: 0,
        angle,
        radius: 12 + Math.random() * 20,
        speed: 0.008 + Math.random() * 0.012,
        size: 1 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasInit) {
        hasInit = true;
        smoothX = mouseX;
        smoothY = mouseY;
        prevSmoothX = mouseX;
        prevSmoothY = mouseY;
        for (const m of motes) {
          m.x = mouseX + Math.cos(m.angle) * m.radius;
          m.y = mouseY + Math.sin(m.angle) * m.radius;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      time++;

      ctx.clearRect(0, 0, w, h);

      if (!hasInit) {
        animFrame = requestAnimationFrame(draw);
        return;
      }

      // Smooth cursor
      prevSmoothX = smoothX;
      prevSmoothY = smoothY;
      smoothX += (mouseX - smoothX) * 0.15;
      smoothY += (mouseY - smoothY) * 0.15;

      const dx = smoothX - prevSmoothX;
      const dy = smoothY - prevSmoothY;
      const instantSpeed = Math.sqrt(dx * dx + dy * dy);
      currentSpeed += (instantSpeed - currentSpeed) * 0.1;

      // Add trail points when moving
      if (currentSpeed > 0.5) {
        trail.push({
          x: smoothX,
          y: smoothY,
          age: 0,
          width: Math.min(3, 0.5 + currentSpeed * 0.3),
        });
        if (trail.length > MAX_TRAIL) trail.shift();
      }

      // Age and draw trail as a fluid ribbon
      if (trail.length > 2) {
        for (let i = trail.length - 1; i >= 0; i--) {
          trail[i].age++;
          if (trail[i].age > TRAIL_LIFETIME) {
            trail.splice(i, 1);
          }
        }

        if (trail.length > 2) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          for (let i = 1; i < trail.length; i++) {
            const p = trail[i];
            const prev = trail[i - 1];
            const life = 1 - p.age / TRAIL_LIFETIME;
            const fade = life * life;

            // Blend from warm accent to cool white based on speed
            const speedBlend = Math.min(1, currentSpeed / 6);
            const r = Math.round(196 * speedBlend + 225 * (1 - speedBlend));
            const g = Math.round(93 * speedBlend + 225 * (1 - speedBlend));
            const b = Math.round(62 * speedBlend + 225 * (1 - speedBlend));

            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(fade * 0.35).toFixed(3)})`;
            ctx.lineWidth = p.width * fade;
            ctx.stroke();
          }
        }
      }

      // Update and draw motes
      const moveAngle = Math.atan2(dy, dx);
      const dispersion = Math.min(1, currentSpeed / 5);

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];

        // Orbit rotation
        m.angle += m.speed * (1 - dispersion * 0.6);

        // Breathing radius
        const breathe = Math.sin(time * 0.02 + m.phase) * 4;
        const effectiveRadius = m.radius + breathe;

        // Target position: orbit around cursor, stretched when moving
        let targetX = smoothX + Math.cos(m.angle) * effectiveRadius;
        let targetY = smoothY + Math.sin(m.angle) * effectiveRadius;

        // Disperse backward when moving fast
        if (dispersion > 0.05) {
          const trailDist = (m.radius / 30) * dispersion * 25;
          targetX -= Math.cos(moveAngle) * trailDist;
          targetY -= Math.sin(moveAngle) * trailDist;

          // Perpendicular scatter
          const perp = moveAngle + Math.PI / 2;
          const scatter = Math.sin(time * 0.04 + i * 1.2) * dispersion * 8;
          targetX += Math.cos(perp) * scatter;
          targetY += Math.sin(perp) * scatter;
        }

        // Spring physics
        const spring = 0.04;
        m.vx += (targetX - m.x) * spring;
        m.vy += (targetY - m.y) * spring;
        m.vx *= 0.82;
        m.vy *= 0.82;
        m.x += m.vx;
        m.y += m.vy;

        // Draw mote
        const pulse = 0.85 + Math.sin(time * 0.03 + m.phase) * 0.15;
        const drawSize = m.size * pulse;

        ctx.beginPath();
        ctx.arc(m.x, m.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(225, 225, 225, 0.7)`;
        ctx.fill();

        // Draw faint connection lines between nearby motes
        for (let j = i + 1; j < motes.length; j++) {
          const m2 = motes[j];
          const connDx = m.x - m2.x;
          const connDy = m.y - m2.y;
          const dist = Math.sqrt(connDx * connDx + connDy * connDy);

          if (dist < 40) {
            const connAlpha = (1 - dist / 40) * 0.12;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(m2.x, m2.y);
            ctx.strokeStyle = `rgba(225, 225, 225, ${connAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Soft glow at cursor position
      const glowAlpha = 0.04 + dispersion * 0.03;
      const glowSize = 30 + dispersion * 15;
      const gradient = ctx.createRadialGradient(
        smoothX, smoothY, 0,
        smoothX, smoothY, glowSize
      );
      gradient.addColorStop(0, `rgba(225, 225, 225, ${glowAlpha})`);
      gradient.addColorStop(1, 'rgba(225, 225, 225, 0)');
      ctx.beginPath();
      ctx.arc(smoothX, smoothY, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

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
