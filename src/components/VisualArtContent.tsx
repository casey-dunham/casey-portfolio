'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ArtDetail {
  title: string;
  description: string;
  href?: string;
  tags?: string[];
  processImages?: { src: string; alt: string; width: number; height: number }[];
}

interface ArtPiece {
  src: string;
  alt: string;
  width: number;
  height: number;
  detail?: ArtDetail;
}

interface ArtRow {
  cols: 1 | 2 | 3;
  pieces: ArtPiece[];
  equalHeight?: boolean;
  layout?: 'stacked-right' | 'left-tall-right-grid' | 'left-tall-right-2x2' | 'left-tall-right-2-stacked';
  groupLabel?: string;
}

const rows: ArtRow[] = [
  // Bird triptych — charcoal on toned paper
  {
    cols: 3,
    equalHeight: true,
    pieces: [
      { src: '/images/art/bird1.jpeg', alt: 'American Kestrel — Charcoal on toned paper', width: 989, height: 1200, detail: { title: 'American Kestrel', description: 'Charcoal on toned paper, 2022. Drawn for a volunteer project with the Brandywine Zoo in Delaware. Each piece in this series depicts an endangered bird species native to the state.', tags: ['Charcoal', 'Colored Pencil'] } },
      { src: '/images/art/bird2.jpeg', alt: 'Black-crowned Night-Heron — Charcoal on toned paper', width: 933, height: 1200, detail: { title: 'Black-crowned Night-Heron', description: 'Charcoal and colored pencil on toned paper, 2022. Part of the Brandywine Zoo endangered species series. The juvenile night-heron is one of Delaware\'s most at-risk wading birds.', tags: ['Charcoal', 'Colored Pencil'] } },
      { src: '/images/art/bird3.jpeg', alt: 'Red Knot — Charcoal on toned paper', width: 1200, height: 981, detail: { title: 'Red Knot', description: 'Charcoal and colored pencil on toned paper, 2022. The red knot migrates through Delaware Bay each spring and is federally listed as threatened. Drawn for the Brandywine Zoo endangered species series.', tags: ['Charcoal', 'Colored Pencil'] } },
    ],
  },
  {
    cols: 2,
    layout: 'left-tall-right-grid',
    pieces: [
      { src: '/images/art/treasured.jpeg', alt: 'Treasured — Charcoal', width: 3292, height: 4907, detail: { title: 'Treasured', description: 'Charcoal, 2023. Featured in College Board\'s AP Art & Design Exhibit. This piece explores themes of memory and personal value through detailed charcoal rendering.', href: 'https://apartanddesign.collegeboard.org/2024-student04?excmpid=SM068-PR-1-LI', tags: ['Charcoal'] } },
      { src: '/images/art/delicate.png', alt: 'Delicate — Graphite', width: 3563, height: 2670, detail: { title: 'Delicate', description: 'Graphite, 2022. National Silver Medal recipient, Scholastic Art & Writing Awards. Drawn in tenth grade.', tags: ['Graphite'] } },
      { src: '/images/art/portrait-study.jpg', alt: 'Portrait Study — Graphite', width: 1056, height: 1439, detail: { title: 'Portrait Study', description: 'Graphite, 2023. Drawn from a photograph found in the Library of Congress archives. A profile study focused on rendering hair texture and delicate lace detail.', tags: ['Graphite'] } },
      { src: '/images/art/hold-the-phone.jpeg', alt: 'Hold the Phone — Graphite', width: 4513, height: 2957, detail: { title: 'Hold the Phone', description: 'Graphite, 2023. Drawn from a Library of Congress archival photograph. A study in soft light, fabric texture, and the quiet intimacy of a child lost in thought.', tags: ['Graphite'] } },
    ],
  },
  {
    cols: 3,
    equalHeight: true,
    pieces: [
      { src: '/images/art/midnight.jpg', alt: 'Midnight — Charcoal and graphite', width: 1200, height: 1801, detail: { title: 'Midnight', description: 'Charcoal and graphite, 2023. A portrait lit only by candlelight, exploring extreme contrast and the way light dissolves into shadow.', tags: ['Charcoal', 'Graphite'] } },
      { src: '/images/art/lemons-and-antlers.jpg', alt: 'Still Life with Antlers — Oil on canvas', width: 2123, height: 2503, detail: { title: 'Still Life with Antlers', description: 'Oil on canvas, 2023. A traditional still life pairing organic forms — shed antlers and lemons — against a richly patterned draped fabric. Focus on color temperature and reflected light within a muted palette.', tags: ['Oil'] } },
      { src: '/images/art/sargent-study.jpg', alt: 'After Sargent — Oil on canvas', width: 1892, height: 2763, detail: { title: 'After Sargent', description: 'Oil on canvas, 2023. A master copy after John Singer Sargent, studying his confident brushwork and approach to rendering light on skin and fabric.', tags: ['Oil'] } },
      { src: '/images/art/beach-digital.jpg', alt: 'Riviera — Digital', width: 2295, height: 2994, detail: { title: 'Riviera', description: 'Digital, 2023. Created in Procreate. An aerial view of a crowded beach rendered in flat, graphic color — striped umbrellas and sun chairs forming a dense pattern of shape and shadow.', tags: ['Procreate'] } },
    ],
  },
];

const photoRows: ArtRow[] = [
  {
    cols: 2,
    layout: 'left-tall-right-grid',
    pieces: [
      { src: '/images/art/boy-drinking-soda.jpeg', alt: 'Orange — Kenya, 2024', width: 716, height: 1200, detail: { title: 'Orange', description: 'Kenya, 2024. A boy mid-sip in the afternoon sun, his orange polo echoing the warm tones of the soda bottle. Shot during a community gathering in the Rift Valley.' } },
      { src: '/images/art/basket-of-mangos.jpeg', alt: 'The Harvest — Kenya, 2024', width: 675, height: 1200, detail: { title: 'The Harvest', description: 'Kenya, 2024. A child proudly holds a basin of freshly picked mangoes outside a school gate. The pink basin and red sweater cut against the muted stone and iron behind him.' } },
      { src: '/images/art/girl-with-water.jpg', alt: 'Water Carry — Kenya, 2024', width: 675, height: 1200, detail: { title: 'Water Carry', description: 'Kenya, 2024. A girl stands with a jerry can in the midday heat, smiling despite the weight. The harsh light flattens the scene into planes of white and warm shadow.' } },
      { src: '/images/art/clothesline.jpg', alt: 'Drying Day — Kenya, 2024', width: 1600, height: 900, detail: { title: 'Drying Day', description: 'Kenya, 2024. Laundry dries on a balcony railing overlooking a schoolyard. The patterned fabrics and ochre walls create a layered composition of color and texture.' } },
    ],
  },
  {
    cols: 3,
    equalHeight: true,
    pieces: [
      { src: '/images/art/sink.jpeg', alt: 'Wash — Kenya, 2024', width: 737, height: 1200, detail: { title: 'Wash', description: 'Kenya, 2024. Two children at a hand-washing station at Happy Life Children\'s Home. Shot in black and white to draw attention to gesture and the geometry of the signs and tiles around them.' } },
      { src: '/images/art/portrait.jpg', alt: 'Hands to Heart — Kenya, 2024', width: 719, height: 1200, detail: { title: 'Hands to Heart', description: 'Kenya, 2024. A quiet portrait — hands pressed to chest, eyes steady. The shallow depth of field dissolves the palm trees behind into soft light.' } },
      { src: '/images/art/supersonic.jpg', alt: 'Window Seat — Kenya, 2024', width: 1067, height: 1200, detail: { title: 'Window Seat', description: 'Kenya, 2024. Reading by the glow of an airplane window on the flight over. The cabin darkness isolates the figure in a cocoon of blue light.' } },
    ],
  },
  {
    cols: 1,
    pieces: [
      { src: '/images/art/zebrastripe.jpg', alt: 'The Herd — Kenya, 2024', width: 5884, height: 1533, detail: { title: 'The Herd', description: 'Kenya, 2024. A panoramic shot of zebras grazing on the Maasai Mara. The wide crop emphasizes the rhythm of stripes repeating across the grassland.' } },
    ],
  },
];

const stoolProcessImages = [
  { src: '/images/product/cardboard.png', alt: 'Cardboard Prototype', width: 1024, height: 1024 },
  { src: '/images/product/cnc.png', alt: 'CNC-cut Parts', width: 2824, height: 1532 },
];

const productRows: ArtRow[] = [
  {
    cols: 3,
    equalHeight: true,
    groupLabel: 'Step Stool',
    pieces: [
      { src: '/images/product/2.jpg', alt: 'Step Stool — In Context', width: 795, height: 1200, detail: { title: 'Step Stool — In Context', description: 'A step stool designed for the laundry room, featuring a pull-out table for resting a basket while loading or unloading machines. CNC-cut from Baltic birch plywood with finger joint construction. Modeled in Fusion 360 and prototyped in laser-cut cardboard before final fabrication.', tags: ['Fusion 360', 'CNC'], processImages: stoolProcessImages } },
      { src: '/images/product/Studio_3.jpeg', alt: 'Step Stool — Studio', width: 900, height: 1200, detail: { title: 'Step Stool — Studio', description: 'Studio shot showing the two-tier step stool with the pull-out table extended. The slatted surface allows airflow and adds visual lightness to the form.', tags: ['Fusion 360', 'CNC'], processImages: stoolProcessImages } },
      { src: '/images/product/Detail_1.jpeg', alt: 'Step Stool — Detail', width: 900, height: 1200, detail: { title: 'Step Stool — Detail', description: 'Joinery detail showing the finger joints and sliding table mechanism. The arched cutouts reduce weight while adding a subtle design element.', tags: ['Fusion 360', 'CNC'], processImages: stoolProcessImages } },
    ],
  },
];

const allPieces = [...rows, ...photoRows, ...productRows].flatMap((r) => r.pieces);

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
  const dirRef = useRef(direction);
  dirRef.current = direction;

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
    return { x: direction > 0 ? 600 : -600, opacity: 0 };
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

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={piece.src}
          initial={getInitial()}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={() => ({ x: dirRef.current > 0 ? -600 : 600, opacity: 0, position: 'absolute' as const })}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="art-lightbox-content"
          style={piece.width / piece.height > 2 ? { flexDirection: 'column', alignItems: 'flex-start' } : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={piece.src}
            alt={piece.alt}
            width={piece.width}
            height={piece.height}
            className="art-lightbox-image"
            quality={90}
            style={piece.width / piece.height > 2 ? { maxWidth: '80vw', width: '80vw' } : undefined}
          />
          {piece.detail && (
            <div className="video-lightbox-detail" style={piece.width / piece.height > 2 ? { maxWidth: 'none', paddingTop: '0.75rem' } : undefined}>
              <span className="video-lightbox-detail-name">{piece.detail.title}</span>
              <p className="video-lightbox-detail-desc">{piece.detail.description}</p>
              {piece.detail.href && (
                <a href={piece.detail.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--fg-muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  View in AP Art & Design Exhibit →
                </a>
              )}
              {piece.detail.tags && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {piece.detail.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--border-light)', color: 'var(--fg-muted)', fontFamily: 'var(--font-body)' }}>{tag}</span>
                  ))}
                </div>
              )}
              {piece.detail.processImages && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '1rem' }}>
                  {piece.detail.processImages.map((img) => (
                    <Image key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} quality={80} style={{ width: '100%', height: 'auto', borderRadius: '6px' }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      </div>

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

        const grid = (
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

        return grid;
      })}
    </div>
  );
}

import { createContext, useContext } from 'react';

interface GalleryContextValue {
  openLightbox: (piece: ArtPiece) => void;
}

const GalleryContext = createContext<GalleryContextValue>({ openLightbox: () => {} });

export function ArtGalleryProvider({ children }: { children: React.ReactNode }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const closeLightbox = useCallback(() => { setActiveIndex(null); setDirection(0); }, []);
  const goPrev = useCallback(() => { setDirection(-1); setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)); }, []);
  const goNext = useCallback(() => { setDirection(1); setActiveIndex((i) => (i !== null && i < allPieces.length - 1 ? i + 1 : i)); }, []);

  const openLightbox = useCallback((piece: ArtPiece) => {
    const idx = allPieces.findIndex((p) => p.src === piece.src);
    setDirection(0);
    setActiveIndex(idx);
  }, []);

  return (
    <GalleryContext.Provider value={{ openLightbox }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
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
        </AnimatePresence>,
        document.body
      )}
    </GalleryContext.Provider>
  );
}

export default function VisualArtContent() {
  const { openLightbox } = useContext(GalleryContext);
  return <ArtGallery galleryRows={rows} handleClick={openLightbox} />;
}

export function ProductContent() {
  const { openLightbox } = useContext(GalleryContext);
  return <ArtGallery galleryRows={productRows} handleClick={openLightbox} />;
}

export function PhotographyContent() {
  const { openLightbox } = useContext(GalleryContext);
  return <ArtGallery galleryRows={photoRows} handleClick={openLightbox} />;
}
