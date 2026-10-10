/** Capture the settled live mesh as the shared, transparent no-motion poster. */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const base = process.env.BRAND_PREVIEW_URL ?? "http://127.0.0.1:3017";
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "quorlyn-poster-"));
const capture = path.join(temporary, "relief.png");
const output = path.join(process.cwd(), "public/brand/quorlyn-relief.webp");
const encoded = output + `.tmp-${process.pid}`;
const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader"] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector(".logo-scene")?.getAttribute("data-scene") === "ready", null, { timeout: 30000 });
  await page.addStyleTag({ content: "body, .hero-section { background: transparent !important; } body * { visibility: hidden; } .logo-scene, .logo-scene * { visibility: visible; } .logo-scene { position: fixed !important; inset: 0 auto auto 0 !important; width: 900px !important; height: 900px !important; margin: 0 !important; z-index: 9999; } .logo-scene::before, .logo-scene-poster, .scene-control { display: none !important; } .logo-scene-canvas { opacity: 1 !important; }" });
  await page.waitForSelector('canvas[data-assembly="settled"]');
  await page.getByRole("button", { name: "Pause logo animation", includeHidden: true }).evaluate((button) => button.click());
  await page.locator(".logo-scene canvas").screenshot({ path: capture, omitBackground: true });
  const conversion = spawnSync("cwebp", ["-quiet", "-q", "90", capture, "-o", encoded], { encoding: "utf8" });
  if (conversion.status !== 0) throw new Error(conversion.stderr || "cwebp failed");
  // Atomic replacement keeps a live preview from decoding a partially written image.
  fs.renameSync(encoded, output);
  fs.writeFileSync(output + ".json", JSON.stringify({
    prompt: "Origin: transparent 900x900 browser capture of the settled Three.js 0.186.1 mesh in src/components/brand/logo-scene.ts, produced by scripts/render-logo-poster.mjs. Geometry traced from the official Quorlyn PNG by scripts/extract-logo-geometry.mjs; colors are existing Quorlyn brand tokens. Neutral RoomEnvironment/PMREM reflections, ACES exposure 1.1, and a soft shadow catcher over a pale fading floor matched to the public off-white theme. No AI image generation.",
    createdAt: new Date().toISOString(),
  }, null, 2) + "\n");
  console.log(JSON.stringify({ output, width: 900, height: 900, bytes: fs.statSync(output).size, source: "live source-derived Three.js mesh" }));
} finally {
  await browser.close();
  fs.rmSync(encoded, { force: true });
  fs.rmSync(temporary, { recursive: true, force: true });
}
