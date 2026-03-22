export default function Contact() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
      <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-tight tracking-tight text-fg mb-16">
        Contact
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div>
            <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-2">
              Email
            </p>
            <a
              href="mailto:casey@dossi.dev"
              className="font-body text-lg text-fg hover:text-accent transition-colors"
            >
              casey@dossi.dev
            </a>
          </div>
          <div>
            <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-2">
              Location
            </p>
            <p className="font-body text-lg text-fg-muted">
              Philadelphia, PA
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-2">
              Resume
            </p>
            <p className="font-body text-fg-muted">
              Available upon request
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
