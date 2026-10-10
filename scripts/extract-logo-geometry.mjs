/** Derive the hero silhouette from the official PNG's alpha, without redrawing the mark. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "public/brand/quorlyn-logo.png");
const uri = `data:image/png;base64,${fs.readFileSync(source).toString("base64")}`;
const browser = await chromium.launch();
const page = await browser.newPage();
const result = await page.evaluate(async (src) => {
  const image = new Image();
  image.src = src;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const alpha = (x, y) => rgba[(y * canvas.width + x) * 4 + 3];
  const rows = Array.from({ length: canvas.height }, (_, y) => {
    let count = 0;
    for (let x = 0; x < canvas.width; x++) if (alpha(x, y) > 40) count++;
    return count;
  });
  const first = rows.findIndex((count) => count > 0);
  const last = rows.findLastIndex((count) => count > 0);
  let separator = last;
  let longest = 0;
  let start = -1;
  for (let y = first; y <= last; y++) {
    if (rows[y] === 0 && start === -1) start = y;
    if (rows[y] > 0 && start !== -1) {
      if (y - start > longest) {
        separator = start;
        longest = y - start;
      }
      start = -1;
    }
  }
  let x0 = canvas.width, y0 = canvas.height, x1 = 0, y1 = 0;
  for (let y = first; y < separator; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (alpha(x, y) <= 128) continue;
      x0 = Math.min(x0, x); x1 = Math.max(x1, x);
      y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
  }
  const width = x1 - x0 + 1;
  const height = y1 - y0 + 1;
  const filled = (x, y) => x >= 0 && y >= 0 && x < width && y < height && alpha(x + x0, y + y0) > 128;
  const edges = new Map();
  const edge = (x, y, tx, ty, direction) => {
    const key = `${x},${y}`;
    if (!edges.has(key)) edges.set(key, []);
    edges.get(key).push({ x: tx, y: ty, direction });
  };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!filled(x, y)) continue;
      if (!filled(x, y - 1)) edge(x, y, x + 1, y, 0);
      if (!filled(x + 1, y)) edge(x + 1, y, x + 1, y + 1, 1);
      if (!filled(x, y + 1)) edge(x + 1, y + 1, x, y + 1, 2);
      if (!filled(x - 1, y)) edge(x, y + 1, x, y, 3);
    }
  }
  const area = (points) => points.reduce((sum, p, i) => {
    const next = points[(i + 1) % points.length];
    return sum + p[0] * next[1] - next[0] * p[1];
  }, 0) / 2;
  // Remove raster stair steps while keeping corners and brand gaps. The
  // source-overlap check below constrains simplification of the silhouette.
  const simplify = (points, tolerance = 1.15) => {
    const distance = (p, a, b) => {
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const t = dx || dy ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))) : 0;
      return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
    };
    const reduce = (list) => {
      let furthest = tolerance, index = -1;
      for (let i = 1; i < list.length - 1; i++) {
        const d = distance(list[i], list[0], list[list.length - 1]);
        if (d > furthest) { furthest = d; index = i; }
      }
      if (index < 0) return [list[0], list[list.length - 1]];
      return [...reduce(list.slice(0, index + 1)).slice(0, -1), ...reduce(list.slice(index))];
    };
    return reduce([...points, points[0]]).slice(0, -1);
  };
  const contours = [];
  while (edges.size) {
    const key = edges.keys().next().value;
    const initial = key.split(",").map(Number);
    const points = [initial];
    let at = initial, direction = 0;
    for (let guard = 0; guard < width * height * 4; guard++) {
      const current = `${at[0]},${at[1]}`;
      const choices = edges.get(current);
      if (!choices?.length) throw new Error("Unclosed alpha contour");
      const priority = [(direction + 1) % 4, direction, (direction + 3) % 4, (direction + 2) % 4];
      const choice = choices.length === 1 ? 0 : priority.map((d) => choices.findIndex((item) => item.direction === d)).find((i) => i >= 0);
      const next = choices.splice(choice, 1)[0];
      if (!choices.length) edges.delete(current);
      at = [next.x, next.y]; direction = next.direction;
      if (at[0] === initial[0] && at[1] === initial[1]) break;
      points.push(at);
    }
    const signedArea = area(points);
    if (Math.abs(signedArea) < 4) continue;
    // The separate right-hand stroke has long straight diagonals. A slightly
    // wider fit removes the alpha mask's two-pixel steps on those edges;
    // the ring and its intentional dissolution keep the narrower fit.
    const straightStroke = signedArea > 10000 && points.every(([x]) => x > width * 0.4);
    contours.push({ points: simplify(points, straightStroke ? 2.2 : 1.15), area: signedArea });
  }
  contours.sort((a, b) => Math.abs(b.area) - Math.abs(a.area));
  const verification = document.createElement("canvas");
  verification.width = width; verification.height = height;
  const verifyContext = verification.getContext("2d");
  verifyContext.beginPath();
  for (const contour of contours) {
    contour.points.forEach(([x, y], i) => i ? verifyContext.lineTo(x, y) : verifyContext.moveTo(x, y));
    verifyContext.closePath();
  }
  verifyContext.fill();
  const raster = verifyContext.getImageData(0, 0, width, height).data;
  let intersection = 0, union = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const expected = filled(x, y), actual = raster[(y * width + x) * 4 + 3] > 128;
    if (expected && actual) intersection++;
    if (expected || actual) union++;
  }
  const silhouetteIoU = intersection / union;
  if (silhouetteIoU < 0.99) throw new Error(`Logo trace failed its source comparison: ${silhouetteIoU}`);
  const crop = document.createElement("canvas");
  const pad = Math.round(Math.max(width, height) * 0.07);
  crop.width = width + pad * 2;
  crop.height = height + pad * 2;
  crop.getContext("2d").drawImage(image, x0, y0, width, height, pad, pad, width, height);
  return {
    geometry: { source: "public/brand/quorlyn-logo.png", threshold: 128, width, height, silhouetteIoU, bounds: { x0, y0, x1, y1 }, contours },
    artwork: crop.toDataURL("image/png"),
  };
}, uri);
await browser.close();
const geometryFile = path.join(root, "src/assets/brand/quorlyn-geometry.json");
fs.writeFileSync(geometryFile, JSON.stringify(result.geometry));
const artworkFile = path.join(root, "public/brand/quorlyn-hero-symbol.png");
fs.writeFileSync(artworkFile, Buffer.from(result.artwork.split(",")[1], "base64"));
console.log(JSON.stringify({ geometryFile, artworkFile, contours: result.geometry.contours.length, points: result.geometry.contours.reduce((sum, c) => sum + c.points.length, 0), silhouetteIoU: result.geometry.silhouetteIoU, bounds: result.geometry.bounds }));
