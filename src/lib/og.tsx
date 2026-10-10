import fs from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

import { company } from "@/content/company";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Satori cannot resolve relative image URLs, and fetching the site's own origin
 * at build time is unreliable. Reading the official symbol off disk and
 * inlining it is deterministic and works in every environment.
 * Read once per process — the card is generated for several routes.
 */
let symbolUri: string | null = null;

function getSymbolUri(): string {
  if (symbolUri === null) {
    const file = path.join(process.cwd(), "public/brand/quorlyn-symbol.png");
    symbolUri = `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
  }
  return symbolUri;
}

/**
 * Shared social card. Rendered by both `opengraph-image` and `twitter-image`
 * so the two never drift apart.
 *
 * Satori (which backs ImageResponse) supports a subset of CSS: flexbox only,
 * no `gap` on some versions, no background-clip text. The official mark is
 * inlined as a PNG, with a solid subtitle color and a single blue rule.
 */
export function renderOgImage(title = "Web, mobile and AI engineering") {
  // Satori treats each interpolated expression as a separate child node and
  // rejects non-flex parents with more than one. Build the string first.
  const footnote = `${company.location.locality}, ${company.location.country} · ${company.domain}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#f7f7f4",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Mark + wordmark lockup */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori renders
              its own image pipeline; next/image does not exist in this context. */}
          <img src={getSymbolUri()} width={78} height={78} alt="" />

          <div style={{ display: "flex", flexDirection: "column", marginLeft: 22 }}>
            {/* Satori has no background-clip: text, so the subtitle takes the
                midpoint of the artwork's #2F4EF2 → #A225EF run as a solid. */}
            <div style={{ fontSize: 32, letterSpacing: 9, color: "#17212b" }}>QUORLYN</div>
            <div style={{ fontSize: 14, letterSpacing: 9, color: "#6939F0", marginTop: 8 }}>
              TECHNOLOGY
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.1,
              color: "#17212b",
              fontWeight: 600,
              letterSpacing: -1.5,
              maxWidth: 900,
            }}
          >
            {title}
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: 40 }}>
            <div
              style={{
                width: 120,
                height: 3,
                backgroundColor: "#1757FC",
              }}
            />
            <div style={{ fontSize: 22, color: "#4e5a67", marginLeft: 24, letterSpacing: 1 }}>
              {footnote}
            </div>
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
