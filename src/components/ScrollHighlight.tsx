'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParagraphData {
  text: string;
  serifWords?: number[]; // indices of words to render in serif italic
}

const paragraphs: ParagraphData[] = [
  {
    text: "I'm a designer and engineer who builds products that live at the intersection of health, technology, and human behavior. I care deeply about craft — the way an interface feels, the logic behind a flow, the moment something clicks for a user.",
    serifWords: [7, 8, 22, 23],
  },
  {
    text: "Most recently I've been building tools for people managing diabetes and exploring how AI can make health decisions feel less overwhelming. I believe the best digital products don't just function — they resonate.",
    serifWords: [14, 15, 30],
  },
  {
    text: "When I'm not designing or writing code, I'm probably sketching, making music, or thinking about neuroplasticity. I'm always looking for the next thing to learn, build, and share with the world.",
    serifWords: [10, 11, 13],
  },
];

function splitIntoWords(text: string, serifIndices: number[] = []) {
  return text.split(' ').map((word, i) => ({
    word,
    isSerif: serifIndices.includes(i),
  }));
}

export default function ScrollHighlight() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = section.querySelectorAll('.word');

    // Create a ScrollTrigger for each word
    const triggers: ScrollTrigger[] = [];

    words.forEach((word, i) => {
      const trigger = ScrollTrigger.create({
        trigger: word,
        start: 'top 85%',
        end: 'top 40%',
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress;
          const opacity = 0.15 + progress * 0.85;
          (word as HTMLElement).style.opacity = String(opacity);
        },
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="scroll-highlight-section">
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
  );
}
