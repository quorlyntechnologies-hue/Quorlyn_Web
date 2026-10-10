import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { company } from "@/content/company";
import { organizationSchema } from "@/lib/schema";

import "./globals.css";

/* IBM Plex Sans is the single interface family: headings, reading and controls.
   The existing logo lettering remains separate. Monospace is limited to real
   code/reference values and the brand subtitle. next/font self-hosts all files. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: `${company.name} — Web, mobile and AI engineering`,
    template: `%s — ${company.name}`,
  },
  description: company.descriptor,
  applicationName: company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: company.name,
    url: company.url,
    title: `${company.name} — Web, mobile and AI engineering`,
    description: company.descriptor,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} — Web, mobile and AI engineering`,
    description: company.descriptor,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#f7f7f4",
  colorScheme: "light",
  // Zoom is never disabled — pinch-zoom is an accessibility requirement.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      {/* Deliberately bare: no navigation or footer here. The public chrome is
          applied by `(site)/layout.tsx`, so the admin segment can render its
          own without fighting a parent layout. */}
      <body className="min-h-dvh antialiased">
        {children}

        <script
          type="application/ld+json"
          // Static, build-time constant — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* The insights endpoint is supplied by Vercel, not `next start`.
            Keep local builds and preview deployments out of production data. */}
        {process.env.VERCEL_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
