'use client';

import { useState, useEffect, type ReactNode } from 'react';

type Tab = 'gallery' | 'projects';

const tabInfo = {
  gallery: {
    title: 'Gallery',
    subtitle: 'A collection of my creative work across disciplines.',
  },
  projects: {
    title: 'Projects',
    subtitle: 'A few things I\u2019ve been building.',
  },
};

export default function SectionTabs({
  galleryContent,
  projectsContent,
}: {
  galleryContent: ReactNode;
  projectsContent: ReactNode;
}) {
  const [active, setActive] = useState<Tab>('gallery');

  // Read hash on mount and on hash change
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === '#projects') setActive('projects');
      else if (window.location.hash === '#gallery') setActive('gallery');
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const switchTab = (tab: Tab) => {
    setActive(tab);
    window.history.replaceState(null, '', `#${tab}`);
  };

  const { title, subtitle } = tabInfo[active];

  return (
    <>
      <div id="section-tabs" className="px-4 md:px-8 lg:px-12 pt-16 pb-8">
        <div className="inline-flex items-center gap-1 rounded-full bg-surface border border-border p-1 -ml-1">
          <button
            onClick={() => switchTab('gallery')}
            className={`px-5 py-1.5 rounded-full text-sm font-body font-medium tracking-wide transition-all duration-200 ${
              active === 'gallery'
                ? 'bg-fg text-bg'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => switchTab('projects')}
            className={`px-5 py-1.5 rounded-full text-sm font-body font-medium tracking-wide transition-all duration-200 ${
              active === 'projects'
                ? 'bg-fg text-bg'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Projects
          </button>
        </div>
      </div>
      {active === 'gallery' ? galleryContent : projectsContent}
    </>
  );
}
