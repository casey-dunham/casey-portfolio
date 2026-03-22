export default function RewiredProject() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 md:px-10 max-w-[1000px] mx-auto">
      <header className="mb-20">
        <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-4">
          Case Study
        </p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-tight tracking-tight text-fg mb-6">
          Rewired
        </h1>
        <p className="font-body text-fg-muted text-lg leading-relaxed max-w-2xl">
          A science-backed neuroplasticity app that helps users transform
          limiting beliefs through personalized daily sessions, combining
          psychoeducation, therapeutic exercises, and AI coaching.
        </p>
      </header>

      {/* Sections to be populated */}
      <div className="space-y-24">
        <Section title="Tech Stack" />
        <Section title="What It Does" />
        <Section title="The AI Orb" />
        <Section title="The Ribbon — From Idea to Reality" />
        <Section title="Illustration Gallery" />
        <Section title="Logo Exploration & App Icon" />
        <Section title="Design Brief — Textures" />
        <Section title="Avatar Picker" />
      </div>
    </main>
  );
}

function Section({ title }: { title: string }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-light text-fg mb-6 pb-4 border-b border-border">
        {title}
      </h2>
      <div className="min-h-[200px] bg-bg-raised rounded-xl border border-border flex items-center justify-center">
        <p className="text-fg-dim font-body text-sm uppercase tracking-widest">
          Content pending
        </p>
      </div>
    </section>
  );
}
