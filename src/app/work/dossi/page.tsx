export default function DossiProject() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 md:px-10 max-w-[1000px] mx-auto">
      <header className="mb-20">
        <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-4">
          Case Study
        </p>
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-tight tracking-tight text-fg mb-6">
          Dossi
        </h1>
        <p className="font-body text-fg-muted text-lg leading-relaxed max-w-2xl">
          Contextual metabolic intelligence for Type 1 Diabetes. An iOS app
          that uses Bayesian machine learning to infer why glucose moves the
          way it does.
        </p>
      </header>

      {/* Sections to be populated */}
      <div className="space-y-24">
        <Section title="Original Vision" />
        <Section title="Timeline" />
        <Section title="Feature Callouts" />
        <Section title="Interview & Customer Discovery" />
        <Section title="Design Process & Iteration" />
        <Section title="App Icon Ideation" />
        <Section title="AI Coding Highlight" />
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
