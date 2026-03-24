'use client';

import { useEffect, useRef, useCallback } from 'react';

// Muybridge-inspired ASCII horse gallop frames
// Each frame is an array of strings (rows)
const HORSE_FRAMES = [
  // Frame 1: legs extended, full gallop
  [
    "          .=*#%,          ",
    "        .*%@@@@#=         ",
    "       ,#@@@@@@@@*.       ",
    "   .,-*%@@@@@@@@@@#=      ",
    " ,=#@@@@@@@@@@@@@@@@*     ",
    "*@@@@@@@@@@@@@@@@@@@@#.   ",
    "@@@@@@@@@@@@@@@@@@@@@@*   ",
    "#@@@@@@@@@@@@@@@@@@@@%,   ",
    " *@@@@@@@@@@@@@@@@@#=     ",
    "  .=#@@@@@@@@@@@@*,       ",
    "    .*@@#. .*@@%.         ",
    "   .#@@=    .*@@#,        ",
    "  =%@*.      .=@@#.       ",
    " *@#,          ,%@*.      ",
    "=#=              =%=      ",
    "*,                ,*      ",
  ],
  // Frame 2: legs coming together
  [
    "           =*#%,          ",
    "         .*@@@@#=         ",
    "        =#@@@@@@%*        ",
    "    .,=*%@@@@@@@@@@=      ",
    "  ,=#@@@@@@@@@@@@@@%*     ",
    " *@@@@@@@@@@@@@@@@@@#.    ",
    "*@@@@@@@@@@@@@@@@@@@@@,   ",
    "#@@@@@@@@@@@@@@@@@@@@%    ",
    " *@@@@@@@@@@@@@@@@@#,     ",
    "  .=#@@@@@@@@@@@@*,       ",
    "    .*@@%, =%@@#.         ",
    "     *@@=  .#@@=          ",
    "     ,#%    ,#@*          ",
    "      *=     =%,          ",
    "                          ",
    "                          ",
  ],
  // Frame 3: suspension phase, legs tucked
  [
    "          .=*#%,          ",
    "        ,*%@@@@#=         ",
    "       =#@@@@@@@%*        ",
    "   .,=*@@@@@@@@@@@=       ",
    " ,=#@@@@@@@@@@@@@@@*.     ",
    "*@@@@@@@@@@@@@@@@@@@#.    ",
    "@@@@@@@@@@@@@@@@@@@@%,    ",
    "#@@@@@@@@@@@@@@@@@#=      ",
    " =#@@@@@@@@@@@@%*,        ",
    "   ,%@@@@@@@@#=           ",
    "     .*%@@%*.             ",
    "      ,#@@#,              ",
    "       =%@=               ",
    "                          ",
    "                          ",
    "                          ",
  ],
  // Frame 4: front legs reaching forward
  [
    "           =*#%,          ",
    "         ,*@@@@#=         ",
    "        =#@@@@@@@*.       ",
    "    .,=#@@@@@@@@@@@=      ",
    "  ,*%@@@@@@@@@@@@@@@*     ",
    " *@@@@@@@@@@@@@@@@@@@#.   ",
    "#@@@@@@@@@@@@@@@@@@@@%,   ",
    "@@@@@@@@@@@@@@@@@@@#=     ",
    " =#@@@@@@@@@@@@@%*        ",
    "   ,*@@@@@@@@#=           ",
    "    .#@@= =%@%,           ",
    "   =#@@,   ,#@@=          ",
    "  *@@=      .=%@#.        ",
    " =%*          .*@*.       ",
    "=#,             =%=       ",
    "*                 *       ",
  ],
  // Frame 5: transition
  [
    "          .=*#%,          ",
    "        ,*%@@@@#=         ",
    "       =#@@@@@@@%*        ",
    "   .,=#@@@@@@@@@@@@,      ",
    " ,*%@@@@@@@@@@@@@@@@=     ",
    "*@@@@@@@@@@@@@@@@@@@@*.   ",
    "#@@@@@@@@@@@@@@@@@@@@#    ",
    " %@@@@@@@@@@@@@@@@@@%,    ",
    "  =#@@@@@@@@@@@@@@#=      ",
    "    ,%@@@@@@@@@@*,        ",
    "     *@@#, =%@@=          ",
    "     *@@=  ,#@@,          ",
    "     *@*    *@#           ",
    "     =#      %=           ",
    "                          ",
    "                          ",
  ],
];

// Characters used for rendering, sorted by visual density
const DENSITY_CHARS = ' .,:;=+*#%@';

interface AsciiHorseProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export default function AsciiHorse({ containerRef }: AsciiHorseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const angleRef = useRef(0);
  const frameIndexRef = useRef(0);
  const frameTickRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas to container
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    // Ellipse parameters — orbit around the hero content
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radiusX = rect.width * 0.46;
    const radiusY = rect.height * 0.42;

    // Current angle
    const angle = angleRef.current;

    // Horse position on ellipse
    const x = centerX + Math.cos(angle) * radiusX;
    const y = centerY + Math.sin(angle) * radiusY;

    // Direction: flip horse when going left
    const goingRight = -Math.sin(angle) * radiusX > 0 ? false : true;

    // Advance gallop frame
    frameTickRef.current++;
    if (frameTickRef.current % 6 === 0) {
      frameIndexRef.current = (frameIndexRef.current + 1) % HORSE_FRAMES.length;
    }

    const frame = HORSE_FRAMES[frameIndexRef.current];

    // Font setup
    const fontSize = Math.max(8, Math.min(11, rect.width / 120));
    ctx.font = `${fontSize}px "Menlo", "Monaco", "Courier New", monospace`;
    ctx.textBaseline = 'top';

    const charW = fontSize * 0.6;
    const charH = fontSize * 1.1;
    const horseW = frame[0].length * charW;
    const horseH = frame.length * charH;

    // Depth effect: scale and opacity based on Y position (top = far, bottom = near)
    const depthFactor = 0.6 + 0.4 * ((y - (centerY - radiusY)) / (2 * radiusY));
    const scale = 0.7 + depthFactor * 0.5;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(goingRight ? scale : -scale, scale);
    ctx.translate(-horseW / 2, -horseH / 2);

    // Draw each character
    for (let row = 0; row < frame.length; row++) {
      const line = frame[row];
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        if (ch === ' ') continue;

        // Density-based opacity
        const densityIdx = DENSITY_CHARS.indexOf(ch);
        const density = densityIdx >= 0 ? densityIdx / (DENSITY_CHARS.length - 1) : 0.5;

        // Randomize the actual character drawn for that glitchy tech look
        const rand = Math.random();
        let drawChar: string;
        if (density > 0.7) {
          drawChar = '#@%&$XW8'[Math.floor(rand * 8)];
        } else if (density > 0.4) {
          drawChar = '*+=<>{}[]'[Math.floor(rand * 9)];
        } else {
          drawChar = '.,:;-~'[Math.floor(rand * 6)];
        }

        // Color: light on dark theme, with slight variation
        const base = Math.floor(120 + density * 135);
        const r = Math.min(255, base + Math.floor(Math.random() * 20 - 10));
        const g = Math.min(255, base + Math.floor(Math.random() * 15 - 8));
        const b = Math.min(255, base + Math.floor(Math.random() * 25 - 5));
        const alpha = 0.5 + density * 0.5;

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fillText(drawChar, col * charW, row * charH);
      }
    }

    ctx.restore();

    // Advance orbit
    angleRef.current += 0.008;
    if (angleRef.current > Math.PI * 2) angleRef.current -= Math.PI * 2;

    animRef.current = requestAnimationFrame(draw);
  }, [containerRef]);

  useEffect(() => {
    // Small delay to ensure container is rendered
    const timer = setTimeout(() => {
      animRef.current = requestAnimationFrame(draw);
    }, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
