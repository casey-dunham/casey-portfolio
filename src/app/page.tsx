import Hero from '@/components/Hero';
import FolderSection from '@/components/FolderSection';
import UXUIContent from '@/components/UXUIContent';
import VisualArtContent, { ProductContent, PhotographyContent, ArtGalleryProvider } from '@/components/VisualArtContent';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <main>
      <Hero />

      <div className="max-w-[1400px] mx-auto">
        <ArtGalleryProvider>
          <FolderSection title="UX / UI" index={0} startOpen>
            <UXUIContent />
          </FolderSection>

          <FolderSection title="Products" index={1}>
            <ProductContent />
          </FolderSection>

          <FolderSection title="Fine Art" index={2}>
            <VisualArtContent />
          </FolderSection>

          <FolderSection title="Photography" index={3}>
            <PhotographyContent />
          </FolderSection>
        </ArtGalleryProvider>

      </div>

      <footer className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-16 border-t border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          <div>
            <h3 className="font-display text-xl font-bold text-fg mb-4">
              Get in touch
            </h3>
            <div className="flex flex-col gap-2 font-body text-sm text-fg-muted">
              <a href="mailto:caseyedunham@gmail.com" className="hover:text-fg transition-colors">
                caseyedunham@gmail.com
              </a>
              <a href="tel:302-377-5638" className="hover:text-fg transition-colors">
                302-377-5638
              </a>
              <a href="https://www.linkedin.com/in/casey-dunham/" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">
                LinkedIn
              </a>
              <span>Atlanta, GA</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-body text-sm text-fg-dim">
            <span>&copy; {new Date().getFullYear()} Casey Dunham</span>
            <span>Designed & built by hand</span>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </main>
  );
}
