'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GalleryContext, useGalleryContext } from './GalleryContext';
import { allVideos, type VideoItem } from './UXUIContent';
import { HIDDEN_PILL_TAGS } from '@/data/projects';

const visibleTags = (tags: string[]) =>
  tags.filter((t) => !HIDDEN_PILL_TAGS.includes(t as typeof HIDDEN_PILL_TAGS[number]));

interface ArtDetail {
  title: string;
  description: string;
  href?: string;
  tags?: string[];
  processImages?: { src: string; alt: string; width: number; height: number }[];
  groupPieces?: ArtPiece[];
}

interface ArtPiece {
  src: string;
  alt: string;
  width: number;
  height: number;
  cropBottom?: boolean;
  imageStyle?: React.CSSProperties;
  detail?: ArtDetail;
}

interface ArtRow {
  cols: 1 | 2 | 3;
  pieces: ArtPiece[];
  equalHeight?: boolean;
  layout?: 'stacked-right' | 'left-tall-right-grid' | 'left-tall-right-2x2' | 'left-tall-right-2-stacked';
  groupLabel?: string;
}

const birdPieces: ArtPiece[] = [
  { src: '/images/art/bird1.jpeg', alt: 'American Kestrel — Charcoal on toned paper', width: 989, height: 1200 },
  { src: '/images/art/bird2.jpeg', alt: 'Black-crowned Night-Heron — Charcoal on toned paper', width: 933, height: 1200 },
  { src: '/images/art/bird3.jpeg', alt: 'Red Knot — Charcoal on toned paper', width: 1200, height: 981 },
];

const birdDetail: ArtDetail = {
  title: 'Brandywine Zoo Series',
  description: 'Charcoal and colored pencil on toned paper, 2022. Drawn for a volunteer project with the Brandywine Zoo in Delaware. Each piece in this series depicts an endangered bird species native to the state.',
  tags: ['Fine Art'],
  groupPieces: birdPieces,
};
birdPieces.forEach((p) => { p.detail = birdDetail; });

const rows: ArtRow[] = [
  // Bird triptych — charcoal on toned paper
  {
    cols: 3,
    equalHeight: true,
    groupLabel: 'Brandywine Zoo Series',
    pieces: birdPieces,
  },
  {
    cols: 2,
    layout: 'left-tall-right-grid',
    pieces: [
      { src: '/images/art/beach-digital.jpg', alt: 'Riviera — Digital', width: 2295, height: 2994, imageStyle: { objectPosition: '52% 52%' }, detail: { title: 'Riviera', description: 'Digital, 2023. Created in Procreate. An aerial view of a crowded beach rendered in flat, graphic color — striped umbrellas and sun chairs forming a dense pattern of shape and shadow.', tags: ['Fine Art', 'Procreate'] } },
      { src: '/images/art/delicate.png', alt: 'Delicate — Graphite', width: 3563, height: 2670, detail: { title: 'Delicate', description: 'Graphite, 2022. National Silver Medal recipient, Scholastic Art & Writing Awards.', tags: ['Fine Art'] } },
      { src: '/images/art/portrait-study.jpg', alt: 'Portrait Study — Graphite', width: 1056, height: 1439, detail: { title: 'Portrait Study', description: 'Graphite, 2023. Drawn from a photograph found in the Library of Congress archives. A profile study focused on rendering hair texture and delicate lace detail.', tags: ['Fine Art'] } },
      { src: '/images/art/hold-the-phone.jpeg', alt: 'Hold the Phone — Graphite', width: 4513, height: 2957, detail: { title: 'Hold the Phone', description: 'Graphite, 2023. Drawn from a Library of Congress archival photograph. A study in soft light, fabric texture, and the quiet intimacy of a child lost in thought.', tags: ['Fine Art'] } },
    ],
  },
  {
    cols: 3,
    equalHeight: true,
    pieces: [
      { src: '/images/art/treasured.jpeg', alt: 'Treasured — Charcoal', width: 3292, height: 4907, detail: { title: 'Treasured', description: 'Charcoal, 2023. Featured in College Board\'s AP Art & Design Exhibit. This piece explores themes of memory and personal value through detailed charcoal rendering.', href: 'https://apartanddesign.collegeboard.org/2024-student04?excmpid=SM068-PR-1-LI', tags: ['Fine Art'] } },
      { src: '/images/art/lemons-and-antlers.jpg', alt: 'Still Life with Antlers — Oil on canvas', width: 2123, height: 2503, detail: { title: 'Still Life with Antlers', description: 'Oil on canvas, 2023. A traditional still life pairing organic forms — shed antlers and lemons — against a richly patterned draped fabric. Focus on color temperature and reflected light within a muted palette.', tags: ['Fine Art'] } },
      { src: '/images/art/sargent-study.jpg', alt: 'After Sargent — Oil on canvas', width: 1892, height: 2763, detail: { title: 'After Sargent', description: 'Oil on canvas, 2023. A master copy after John Singer Sargent, studying his confident brushwork and approach to rendering light on skin and fabric.', tags: ['Fine Art'] } },
    ],
  },
];

const photoRows: ArtRow[] = [
  {
    cols: 2,
    layout: 'left-tall-right-grid',
    pieces: [
      { src: '/images/art/boy-drinking-soda.jpeg', alt: 'Fanta Break — Kenya, 2024', width: 716, height: 1200, detail: { title: 'Fanta Break', description: 'Kenya, 2024. A boy mid-sip in the afternoon sun.', tags: ['Photography'] } },
      { src: '/images/art/basket-of-mangos.jpeg', alt: 'Mango Haul — Kenya, 2024', width: 675, height: 1200, detail: { title: 'Mango Haul', description: 'Kenya, 2024. A child holds a basin of freshly picked mangoes. The pink basin and red sweater cut against the muted stone and iron behind him.', tags: ['Photography'] } },
      { src: '/images/art/girl-with-water.jpg', alt: 'Water Carry — Kenya, 2024', width: 675, height: 1200, detail: { title: 'Water Carry', description: 'Kenya, 2024. A girl with a jerry can in the midday heat. The harsh light flattens the scene into planes of white and warm shadow.', tags: ['Photography'] } },
      { src: '/images/art/zebrastripe.jpg', alt: 'The Herd — Kenya, 2024', width: 5884, height: 1533, cropBottom: true, detail: { title: 'The Herd', description: 'Kenya, 2024. Zebras grazing on the Maasai Mara.', tags: ['Photography'] } },
    ],
  },
  {
    cols: 3,
    equalHeight: true,
    pieces: [
      { src: '/images/art/sink.jpeg', alt: 'Wash — Kenya, 2024', width: 737, height: 1200, detail: { title: 'Wash', description: 'Kenya, 2024. Two children at a hand-washing station at Happy Life Children\'s Home. Shot in black and white to draw attention to gesture and the geometry of the signs and tiles around them.', tags: ['Photography'] } },
      { src: '/images/art/portrait.jpg', alt: 'Hands to Heart — Kenya, 2024', width: 719, height: 1200, detail: { title: 'Hands to Heart', description: 'Kenya, 2024. A quiet portrait — hands pressed to chest, eyes steady. The shallow depth of field dissolves the palm trees behind into soft light.', tags: ['Photography'] } },
      { src: '/images/art/supersonic.jpg', alt: 'Window Seat — Kenya, 2024', width: 1067, height: 1200, detail: { title: 'Window Seat', description: 'Kenya, 2024. Reading by the glow of an airplane window on the flight over. The cabin darkness isolates the figure in a cocoon of blue light.', tags: ['Photography'] } },
    ],
  },
];

const stoolPieces: ArtPiece[] = [
  { src: '/images/product/2.jpg', alt: 'Step Stool — In Context', width: 795, height: 1200 },
  { src: '/images/product/Studio_3.jpeg', alt: 'Step Stool — Studio', width: 900, height: 1200 },
  { src: '/images/product/Detail_1.jpeg', alt: 'Step Stool — Detail', width: 900, height: 1200 },
];

// Attach shared detail with groupPieces to each stool piece
const stoolDetail: ArtDetail = {
  title: 'Step Stool',
  description: 'A step stool designed for the laundry room, featuring a pull-out table for resting a basket while loading or unloading machines. CNC-cut from Baltic birch plywood with finger joint construction. Modeled in Fusion 360 and prototyped in laser-cut cardboard before final fabrication.',
  tags: ['Product Design', 'Fusion 360'],
  groupPieces: stoolPieces,
};
stoolPieces.forEach((p) => { p.detail = stoolDetail; });

const productRows: ArtRow[] = [
  {
    cols: 3,
    equalHeight: true,
    groupLabel: 'Step Stool',
    pieces: stoolPieces,
  },
];

/* ── Illustration pieces ── */

interface IllustrationPiece {
  src: string;
  alt: string;
  width: number;
  height: number;
  bg: string;
  featured?: boolean;
  span?: number;
  noFrame?: boolean;
  crop?: boolean;
  detail?: ArtDetail;
}

// Helper to build illustration detail
const illDetail = (title: string, desc: string): ArtDetail => ({
  title, description: desc, href: '/projects/rewired', tags: ['Illustration', 'Procreate'],
});

// Masonry (CSS columns) fills top-to-bottom per column.
// Ordered to balance tall/short and cluster brains at the bottom.
const illustrationPieces: IllustrationPiece[] = [
  { src: '/images/illustrations/eyes-watching.png', alt: 'Eyes Watching', width: 1024, height: 1536, bg: 'none', noFrame: true, detail: illDetail('Eyes Watching', 'Digital illustration created for Rewired, a neuroscience education platform.') },
];

const illustrationArtPieces: ArtPiece[] = illustrationPieces.map(p => ({
  src: p.src, alt: p.alt, width: p.width, height: p.height, detail: p.detail,
}));

/* ── Unified lightbox items ── */

type LightboxItem =
  | { type: 'video'; video: VideoItem }
  | { type: 'art'; piece: ArtPiece };

function collapseArtRows(artRows: ArtRow[]): ArtPiece[] {
  return artRows.flatMap(r => {
    if (r.pieces.length > 0 && r.pieces[0].detail?.groupPieces) return [r.pieces[0]];
    return r.pieces;
  });
}

// Page order: UX/UI → Products → Illustrations → Fine Art → Photography
const allItems: LightboxItem[] = [
  ...allVideos.map(v => ({ type: 'video' as const, video: v })),
  ...collapseArtRows(productRows).map(p => ({ type: 'art' as const, piece: p })),
  ...illustrationArtPieces.map(p => ({ type: 'art' as const, piece: p })),
  ...collapseArtRows(rows).map(p => ({ type: 'art' as const, piece: p })),
  ...collapseArtRows(photoRows).map(p => ({ type: 'art' as const, piece: p })),
];

// Lookup: any src (including group member srcs) → index in allItems
const srcToIndex = new Map<string, number>();
allItems.forEach((item, i) => {
  if (item.type === 'video') {
    srcToIndex.set(item.video.src, i);
  } else {
    srcToIndex.set(item.piece.src, i);
    if (item.piece.detail?.groupPieces) {
      item.piece.detail.groupPieces.forEach(gp => srcToIndex.set(gp.src, i));
    }
  }
});

/* ── Components ── */

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
      className={`art-cell ${isHero ? 'art-cell-hero' : ''}${piece.cropBottom ? ' art-cell-crop-bottom' : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)', transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } }}
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
        style={isHero ? { width: '100%', height: 'auto' } : piece.imageStyle}
      />
    </motion.div>
  );
}

function UnifiedLightbox({
  itemIndex,
  direction,
  originRect,
  onClose,
  onPrev,
  onNext,
}: {
  itemIndex: number;
  direction: number;
  originRect: DOMRect | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = allItems[itemIndex];
  const hasPrev = itemIndex > 0;
  const hasNext = itemIndex < allItems.length - 1;
  const isVideo = item.type === 'video';
  const itemKey = isVideo ? item.video.src : item.piece.src;
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
    if (direction !== 0) {
      return { x: direction > 0 ? 600 : -600, opacity: 0 };
    }
    if (isVideo && originRect) {
      const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
      const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
      return {
        opacity: 0,
        scale: originRect.width / 500,
        x: originRect.x + originRect.width / 2 - centerX,
        y: originRect.y + originRect.height / 2 - centerY,
      };
    }
    return { opacity: 0, scale: 0.9 };
  };

  const getOrientationClass = () => {
    if (item.type !== 'art') return '';
    const piece = item.piece;
    if (piece.detail?.groupPieces) return '';
    const ar = piece.width / piece.height;
    if (ar > 2) return ' art-lightbox-ultrawide';
    if (ar >= 1) return ' art-lightbox-landscape';
    return ' art-lightbox-portrait';
  };

  const getContentStyle = () => {
    if (item.type === 'art') {
      const piece = item.piece;
      if (piece.detail?.groupPieces) {
        return { flexDirection: 'column' as const, alignItems: 'stretch' as const, maxWidth: '80vw' };
      }
    }
    return undefined;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      className={isVideo ? 'video-lightbox-backdrop' : 'art-lightbox-backdrop'}
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
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={itemKey}
            initial={direction === 0 ? getInitial() : { x: direction > 0 ? 600 : -600, opacity: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ x: dirRef.current > 0 ? -600 : 600, opacity: 0, position: 'absolute' as const }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as const }}
            className={isVideo ? 'video-lightbox-content' : `art-lightbox-content${getOrientationClass()}`}
            style={getContentStyle()}
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo ? (
              <>
                <div className="video-lightbox-video-wrap" onClick={(e) => {
                  const vid = e.currentTarget.querySelector('video');
                  if (vid) vid.paused ? vid.play() : vid.pause();
                }}>
                  <video src={item.video.src} autoPlay loop muted playsInline className="video-lightbox-video" style={{ cursor: 'pointer' }} />
                </div>
                {item.video.detail && (
                  <div className="video-lightbox-detail">
                    <a href={item.video.detail.project.href} className="video-lightbox-detail-header">
                      <img src={item.video.detail.project.icon} alt={item.video.detail.project.name} className="video-lightbox-detail-icon" />
                      <span className="video-lightbox-detail-name">{item.video.detail.project.name}</span>
                      <svg className="video-lightbox-detail-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </a>
                    <div style={{ height: '1px', background: 'var(--border)', marginBottom: '0.75rem' }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)', display: 'block', marginBottom: '0.5rem' }}>{item.video.detail.subtitle}</span>
                    <p className="video-lightbox-detail-desc">{item.video.detail.description}</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {visibleTags(item.video.detail.tags).map((tag) => (
                        <a key={tag} href={`/skills?t=${encodeURIComponent(tag)}`} style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--border-light)', color: 'var(--fg-muted)', fontFamily: 'var(--font-body)', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--fg-dim)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>{tag}</a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : item.piece.detail?.groupPieces ? (
              <>
                <div style={{ display: 'flex', borderRadius: '14px', overflow: 'hidden', maxHeight: '55vh' }}>
                  {item.piece.detail.groupPieces.map((gp, i) => {
                    const count = item.piece.detail!.groupPieces!.length;
                    const mid = (count - 1) / 2;
                    const offsetX = (i - mid) * 80;
                    return (
                      <motion.div
                        key={gp.src}
                        initial={{ opacity: 0, x: offsetX, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.9, delay: i * 0.12, ease: [0.25, 1, 0.5, 1] }}
                        style={{ flex: `${gp.width / gp.height}`, minWidth: 0 }}
                      >
                        <Image
                          src={gp.src}
                          alt={gp.alt}
                          width={gp.width}
                          height={gp.height}
                          quality={90}
                          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
                <motion.div
                  className="video-lightbox-detail"
                  style={{ maxWidth: 'none', paddingTop: '1rem' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
                >
                  <span className="video-lightbox-detail-name">{item.piece.detail.title}</span>
                  <p className="video-lightbox-detail-desc">{item.piece.detail.description}</p>
                  {item.piece.detail.tags && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {visibleTags(item.piece.detail.tags).map((tag) => (
                        <a key={tag} href={`/skills?t=${encodeURIComponent(tag)}`} style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--border-light)', color: 'var(--fg-muted)', fontFamily: 'var(--font-body)', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--fg-dim)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>{tag}</a>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            ) : (
              <>
                <div className={item.piece.cropBottom ? undefined : 'art-lightbox-image-wrap'} style={item.piece.cropBottom ? { maxHeight: '55vh', overflow: 'hidden', borderRadius: '14px' } : undefined}>
                  <Image
                    src={item.piece.src}
                    alt={item.piece.alt}
                    width={item.piece.width}
                    height={item.piece.height}
                    className="art-lightbox-image"
                    quality={90}
                    style={{
                      ...(item.piece.width / item.piece.height > 2 ? { maxWidth: '80vw' } : {}),
                      ...(item.piece.cropBottom ? { objectFit: 'cover', objectPosition: 'top', width: '100%', height: 'auto' } : {}),
                    }}
                  />
                </div>
                {item.piece.detail && (
                  <div className="video-lightbox-detail" style={item.piece.width / item.piece.height > 2 ? { maxWidth: 'none', paddingTop: '0.75rem' } : undefined}>
                    {item.piece.detail.href === '/projects/rewired' ? (
                      <>
                        <a href="/projects/rewired" className="video-lightbox-detail-header">
                          <img src="/images/rewired-app-icon.png" alt="Rewired" className="video-lightbox-detail-icon" />
                          <span className="video-lightbox-detail-name">Rewired</span>
                          <svg className="video-lightbox-detail-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </a>
                        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '0.75rem' }} />
                      </>
                    ) : item.piece.detail.href === '/projects/dossi' ? (
                      <>
                        <a href="/projects/dossi" className="video-lightbox-detail-header">
                          <img src="/images/dossi-app-icon.png" alt="Dossi" className="video-lightbox-detail-icon" />
                          <span className="video-lightbox-detail-name">Dossi</span>
                          <svg className="video-lightbox-detail-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </a>
                        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '0.75rem' }} />
                      </>
                    ) : null}
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)', display: 'block', marginBottom: '0.5rem' }}>{item.piece.detail.title}</span>
                    <p className="video-lightbox-detail-desc">{item.piece.detail.description}</p>
                    {item.piece.detail.href && !item.piece.detail.href.startsWith('/projects/') && (
                      <a href={item.piece.detail.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--fg-muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                        View in AP Art &amp; Design Exhibit →
                      </a>
                    )}
                    {item.piece.detail.tags && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                        {visibleTags(item.piece.detail.tags).map((tag) => (
                          <a key={tag} href={`/skills?t=${encodeURIComponent(tag)}`} style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--border-light)', color: 'var(--fg-muted)', fontFamily: 'var(--font-body)', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--fg-dim)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}>{tag}</a>
                        ))}
                      </div>
                    )}
                    {item.piece.detail.processImages && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '1rem' }}>
                        {item.piece.detail.processImages.map((img) => (
                          <Image key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} quality={80} style={{ width: '100%', height: 'auto', borderRadius: '6px' }} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
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
          transition={{ duration: 0.2, delay: 0.15 }}
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

export function ArtGalleryProvider({ children }: { children: React.ReactNode }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  const closeLightbox = useCallback(() => { setActiveIndex(null); setDirection(0); setOriginRect(null); }, []);
  const goPrev = useCallback(() => { setDirection(-1); setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)); }, []);
  const goNext = useCallback(() => { setDirection(1); setActiveIndex((i) => (i !== null && i < allItems.length - 1 ? i + 1 : i)); }, []);

  const openLightbox = useCallback((src: string, rect?: DOMRect) => {
    const idx = srcToIndex.get(src);
    if (idx !== undefined) {
      setOriginRect(rect ?? null);
      setDirection(0);
      setActiveIndex(idx);
    }
  }, []);

  const contextValue = useMemo(() => ({
    openLightbox,
    isLightboxOpen: activeIndex !== null,
  }), [openLightbox, activeIndex]);

  return (
    <GalleryContext.Provider value={contextValue}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeIndex !== null && (
            <UnifiedLightbox
              itemIndex={activeIndex}
              direction={direction}
              originRect={originRect}
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
  const { openLightbox } = useGalleryContext();
  return <ArtGallery galleryRows={rows} handleClick={(piece) => openLightbox(piece.src)} />;
}

export function ProductContent() {
  const { openLightbox } = useGalleryContext();
  return <ArtGallery galleryRows={productRows} handleClick={(piece) => openLightbox(piece.src)} />;
}

export function PhotographyContent() {
  const { openLightbox } = useGalleryContext();
  return <ArtGallery galleryRows={photoRows} handleClick={(piece) => openLightbox(piece.src)} />;
}

function AnimatedIllustrationCell({
  piece,
  delay,
  onClick,
}: {
  piece: IllustrationPiece;
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
      className={`illustration-item${piece.noFrame ? ' no-frame' : ''}`}
      style={{ aspectRatio: `${piece.width} / ${piece.height}` }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)', transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } }}
      transition={{ duration: 0.4, delay, ease: [0.25, 1, 0.5, 1] }}
    >
      <Image
        src={piece.src}
        alt={piece.alt}
        width={piece.width}
        height={piece.height}
        quality={85}
        style={{ width: '100%', height: 'auto' }}
      />
    </motion.div>
  );
}

export function IllustrationContent() {
  const { openLightbox } = useGalleryContext();
  return (
    <div className="illustration-grid">
      {illustrationPieces.map((piece, i) => (
        <AnimatedIllustrationCell
          key={piece.src}
          piece={piece}
          delay={i * 0.06}
          onClick={() => openLightbox(piece.src)}
        />
      ))}
    </div>
  );
}
