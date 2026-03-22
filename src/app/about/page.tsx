export default function About() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
      <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-tight tracking-tight text-fg mb-16">
        About
      </h1>

      {/* Portrait + Bio */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        <div className="aspect-[3/4] bg-bg-raised rounded-2xl border border-border" />
        <div className="flex flex-col justify-center gap-6">
          <p className="font-body text-fg-muted text-lg leading-relaxed">
            {/* Bio text will go here */}
          </p>
        </div>
      </section>

      {/* Skills Bubbles */}
      <section className="mb-24">
        <h2 className="font-display text-2xl font-light text-fg mb-8">
          Proficiencies
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            'Product Design',
            'Branding',
            'Web Design',
            'Pitch Decks',
            'Design Systems',
            'UX Research',
            'Prototyping',
            'iOS Development',
            'SwiftUI',
            'React',
            'Figma',
            'Illustrator',
            'After Effects',
            'Procreate',
          ].map((skill) => (
            <span
              key={skill}
              className="px-5 py-2.5 text-sm font-body font-medium text-fg-muted border border-border rounded-full hover:border-fg-dim hover:text-fg transition-all duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-24">
        <h2 className="font-display text-2xl font-light text-fg mb-8">
          Timeline
        </h2>
        <div className="border-l border-border pl-8 flex flex-col gap-10">
          {/* Timeline entries will go here */}
          <div className="relative">
            <div className="absolute -left-[calc(2rem+4.5px)] top-1.5 w-2 h-2 rounded-full bg-accent" />
            <p className="text-xs font-body text-fg-dim uppercase tracking-widest mb-1">
              Timeline entries will be populated
            </p>
          </div>
        </div>
      </section>

      {/* Resume */}
      <section>
        <h2 className="font-display text-2xl font-light text-fg mb-8">
          Resume
        </h2>
        <div className="p-8 bg-bg-raised rounded-2xl border border-border">
          <p className="text-fg-dim font-body text-sm">
            Resume content will be added here.
          </p>
        </div>
      </section>
    </main>
  );
}
