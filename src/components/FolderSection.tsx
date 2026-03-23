'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FolderSectionProps {
  title: string;
  index: number;
  startOpen?: boolean;
  children: React.ReactNode;
}

export default function FolderSection({
  title,
  index,
  startOpen = false,
  children,
}: FolderSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(startOpen);

  useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    const section = sectionRef.current;
    if (!content || !inner || !section) return;

    if (startOpen) {
      content.style.maxHeight = 'none';
      content.style.opacity = '1';
      return;
    }

    content.style.maxHeight = '0px';
    content.style.opacity = '0';
    content.style.overflow = 'hidden';

    let trigger: ScrollTrigger | null = null;

    const setup = () => {
      content.style.maxHeight = 'none';
      content.style.opacity = '1';
      content.style.position = 'absolute';
      content.style.visibility = 'hidden';
      content.style.width = section.offsetWidth + 'px';

      const h = Math.max(inner.scrollHeight, 800) + 200; // extra buffer for lazy-loaded images

      content.style.position = '';
      content.style.visibility = '';
      content.style.width = '';
      content.style.maxHeight = '0px';
      content.style.opacity = '0';

      if (trigger) trigger.kill();

      const scrollDistance = Math.max(h * 0.6, 600);

      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        end: `+=${scrollDistance}`,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          const eased = 1 - Math.pow(1 - p, 2.5);

          if (p >= 0.98) {
            // Fully open — remove max-height constraint so nothing clips
            content.style.maxHeight = 'none';
          } else {
            content.style.maxHeight = `${eased * h}px`;
          }
          content.style.opacity = `${Math.min(1, p * 2)}`;

          setIsOpen(p > 0.02);
        },
        onLeaveBack: () => {
          content.style.maxHeight = '0px';
          content.style.opacity = '0';
          setIsOpen(false);
        },
      });

      ScrollTrigger.refresh();
    };

    const timer = setTimeout(setup, 500);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      if (trigger) trigger.kill();
    };
  }, [startOpen]);

  const folderNumber = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={sectionRef}
      className={`section-block ${isOpen ? 'is-open' : ''}`}
    >
      <div className="section-header">
        <span className="section-number">{folderNumber}</span>
        <h2 className="section-title">{title}</h2>
      </div>

      <div className="section-body">
        <div ref={contentRef} className="folder-content">
          <div ref={innerRef}>{children}</div>
        </div>
      </div>
    </div>
  );
}
