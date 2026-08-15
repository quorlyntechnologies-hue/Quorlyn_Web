import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { company } from "@/content/company";
import { organizationSchema } from "@/lib/schema";

import "./globals.css";

/* Three faces, each with a distinct job:
   — Space Grotesk: display. Geometric, slightly technical letterforms that
     echo the mark's construction.
   — Inter: body and UI. Chosen for legibility at small sizes on dark ground.
   — JetBrains Mono: indices, labels and technical annotation only. It carries
     the "engineering document" signal that makes the third family worth its
     weight; it is never used for reading copy.
   All are self-hosted by next/font — no render-blocking request to Google. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    default: `${company.name} — Software engineering, built to last`,
    template: `%s — ${company.name}`,
  },
  description: company.descriptor,
  applicationName: company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: company.name,
    url: company.url,
    title: `${company.name} — Software engineering, built to last`,
    description: company.descriptor,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} — Software engineering, built to last`,
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
  themeColor: "#05070b",
  colorScheme: "dark",
  // Zoom is never disabled — pinch-zoom is an accessibility requirement.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
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

        {/* Cookieless, no consent banner required. Sends nothing outside
            production; see src/lib/analytics.ts. */}
        <Analytics />
      </body>
    </html>
  );
}
