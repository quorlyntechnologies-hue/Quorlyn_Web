/**
 * Pre-release audit: accessibility, layout overflow, and contact-form behaviour.
 *
 *   npm run build && npm start          # in one terminal
 *   npm run audit                       # in another
 *
 * Checks, per page:
 *   — axe-core against WCAG 2.0/2.1/2.2 A + AA and Deque best practices
 *   — no horizontal page scroll at 320/390/768/1280/1728, measured with the
 *     `overflow-x: clip` safety net disabled so real overflow cannot hide
 *   — no console errors or uncaught exceptions
 * Then, once:
 *   — reduced-motion: every revealed element is visible, hero canvas still paints
 *   — contact form: client validation blocks the request, a valid submit reaches
 *     the API, and the honeypot is accepted silently
 *
 * Exits non-zero on any failure so it can gate a deploy.
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3111";
const PATHS = ["/", "/about", "/services", "/work", "/contact", "/privacy", "/terms", "/nope"];
const VIEWPORTS = [
  { name: "small", width: 320, height: 720 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 900 },
  { name: "desktop", width: 1728, height: 1000 },
];

const failures = [];
const note = (msg) => failures.push(msg);

const browser = await chromium.launch();

// ── Accessibility ───────────────────────────────────────────────────────────
for (const path of PATHS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();

  if (violations.length) {
    for (const v of violations) {
      note(`a11y ${path} [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node/s)`);
    }
  }
  console.log(`a11y ${path}: ${violations.length ? `${violations.length} violation(s)` : "clean"}`);
  await ctx.close();
}

// ── Layout + console ────────────────────────────────────────────────────────
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  // Disable the overflow-x safety net so genuine overflow is measurable.
  await ctx.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const s = document.createElement("style");
      s.textContent = "body{overflow-x:visible !important}html{scroll-behavior:auto !important}";
      document.head.appendChild(s);
    });
  });
  const page = await ctx.newPage();

  page.on("console", (m) => {
    // 404s are expected on the deliberate not-found probe.
    if (m.type() === "error" && !m.text().includes("404")) {
      note(`console ${vp.name} ${page.url()}: ${m.text()}`);
    }
  });
  page.on("pageerror", (e) => note(`pageerror ${vp.name} ${page.url()}: ${e.message}`));

  for (const path of PATHS) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const offenders = [];
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || (r.right <= vw + 1 && r.left >= -1)) return;
        let p = el.parentElement;
        while (p && p !== document.body) {
          const ox = getComputedStyle(p).overflowX;
          if (["hidden", "clip", "auto", "scroll"].includes(ox)) return;
          p = p.parentElement;
        }
        offenders.push(`${el.tagName}.${String(el.className).slice(0, 60)}`);
      });
      return { scrollW: document.documentElement.scrollWidth, vw, offenders: offenders.slice(0, 4) };
    });

    if (overflow.scrollW > overflow.vw + 1) {
      note(
        `overflow ${vp.name} ${path}: ${overflow.scrollW} > ${overflow.vw} — ${overflow.offenders.join(", ")}`,
      );
    }
  }
  console.log(`layout ${vp.name}: checked ${PATHS.length} pages`);
  await ctx.close();
}

// ── Reduced motion ──────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll(".reveal")].filter(
        (n) => parseFloat(getComputedStyle(n).opacity) < 0.95,
      ).length,
  );
  if (hidden) note(`reduced-motion: ${hidden} .reveal element(s) never became visible`);

  const canvasLit = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return -1;
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let lit = 0;
    for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 8) lit++;
    return lit;
  });
  if (canvasLit === 0) note("reduced-motion: hero canvas painted nothing");
  console.log(`reduced motion: ${hidden} hidden reveals, canvas lit samples ${canvasLit}`);
  await ctx.close();
}

// ── Contact form ────────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });

  await page.click('button[type="submit"]');
  await page.waitForTimeout(300);
  const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
  if (focused !== "name") note(`contact: empty submit focused "${focused}", expected "name"`);

  const requests = await page.evaluate(
    () => performance.getEntriesByName(location.origin + "/api/inquiries").length,
  );
  if (requests > 0) note("contact: invalid form still hit the API");

  await page.fill('input[name="name"]', "Audit Bot");
  await page.fill('input[name="email"]', "audit@example.com");
  await page.selectOption('select[name="projectType"]', "AI engineering");
  await page.fill('textarea[name="message"]', "A message long enough to pass validation checks.");
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/inquiries")),
    page.click('button[type="submit"]'),
  ]);
  // 200 once an inbox is configured; 503 is the honest "not connected" path.
  if (![200, 503].includes(response.status())) {
    note(`contact: valid submit returned ${response.status()}`);
  }

  const honeypot = await page.evaluate(async (base) => {
    const r = await fetch(base + "/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website: "spam" }),
    });
    return r.status;
  }, BASE);
  if (honeypot !== 200) note(`contact: honeypot returned ${honeypot}, expected 200`);

  console.log(`contact form: submit ${response.status()}, honeypot ${honeypot}`);
  await ctx.close();
}

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} FAILURE(S):`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log("\nAll audit checks passed.");
