'use client';

import { createContext, useContext } from 'react';

interface GalleryContextValue {
  openLightbox: (src: string, rect?: DOMRect) => void;
  isLightboxOpen: boolean;
}

export const GalleryContext = createContext<GalleryContextValue>({
  openLightbox: () => {},
  isLightboxOpen: false,
});

export function useGalleryContext() {
  return useContext(GalleryContext);
}
