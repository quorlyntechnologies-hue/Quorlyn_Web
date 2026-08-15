"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's brand visual: the mark, reconstructing.
 *
 * The logo shows a Q dissolving into pixels. This is the same idea read
 * forwards — a field of loose pixels whose *density* traces the mark's own
 * geometry (ring, gap, tail), so the Q is latent in the noise. A slow wave
 * travels left to right, briefly resolving whatever it crosses into bright,
 * larger pixels; behind it the form falls back into the field.
 *
 * The shape field is computed once per layout and cached on each cell, so the
 * per-frame cost is one distance-free multiply and a fillRect.
 *
 * Cost control:
 * — canvas 2D, no library, ~2k fillRect calls per frame at desktop size
 * — DPR capped at 2 (retina phones otherwise quadruple the fill area)
 * — rAF stops entirely when the hero scrolls out of view or the tab is hidden
 * — prefers-reduced-motion renders one static frame and never starts a loop
 *
 * The canvas is decorative: it is aria-hidden, carries no information that is
 * not also in the text, and the hero reads correctly if it never paints.
 */

const SPACING = 15; // px between cell centres
const WAVE_WIDTH = 260; // px falloff either side of the resolving wave
const WAVE_SPEED = 0.055; // px per ms

/** Angular window, in radians, where the ring breaks so the stem can fall
 *  through it — lower right, matching the mark. Screen coordinates: +y is down,
 *  so this is 35°…80° measured clockwise from three o'clock. */
const GAP_START = 0.61; // ≈ 35°
const GAP_END = 1.4; // ≈ 80°

type Cell = {
  x: number;
  y: number;
  nx: number;
  /** Ambient brightness — the loose field. */
  base: number;
  /** 0…1 proximity to the mark's geometry. */
  form: number;
  phase: number;
};

/** Shortest distance from a point to a line segment. */
function distanceToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** The mark's own ramp, sampled by horizontal position. RGB triples of the
 *  --color-cyan/azure/blue/violet/magenta tokens; keep them in step. */
function colorAt(nx: number): [number, number, number] {
  const stops: Array<[number, [number, number, number]]> = [
    [0, [0, 205, 253]], // #00CDFD cyan
    [0.32, [0, 166, 252]], // #00A6FC azure
    [0.62, [23, 87, 252]], // #1757FC blue
    [0.86, [134, 58, 251]], // #863AFB violet
    [1, [185, 20, 252]], // #B914FC magenta
  ];

  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i];
    const [p1, c1] = stops[i + 1];
    if (nx <= p1) {
      const t = (nx - p0) / (p1 - p0);
      return [
        Math.round(c0[0] + (c1[0] - c0[0]) * t),
        Math.round(c0[1] + (c1[1] - c0[1]) * t),
        Math.round(c0[2] + (c1[2] - c0[2]) * t),
      ];
    }
  }
  return stops[stops.length - 1][1];
}

export function HeroLattice() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cells: Cell[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let start = 0;

    const build = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const next: Cell[] = [];

      // Where the latent Q sits. On wide screens it occupies the empty right
      // half; on narrow ones the mask moves the visible band to the bottom, so
      // the mark follows it and shrinks to fit.
      const wide = width >= 1024;
      const cx = wide ? width * 0.765 : width * 0.5;
      const cy = wide ? height * 0.45 : height * 0.74;
      const radius = wide
        ? Math.min(width * 0.152, height * 0.29)
        : Math.min(width * 0.3, height * 0.19);

      // Half the mark's stroke weight, measured off the official artwork
      // (70px on a 425px outer diameter).
      const sigma = Math.max(5, radius * 0.165);

      // Crossbar and stem, in the same proportions as the artwork.
      const barY = cy - radius * 0.035;
      const barAx = cx - radius * 0.41;
      const barBx = cx + radius * 1.01;

      const stemAx = cx + radius * 0.32;
      const stemAy = cy + radius * 0.13;
      const stemBx = cx + radius * 1.14;
      const stemBy = cy + radius * 1.19;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * SPACING;
          const y = j * SPACING;
          const nx = width ? x / width : 0;
          const ny = height ? y / height : 0;

          // Deterministic scatter: a hashed value, so the field is stable
          // across resizes instead of reshuffling on every rebuild.
          const hash = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
          const noise = hash - Math.floor(hash);

          // ── The latent mark ───────────────────────────────────────────────
          const dx = x - cx;
          const dy = y - cy;
          const angle = Math.atan2(dy, dx);

          // Ring, minus the arc where the mark breaks open.
          const ringDistance = Math.abs(Math.hypot(dx, dy) - radius);
          const inGap = angle > GAP_START && angle < GAP_END;
          // Inside the gap the ring does not vanish outright — it decays, which
          // is what makes the break read as dissolution rather than a notch.
          const gapFalloff = inGap
            ? 0.16 + 0.5 * Math.min(1, Math.abs(angle - (GAP_START + GAP_END) / 2) / 0.44)
            : 1;

          const ring = Math.exp(-((ringDistance / sigma) ** 2)) * gapFalloff;
          const bar = Math.exp(-((distanceToSegment(x, y, barAx, barY, barBx, barY) / sigma) ** 2));
          const stem = Math.exp(
            -((distanceToSegment(x, y, stemAx, stemAy, stemBx, stemBy) / sigma) ** 2),
          );

          const form = Math.max(ring, bar, stem);

          // ── The dissolution ───────────────────────────────────────────────
          // The mark's left flank breaks into scattered pixels. A wedge to the
          // left of the ring, thinning with distance out and away from the
          // horizontal axis, reproduces that scatter.
          const outward = (cx - x) / radius;
          const offAxis = Math.abs(y - cy) / radius;
          const dust =
            outward > 0.55 && offAxis < 1.15
              ? Math.max(0, 1 - (outward - 0.55) / 0.8) * Math.max(0, 1 - offAxis / 1.15)
              : 0;

          // ── The loose field ───────────────────────────────────────────────
          // A faint everywhere-floor so the mark sits in a field rather than on
          // empty black, weighted away from the headline's column.
          const ambient = 0.05 + 0.16 * ((nx * 0.75 + ny * 0.25) ** 1.6);

          // A cell survives if it belongs to the form, to the dissolution, or
          // wins the ambient roll. Form cells thin slightly too, so the shape
          // stays pixelated instead of resolving into a solid line.
          const keepChance = Math.max(ambient, dust * 0.7, form * 0.9);
          if (noise > keepChance) continue;

          next.push({
            x,
            y,
            nx,
            base: 0.12 + noise * 0.3 + dust * 0.3,
            form,
            phase: noise * Math.PI * 2,
          });
        }
      }

      cells = next;
    };

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);

      // The resolving wave sweeps left to right, then repeats off-canvas.
      const travel = width + WAVE_WIDTH * 2;
      const waveX = ((elapsed * WAVE_SPEED) % travel) - WAVE_WIDTH;

      for (const cell of cells) {
        const distance = Math.abs(cell.x - waveX);
        const resolved = distance < WAVE_WIDTH ? 1 - distance / WAVE_WIDTH : 0;

        // Slow breathing keeps the static field from looking like a texture.
        const breathe = reducedMotion ? 1 : 0.72 + 0.28 * Math.sin(elapsed * 0.0009 + cell.phase);

        // Form pixels sit brighter than the field at rest, so the Q is legible
        // even in a still frame; the wave then lifts whatever it is crossing.
        const rest = (cell.base + cell.form * 0.82) * breathe;
        const alpha = Math.min(1, rest + resolved * resolved * (0.3 + cell.form * 0.75));
        if (alpha < 0.02) continue;

        const [r, g, b] = colorAt(cell.nx);
        const size = 2 + cell.form * 1.2 + resolved * (1.4 + cell.form * 1.6);

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.fillRect(cell.x, cell.y, size, size);
      }
    };

    const loop = (now: number) => {
      if (!start) start = now;
      draw(now - start);
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running || reducedMotion) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const pause = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    };

    build();
    draw(0);

    if (reducedMotion) return () => pause();

    // Only animate while actually on screen and in a visible tab.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0 },
    );
    observer.observe(parent);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    // Rebuild on resize. Debounced — a rebuild allocates the whole cell array.
    let resizeTimer: number | undefined;
    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (!running) draw(0);
      }, 150);
    });
    resizeObserver.observe(parent);

    return () => {
      pause();
      observer.disconnect();
      resizeObserver.disconnect();
      window.clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
