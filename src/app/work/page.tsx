import Link from 'next/link';

const projects = [
  {
    slug: 'dossi',
    title: 'Dossi',
    tagline: 'Contextual Metabolic Intelligence',
    tags: ['iOS', 'Health Tech', 'Product Design', 'AI/ML'],
    color: '#6366F1',
  },
  {
    slug: 'rewired',
    title: 'Rewired',
    tagline: 'Neuroplasticity Transformation',
    tags: ['iOS', 'SwiftUI', 'Branding', 'AI Coaching'],
    color: '#8B5CF6',
  },
];

export default function Work() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
      <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-tight tracking-tight text-fg mb-16">
        Work
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link key={project.slug} href={`/work/${project.slug}`}>
            <div className="group relative aspect-[4/3] bg-bg-raised rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:border-border-light">
              {/* Gradient placeholder */}
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 30% 70%, ${project.color}40 0%, transparent 60%)`,
                }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-[0.7rem] font-body font-medium text-fg-dim bg-bg/60 backdrop-blur-sm rounded-full border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-3xl font-light text-fg mb-1">
                  {project.title}
                </h2>
                <p className="font-body text-sm text-fg-muted">
                  {project.tagline}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
