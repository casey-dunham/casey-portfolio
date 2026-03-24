'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  depth: number; // 0..1, affects mouse reactivity
  isSpot: boolean;
  cluster: 0 | 1 | 2; // 0 = main, 1 = bridge, 2 = second cluster
}

// Spatial hash grid for efficient neighbor lookups
class SpatialGrid {
  cellSize: number;
  cells: Map<string, number[]>;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }

  clear() {
    this.cells.clear();
  }

  key(cx: number, cy: number): string {
    return `${cx},${cy}`;
  }

  insert(index: number, x: number, y: number) {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const k = this.key(cx, cy);
    let arr = this.cells.get(k);
    if (!arr) {
      arr = [];
      this.cells.set(k, arr);
    }
    arr.push(index);
  }

  getNeighbors(x: number, y: number): number[] {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const result: number[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const arr = this.cells.get(this.key(cx + dx, cy + dy));
        if (arr) {
          for (let i = 0; i < arr.length; i++) {
            result.push(arr[i]);
          }
        }
      }
    }
    return result;
  }
}

interface DotFieldProps {
  anchorRef?: React.RefObject<HTMLElement | null>;
  mobile?: boolean;
}

export default function DotField({ anchorRef, mobile = false }: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999 });
  const scrollRef = useRef({ velocity: 0, lastY: 0 });
  const dotsRef = useRef<Dot[]>([]);
  const gridRef = useRef(new SpatialGrid(20));
  const animRef = useRef<number>(0);
  const cluster2OpacityRef = useRef(0); // animated 0→1
  const mobileRef = useRef(mobile);
  mobileRef.current = mobile;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const initDots = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;

      const dots: Dot[] = [];

      // Anchor to upper-right corner of the first paragraph, or fallback
      let cx = w * 0.48;
      let cy = h * 0.40;
      const canvasRect = canvas.getBoundingClientRect();
      if (anchorRef?.current) {
        const anchorRect = anchorRef.current.getBoundingClientRect();
        cx = anchorRect.right - canvasRect.left;
        cy = anchorRect.top - canvasRect.top + 20;
      }
      centerRef.current = { x: cx, y: cy };
      const s = Math.min(w, h) * 0.012;

      interface Petal { cx: number; cy: number; r: number }
      const allPetals: Petal[] = [];
      const allCenters: { cx: number; cy: number; r: number }[] = [];

      const addBloom = (
        bx: number, by: number,
        petalCount: number, petalR: number, petalDist: number,
        centerR: number, rotation: number
      ) => {
        allCenters.push({ cx: bx, cy: by, r: centerR });
        for (let i = 0; i < petalCount; i++) {
          const a = rotation + (i / petalCount) * Math.PI * 2;
          allPetals.push({
            cx: bx + Math.cos(a) * petalDist,
            cy: by + Math.sin(a) * petalDist,
            r: petalR,
          });
        }
      };

      // Bloom A — top, large
      addBloom(cx - 2 * s, cy - 4 * s, 5, 4.5 * s, 4 * s, 3 * s, 0.3);
      // Bloom B — right, smaller
      addBloom(cx + 4 * s, cy - 2 * s, 4, 3 * s, 2.8 * s, 2 * s, 0.8);
      // Bloom C — center-bottom, main
      addBloom(cx, cy + 2 * s, 6, 4 * s, 3.5 * s, 2.8 * s, 0.1);
      // Bloom D — lower-right, small
      addBloom(cx + 5 * s, cy + 5 * s, 3, 2.5 * s, 2.2 * s, 1.5 * s, 1.5);
      // Isolated cluster
      allPetals.push({ cx: cx + 10 * s, cy: cy + 1 * s, r: 2.2 * s });
      allPetals.push({ cx: cx + 11 * s, cy: cy + 0 * s, r: 1.4 * s });
      allCenters.push({ cx: cx + 10 * s, cy: cy + 1 * s, r: 1.0 * s });

      const viewportW = window.innerWidth;

      // Track petal count before second cluster for dot classification
      const mainPetalCount = allPetals.length;

      // Second cluster — bottom-right, wide screens only
      if (viewportW >= 1500) {
        const cx2 = w * 0.78;
        const cy2 = h * 0.72;
        const s2 = s * 0.65;

        // Bloom E — main bloom of second cluster
        addBloom(cx2, cy2, 4, 3.5 * s2, 3 * s2, 2 * s2, 0.6);
        // Bloom F — offset companion
        addBloom(cx2 + 5 * s2, cy2 - 3 * s2, 3, 2.5 * s2, 2.2 * s2, 1.5 * s2, 1.2);
        // Small trailing pocket
        allPetals.push({ cx: cx2 + 8 * s2, cy: cy2 + 2 * s2, r: 1.8 * s2 });
        allPetals.push({ cx: cx2 - 4 * s2, cy: cy2 + 4 * s2, r: 1.5 * s2 });
        allCenters.push({ cx: cx2 + 1 * s2, cy: cy2 - 1 * s2, r: 1.2 * s2 });
        allCenters.push({ cx: cx2 + 5 * s2, cy: cy2 - 2 * s2, r: 1.0 * s2 });
      }

      // Center voids
      const extraVoids = [
        { cx: cx - 1 * s, cy: cy - 2 * s, r: 1.8 * s },
        { cx: cx + 3 * s, cy: cy - 3.5 * s, r: 1.4 * s },
        { cx: cx - 3 * s, cy: cy + 0.5 * s, r: 1.5 * s },
        { cx: cx + 1 * s, cy: cy + 4 * s, r: 1.6 * s },
        { cx: cx + 5 * s, cy: cy + 1 * s, r: 1.3 * s },
        { cx: cx - 4 * s, cy: cy - 3 * s, r: 1.2 * s },
        { cx: cx + 2 * s, cy: cy + 0 * s, r: 1.1 * s },
        { cx: cx + 4 * s, cy: cy + 4 * s, r: 1.0 * s },
        { cx: cx - 2 * s, cy: cy + 4 * s, r: 1.3 * s },
        { cx: cx + 1 * s, cy: cy - 5 * s, r: 1.1 * s },
        { cx: cx + 6 * s, cy: cy - 1 * s, r: 1.4 * s },
        { cx: cx - 1 * s, cy: cy + 1.5 * s, r: 1.2 * s },
      ];
      for (const v of extraVoids) {
        allCenters.push(v);
      }

      // Noise for edge variation
      const edgeNoise = (angle: number) => {
        const n1 = Math.sin(angle * 4.3 + 1.1) * 0.35;
        const n2 = Math.sin(angle * 9.7 + 3.3) * 0.18;
        const n3 = Math.sin(angle * 19.1 + 0.7) * 0.09;
        return n1 + n2 + n3;
      };

      // Bounding box for rejection sampling (wide enough for all clusters)
      const margin = 8 * s;
      let minX = cx - 12 * s - margin;
      let maxX = cx + 14 * s + margin;
      let minY = cy - 12 * s - margin;
      let maxY = cy + 12 * s + margin;

      // Expand bounding box if second cluster is present
      if (viewportW >= 1500) {
        const cx2 = w * 0.78;
        const cy2 = h * 0.72;
        const s2 = s * 0.65;
        maxX = Math.max(maxX, cx2 + 12 * s2 + margin);
        maxY = Math.max(maxY, cy2 + 8 * s2 + margin);
        minX = Math.min(minX, cx2 - 8 * s2 - margin);
        minY = Math.min(minY, cy2 - 8 * s2 - margin);
      }

      const baseCount = mobileRef.current ? 1200 : 7000;
      const count = viewportW >= 1500 ? baseCount + 2000 : baseCount;
      let placed = 0;
      let attempts = 0;

      while (placed < count && attempts < count * 12) {
        attempts++;
        const px = minX + Math.random() * (maxX - minX);
        const py = minY + Math.random() * (maxY - minY);

        let inPetal = false;
        let nearPetal = false;
        let petalDepth = 0;
        let minEdgeDist = Infinity;
        let minOuterDist = Infinity;
        for (const p of allPetals) {
          const dx = px - p.cx;
          const dy = py - p.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Vary the effective radius with noise for irregular edges
          const angle = Math.atan2(dy, dx);
          const noiseOffset = edgeNoise(angle) * p.r;
          const effectiveR = p.r + noiseOffset;
          if (dist < effectiveR) {
            inPetal = true;
            petalDepth++;
            const edgeDist = effectiveR - dist;
            if (edgeDist < minEdgeDist) minEdgeDist = edgeDist;
          } else {
            const outerDist = dist - effectiveR;
            // Vary spray reach — some areas spray further
            const sprayReach = p.r * (0.1 + Math.abs(edgeNoise(angle + 1.0)) * 1.2);
            if (outerDist < sprayReach) {
              nearPetal = true;
              if (outerDist < minOuterDist) minOuterDist = outerDist;
            }
          }
        }

        let inCenter = false;
        let centerDepth = 0;
        for (const c of allCenters) {
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

        // Spatial noise field — density varies in patches, not just by angle
        const globalAngle = Math.atan2(py - cy, px - cx);
        const distFromCenter = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
        // Low-freq patches: big dense vs sparse regions
        const patch1 = Math.sin(px * 0.04 + py * 0.03 + 1.7) * 0.5 + 0.5;
        const patch2 = Math.sin(px * 0.07 - py * 0.05 + 3.2) * 0.5 + 0.5;
        // Angular variation
        const clump1 = Math.sin(globalAngle * 3.7 + 2.1) * 0.5 + 0.5;
        const clump2 = Math.sin(globalAngle * 8.9 + 0.4) * 0.5 + 0.5;
        // Radial variation
        const radial = Math.sin(distFromCenter * 0.06 + globalAngle * 1.5) * 0.5 + 0.5;
        const clumpFactor = 0.1 + 0.9 * (patch1 * 0.3 + clump1 * 0.25 + clump2 * 0.15 + patch2 * 0.15 + radial * 0.15);

        if (inPetal) {
          if (inCenter) {
            density = 0.02 + (1 - centerDepth) * 0.06;
          } else if (petalDepth >= 3) {
            density = 1.0 * clumpFactor;
          } else if (petalDepth >= 2) {
            density = 0.9 * clumpFactor;
          } else {
            const edgeNorm = Math.min(minEdgeDist / (s * 2.5), 1);
            if (edgeNorm > 0.3) {
              density = 0.95 * clumpFactor;
            } else if (edgeNorm > 0.1) {
              const t = (edgeNorm - 0.1) / 0.2;
              density = (0.2 + t * 0.75) * clumpFactor;
            } else {
              density = edgeNorm * 2.0 * clumpFactor;
            }
          }
        } else if (nearPetal) {
          // Varied spray — some directions spray dense clumps, others almost nothing
          const sprayVariation = 0.2 + Math.abs(edgeNoise(globalAngle * 2.0)) * 3.5;
          const sprayR = allPetals.reduce((max, p) => Math.max(max, p.r * 0.6), 0);
          const sprayNorm = Math.min(minOuterDist / sprayR, 1);
          density = 0.22 * sprayVariation * (1 - sprayNorm) * (1 - sprayNorm) * clumpFactor;
        }

        if (density <= 0 || Math.random() > density) continue;

        // Spatially-varied jitter: tight clusters vs loose scattered zones
        const jitterZone = Math.sin(globalAngle * 5.3 + 1.7) * 0.5 + 0.5;
        const looseness = Math.sin(globalAngle * 2.9 + 4.3) * 0.5 + 0.5;
        const tightness = 1 - looseness;
        const baseJitter = inCenter ? 0.8 : (0.8 + jitterZone * 3.0 + looseness * 5.0);
        const gx = px + (Math.random() - 0.5) * baseJitter;
        const gy = py + (Math.random() - 0.5) * baseJitter;

        // Scattered initial offset — some dots float way out
        const scatterChance = nearPetal ? 0.5 : (0.1 + looseness * 0.25);
        const scatter = Math.random() < scatterChance
          ? 4 + Math.random() * 10
          : (Math.random() - 0.5) * 2.0;
        const scatterAngle = Math.random() * Math.PI * 2;

        // Classify: check if this dot was placed by a second-cluster petal
        let dotCluster: 0 | 1 | 2 = 0;
        if (viewportW >= 1500) {
          // Check if nearest petal is from the second cluster
          let nearestPetalIdx = 0;
          let nearestDist = Infinity;
          for (let pi = 0; pi < allPetals.length; pi++) {
            const p = allPetals[pi];
            const ddx = px - p.cx;
            const ddy = py - p.cy;
            const d = ddx * ddx + ddy * ddy;
            if (d < nearestDist) {
              nearestDist = d;
              nearestPetalIdx = pi;
            }
          }
          if (nearestPetalIdx >= mainPetalCount) dotCluster = 2;
        }

        dots.push({
          x: gx + Math.cos(scatterAngle) * scatter,
          y: gy + Math.sin(scatterAngle) * scatter,
          baseX: gx, baseY: gy,
          radius: 0.85,
          vx: (Math.random() - 0.5) * 2.0,
          vy: (Math.random() - 0.5) * 2.0,
          opacity: 1,
          depth: Math.random(),
          isSpot: false,
          cluster: dotCluster,
        });
        placed++;
      }

      dotsRef.current = dots;
    };

    initDots();

    const handleResize = () => initDots();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const m = mouseRef.current;
      m.prevX = m.x;
      m.prevY = m.y;
      m.x = e.clientX - rect.left;
      m.y = e.clientY - rect.top;
    };

    const handleScroll = () => {
      const y = window.scrollY;
      const sc = scrollRef.current;
      sc.velocity = y - sc.lastY;
      sc.lastY = y;
    };

    let lastDrawTime = 0;
    const targetInterval = mobileRef.current ? 33 : 16; // 30fps mobile, 60fps desktop

    const draw = (now: number = 0) => {
      // Throttle frame rate on mobile
      if (now - lastDrawTime < targetInterval) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      lastDrawTime = now;

      // Smoothly animate second cluster opacity based on viewport width
      const hasCluster2 = window.innerWidth >= 1500;
      const target = hasCluster2 ? 1 : 0;
      const c2o = cluster2OpacityRef.current;
      cluster2OpacityRef.current += (target - c2o) * 0.04; // smooth ease

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dots = dotsRef.current;
      const grid = gridRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseRadius = 80;

      // Build spatial grid (only needed for dot-dot repulsion on desktop)
      if (!mobileRef.current) {
        grid.clear();
        for (let i = 0; i < dots.length; i++) {
          grid.insert(i, dots[i].x, dots[i].y);
        }
      }

      // Physics
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Mouse repulsion — explosive scatter
        const dmx = dot.x - mx;
        const dmy = dot.y - my;
        const mDist = Math.sqrt(dmx * dmx + dmy * dmy);

        if (mDist < mouseRadius && mDist > 0.1) {
          const force = ((1 - mDist / mouseRadius) ** 1.5) * 6.5;
          dot.vx += (dmx / mDist) * force;
          dot.vy += (dmy / mDist) * force;
        }

        // Scroll disturbance — noticeable jiggle
        const scrollVel = scrollRef.current.velocity;
        if (Math.abs(scrollVel) > 0.5) {
          const jiggle = Math.min(Math.abs(scrollVel) * 0.08, 2.5);
          dot.vx += (Math.random() - 0.5) * jiggle;
          dot.vy += (Math.random() - 0.5) * jiggle;
        }

        // Dot-dot repulsion (neighbors only via spatial hash) — skip on mobile
        if (!mobileRef.current) {
          const neighbors = grid.getNeighbors(dot.x, dot.y);
          for (let n = 0; n < neighbors.length; n++) {
            const j = neighbors[n];
            if (j <= i) continue;

            const other = dots[j];
            const ddx = dot.x - other.x;
            const ddy = dot.y - other.y;
            const dDist = Math.sqrt(ddx * ddx + ddy * ddy);
            const minDist = dot.radius + other.radius + 2.5; // repulsion range

            if (dDist < minDist && dDist > 0.01) {
              const overlap = (minDist - dDist) / minDist;
              const force = overlap * 1.2;
              const nx = ddx / dDist;
              const ny = ddy / dDist;
              dot.vx += nx * force;
              dot.vy += ny * force;
              other.vx -= nx * force;
              other.vy -= ny * force;
            }
          }
        }


        // Spring back to home
        const hx = dot.baseX - dot.x;
        const hy = dot.baseY - dot.y;
        const homeDist = Math.sqrt(hx * hx + hy * hy);
        // Gentle pull, stronger when far away
        const springForce = 0.02 + homeDist * 0.0001;
        dot.vx += hx * springForce;
        dot.vy += hy * springForce;

        // Damping
        dot.vx *= 0.92;
        dot.vy *= 0.92;

        // Integrate
        dot.x += dot.vx;
        dot.y += dot.vy;
      }

      // Decay scroll velocity
      scrollRef.current.velocity *= 0.85;

      // Render dots — orb gradient + glow white near mouse
      // Pre-compute colors once per dot during init (cached), then just fillRect
      const glowRadius = 120;
      const { x: shapeX, y: shapeY } = centerRef.current;
      const colCenter_r = 155, colCenter_g = 170, colCenter_b = 255;
      const colLav_r = 200, colLav_g = 192, colLav_b = 252;
      const colPink_r = 235, colPink_g = 195, colPink_b = 230;

      const mouseActive = mx > -1000 && my > -1000;
      const dotSize = 1.7; // diameter for fillRect (faster than arc)

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dx = dot.baseX - shapeX;
        const dy = dot.baseY - shapeY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        const radialT = Math.min(dist * 0.008, 1);
        const angularT = Math.sin(angle - 0.8) * 0.5 + 0.5;

        const edgeR = colLav_r + (colPink_r - colLav_r) * angularT;
        const edgeG = colLav_g + (colPink_g - colLav_g) * angularT;
        const edgeB = colLav_b + (colPink_b - colLav_b) * angularT;

        let r = colCenter_r + (edgeR - colCenter_r) * radialT;
        let g = colCenter_g + (edgeG - colCenter_g) * radialT;
        let b = colCenter_b + (edgeB - colCenter_b) * radialT;

        if (mouseActive) {
          const dmx = dot.x - mx;
          const dmy = dot.y - my;
          const mDist = Math.sqrt(dmx * dmx + dmy * dmy);
          if (mDist < glowRadius) {
            const glow = 1 - mDist / glowRadius;
            r += (255 - r) * glow;
            g += (255 - g) * glow;
            b += (255 - b) * glow;
          }
        }

        // Apply dissolve for second cluster dots
        const alpha = dot.cluster === 2 ? cluster2OpacityRef.current : 1;
        if (alpha < 0.01) continue; // skip invisible dots

        if (alpha < 0.99) {
          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
        } else {
          ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        }
        ctx.fillRect(dot.x - 0.85, dot.y - 0.85, dotSize, dotSize);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 h-full"
      style={{
        zIndex: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw',
      }}
    />
  );
}
