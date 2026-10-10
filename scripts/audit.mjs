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
 *   — continuing 3D motion on desktop/mobile, stable paused frames, pause/resume,
 *     visibility gates, reduced-motion and WebGL fallbacks
 *   — readable homepage without JavaScript and service enquiry preselection
 *   — contact form: client validation blocks the request, a valid submit reaches
 *     the API, and the honeypot is accepted silently
 *
 * Exits non-zero on any failure so it can gate a deploy.
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3111";
const PATHS = ["/", "/about", "/services", "/work", "/work/tripper-driving-simulator", "/contact", "/privacy", "/terms", "/nope"];
const VIEWPORTS = [
  { name: "small", width: 320, height: 720 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 900 },
  { name: "desktop", width: 1728, height: 1000 },
];

const failures = [];
const note = (msg) => failures.push(msg);

const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader"] });

// Compare actual rendered pixels, not just a "running" flag. The colored
// silhouette must move; lighting variation on a stationary mark is insufficient.
async function frameMovement(page, before, after) {
  return page.evaluate(async (uris) => {
    const frames = await Promise.all(uris.map(async (uri) => {
      const image = new Image(); image.src = uri; await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width; canvas.height = image.height;
      const context = canvas.getContext("2d"); context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, canvas.width, canvas.height).data;
    }));
    const [a, b] = frames;
    if (a.length !== b.length) throw new Error("Scene dimensions changed between frames");
    let changed = 0, silhouetteChanged = 0, colored = 0;
    const isBrand = (rgba, i) => {
      const max = Math.max(rgba[i], rgba[i + 1], rgba[i + 2]);
      const min = Math.min(rgba[i], rgba[i + 1], rgba[i + 2]);
      return rgba[i + 3] > 128 && max > 80 && max - min > 25;
    };
    for (let i = 0; i < a.length; i += 4) {
      if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2] || a[i + 3] !== b[i + 3]) changed++;
      const inA = isBrand(a, i), inB = isBrand(b, i);
      if (inA || inB) colored++;
      if (inA !== inB) silhouetteChanged++;
    }
    return { changed, silhouetteRatio: silhouetteChanged / Math.max(1, colored) };
  }, [before, after].map((buffer) => `data:image/png;base64,${buffer.toString("base64")}`));
}

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
      [...document.querySelectorAll("#main h1, #main h2, #main p")].filter(
        (n) => parseFloat(getComputedStyle(n).opacity) < 0.95,
      ).length,
  );
  if (hidden) note(`reduced-motion: ${hidden} reading element(s) not visible`);

  const fallback = await page.evaluate(() => {
    const poster = document.querySelector(".logo-scene-poster");
    return !!poster?.complete && poster.naturalWidth > 0 && !document.querySelector(".logo-scene canvas") && !document.querySelector(".scene-control");
  });
  if (!fallback) note("reduced-motion: expected the loaded static poster without a renderer or animation control");
  console.log(`reduced motion: ${hidden} hidden reading elements, static poster ${fallback}`);
  await ctx.close();
}

// ── Live scene and lifecycle ────────────────────────────────────────────────
await Promise.all([
  { name: "desktop", viewport: { width: 1440, height: 1000 } },
  { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
].map(async ({ name, ...options }) => {
  const ctx = await browser.newContext({ ...options, reducedMotion: "no-preference" });
  try {
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.locator(".logo-scene").scrollIntoViewIfNeeded();
    await page.waitForSelector('canvas[data-assembly="settled"][data-animation="running"]');
    if (name === "mobile" && await page.evaluate(() => matchMedia("(pointer: fine)").matches)) note("mobile motion: test unexpectedly has a fine pointer");
    // First sample is after the entrance; the third is beyond a full loop.
    await page.waitForTimeout(3500);
    const canvas = page.locator(".logo-scene canvas");
    // Exclude the overlaid control: its tap feedback is allowed to transition
    // while the WebGL image is paused.
    const sceneFrame = () => canvas.screenshot({ omitBackground: true, style: ".scene-control { visibility: hidden !important; }" });
    const first = await sceneFrame();
    await page.waitForTimeout(4000);
    const second = await sceneFrame();
    await page.waitForTimeout(9000);
    const third = await sceneFrame();
    const early = await frameMovement(page, first, second);
    const late = await frameMovement(page, second, third);
    if (early.silhouetteRatio < 0.03 || late.silhouetteRatio < 0.03) note(`${name} motion: logo stopped moving after assembly (${early.silhouetteRatio}, ${late.silhouetteRatio})`);

    const pause = page.getByRole("button", { name: "Pause logo animation" });
    if (name === "mobile") await pause.tap();
    else { await pause.focus(); await page.keyboard.press("Enter"); }
    await page.waitForSelector('canvas[data-animation="paused"]');
    const paused = await sceneFrame();
    await page.waitForTimeout(1000);
    const held = await frameMovement(page, paused, await sceneFrame());
    if (held.changed) note(`${name} motion: ${held.changed} pixels changed while paused`);
    const resume = page.getByRole("button", { name: "Resume logo animation" });
    if (name === "mobile") await resume.tap();
    else { await resume.focus(); await page.keyboard.press("Enter"); }
    await page.waitForSelector('canvas[data-animation="running"]');
    await page.waitForTimeout(3000);
    const resumed = await frameMovement(page, paused, await sceneFrame());
    if (resumed.silhouetteRatio < 0.03) note(`${name} motion: resume did not restore visible rotation`);
    console.log(`continuous motion ${name}: silhouette changes ${(early.silhouetteRatio * 100).toFixed(1)}% / ${(late.silhouetteRatio * 100).toFixed(1)}%; paused changes ${held.changed}; resume ${(resumed.silhouetteRatio * 100).toFixed(1)}%`);
  } finally {
    await ctx.close();
  }
}));

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForSelector('.logo-scene[data-scene="ready"] canvas[data-animation="running"]');
  await page.waitForSelector('canvas[data-assembly="settled"]');
  const capture = await page.locator(".logo-scene canvas").screenshot({ omitBackground: true });
  const coloredSamples = await page.evaluate(async (uri) => {
    const image = new Image(); image.src = uri; await image.decode();
    const sample = document.createElement("canvas"); sample.width = image.width; sample.height = image.height;
    const context = sample.getContext("2d"); context.drawImage(image, 0, 0);
    const rgba = context.getImageData(0, 0, sample.width, sample.height).data;
    let count = 0;
    for (let i = 0; i < rgba.length; i += 4 * 97) {
      const max = Math.max(rgba[i], rgba[i + 1], rgba[i + 2]);
      const min = Math.min(rgba[i], rgba[i + 1], rgba[i + 2]);
      if (rgba[i + 3] > 200 && max > 80 && max - min > 25) count++;
    }
    return count;
  }, `data:image/png;base64,${capture.toString("base64")}`);
  if (coloredSamples < 100) note(`3D scene: too few rendered logo samples (${coloredSamples})`);

  await page.getByRole("button", { name: "Pause logo animation" }).focus();
  await page.keyboard.press("Enter");
  await page.waitForSelector('canvas[data-animation="paused"]');
  await page.getByRole("button", { name: "Resume logo animation" }).click();
  await page.waitForSelector('canvas[data-animation="running"]');

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.waitForSelector('canvas[data-animation="paused"]');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForSelector('canvas[data-animation="running"]');

  // Exercise the same browser visibility event used when a real tab is hidden.
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForSelector('canvas[data-animation="paused"]');
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
  await page.waitForSelector('canvas[data-animation="running"]');

  await page.getByRole("button", { name: "Pause logo animation" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForSelector('.logo-scene[data-scene="poster"]');
  if (await page.locator(".logo-scene canvas").count()) note("3D scene: live reduced-motion change did not dispose the canvas");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForSelector('.logo-scene[data-scene="ready"]');
  if (await page.locator('canvas[data-animation="running"]').count()) note("3D scene: reduced-motion toggle discarded the user's pause choice");
  await page.getByRole("button", { name: "Resume logo animation" }).click();
  await page.waitForSelector('canvas[data-animation="running"]');

  await page.evaluate(() => document.querySelector(".logo-scene canvas").getContext("webgl2").getExtension("WEBGL_lose_context").loseContext());
  await page.waitForSelector('.logo-scene[data-scene="fallback"]');
  if (await page.locator('canvas[data-animation="running"]').count()) note("3D scene: context loss did not stop the loop");
  console.log(`3D scene: ${coloredSamples} colored samples; keyboard pause, scroll, visibility, preference changes and context loss passed`);
  await ctx.close();
}

// ── Unsupported WebGL / no JavaScript ────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      return kind === "webgl2" ? null : original.call(this, kind, ...args);
    };
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForSelector('.logo-scene[data-scene="fallback"]');
  const posterVisible = await page.locator(".logo-scene-poster").evaluate((img) => img.complete && img.naturalWidth > 0 && getComputedStyle(img).opacity === "1");
  if (!posterVisible) note("WebGL unavailable: the static poster was not visible");
  await ctx.close();

  const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(BASE, { waitUntil: "networkidle" });
  const readable = await staticPage.getByRole("heading", { level: 1 }).evaluate((el) => getComputedStyle(el.parentElement).opacity === "1");
  const text = await staticPage.locator("body").innerText();
  if (!readable || !text.includes("Software your team") || !text.includes("can maintain.") || !text.includes("Start a project")) note("no JavaScript: essential hero text and actions are not readable");
  console.log(`fallbacks: WebGL poster ${posterVisible}, no-JavaScript copy ${readable}`);
  await staticContext.close();
}

// ── Contact form ────────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/contact?service=ai-engineering", { waitUntil: "networkidle" });
  const preselection = await page.locator('select[name="projectType"]').inputValue();
  if (preselection !== "AI engineering") note(`contact: AI service preselected "${preselection}"`);

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
