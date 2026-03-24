'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollArrow() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hasScrolled = false;

    const onScroll = () => {
      if (window.scrollY > 10) {
        hasScrolled = true;
        setVisible(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const timer = setTimeout(() => {
      if (!hasScrolled && window.scrollY <= 10) {
        setVisible(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => {
            window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' });
          }}
          aria-label="Scroll down"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
        >
          <motion.svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-fg-muted"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
