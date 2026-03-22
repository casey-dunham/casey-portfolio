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

    // If this folder starts open, show it immediately — no scroll trigger
    if (startOpen) {
      content.style.maxHeight = 'none';
      content.style.opacity = '1';
      return;
    }

    // Start closed
    content.style.maxHeight = '0px';
    content.style.opacity = '0';
    content.style.overflow = 'hidden';

    let trigger: ScrollTrigger | null = null;

    const setup = () => {
      // Measure content height
      content.style.maxHeight = 'none';
      content.style.opacity = '1';
      content.style.position = 'absolute';
      content.style.visibility = 'hidden';
      content.style.width = section.offsetWidth + 'px';

      const h = Math.max(inner.scrollHeight, 800);

      content.style.position = '';
      content.style.visibility = '';
      content.style.width = '';
      content.style.maxHeight = '0px';
      content.style.opacity = '0';

      if (trigger) trigger.kill();

      const scrollDistance = Math.max(h * 0.35, 350);

      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 65%',
        end: `+=${scrollDistance}`,
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          const eased = 1 - Math.pow(1 - p, 2.5);

          content.style.maxHeight = `${eased * h}px`;
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
      className={`folder-section ${isOpen ? 'is-open' : ''}`}
    >
      {/* Protruding folder tab */}
      <div className="folder-tab-wrapper">
        <div className="folder-tab">
          <span className="font-body text-[11px] text-fg-muted tracking-widest uppercase opacity-60">
            {folderNumber}
          </span>
          <h2 className="font-display text-sm md:text-base font-semibold tracking-tight"
            style={{ color: '#FFFFFF' }}
          >
            {title}
          </h2>
          {!startOpen && (
            <svg
              className="w-3.5 h-3.5 text-fg-muted transition-transform duration-500 ml-auto"
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </div>
      </div>

      {/* Folder body */}
      <div className="folder-body">
        <div ref={contentRef} className="folder-content">
          <div ref={innerRef}>{children}</div>
        </div>
      </div>
    </div>
  );
}
