'use client';

import { useEffect, useRef } from 'react';

interface Petal { cx: number; cy: number; r: number }
interface Center { cx: number; cy: number; r: number }

function renderVariant(
  canvas: HTMLCanvasElement,
  petals: Petal[],
  centers: Center[],
  edgeNoiseFn: (angle: number) => number,
  dotCount: number,
  label: string,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#181818';
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.5;

  // Bounding box
  let bMinX = Infinity, bMinY = Infinity, bMaxX = -Infinity, bMaxY = -Infinity;
  for (const p of petals) {
    bMinX = Math.min(bMinX, p.cx - p.r * 1.5);
    bMinY = Math.min(bMinY, p.cy - p.r * 1.5);
    bMaxX = Math.max(bMaxX, p.cx + p.r * 1.5);
    bMaxY = Math.max(bMaxY, p.cy + p.r * 1.5);
  }

  let placed = 0;
  let attempts = 0;

  ctx.fillStyle = 'rgba(230, 230, 235, 1)';
  ctx.beginPath();

  while (placed < dotCount && attempts < dotCount * 12) {
    attempts++;
    const px = bMinX + Math.random() * (bMaxX - bMinX);
    const py = bMinY + Math.random() * (bMaxY - bMinY);

    let inPetal = false;
    let nearPetal = false;
    let petalDepth = 0;
    let minEdgeDist = Infinity;
    let minOuterDist = Infinity;

    for (const p of petals) {
      const dx = px - p.cx;
      const dy = py - p.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const noiseOffset = edgeNoiseFn(angle) * p.r;
      const effectiveR = p.r + noiseOffset;
      if (dist < effectiveR) {
        inPetal = true;
        petalDepth++;
        const edgeDist = effectiveR - dist;
        if (edgeDist < minEdgeDist) minEdgeDist = edgeDist;
      } else {
        const outerDist = dist - effectiveR;
        const sprayReach = p.r * (0.15 + Math.abs(edgeNoiseFn(angle + 1.0)) * 0.6);
        if (outerDist < sprayReach) {
          nearPetal = true;
          if (outerDist < minOuterDist) minOuterDist = outerDist;
        }
      }
    }

    let inCenter = false;
    let centerDepth = 0;
    for (const c of centers) {
      const dx = px - c.cx;
      const dy = py - c.cy;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < c.r * c.r) {
        inCenter = true;
        centerDepth = Math.max(centerDepth, 1 - Math.sqrt(dist2) / c.r);
      }
    }

    if (!inPetal && !nearPetal) continue;

    let density = 0;
    const s = Math.min(w, h) * 0.012;

    if (inPetal) {
      if (inCenter) {
        density = 0.02 + (1 - centerDepth) * 0.06;
      } else if (petalDepth >= 3) {
        density = 1.0;
      } else if (petalDepth >= 2) {
        density = 0.95;
      } else {
        const edgeNorm = Math.min(minEdgeDist / (s * 2.5), 1);
        if (edgeNorm > 0.3) density = 0.97;
        else if (edgeNorm > 0.1) density = 0.25 + ((edgeNorm - 0.1) / 0.2) * 0.72;
        else density = edgeNorm * 2.5;
      }
    } else if (nearPetal) {
      const angle = Math.atan2(py - cy, px - cx);
      const sprayVar = 0.5 + Math.abs(edgeNoiseFn(angle * 2.0)) * 2.0;
      const sprayR = petals.reduce((max, p) => Math.max(max, p.r * 0.35), 0);
      const sprayNorm = Math.min(minOuterDist / sprayR, 1);
      density = 0.15 * sprayVar * (1 - sprayNorm) * (1 - sprayNorm);
    }

    if (density <= 0 || Math.random() > density) continue;

    const jitter = inCenter ? 0.8 : 1.2;
    const gx = px + (Math.random() - 0.5) * jitter;
    const gy = py + (Math.random() - 0.5) * jitter;

    ctx.moveTo(gx + 0.85, gy);
    ctx.arc(gx, gy, 0.85, 0, Math.PI * 2);
    placed++;
  }

  ctx.fill();

  // Label
  ctx.fillStyle = '#9CA5FF';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(label, 12, 28);
}

function addBloom(
  petals: Petal[], centers: Center[],
  bx: number, by: number,
  petalCount: number, petalR: number, petalDist: number,
  centerR: number, rotation: number
) {
  centers.push({ cx: bx, cy: by, r: centerR });
  for (let i = 0; i < petalCount; i++) {
    const a = rotation + (i / petalCount) * Math.PI * 2;
    petals.push({
      cx: bx + Math.cos(a) * petalDist,
      cy: by + Math.sin(a) * petalDist,
      r: petalR,
    });
  }
}

export default function TestDots() {
  const canvasRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];

  useEffect(() => {
    const w = 500;
    const h = 500;
    const cx = w * 0.5;
    const cy = h * 0.5;
    const s = Math.min(w, h) * 0.012;

    // === VARIANT A: Baseplate + bigger noise, one extra protrusion ===
    {
      const petals: Petal[] = [];
      const centers: Center[] = [];
      addBloom(petals, centers, cx - 3*s, cy - 4.5*s, 5, 3.8*s, 3.5*s, 2.5*s, 0.4);
      addBloom(petals, centers, cx + 3.5*s, cy - 3*s, 5, 4.0*s, 3.8*s, 2.8*s, 0.9);
      addBloom(petals, centers, cx - 0.5*s, cy + 1*s, 6, 4.2*s, 3.8*s, 3.0*s, 0.2);
      addBloom(petals, centers, cx + 5*s, cy + 4.5*s, 5, 3.2*s, 3.0*s, 2.0*s, 1.3);
      // Extra protrusion top-right
      petals.push({ cx: cx + 7*s, cy: cy - 5*s, r: 2.2*s });
      petals.push({ cx: cx + 8*s, cy: cy - 6*s, r: 1.5*s });
      // Voids (base + extra)
      const voids = [
        {cx:cx+1*s,cy:cy-6*s,r:1.6*s},{cx:cx-4.5*s,cy:cy-1.5*s,r:1.5*s},
        {cx:cx+5*s,cy:cy-0.5*s,r:1.7*s},{cx:cx+1.5*s,cy:cy+3.5*s,r:1.5*s},
        {cx:cx-2*s,cy:cy+5*s,r:1.3*s},{cx:cx-1*s,cy:cy-2*s,r:1.4*s},
        {cx:cx+3*s,cy:cy+1.5*s,r:1.3*s},{cx:cx+2*s,cy:cy-1*s,r:1.5*s},
        {cx:cx-1.5*s,cy:cy+3*s,r:1.6*s},{cx:cx+4.5*s,cy:cy-3.5*s,r:1.3*s},
        {cx:cx-3.5*s,cy:cy-3.5*s,r:1.2*s},{cx:cx+1*s,cy:cy+0.5*s,r:1.0*s},
        // bigger noise voids
        {cx:cx+6*s,cy:cy+5*s,r:1.8*s},{cx:cx-3*s,cy:cy+2.5*s,r:1.5*s},
      ];
      centers.push(...voids);
      const noise = (a: number) => Math.sin(a*3.1+0.5)*0.45 + Math.sin(a*11.3+2.7)*0.2 + Math.sin(a*21.7+4.1)*0.1;
      if (canvasRefs[0].current) renderVariant(canvasRefs[0].current, petals, centers, noise, 5000, 'A — Big noise + protrusion');
    }

    // === VARIANT B: Asymmetric blooms, varied sizes, isolated cluster ===
    {
      const petals: Petal[] = [];
      const centers: Center[] = [];
      addBloom(petals, centers, cx - 2*s, cy - 4*s, 5, 4.5*s, 4*s, 3*s, 0.3);
      addBloom(petals, centers, cx + 4*s, cy - 2*s, 4, 3*s, 2.8*s, 2*s, 0.8);
      addBloom(petals, centers, cx, cy + 2*s, 6, 4*s, 3.5*s, 2.8*s, 0.1);
      addBloom(petals, centers, cx + 5*s, cy + 5*s, 3, 2.5*s, 2.2*s, 1.5*s, 1.5);
      // Isolated cluster
      petals.push({ cx: cx + 10*s, cy: cy + 1*s, r: 2.2*s });
      petals.push({ cx: cx + 11*s, cy: cy + 0*s, r: 1.4*s });
      centers.push({ cx: cx + 10*s, cy: cy + 1*s, r: 1.0*s });
      // Voids
      const voids = [
        {cx:cx-1*s,cy:cy-2*s,r:1.8*s},{cx:cx+3*s,cy:cy-3.5*s,r:1.4*s},
        {cx:cx-3*s,cy:cy+0.5*s,r:1.5*s},{cx:cx+1*s,cy:cy+4*s,r:1.6*s},
        {cx:cx+5*s,cy:cy+1*s,r:1.3*s},{cx:cx-4*s,cy:cy-3*s,r:1.2*s},
        {cx:cx+2*s,cy:cy+0*s,r:1.1*s},{cx:cx+4*s,cy:cy+4*s,r:1.0*s},
        {cx:cx-2*s,cy:cy+4*s,r:1.3*s},{cx:cx+1*s,cy:cy-5*s,r:1.1*s},
        {cx:cx+6*s,cy:cy-1*s,r:1.4*s},{cx:cx-1*s,cy:cy+1.5*s,r:1.2*s},
      ];
      centers.push(...voids);
      const noise = (a: number) => Math.sin(a*4.3+1.1)*0.35 + Math.sin(a*9.7+3.3)*0.18 + Math.sin(a*19.1+0.7)*0.09;
      if (canvasRefs[1].current) renderVariant(canvasRefs[1].current, petals, centers, noise, 5000, 'B — Asymmetric + isolated');
    }

    // === VARIANT C: Tentacle-like extensions, dramatic voids ===
    {
      const petals: Petal[] = [];
      const centers: Center[] = [];
      addBloom(petals, centers, cx - 1*s, cy - 2*s, 5, 4*s, 3.5*s, 2.8*s, 0.2);
      addBloom(petals, centers, cx + 3*s, cy + 2*s, 5, 3.5*s, 3.2*s, 2.2*s, 1.0);
      addBloom(petals, centers, cx - 3*s, cy + 3*s, 4, 3.2*s, 2.8*s, 2.0*s, 0.6);
      // Tentacle extensions — chains of small circles reaching outward
      // Top tentacle
      petals.push({ cx: cx + 1*s, cy: cy - 7*s, r: 2.5*s });
      petals.push({ cx: cx + 0.5*s, cy: cy - 9.5*s, r: 1.8*s });
      petals.push({ cx: cx + 0*s, cy: cy - 11.5*s, r: 1.2*s });
      // Right tentacle
      petals.push({ cx: cx + 7*s, cy: cy + 0*s, r: 2.0*s });
      petals.push({ cx: cx + 9*s, cy: cy - 0.5*s, r: 1.4*s });
      // Bottom-left drip
      petals.push({ cx: cx - 4*s, cy: cy + 6*s, r: 1.8*s });
      petals.push({ cx: cx - 4.5*s, cy: cy + 8*s, r: 1.2*s });
      // Big dramatic voids
      const voids = [
        {cx:cx,cy:cy,r:2.5*s},{cx:cx+2*s,cy:cy-3*s,r:2.0*s},
        {cx:cx-2*s,cy:cy+1*s,r:1.8*s},{cx:cx+4*s,cy:cy+0*s,r:1.5*s},
        {cx:cx-1*s,cy:cy-5*s,r:1.3*s},{cx:cx+1*s,cy:cy+3*s,r:1.6*s},
        {cx:cx+3*s,cy:cy+3.5*s,r:1.2*s},{cx:cx-3*s,cy:cy-1*s,r:1.4*s},
        {cx:cx+5*s,cy:cy+2*s,r:1.0*s},{cx:cx+0.5*s,cy:cy-8*s,r:0.9*s},
      ];
      centers.push(...voids);
      const noise = (a: number) => Math.sin(a*6.1+2.2)*0.3 + Math.sin(a*14.7+5.1)*0.15 + Math.sin(a*28.3+1.3)*0.07;
      if (canvasRefs[2].current) renderVariant(canvasRefs[2].current, petals, centers, noise, 5000, 'C — Tentacles + big voids');
    }

    // === VARIANT D: Dense core, scattered outlier clusters, many small voids ===
    {
      const petals: Petal[] = [];
      const centers: Center[] = [];
      addBloom(petals, centers, cx, cy, 6, 4.5*s, 4*s, 3.2*s, 0.15);
      addBloom(petals, centers, cx - 3*s, cy - 3*s, 4, 3.5*s, 3*s, 2.2*s, 0.5);
      addBloom(petals, centers, cx + 3.5*s, cy - 3.5*s, 4, 3*s, 2.8*s, 2.0*s, 0.9);
      addBloom(petals, centers, cx + 2*s, cy + 4*s, 5, 3.8*s, 3.2*s, 2.5*s, 1.2);
      // Scattered outlier clusters
      petals.push({ cx: cx - 8*s, cy: cy - 4*s, r: 1.8*s });
      centers.push({ cx: cx - 8*s, cy: cy - 4*s, r: 0.8*s });
      petals.push({ cx: cx + 9*s, cy: cy + 3*s, r: 2.0*s });
      petals.push({ cx: cx + 10*s, cy: cy + 2*s, r: 1.3*s });
      centers.push({ cx: cx + 9*s, cy: cy + 3*s, r: 0.9*s });
      petals.push({ cx: cx - 2*s, cy: cy + 9*s, r: 1.5*s });
      // Many small voids for swiss-cheese effect
      const voids = [
        {cx:cx+1*s,cy:cy-1*s,r:1.6*s},{cx:cx-1.5*s,cy:cy+1.5*s,r:1.4*s},
        {cx:cx+3*s,cy:cy+1*s,r:1.2*s},{cx:cx-2*s,cy:cy-2*s,r:1.3*s},
        {cx:cx+1*s,cy:cy+3*s,r:1.1*s},{cx:cx+4*s,cy:cy-2*s,r:1.0*s},
        {cx:cx-3.5*s,cy:cy+0*s,r:1.1*s},{cx:cx+0*s,cy:cy-4.5*s,r:1.0*s},
        {cx:cx+2*s,cy:cy+5.5*s,r:1.3*s},{cx:cx-1*s,cy:cy+5*s,r:0.9*s},
        {cx:cx+5*s,cy:cy+3*s,r:1.2*s},{cx:cx-4*s,cy:cy-4*s,r:1.0*s},
        {cx:cx+3*s,cy:cy-4.5*s,r:0.8*s},{cx:cx-2.5*s,cy:cy+3.5*s,r:1.1*s},
        {cx:cx+5*s,cy:cy-1*s,r:1.3*s},{cx:cx-0.5*s,cy:cy-3*s,r:1.2*s},
      ];
      centers.push(...voids);
      const noise = (a: number) => Math.sin(a*5.3+0.9)*0.25 + Math.sin(a*12.1+3.8)*0.15 + Math.sin(a*25.7+2.4)*0.1;
      if (canvasRefs[3].current) renderVariant(canvasRefs[3].current, petals, centers, noise, 5000, 'D — Dense + scattered + swiss cheese');
    }
  }, []);

  return (
    <div style={{ background: '#181818', minHeight: '100vh', padding: 20 }}>
      <h1 style={{ color: '#fff', fontFamily: 'sans-serif', marginBottom: 20, fontSize: 24 }}>
        Pick what you like from each:
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {canvasRefs.map((ref, i) => (
          <canvas
            key={i}
            ref={ref}
            style={{ width: 500, height: 500, borderRadius: 8, border: '1px solid #333' }}
          />
        ))}
      </div>
    </div>
  );
}
