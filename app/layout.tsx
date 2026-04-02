import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClientProvider } from "@/providers/QueryProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import Script from "next/script";
import DevToolsEasterEgg from "@/components/DevToolsEasterEgg";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { CookieConsent } from "@/components/CookieConsent";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Brent Schoenmakers | Full-Stack Developer",
  description:
    "Full-Stack Developer specializing in web development and security. Building modern, secure, and scalable applications.",
  keywords:
    "full-stack developer, web developer, security, React, Node.js, TypeScript, portfolio",
  authors: [{ name: "Brent Schoenmakers" }],
  metadataBase: new URL("https://www.brentweb.eu"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Brent Schoenmakers | Full-Stack Developer",
    description:
      "Full-Stack Developer specializing in web development and security.",
    type: "website",
    url: "https://www.brentweb.eu",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Brent Schoenmakers",
              "jobTitle": "Full-Stack Developer",
              "description": "Full-Stack Developer specializing in web development and security. Building modern, secure, and scalable applications.",
              "url": "https://www.brentweb.eu",
              "sameAs": [
                "https://github.com/BrentWebEU",
                "https://www.linkedin.com/in/brent-schoenmakers-3793a8262/"
              ],
              "knowsAbout": ["Web Development", "Security", "React", "Node.js", "TypeScript", "Full-Stack Development"]
            }
          `}
        </Script>
      </head>
      <body className="font-sans">
        <noscript>
          <div
            style={{
              padding: "2rem",
              maxWidth: "800px",
              margin: "0 auto",
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: "1.6",
              color: "#333",
            }}
          >
            <h1>Brent Schoenmakers | Full-Stack Developer</h1>
            <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
              Full-Stack Developer specializing in web development and security.
              Building modern, secure, and scalable applications.
            </p>

            <div
              style={{
                background: "#fff3cd",
                border: "1px solid #ffc107",
                padding: "1rem",
                borderRadius: "4px",
                marginBottom: "2rem",
              }}
            >
              <strong>⚠️ JavaScript Required</strong>
              <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                This website uses JavaScript to provide an interactive
                experience. Please enable JavaScript in your browser to access
                the full site.
              </p>
            </div>

            <h2>About Me</h2>
            <p>
              I'm a passionate full-stack developer with expertise in building
              secure, scalable web applications. I specialize in modern web
              technologies including React, Node.js, TypeScript, and cloud
              infrastructure.
            </p>

            <h2>Core Services</h2>
            <ul>
              <li>
                <strong>Web Development:</strong> Custom web applications using
                modern frameworks
              </li>
              <li>
                <strong>Security Consulting:</strong> Application security
                audits and best practices
              </li>
              <li>
                <strong>Full-Stack Solutions:</strong> End-to-end development
                from frontend to backend
              </li>
              <li>
                <strong>Performance Optimization:</strong> Making websites
                faster and more efficient
              </li>
            </ul>

            <h2>Contact Information</h2>
            <p>
              Email:{" "}
              <a href="mailto:contact@brent@b" style={{ color: "#0066cc" }}>
                contact@brent@b
              </a>
            </p>
            <p>
              LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/in/brent-schoenmakers-3793a8262/"
                style={{ color: "#0066cc" }}
              >
                https://www.linkedin.com/in/brent-schoenmakers-3793a8262/
              </a>
            </p>
            <p>
              GitHub:{" "}
              <a
                href="https://github.com/BrentWebEU"
                style={{ color: "#0066cc" }}
              >
                https://github.com/BrentWebEU
              </a>
            </p>

            <h2>Additional Information</h2>
            <ul>
              <li>
                <a href="/privacy" style={{ color: "#0066cc" }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/accessibility" style={{ color: "#0066cc" }}>
                  Accessibility Statement
                </a>
              </li>
            </ul>

            <hr
              style={{
                margin: "2rem 0",
                border: "none",
                borderTop: "1px solid #ddd",
              }}
            />
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              © {new Date().getFullYear()} Brent Schoenmakers. All rights
              reserved.
            </p>
          </div>
        </noscript>
        <LocaleProvider>
          <QueryClientProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <TooltipProvider>
                <DevToolsEasterEgg />
                <CookieConsent />
                {children}
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
