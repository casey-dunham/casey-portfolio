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
              href="mailto:caseyedunham@gmail.com"
              className="font-body text-lg text-fg hover:text-accent transition-colors"
            >
              caseyedunham@gmail.com
            </a>
          </div>
          <div>
            <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-2">
              Phone
            </p>
            <a
              href="tel:302-377-5638"
              className="font-body text-lg text-fg hover:text-accent transition-colors"
            >
              302-377-5638
            </a>
          </div>
          <div>
            <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-2">
              LinkedIn
            </p>
            <a
              href="https://www.linkedin.com/in/casey-dunham/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-lg text-fg hover:text-accent transition-colors"
            >
              linkedin.com/in/casey-dunham
            </a>
          </div>
          <div>
            <p className="font-body text-xs text-fg-dim uppercase tracking-widest mb-2">
              Location
            </p>
            <p className="font-body text-lg text-fg-muted">
              Atlanta, GA
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
