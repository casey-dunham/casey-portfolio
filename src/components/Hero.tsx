'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParagraphData {
  text: string;
  serifWords?: number[];
}

const paragraphs: ParagraphData[] = [
  {
    text: "I'm a designer and engineer who builds products that live at the intersection of health, technology, and human behavior. I care deeply about craft — the way an interface feels, the logic behind a flow, the moment something clicks for a user.",
    serifWords: [],
  },
  {
    text: "Most recently I've been building tools for people managing diabetes and exploring how AI can make health decisions feel less overwhelming. I believe the best digital products don't just function — they resonate.",
    serifWords: [],
  },
  {
    text: "When I'm not designing or writing code, I'm probably sketching, making music, or thinking about neuroplasticity. I'm always looking for the next thing to learn, build, and share with the world.",
    serifWords: [],
  },
];

const titleText = "Hi, I'm Casey. I design and build products in Atlanta.";
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
    <section ref={heroRef} className="relative px-[1rem] md:px-[2rem] lg:px-[3rem] max-w-[1400px] mx-auto">
      {/* Title — word-by-word stagger */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="min-h-[40vh] flex items-end pb-8 pt-28"
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
      <div ref={highlightRef} className="scroll-highlight-section">
        {paragraphs.map((para, pIndex) => {
          const words = splitIntoWords(para.text, para.serifWords);
          return (
            <p key={pIndex} className="scroll-highlight-paragraph">
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
