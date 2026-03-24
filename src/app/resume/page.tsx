'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import './resume-print.css';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] as const },
});

interface Theme {
  pageBg: string;
  paperBg: string;
  paperBorder: string;
  paperShadow: string;
  name: string;
  contact: string;
  contactDot: string;
  heading: string;
  subtext: string;
  muted: string;
  bullet: string;
  bulletDot: string;
  date: string;
  sectionBorder: string;
  accent: string;
  backLink: string;
  btnBg: string;
  btnBorder: string;
  btnText: string;
  footerBorder: string;
  footerText: string;
  navOverride: boolean;
}

const themes: Record<'dark' | 'light', Theme> = {
  dark: {
    pageBg: '#141414',
    paperBg: '#222222',
    paperBorder: '#333333',
    paperShadow: '0 1px 3px rgba(0,0,0,0.3), 0 8px 40px rgba(0,0,0,0.2)',
    name: '#F0F0F0',
    contact: '#999',
    contactDot: '#555',
    heading: '#E8E8E8',
    subtext: '#A0A0A0',
    muted: '#888',
    bullet: '#999',
    bulletDot: '#666',
    date: '#888',
    sectionBorder: '#383838',
    accent: '#9CA5FF',
    backLink: '#777',
    btnBg: '#222222',
    btnBorder: '#444',
    btnText: '#999',
    footerBorder: '#333',
    footerText: '#666',
    // nav doesn't need overriding in dark — it matches the site default
    navOverride: false,
  },
  light: {
    pageBg: '#FCFCFC',
    paperBg: '#FFFFFF',
    paperBorder: '#F0F0F0',
    paperShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 40px rgba(0,0,0,0.04)',
    name: '#1A1A1A',
    contact: '#777',
    contactDot: '#CCC',
    heading: '#1A1A1A',
    subtext: '#666',
    muted: '#888',
    bullet: '#555',
    bulletDot: '#CCC',
    date: '#999',
    sectionBorder: '#F0F0F0',
    accent: '#9CA5FF',
    backLink: '#999',
    btnBg: '#FFFFFF',
    btnBorder: '#E5E5E5',
    btnText: '#999',
    footerBorder: '#F0F0F0',
    footerText: '#CCC',
    navOverride: true,
  },
} as const;


export default function ResumePage() {
  const { theme: mode, setTheme: setMode } = useTheme();
  const t = themes[mode];

  return (
      <main
        className={`resume-page-${mode} min-h-screen pt-20 md:pt-24 pb-16 px-4 md:px-8`}
        style={{ background: t.pageBg, transition: 'background 0.4s ease' }}
      >
        {/* Back link */}
        <motion.div {...fade(0)} className="resume-back-link max-w-[820px] mx-auto mb-6">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm tracking-wide hover:opacity-60 transition-opacity"
            style={{ color: t.backLink, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
            Back
          </Link>
        </motion.div>

        {/* Paper */}
        <motion.div
          {...fade(0.1)}
          className="resume-paper max-w-[820px] mx-auto rounded-lg px-5 sm:px-10 md:px-14 py-8 sm:py-10 md:py-12"
          style={{
            background: t.paperBg,
            boxShadow: t.paperShadow,
            border: `1px solid ${t.paperBorder}`,
            transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
          }}
        >
          {/* Header */}
          <div className="resume-header mb-8 text-center">
            <motion.h1
              {...fade(0.15)}
              className="resume-name font-bold tracking-tight mb-2"
              style={{
                fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)',
                fontSize: '28px',
                color: t.name,
                letterSpacing: '-0.02em',
                transition: 'color 0.4s ease',
              }}
            >
              Casey Dunham
            </motion.h1>
            <motion.div
              {...fade(0.2)}
              className="resume-contact flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
              style={{
                fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)',
                fontSize: '12px',
                color: t.contact,
                transition: 'color 0.4s ease',
              }}
            >
              <span>Atlanta, GA 30322</span>
              <span className="resume-contact-dot" style={{ color: t.contactDot, margin: '0 4px' }}>·</span>
              <a href="mailto:cdunham31@gatech.edu" className="hover:opacity-60 transition-opacity" style={{ color: t.contact }}>cdunham31@gatech.edu</a>
              <span className="resume-contact-dot" style={{ color: t.contactDot, margin: '0 4px' }}>·</span>
              <span>302-377-5638</span>
              <span className="resume-contact-dot" style={{ color: t.contactDot, margin: '0 4px' }}>·</span>
              <a href="https://linkedin.com/in/casey-dunham" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity" style={{ color: t.contact }}>linkedin.com/in/casey-dunham</a>
            </motion.div>
          </div>

          {/* Education */}
          <ResumeSection title="Education" delay={0.25} theme={t}>
            <div className="resume-edu-row flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
              <div className="flex-1">
                <p className="resume-edu-school font-semibold" style={{ fontSize: '13px', color: t.heading, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', transition: 'color 0.4s ease' }}>
                  Georgia Institute of Technology
                  <span className="resume-edu-detail font-normal" style={{ color: t.subtext }}>, Atlanta, GA</span>
                </p>
                <p className="resume-edu-detail" style={{ fontSize: '12px', color: t.subtext, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)' }}>
                  Bachelor of Science in Industrial Design — GPA: 4.00/4.00
                </p>
              </div>
              <span className="resume-edu-date whitespace-nowrap" style={{ fontSize: '11px', color: t.date, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontVariantNumeric: 'tabular-nums' }}>
                May 2027
              </span>
            </div>
            <div className="resume-edu-row flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <div className="flex-1">
                <p className="resume-edu-school font-semibold" style={{ fontSize: '13px', color: t.heading, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', transition: 'color 0.4s ease' }}>
                  Wilmington Christian School
                  <span className="resume-edu-detail font-normal" style={{ color: t.subtext }}>, Hockessin, DE</span>
                </p>
                <p className="resume-edu-detail" style={{ fontSize: '12px', color: t.subtext, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)' }}>
                  Valedictorian (1/50) — GPA: 4.70/4.00
                </p>
              </div>
              <span className="resume-edu-date whitespace-nowrap" style={{ fontSize: '11px', color: t.date, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontVariantNumeric: 'tabular-nums' }}>
                June 2025
              </span>
            </div>
          </ResumeSection>

          {/* Projects */}
          <ResumeSection title="Projects" delay={0.3} theme={t}>
            <div className="resume-project-block mb-4">
              <p className="resume-project-title font-semibold" style={{ fontSize: '13px', color: t.heading, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', transition: 'color 0.4s ease' }}>
                Dossi
                <span className="resume-project-subtitle font-normal" style={{ color: t.subtext }}> — Intelligent Insulin Delivery iOS App</span>
              </p>
              <Bullet theme={t}>Built a full-stack iOS app in SwiftUI that connects directly to insulin pumps via Bluetooth LE to deliver automated bolus dosing with insulin-on-board tracking and safety checks</Bullet>
              <Bullet theme={t}>Developed a Bayesian attribution engine and ML prediction service for glucose forecasting, pattern detection, and personalized basal rate optimization</Bullet>
              <Bullet theme={t}>Integrated CGM monitoring, HealthKit sync, AI-powered meal recognition with photo-based carb estimation, and a natural language diabetes assistant</Bullet>
              <Bullet theme={t}>Designed complete brand identity, onboarding UX, and watchOS companion; conducted user research through Georgia Tech Disability Services</Bullet>
            </div>
            <div className="resume-project-block">
              <p className="resume-project-title font-semibold" style={{ fontSize: '13px', color: t.heading, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', transition: 'color 0.4s ease' }}>
                Rewired
                <span className="resume-project-subtitle font-normal" style={{ color: t.subtext }}> — Neuroplasticity iOS App</span>
              </p>
              <Bullet theme={t}>Designed and developed an iOS app combining psychoeducation, therapeutic exercises, and AI coaching to help users transform limiting beliefs through personalized daily sessions</Bullet>
              <Bullet theme={t}>Built adaptive session engine, custom illustrations, and brand identity from concept through implementation</Bullet>
            </div>
          </ResumeSection>

          {/* Experience */}
          <ResumeSection title="Experience" delay={0.35} theme={t}>
            <div className="resume-exp-block mb-4">
              <div className="resume-exp-header flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                <p className="resume-exp-company font-semibold" style={{ fontSize: '13px', color: t.heading, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', transition: 'color 0.4s ease' }}>
                  Breakthrough T1D
                  <span className="font-normal" style={{ color: t.subtext }}>, King of Prussia, PA</span>
                  <span className="resume-exp-role font-normal" style={{ color: t.muted }}> — Youth Ambassador</span>
                </p>
                <span className="resume-exp-date whitespace-nowrap" style={{ fontSize: '11px', color: t.date, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontVariantNumeric: 'tabular-nums' }}>
                  2023–2025
                </span>
              </div>
              <Bullet theme={t}>Advocated to members of Congress on diabetes legislation and insulin pricing policy</Bullet>
              <Bullet theme={t}>Mentored younger individuals newly diagnosed with Type 1 Diabetes</Bullet>
            </div>
            <div className="resume-exp-block">
              <div className="resume-exp-header flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                <p className="resume-exp-company font-semibold" style={{ fontSize: '13px', color: t.heading, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', transition: 'color 0.4s ease' }}>
                  Fontspring
                  <span className="font-normal" style={{ color: t.subtext }}>, Wilmington, DE</span>
                  <span className="resume-exp-role font-normal" style={{ color: t.muted }}> — Administrative Assistant</span>
                </p>
                <span className="resume-exp-date whitespace-nowrap" style={{ fontSize: '11px', color: t.date, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontVariantNumeric: 'tabular-nums' }}>
                  2021–2022
                </span>
              </div>
              <Bullet theme={t}>Extracted, cleaned, and organized font licensing database records; managed client email communications</Bullet>
            </div>
          </ResumeSection>

          {/* Honors & Awards */}
          <ResumeSection title="Honors & Awards" delay={0.4} theme={t}>
            <HonorRow name="College of Design Dean's Scholarship" org="Georgia Institute of Technology" date="June 2025" theme={t} />
            <HonorRow name="Coca-Cola Scholar, Semifinalist" org="Coca-Cola Scholars Foundation" date="March 2025" theme={t} />
            <HonorRow name="2025 Most Valuable Student Scholarship" org="Elks National Foundation" date="April 2025" theme={t} />
            <HonorRow name="Charles M. Hebner Memorial Scholarship" org="Delaware Higher Education Office" date="June 2025" theme={t} />
            <HonorRow name="Delaware Diabetes Coalition Scholarship" org="Delaware Diabetes Coalition" date="June 2025" theme={t} />
            <HonorRow name="National Silver Medal" org="Scholastic Art & Writing Awards" date="Feb. 2022" theme={t} />
            <HonorRow name="Maestro Award" org="WorldStrides" date="June 2025" theme={t} />
          </ResumeSection>

          {/* Leadership */}
          <ResumeSection title="Leadership" delay={0.45} theme={t}>
            <LeadershipRow name="National Honor Society" role="President & Secretary" date="2023–2025" theme={t} />
            <LeadershipRow name="Student Government" role="Secretary, Class of 2025" date="2022–2025" theme={t} />
            <LeadershipRow name="Delaware Youth Symphony Orchestra" role="Assistant Concertmaster" date="2023–2025" theme={t} />
            <LeadershipRow name="Delaware All-State Orchestra" role="Assistant Concertmaster" date="Feb. 2024" theme={t} />
            <LeadershipRow name="Faith Presbyterian Church" role="Volunteer, Worship Team (250+ hours)" date="2017–2025" theme={t} />
          </ResumeSection>

          {/* Skills */}
          <ResumeSection title="Skills" delay={0.5} theme={t}>
            <SkillRow label="Programming" value="Swift, SwiftUI, TypeScript, React, Next.js, Python, HTML/CSS, Git" theme={t} />
            <SkillRow label="Design" value="Figma, Adobe Creative Suite, Fusion 360" theme={t} />
            <SkillRow label="AI Tools" value="Claude Code, Codex, Cursor, Windsurf, Gemini" theme={t} />
            <SkillRow label="Languages" value="English; Conversational in German" theme={t} />
          </ResumeSection>
        </motion.div>

        {/* Print button */}
        <motion.div {...fade(0.55)} className="resume-print-btn max-w-[820px] mx-auto mt-6 flex justify-center">
          <button
            onClick={() => {
              const prev = mode;
              setMode('light');
              const restore = () => {
                setMode(prev);
                window.removeEventListener('afterprint', restore);
              };
              window.addEventListener('afterprint', restore);
              setTimeout(() => window.print(), 100);
            }}
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer"
            style={{
              fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)',
              color: t.btnText,
              border: `1px solid ${t.btnBorder}`,
              background: t.btnBg,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#9CA5FF';
              e.currentTarget.style.color = '#9CA5FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = t.btnBorder;
              e.currentTarget.style.color = t.btnText;
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
              <path d="M4 6V2h8v4" />
              <rect x="2" y="6" width="12" height="6" rx="1" />
              <path d="M4 12v2h8v-2" />
            </svg>
            Print Resume
          </button>
        </motion.div>

        {/* Screen-only footer */}
        <motion.footer {...fade(0.6)} className="resume-screen-footer max-w-[820px] mx-auto mt-16 pt-8 text-center" style={{ borderTop: `1px solid ${t.footerBorder}` }}>
          <p style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontSize: '12px', color: t.footerText }}>
            &copy; {new Date().getFullYear()} Casey Dunham
          </p>
        </motion.footer>
      </main>
    );
}

/* ── Section wrapper ── */

function ResumeSection({ title, delay, theme, children }: { title: string; delay: number; theme: Theme; children: React.ReactNode }) {
  return (
    <motion.section {...fade(delay)} className="resume-section mb-6">
      <h2
        className="resume-section-title uppercase font-semibold pb-2 mb-4"
        style={{
          fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: theme.accent,
          borderBottom: `1px solid ${theme.sectionBorder}`,
          transition: 'border-color 0.4s ease',
        }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

/* ── Bullet point ── */

function Bullet({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <p
      className="resume-bullet relative"
      style={{
        fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)',
        fontSize: '12px',
        lineHeight: '1.55',
        color: theme.bullet,
        paddingLeft: '14px',
        marginBottom: '2px',
        transition: 'color 0.4s ease',
      }}
    >
      <span className="resume-bullet-dot absolute" style={{ left: 0, top: '0px', color: theme.bulletDot, fontSize: '10px' }}>&#x2022;</span>
      {children}
    </p>
  );
}

/* ── Honor row ── */

function HonorRow({ name, org, date, theme }: { name: string; org: string; date: string; theme: Theme }) {
  return (
    <div className="resume-honor-row flex flex-col sm:flex-row sm:items-baseline sm:justify-between" style={{ marginBottom: '3px' }}>
      <p style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontSize: '12px' }}>
        <span className="resume-honor-name font-medium" style={{ color: theme.heading, transition: 'color 0.4s ease' }}>{name}</span>
        <span className="resume-honor-org" style={{ color: theme.muted }}>, {org}</span>
      </p>
      <span className="resume-honor-date whitespace-nowrap" style={{ fontSize: '11px', color: theme.date, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontVariantNumeric: 'tabular-nums' }}>
        {date}
      </span>
    </div>
  );
}

/* ── Leadership row ── */

function LeadershipRow({ name, role, date, theme }: { name: string; role: string; date: string; theme: Theme }) {
  return (
    <div className="resume-leadership-row flex flex-col sm:flex-row sm:items-baseline sm:justify-between" style={{ marginBottom: '3px' }}>
      <p style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontSize: '12px' }}>
        <span className="resume-leadership-name font-medium" style={{ color: theme.heading, transition: 'color 0.4s ease' }}>{name}</span>
        <span className="resume-leadership-role" style={{ color: theme.muted }}> — {role}</span>
      </p>
      <span className="resume-leadership-date whitespace-nowrap" style={{ fontSize: '11px', color: theme.date, fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontVariantNumeric: 'tabular-nums' }}>
        {date}
      </span>
    </div>
  );
}

/* ── Skill row ── */

function SkillRow({ label, value, theme }: { label: string; value: string; theme: Theme }) {
  return (
    <div className="resume-skills-row flex" style={{ marginBottom: '3px' }}>
      <span className="resume-skills-label font-medium" style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontSize: '12px', color: theme.heading, minWidth: '90px', transition: 'color 0.4s ease' }}>
        {label}
      </span>
      <span className="resume-skills-value" style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)', fontSize: '12px', color: theme.subtext }}>
        {value}
      </span>
    </div>
  );
}
