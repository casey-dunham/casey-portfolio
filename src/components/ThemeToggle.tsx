'use client';

import { useTheme } from '@/components/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-border text-fg-dim hover:text-fg hover:border-fg-dim transition-all duration-300 cursor-pointer"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="3.5" />
          <path d="M8 1.5v1M8 13.5v1M2.87 2.87l.71.71M12.42 12.42l.71.71M1.5 8h1M13.5 8h1M2.87 13.13l.71-.71M12.42 3.58l.71-.71" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.5 8.5a5.5 5.5 0 0 1-7.5-7.5 6 6 0 1 0 7.5 7.5z" />
        </svg>
      )}
    </button>
  );
}
