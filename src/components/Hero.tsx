'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DotField from './DotField';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParagraphData {
  text: string;
  serifWords?: number[];
}

const paragraphs: ParagraphData[] = [
  {
    text: "I believe that every interaction in our lives should feel intentional. Everything we touch, see, smell, and taste should be a thoughtful\u00a0experience.",
    serifWords: [],
  },
  {
    text: "There are hundreds of billions of products in the world, and we'll only ever interact with a tiny fraction of them. The ones we do should be meaningful and\u00a0beautiful.",
    serifWords: [],
  },
  {
    text: "I'm interested in creating things that meet that standard. I'm also curious how AI is expanding design beyond aesthetics into the full experience, redefining the role of the designer and opening new ways to shape how products are built and\u00a0experienced.",
    serifWords: [],
  },
];

const titleText = "Hi, I'm Casey. I love beautiful things.";
const titleWords = titleText.split(' ');

function splitIntoWords(text: string, serifIndices: number[] = []) {
  return text.split(' ').map((word, i) => ({
    word,
    isSerif: serifIndices.includes(i),
  }));
}

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: 0.3 + i * 0.04,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const firstParaRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = highlightRef.current;
    if (!section) return;

    const words = section.querySelectorAll('.word');
    const triggers: ScrollTrigger[] = [];

    words.forEach((word) => {
      const el = word as HTMLElement;
      const trigger = ScrollTrigger.create({
        trigger: word,
        start: 'top 85%',
        end: 'top 50%',
        scrub: 0.15,
        onUpdate: (self) => {
          const p = self.progress;
          if (p >= 0.95) {
            el.style.opacity = '1';
            el.style.color = '#FFFFFF';
          } else {
            el.style.opacity = String(0.08 + p * 0.92);
            el.style.color = '';
          }
        },
        onLeave: () => {
          el.style.opacity = '1';
          el.style.color = '#FFFFFF';
        },
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={heroRef} className="relative px-[1rem] md:px-[2rem] lg:px-[3rem] max-w-[1400px] mx-auto overflow-visible">
      <DotField anchorRef={firstParaRef} />
      {/* Title — word-by-word stagger */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="min-h-[40vh] flex items-end pb-8 pt-28 relative z-[1]"
      >
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-fg max-w-[700px]">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={wordVariants}
              style={{ display: 'inline-block', marginRight: '0.25em' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </motion.div>


      {/* Scroll-highlight paragraphs */}
      <div ref={highlightRef} className="scroll-highlight-section relative z-[1]">
        {paragraphs.map((para, pIndex) => {
          const words = splitIntoWords(para.text, para.serifWords);
          return (
            <p key={pIndex} ref={pIndex === 0 ? firstParaRef : undefined} className="scroll-highlight-paragraph">
              {words.map((w, wIndex) => (
                <span
                  key={wIndex}
                  className={`word${w.isSerif ? ' word-serif' : ''}`}
                >
                  {w.word}{' '}
                </span>
              ))}
            </p>
          );
        })}
      </div>
    </section>
  );
}
