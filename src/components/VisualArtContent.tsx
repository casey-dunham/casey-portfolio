'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ArtPiece {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ArtRow {
  cols: 1 | 2 | 3;
  pieces: ArtPiece[];
  equalHeight?: boolean;
  layout?: 'stacked-right' | 'left-tall-right-grid' | 'left-tall-right-2x2' | 'left-tall-right-2-stacked';
}

const rows: ArtRow[] = [
  // Bird triptych — charcoal on toned paper
  {
    cols: 3,
    equalHeight: true,
    pieces: [
      { src: '/images/art/bird1.jpeg', alt: 'Bird Study I — Charcoal on toned paper', width: 989, height: 1200 },
      { src: '/images/art/bird2.jpeg', alt: 'Bird Study II — Charcoal on toned paper', width: 933, height: 1200 },
      { src: '/images/art/bird3.jpeg', alt: 'Bird Study III — Charcoal on toned paper', width: 1200, height: 981 },
    ],
  },
  // Treasured left, ballet+study top-right, phone bottom-right
  {
    cols: 2,
    layout: 'left-tall-right-grid',
    pieces: [
      { src: '/images/art/treasured.jpeg', alt: 'Treasured — Charcoal', width: 3292, height: 4907 },
      { src: '/images/art/ballet-dancers.jpeg', alt: 'Ballet Dancers — Charcoal', width: 1200, height: 937 },
      { src: '/images/art/portrait-study.jpg', alt: 'Portrait Study — Graphite', width: 1056, height: 1439 },
      { src: '/images/art/hold-the-phone.jpeg', alt: 'Hold the Phone — Graphite', width: 4513, height: 2957 },
    ],
  },
  // Paintings + drawings row — all same height
  {
    cols: 3,
    equalHeight: true,
    pieces: [
      { src: '/images/art/midnight.jpg', alt: 'Midnight — Charcoal', width: 1200, height: 1801 },
      { src: '/images/art/delicate.jpg', alt: 'Delicate — Graphite', width: 1200, height: 899 },
      { src: '/images/art/sargent-study.jpg', alt: 'Sargent Study — Oil on canvas', width: 1892, height: 2763 },
      { src: '/images/art/still-life.jpg', alt: 'Still Life — Oil on canvas', width: 2123, height: 2503 },
      { src: '/images/art/beach-digital.jpg', alt: 'Beach Scene — Digital illustration', width: 2295, height: 2994 },
    ],
  },
];

const photoRows: ArtRow[] = [
  // Boy drinking soda left, right: basket+girl top, clothesline+gazelle stacked bottom
  {
    cols: 2,
    layout: 'left-tall-right-grid',
    pieces: [
      { src: '/images/art/boy-drinking-soda.jpeg', alt: 'Boy Drinking Soda — Photography', width: 716, height: 1200 },
      { src: '/images/art/basket-of-mangos.jpeg', alt: 'Basket of Mangoes — Photography', width: 675, height: 1200 },
      { src: '/images/art/girl-with-water.jpg', alt: 'Girl with Water — Photography', width: 675, height: 1200 },
      { src: '/images/art/clothesline.jpg', alt: 'Clothesline — Photography', width: 1600, height: 900 },
    ],
  },
  // Sink + portrait + cabin chair — same height
  {
    cols: 3,
    equalHeight: true,
    pieces: [
      { src: '/images/art/sink.jpeg', alt: 'Sink — Photography', width: 737, height: 1200 },
      { src: '/images/art/portrait.jpg', alt: 'Portrait — Photography', width: 719, height: 1200 },
      { src: '/images/art/supersonic.jpg', alt: 'Supersonic — Photography', width: 1067, height: 1200 },
    ],
  },
  // Zebras — solo
  {
    cols: 1,
    pieces: [
      { src: '/images/art/zebras.jpg', alt: 'Zebras — Photography', width: 6000, height: 1693 },
    ],
  },
];

const allPieces = [...rows, ...photoRows].flatMap((r) => r.pieces);

function AnimatedArtCell({
  piece,
  isHero,
  delay,
  onClick,
}: {
  piece: ArtPiece;
  isHero: boolean;
  delay: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`art-cell ${isHero ? 'art-cell-hero' : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)', transition: { duration: 0.3, ease: 'easeOut' } }}
      transition={{ duration: 0.4, delay, ease: [0.25, 1, 0.5, 1] }}
    >
      <Image
        src={piece.src}
        alt={piece.alt}
        width={piece.width}
        height={piece.height}
        quality={85}
        sizes={isHero ? '100vw' : undefined}
        className="art-image"
        style={isHero ? { width: '100%', height: 'auto' } : undefined}
      />
    </motion.div>
  );
}

function ArtLightbox({
  pieceIndex,
  direction,
  onClose,
  onPrev,
  onNext,
}: {
  pieceIndex: number;
  direction: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const piece = allPieces[pieceIndex];
  const hasPrev = pieceIndex > 0;
  const hasNext = pieceIndex < allPieces.length - 1;
  const slideX = 300;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const getInitial = () => {
    if (direction === 0) return { opacity: 0, scale: 0.9 };
    return { opacity: 0, x: direction > 0 ? slideX : -slideX };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className="art-lightbox-backdrop"
      onClick={onClose}
    >
      <motion.button
        className="video-lightbox-close"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </motion.button>

      {hasPrev && (
        <motion.button
          className="video-lightbox-nav video-lightbox-prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>
      )}

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={piece.src}
          initial={getInitial()}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -slideX : slideX }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="art-lightbox-content"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={piece.src}
            alt={piece.alt}
            width={piece.width}
            height={piece.height}
            className="art-lightbox-image"
            quality={90}
          />
        </motion.div>
      </AnimatePresence>

      {hasNext && (
        <motion.button
          className="video-lightbox-nav video-lightbox-next"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
}

function ArtGallery({ galleryRows, handleClick }: { galleryRows: ArtRow[]; handleClick: (piece: ArtPiece) => void }) {
  let globalIndex = 0;

  return (
    <div className="art-gallery">
      {galleryRows.map((row, rowIndex) => {
        if (row.layout === 'stacked-right') {
          const [left, topRight, bottomRight] = row.pieces;
          const leftAR = left.width / left.height;
          const topAR = topRight.width / topRight.height;
          const bottomAR = bottomRight.width / bottomRight.height;
          const leftFr = leftAR * (1 / topAR + 1 / bottomAR);
          const rightFr = 1;
          globalIndex += 3;
          return (
            <div
              key={rowIndex}
              className="art-stacked-row"
              style={{ gridTemplateColumns: `${leftFr}fr ${rightFr}fr` }}
            >
              <AnimatedArtCell
                key={left.src}
                piece={left}
                isHero={false}
                delay={0}
                onClick={() => handleClick(left)}
              />
              <div className="art-stacked-col">
                <AnimatedArtCell
                  key={topRight.src}
                  piece={topRight}
                  isHero={false}
                  delay={0.1}
                  onClick={() => handleClick(topRight)}
                />
                <AnimatedArtCell
                  key={bottomRight.src}
                  piece={bottomRight}
                  isHero={false}
                  delay={0.15}
                  onClick={() => handleClick(bottomRight)}
                />
              </div>
            </div>
          );
        }

        if (row.layout === 'left-tall-right-grid') {
          const [left, topRight1, topRight2, bottomRight] = row.pieces;
          const leftAR = left.width / left.height;
          const tr1AR = topRight1.width / topRight1.height;
          const tr2AR = topRight2.width / topRight2.height;
          const brAR = bottomRight.width / bottomRight.height;
          // Right col: top row has 2 images side by side, bottom has 1
          // Top row height = Wr / (tr1AR + tr2AR + gap), bottom = Wr / brAR
          // Left height = Wl / leftAR = Wr * (1/(tr1AR + tr2AR) + 1/brAR)
          // Wl/Wr = leftAR * (1/min(tr1AR,tr2AR) + 1/brAR) — approximate
          const rightTopCombinedAR = tr1AR + tr2AR;
          const leftFr = leftAR * (1 / rightTopCombinedAR + 1 / brAR);
          globalIndex += 4;
          return (
            <div
              key={rowIndex}
              className="art-stacked-row"
              style={{ gridTemplateColumns: `${leftFr}fr 1fr` }}
            >
              <AnimatedArtCell
                key={left.src}
                piece={left}
                isHero={false}
                delay={0}
                onClick={() => handleClick(left)}
              />
              <div className="art-stacked-col">
                <div className="art-row" style={{ gridTemplateColumns: `${tr1AR}fr ${tr2AR}fr` }}>
                  <AnimatedArtCell
                    key={topRight1.src}
                    piece={topRight1}
                    isHero={false}
                    delay={0.1}
                    onClick={() => handleClick(topRight1)}
                  />
                  <AnimatedArtCell
                    key={topRight2.src}
                    piece={topRight2}
                    isHero={false}
                    delay={0.15}
                    onClick={() => handleClick(topRight2)}
                  />
                </div>
                <AnimatedArtCell
                  key={bottomRight.src}
                  piece={bottomRight}
                  isHero={false}
                  delay={0.2}
                  onClick={() => handleClick(bottomRight)}
                />
              </div>
            </div>
          );
        }

        if (row.layout === 'left-tall-right-2x2') {
          const [left, tr1, tr2, br1, br2] = row.pieces;
          const leftAR = left.width / left.height;
          const tr1AR = tr1.width / tr1.height;
          const tr2AR = tr2.width / tr2.height;
          const br1AR = br1.width / br1.height;
          const br2AR = br2.width / br2.height;
          // Left height = right height: Wl/leftAR = Wr * (1/(tr1AR+tr2AR) + 1/(br1AR+br2AR))
          const leftFr = leftAR * (1 / (tr1AR + tr2AR) + 1 / (br1AR + br2AR));
          globalIndex += 5;
          return (
            <div
              key={rowIndex}
              className="art-stacked-row"
              style={{ gridTemplateColumns: `${leftFr}fr 1fr` }}
            >
              <AnimatedArtCell
                key={left.src}
                piece={left}
                isHero={false}
                delay={0}
                onClick={() => handleClick(left)}
              />
              <div className="art-stacked-col">
                <div className="art-row" style={{ gridTemplateColumns: `${tr1.width / tr1.height}fr ${tr2.width / tr2.height}fr` }}>
                  <AnimatedArtCell key={tr1.src} piece={tr1} isHero={false} delay={0.1} onClick={() => handleClick(tr1)} />
                  <AnimatedArtCell key={tr2.src} piece={tr2} isHero={false} delay={0.15} onClick={() => handleClick(tr2)} />
                </div>
                <div className="art-row" style={{ gridTemplateColumns: `${br1.width / br1.height}fr ${br2.width / br2.height}fr` }}>
                  <AnimatedArtCell key={br1.src} piece={br1} isHero={false} delay={0.2} onClick={() => handleClick(br1)} />
                  <AnimatedArtCell key={br2.src} piece={br2} isHero={false} delay={0.25} onClick={() => handleClick(br2)} />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={rowIndex}
            className={`art-row${row.equalHeight ? '' : ` art-cols-${row.cols}`}`}
            style={row.equalHeight ? {
              gridTemplateColumns: row.pieces.map(p => `${p.width / p.height}fr`).join(' '),
            } : undefined}
          >
            {row.pieces.map((piece) => {
              const delay = (globalIndex % row.cols) * 0.1;
              globalIndex++;
              return (
                <AnimatedArtCell
                  key={piece.src}
                  piece={piece}
                  isHero={row.cols === 1}
                  delay={delay}
                  onClick={() => handleClick(piece)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function useGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const closeLightbox = useCallback(() => { setActiveIndex(null); setDirection(0); }, []);
  const goPrev = useCallback(() => { setDirection(-1); setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)); }, []);
  const goNext = useCallback(() => { setDirection(1); setActiveIndex((i) => (i !== null && i < allPieces.length - 1 ? i + 1 : i)); }, []);

  const handleClick = useCallback((piece: ArtPiece) => {
    const idx = allPieces.findIndex((p) => p.src === piece.src);
    setDirection(0);
    setActiveIndex(idx);
  }, []);

  return { activeIndex, direction, closeLightbox, goPrev, goNext, handleClick };
}

export default function VisualArtContent() {
  const { activeIndex, direction, closeLightbox, goPrev, goNext, handleClick } = useGallery();

  return (
    <>
      <ArtGallery galleryRows={rows} handleClick={handleClick} />
      <AnimatePresence>
        {activeIndex !== null && (
          <ArtLightbox
            pieceIndex={activeIndex}
            direction={direction}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function PhotographyContent() {
  const { activeIndex, direction, closeLightbox, goPrev, goNext, handleClick } = useGallery();

  return (
    <>
      <ArtGallery galleryRows={photoRows} handleClick={handleClick} />
      <AnimatePresence>
        {activeIndex !== null && (
          <ArtLightbox
            pieceIndex={activeIndex}
            direction={direction}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </>
  );
}
