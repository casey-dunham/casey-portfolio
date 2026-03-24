'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  startOpen = true,
  children,
}: FolderSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(startOpen);
  const manuallyClosedRef = useRef(false);

  const toggle = useCallback(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner) return;

    if (isOpen) {
      manuallyClosedRef.current = true;
      const h = content.scrollHeight;
      content.style.maxHeight = h + 'px';
      content.offsetHeight;
      gsap.to(content, {
        maxHeight: 0,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          content.style.overflow = 'hidden';
        },
      });
      setIsOpen(false);
    } else {
      manuallyClosedRef.current = false;
      content.style.overflow = 'hidden';
      content.style.maxHeight = '0px';
      const h = inner.scrollHeight + 100;
      gsap.to(content, {
        maxHeight: h,
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        onComplete: () => {
          content.style.maxHeight = 'none';
          content.style.overflow = '';
        },
      });
      setIsOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const content = contentRef.current;
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!content || !section || !inner) return;

    if (startOpen) {
      content.style.maxHeight = 'none';
      content.style.opacity = '1';
      return;
    }

    content.style.maxHeight = '0px';
    content.style.opacity = '0';
    content.style.overflow = 'hidden';

    // Auto-open when scrolled into view (one-time, scroll down only)
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (manuallyClosedRef.current) return;
        const h = inner.scrollHeight + 100;
        gsap.to(content, {
          maxHeight: h,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            content.style.maxHeight = 'none';
            content.style.overflow = '';
            ScrollTrigger.refresh();
          },
        });
        setIsOpen(true);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [startOpen]);

  return (
    <div
      ref={sectionRef}
      className={`section-block ${isOpen ? 'is-open' : ''}`}
    >
      <div className="section-header" onClick={toggle} style={{ cursor: 'pointer' }}>
        <h2 className="section-title">{title.toUpperCase()}</h2>
        <button
          className="section-toggle-btn"
          aria-label={isOpen ? `Close ${title}` : `Open ${title}`}
          tabIndex={-1}
        >
          <span className="toggle-bar" />
          <span className="toggle-bar" />
          <span className="toggle-bar" />
        </button>
      </div>

      <div className="section-body">
        <div ref={contentRef} className="folder-content">
          <div ref={innerRef}>{children}</div>
        </div>
      </div>
    </div>
  );
}
