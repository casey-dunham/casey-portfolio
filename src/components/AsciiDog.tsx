'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

/*
  Sprite sheet layout (Dogs-Remastered-12, dalmatian):
  Each cell: 64x48px, 8 columns x 9 rows

  Row 0: Idle/stand        (8 frames)
  Row 1: Sit               (8 frames — transition + idle sit)
  Row 2: Lay/sleep         (8 frames)
  Row 3: Run               (8 frames)
  Row 4: Walk              (8 frames)
  Row 5: Walk/trot         (8 frames)
  Row 6: Run fast          (8 frames)
  Row 7: Beg/stand up      (8 frames)
  Row 8: Sleep curled       (4 frames)
*/

const CELL_W = 64;
const CELL_H = 48;
const SCALE = 2.5; // render scale

// Animation definitions: which row, how many frames, frame duration
const ANIMATIONS = {
  walk:      { row: 4, frames: 8, speed: 120 },
  sit:       { row: 1, frames: 8, speed: 150 },
  idle:      { row: 0, frames: 8, speed: 200 },
  beg:       { row: 7, frames: 8, speed: 150 },
  run:       { row: 3, frames: 8, speed: 80 },
  sleep:     { row: 8, frames: 4, speed: 300 },
} as const;

type AnimationName = keyof typeof ANIMATIONS;

// Paw print that fades over time
interface PawPrint {
  x: number;
  y: number;
  opacity: number;
  rotation: number;
  isLeft: boolean;
  createdAt: number;
}

// Dog state machine
type DogPhase = 'walking_up' | 'settling' | 'sitting' | 'idle_sit' | 'head_raise' | 'idle_stand';

interface DogState {
  phase: DogPhase;
  x: number;
  y: number;
  animation: AnimationName;
  frame: number;
  frameTimer: number;
  facingRight: boolean;
  phaseTimer: number;
  settled: boolean;
  // For the walking path
  pathProgress: number; // 0 to 1
}

export default function AsciiDog() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const stateRef = useRef<DogState>({
    phase: 'walking_up',
    x: 0,
    y: 0,
    animation: 'walk',
    frame: 0,
    frameTimer: 0,
    facingRight: false,
    phaseTimer: 0,
    settled: false,
    pathProgress: 0,
  });
  const pawPrintsRef = useRef<PawPrint[]>([]);
  const lastTimeRef = useRef(0);
  const animRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);
  const pawStepRef = useRef(0);

  // Load sprite sheet
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      spriteRef.current = img;
      setLoaded(true);
    };
    img.src = '/sprites/dalmatian-white.png';
  }, []);

  // Define the walk path: starts at bottom-center, walks up with a gentle curve,
  // then settles at the top-right area
  const getPathPoint = useCallback((t: number, w: number, h: number) => {
    // Path goes from bottom center up to top area with a gentle S-curve
    // t: 0 = bottom, 1 = settled position at top

    const startX = w * 0.15;
    const startY = h + 60;
    const endX = w * 0.82;
    const endY = 50;

    if (t <= 0.7) {
      // Main walk up — gentle S curve
      const p = t / 0.7;
      const ease = p * p * (3 - 2 * p); // smoothstep
      const x = startX + (endX - startX) * 0.3 * p + Math.sin(p * Math.PI * 1.5) * w * 0.08;
      const y = startY + (endY - startY) * ease;
      return { x, y, facingRight: true };
    } else {
      // Curve toward final resting spot
      const p = (t - 0.7) / 0.3;
      const ease = p * p * (3 - 2 * p);
      const midX = startX + (endX - startX) * 0.3 + Math.sin(0.7 * Math.PI * 1.5) * w * 0.08;
      const midY = startY + (endY - startY) * (0.7 * 0.7 * (3 - 2 * 0.7));
      const x = midX + (endX - midX) * ease;
      const y = midY + (endY - midY) * ease;
      return { x, y, facingRight: x > midX };
    }
  }, []);

  // Draw a paw print
  const drawPawPrint = useCallback((ctx: CanvasRenderingContext2D, paw: PawPrint) => {
    ctx.save();
    ctx.translate(paw.x, paw.y);
    ctx.rotate(paw.rotation);
    ctx.globalAlpha = paw.opacity;

    const s = 1.8; // scale of paw print

    // Main pad
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.beginPath();
    ctx.ellipse(0, 2 * s, 4 * s, 5 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // Toe beans — 4 small circles
    const toes = [
      { x: -3.5 * s, y: -4 * s },
      { x: -1 * s, y: -6 * s },
      { x: 2 * s, y: -6 * s },
      { x: 4.5 * s, y: -4 * s },
    ];
    for (const toe of toes) {
      ctx.beginPath();
      ctx.ellipse(toe.x, toe.y, 1.8 * s, 2.2 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }, []);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const sprite = spriteRef.current;
    if (!canvas || !sprite) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Delta time
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = Math.min(timestamp - lastTimeRef.current, 50); // cap delta
    lastTimeRef.current = timestamp;

    // Resize canvas
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Crisp pixel rendering
    ctx.imageSmoothingEnabled = false;

    const state = stateRef.current;
    const anim = ANIMATIONS[state.animation];

    // Update frame animation
    state.frameTimer += dt;
    if (state.frameTimer >= anim.speed) {
      state.frameTimer -= anim.speed;
      state.frame = (state.frame + 1) % anim.frames;
    }

    // Phase logic
    state.phaseTimer += dt;

    switch (state.phase) {
      case 'walking_up': {
        // Move along path
        const walkSpeed = 0.00018;
        state.pathProgress = Math.min(1, state.pathProgress + walkSpeed * dt);
        const point = getPathPoint(state.pathProgress, w, h);
        state.x = point.x;
        state.y = point.y;
        state.facingRight = point.facingRight;
        state.animation = 'walk';

        // Add paw prints periodically
        pawStepRef.current += dt;
        if (pawStepRef.current > 280) {
          pawStepRef.current = 0;
          const isLeft = pawPrintsRef.current.length % 2 === 0;
          const offsetX = isLeft ? -8 : 8;
          // Direction of travel for rotation
          const nextT = Math.min(1, state.pathProgress + 0.01);
          const nextPt = getPathPoint(nextT, w, h);
          const angle = Math.atan2(nextPt.y - state.y, nextPt.x - state.x);

          pawPrintsRef.current.push({
            x: state.x + offsetX + Math.cos(angle + Math.PI / 2) * (isLeft ? -6 : 6),
            y: state.y + 30 + Math.sin(angle + Math.PI / 2) * (isLeft ? -6 : 6),
            opacity: 0.6,
            rotation: angle + Math.PI / 2,
            isLeft,
            createdAt: timestamp,
          });
        }

        if (state.pathProgress >= 1) {
          state.phase = 'settling';
          state.phaseTimer = 0;
          state.frame = 0;
          state.animation = 'sit';
        }
        break;
      }

      case 'settling': {
        // Play sit animation once
        state.animation = 'sit';
        state.facingRight = false; // face left toward content
        if (state.phaseTimer > anim.speed * anim.frames) {
          state.phase = 'idle_sit';
          state.phaseTimer = 0;
          state.frame = 0;
        }
        break;
      }

      case 'idle_sit': {
        state.animation = 'sit';
        // Occasionally raise head (beg animation)
        if (state.phaseTimer > 4000 + Math.random() * 3000) {
          state.phase = 'head_raise';
          state.phaseTimer = 0;
          state.frame = 0;
        }
        break;
      }

      case 'head_raise': {
        state.animation = 'beg';
        if (state.phaseTimer > 2500) {
          state.phase = 'idle_sit';
          state.phaseTimer = 0;
          state.frame = 0;
        }
        break;
      }

      default:
        break;
    }

    // Fade paw prints
    const paws = pawPrintsRef.current;
    for (let i = paws.length - 1; i >= 0; i--) {
      const age = timestamp - paws[i].createdAt;
      // Fade over 6 seconds
      paws[i].opacity = Math.max(0, 0.6 * (1 - age / 6000));
      if (paws[i].opacity <= 0) {
        paws.splice(i, 1);
      }
    }

    // Draw paw prints
    for (const paw of paws) {
      drawPawPrint(ctx, paw);
    }

    // Draw dog sprite
    const srcX = state.frame * CELL_W;
    const srcY = anim.row * CELL_H;
    const drawW = CELL_W * SCALE;
    const drawH = CELL_H * SCALE;

    ctx.save();
    ctx.translate(state.x, state.y);
    if (!state.facingRight) {
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      sprite,
      srcX, srcY, CELL_W, CELL_H,
      -drawW / 2, -drawH / 2, drawW, drawH
    );
    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, [getPathPoint, drawPawPrint]);

  useEffect(() => {
    if (!loaded) return;
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [loaded, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
    />
  );
}
