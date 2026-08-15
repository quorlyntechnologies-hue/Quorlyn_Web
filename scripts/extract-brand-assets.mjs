/**
 * Derives the web brand assets from the official logo artwork.
 *
 * Source: public/brand/quorlyn-logo.png (full lockup, 1254²).
 * Outputs:
 *   src/assets/brand/quorlyn-symbol.png — the Q/T monogram alone, imported by
 *                                         <QuorlynMark> and the social card
 *   src/app/icon.png                    — favicon
 *   public/brand/quorlyn-symbol.png     — same symbol, as a distributable file
 *
 * 256² is deliberate: the symbol never renders above ~48 CSS px, so this is
 * already 5x on a 3x display, and it keeps the asset ~40 kB instead of ~200.
 *
 * Run after replacing the source artwork:  npm run brand:assets
 * Uses the Playwright Chromium already present for the audit script, so there
 * is no image-processing dependency in the tree.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "public/brand/quorlyn-logo.png");
if (!fs.existsSync(SOURCE)) {
  console.error(`Missing ${SOURCE}`);
  process.exit(1);
}

const dataUri = `data:image/png;base64,${fs.readFileSync(SOURCE).toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("about:blank");

const out = await page.evaluate(async (src) => {
  const img = new Image();
  img.src = src;
  await img.decode();

  const probe = document.createElement("canvas");
  probe.width = img.width;
  probe.height = img.height;
  const pctx = probe.getContext("2d");
  pctx.drawImage(img, 0, 0);
  const data = pctx.getImageData(0, 0, probe.width, probe.height).data;
  const lit = (x, y) => data[(y * probe.width + x) * 4 + 3] > 40;

  // Rows that contain artwork; the widest empty band separates the symbol
  // above from the wordmark below.
  const rowCount = [];
  for (let y = 0; y < probe.height; y++) {
    let n = 0;
    for (let x = 0; x < probe.width; x++) if (lit(x, y)) n++;
    rowCount.push(n);
  }
  const firstRow = rowCount.findIndex((n) => n > 0);
  const lastRow = rowCount.length - 1 - [...rowCount].reverse().findIndex((n) => n > 0);

  let gapAt = lastRow;
  let best = 0;
  let run = -1;
  for (let y = firstRow; y <= lastRow; y++) {
    if (rowCount[y] === 0) {
      if (run < 0) run = y;
    } else if (run >= 0) {
      if (y - run > best) { best = y - run; gapAt = run; }
      run = -1;
    }
  }

  // Bounding box of the symbol only.
  let x0 = Infinity, x1 = -1, y0 = Infinity, y1 = -1;
  for (let y = firstRow; y < gapAt; y++) {
    for (let x = 0; x < probe.width; x++) {
      if (!lit(x, y)) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }

  // Square crop around the symbol with 8% breathing room. The symbol is wider
  // than it is tall, so squaring it extends past the artwork vertically and
  // would otherwise catch the top of the wordmark below. Compositing from a
  // copy with everything below the gap erased makes that overspill transparent
  // instead, which keeps the symbol optically centred.
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const side = Math.max(x1 - x0, y1 - y0) * 1.08;

  const symbolOnly = document.createElement("canvas");
  symbolOnly.width = img.width;
  symbolOnly.height = img.height;
  const sctx = symbolOnly.getContext("2d");
  sctx.drawImage(img, 0, 0);
  sctx.clearRect(0, gapAt, symbolOnly.width, symbolOnly.height - gapAt);

  const render = (size) => {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(symbolOnly, cx - side / 2, cy - side / 2, side, side, 0, 0, size, size);
    return c.toDataURL("image/png");
  };

  return {
    bbox: { x0, x1, y0, y1 },
    symbol: render(256),
    icon: render(256),
  };
}, dataUri);

await browser.close();

const write = (file, uri) => {
  const target = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, Buffer.from(uri.split(",")[1], "base64"));
  console.log(`wrote ${file} (${(fs.statSync(target).size / 1024).toFixed(1)} kB)`);
};

console.log("symbol bbox in source:", out.bbox);
write("src/assets/brand/quorlyn-symbol.png", out.symbol);
write("public/brand/quorlyn-symbol.png", out.symbol);
write("src/app/icon.png", out.icon);
