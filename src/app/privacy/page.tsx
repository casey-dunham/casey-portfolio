import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Casey Dunham',
  description: 'Privacy policy for caseydunham.design.',
};

const EFFECTIVE_DATE = 'April 14, 2025';
const SITE_URL = 'https://www.caseydunham.design';
const CONTACT_EMAIL = 'caseyedunham@gmail.com';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-10 max-w-[780px] mx-auto">
      <h1 className="font-display text-3xl md:text-5xl font-bold text-fg leading-tight tracking-tight mb-4">
        Privacy Policy
      </h1>
      <p className="font-body text-sm text-fg-dim mb-12">
        Effective date: {EFFECTIVE_DATE}
      </p>

      <div className="space-y-10 font-body text-fg-muted text-[0.95rem] leading-[1.8]">
        {/* 1. Overview */}
        <section>
          <h2 className="font-display text-xl font-bold text-fg mb-3">1. Overview</h2>
          <p>
            This privacy policy describes how Casey Dunham (&ldquo;I&rdquo;, &ldquo;me&rdquo;, or
            &ldquo;my&rdquo;) collects, uses, and handles information when you visit{' '}
            <a href={SITE_URL} className="text-accent hover:underline">
              {SITE_URL}
            </a>{' '}
            (the &ldquo;Site&rdquo;). I take your privacy seriously and keep data
            collection to the absolute minimum necessary to understand how the Site is
            used.
          </p>
        </section>

        {/* 2. Information collected */}
        <section>
          <h2 className="font-display text-xl font-bold text-fg mb-3">
            2. Information I Collect
          </h2>
          <p className="mb-4">
            The Site is a personal portfolio. I do not operate any user accounts,
            contact forms, or databases that store your personal information. However,
            the following data may be collected automatically:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <span className="text-fg font-medium">Usage analytics</span> — page views,
              referrer, country, browser type, device type, and operating system. This
              data is collected by Vercel Analytics (see Section 3) and is
              aggregated&nbsp;/ anonymized; it is not linked to any individual.
            </li>
            <li>
              <span className="text-fg font-medium">Standard server logs</span> — your
              IP address and the pages you request may appear in Vercel&rsquo;s
              infrastructure logs for security and operational purposes. These logs are
              retained according to Vercel&rsquo;s own data-retention policies.
            </li>
          </ul>
        </section>

        {/* 3. Third-party services */}
        <section>
          <h2 className="font-display text-xl font-bold text-fg mb-3">
            3. Third-Party Services
          </h2>

          <h3 className="text-fg font-semibold mb-1">Vercel Analytics</h3>
          <p className="mb-4">
            The Site uses{' '}
            <a
              href="https://vercel.com/docs/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Vercel Analytics
            </a>
            , a privacy-focused analytics tool. Vercel Analytics does not use cookies
            or fingerprinting to track individual users across sessions. The data it
            collects is aggregated and anonymous. You can learn more about how Vercel
            handles data in their{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>

          <h3 className="text-fg font-semibold mb-1">Google Fonts</h3>
          <p className="mb-4">
            The Site loads fonts (DM Sans and DM Serif Display) from the Google Fonts
            API via Next.js&rsquo;s built-in font optimization. Next.js downloads font
            files at build time and serves them from Vercel&rsquo;s own infrastructure,
            so your browser does <strong>not</strong> make a direct request to Google
            servers when you visit the Site. No data is sent to Google as a result of
            loading these fonts.
          </p>

          <h3 className="text-fg font-semibold mb-1">Vercel (Hosting)</h3>
          <p>
            The Site is hosted on Vercel. Vercel may process technical data (such as IP
            addresses) as part of providing hosting and CDN services. See Vercel&rsquo;s{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Privacy Policy
            </a>{' '}
            for details.
          </p>
        </section>

        {/* 4. Cookies */}
        <section>
          <h2 className="font-display text-xl font-bold text-fg mb-3">4. Cookies</h2>
          <p>
            The Site itself does not set any cookies. Your browser may store a theme
            preference (&ldquo;light&rdquo; or &ldquo;dark&rdquo;) in{' '}
            <code className="text-[0.85em] bg-surface px-1.5 py-0.5 rounded">
              localStorage
            </code>
            ; this data never leaves your device and is not transmitted to any server.
            Vercel Analytics does not use cookies.
          </p>
        </section>

        {/* 5. Contact information */}
        <section>
          <h2 className="font-display text-xl font-bold text-fg mb-3">
            5. Contact Information You Share
          </h2>
          <p>
            The contact page displays my email address and phone number so you can
            reach me directly. Any message you send me via email is handled by
            your own email provider and mine (Gmail). I do not use any third-party
            contact-form service or CRM to collect or store your messages.
          </p>
        </section>

        {/* 6. Children */}
        <section>
          <h2 className="font-display text-xl font-bold text-fg mb-3">
            6. Children&rsquo;s Privacy
          </h2>
          <p>
            The Site is not directed at children under 13. I do not knowingly collect
            any personal information from children.
          </p>
        </section>

        {/* 7. Changes */}
        <section>
          <h2 className="font-display text-xl font-bold text-fg mb-3">
            7. Changes to This Policy
          </h2>
          <p>
            I may update this policy from time to time. The effective date at the top
            of this page will reflect the date of the most recent revision. Continued
            use of the Site after any changes constitutes your acceptance of the
            revised policy.
          </p>
        </section>

        {/* 8. Contact */}
        <section>
          <h2 className="font-display text-xl font-bold text-fg mb-3">8. Contact</h2>
          <p>
            If you have any questions about this privacy policy, feel free to reach out:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-accent hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
