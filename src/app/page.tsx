import Hero from '@/components/Hero';
import FolderSection from '@/components/FolderSection';
import UXUIContent from '@/components/UXUIContent';
import VisualArtContent, { ProductContent, PhotographyContent, IllustrationContent, ArtGalleryProvider } from '@/components/VisualArtContent';
import ScrollToTop from '@/components/ScrollToTop';
import SectionTabs from '@/components/SectionTabs';
import ProjectsContent from '@/components/ProjectsContent';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <main>
      <Hero />

      <div className="max-w-[1400px] mx-auto">
        <SectionTabs
          galleryContent={
            <ArtGalleryProvider>
              <FolderSection title="UX / UI" index={0} startOpen>
                <UXUIContent />
              </FolderSection>

              <FolderSection title="Products" index={1} startOpen>
                <ProductContent />
              </FolderSection>

              <FolderSection title="Illustrations" index={2} startOpen>
                <IllustrationContent />
              </FolderSection>

              <FolderSection title="Fine Art" index={3} startOpen>
                <VisualArtContent />
              </FolderSection>

              <FolderSection title="Photography" index={4} startOpen>
                <PhotographyContent />
              </FolderSection>
            </ArtGalleryProvider>
          }
          projectsContent={<ProjectsContent />}
        />
      </div>

      <footer className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-16 border-t border-border">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          <div>
            <h3 className="font-display text-xl font-bold text-fg mb-5">Get in touch</h3>
            <div className="flex flex-col gap-2 font-body text-sm text-fg-muted">
              <a href="mailto:caseyedunham@gmail.com" className="hover:text-fg transition-colors">caseyedunham@gmail.com</a>
              <a href="tel:302-377-5638" className="hover:text-fg transition-colors">302-377-5638</a>
              <a href="https://www.linkedin.com/in/casey-dunham/" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">LinkedIn</a>
              <span>Atlanta, GA</span>
            </div>
          </div>
          <div className="md:self-end flex flex-col items-start md:items-end gap-3 font-body text-sm text-fg-dim">
            <ThemeToggle />
            <span>&copy; {new Date().getFullYear()} Casey Dunham</span>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </main>
  );
}
