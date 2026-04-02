import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Brent Schoenmakers',
  description: 'Privacy policy for Brent Schoenmakers portfolio website.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.6'
    }}>
      <h1>Privacy Policy</h1>
      <p><em>Last updated: February 4, 2026</em></p>

      <section style={{ marginTop: '2rem' }}>
        <h2>Introduction</h2>
        <p>
          This Privacy Policy explains how Brent Schoenmakers ("I", "me", or "my") 
          collects, uses, and protects your information when you visit this website 
          (www.brentweb.eu).
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Information Collection</h2>
        <h3>Analytics Data</h3>
        <p>
          This website uses Google Analytics to collect anonymized information about 
          how visitors use the site. This includes:
        </p>
        <ul>
          <li>Pages visited and time spent on each page</li>
          <li>Browser type and version</li>
          <li>Device type and screen resolution</li>
          <li>Geographic location (country/city level)</li>
          <li>Referral source (how you found this website)</li>
        </ul>
        <p>
          Google Analytics uses cookies to track this information. You can opt out of 
          Google Analytics by installing the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" style={{ color: '#0066cc' }}>
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>

        <h3>Contact Forms</h3>
        <p>
          When you use the contact form on this website, I collect:
        </p>
        <ul>
          <li>Your name</li>
          <li>Email address</li>
          <li>Message content</li>
        </ul>
        <p>
          This information is used solely to respond to your inquiry and is not shared 
          with third parties.
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Cookies</h2>
        <p>This website uses the following types of cookies:</p>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Required for the website to function 
            properly (e.g. theme preferences)
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Google Analytics cookies to understand 
            website usage and improve user experience
          </li>
        </ul>
        <p>
          You can control cookies through your browser settings. However, disabling 
          cookies may affect website functionality.
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Data Security</h2>
        <p>
          I implement security measures to protect your information, including:
        </p>
        <ul>
          <li>HTTPS encryption for all data transmission</li>
          <li>Strict Transport Security (HSTS) headers</li>
          <li>Regular security updates and monitoring</li>
        </ul>
        <p>
          However, no method of transmission over the internet is 100% secure, and 
          I cannot guarantee absolute security.
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Third-Party Services</h2>
        <p>This website uses the following third-party services:</p>
        <ul>
          <li>
            <strong>Google Analytics:</strong> For website analytics. See{' '}
            <a href="https://policies.google.com/privacy" style={{ color: '#0066cc' }}>
              Google's Privacy Policy
            </a>
          </li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal information I hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Opt out of analytics tracking</li>
        </ul>
        <p>
          To exercise these rights, please contact me at{' '}
          <a href="mailto:brent@brentweb.eu" style={{ color: '#0066cc' }}>
            brent@brentweb.eu
          </a>
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Children's Privacy</h2>
        <p>
          This website is not intended for children under 13 years of age. I do not 
          knowingly collect personal information from children.
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Changes to This Policy</h2>
        <p>
          I may update this Privacy Policy from time to time. The updated version will 
          be indicated by an updated "Last updated" date at the top of this page.
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Contact</h2>
        <p>
          If you have questions about this Privacy Policy, please contact me at{' '}
          <a href="mailto:brent@brentweb.eu" style={{ color: '#0066cc' }}>
            brent@brentweb.eu
          </a>
        </p>
      </section>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <a href="/" style={{ color: '#0066cc', textDecoration: 'none' }}>
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
