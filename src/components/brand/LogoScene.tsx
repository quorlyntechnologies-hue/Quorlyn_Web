"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { LogoScene as SceneController } from "@/components/brand/logo-scene";
import reliefPoster from "../../../public/brand/quorlyn-relief.webp";
import sourcePoster from "../../../public/brand/quorlyn-hero-symbol.png";

export function LogoScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SceneController | null>(null);
  const pauseRef = useRef(false);
  const syncRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<"poster" | "ready" | "fallback">("poster");
  const [paused, setPaused] = useState(false);
  const [posterSource, setPosterSource] = useState(reliefPoster);

  useEffect(() => {
    const stage = stageRef.current, host = hostRef.current;
    if (!stage || !host) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let inView = false;
    let cancelled = false;
    let loading = false;
    let failed = false;

    const sync = () => {
      if (cancelled) return;
      const canInitialize = inView && !document.hidden && !motion.matches && !failed;
      const shouldRun = canInitialize && !pauseRef.current;
      if (controllerRef.current) {
        controllerRef.current.setRunning(shouldRun);
        return;
      }
      if (!canInitialize || loading) return;
      loading = true;
      import("@/components/brand/logo-scene")
        .then(({ createLogoScene }) => {
          if (cancelled || motion.matches || !inView || document.hidden) return;
          controllerRef.current = createLogoScene(host, pauseRef.current);
          setStatus("ready");
          sync();
        })
        .catch(() => {
          if (cancelled) return;
          failed = true;
          setStatus("fallback");
        })
        .finally(() => { loading = false; sync(); });
    };
    syncRef.current = sync;

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    }, { threshold: 0.08 });
    observer.observe(stage);
    const resize = new ResizeObserver(() => controllerRef.current?.resize());
    resize.observe(host);
    const move = (event: PointerEvent) => {
      if (!pointer.matches || motion.matches || pauseRef.current) return;
      const box = stage.getBoundingClientRect();
      controllerRef.current?.setPointer(((event.clientX - box.left) / box.width - 0.5) * 2, ((event.clientY - box.top) / box.height - 0.5) * 2);
    };
    const leave = () => controllerRef.current?.setPointer(0, 0);
    const lost = (event: Event) => {
      event.preventDefault();
      failed = true;
      controllerRef.current?.setRunning(false);
      setStatus("fallback");
    };
    const motionChanged = () => {
      if (motion.matches) {
        controllerRef.current?.dispose();
        controllerRef.current = null;
        setStatus("poster");
      }
      sync();
    };
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", motionChanged);
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", leave);
    host.addEventListener("webglcontextlost", lost, true);

    return () => {
      cancelled = true;
      syncRef.current = null;
      observer.disconnect(); resize.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", motionChanged);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
      host.removeEventListener("webglcontextlost", lost, true);
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, []);

  return (
    <div ref={stageRef} className="logo-scene" data-scene={status}>
      <div className="logo-scene-art" aria-hidden="true">
        <Image
          src={posterSource}
          alt=""
          width={900}
          height={900}
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1024px) 46vw, (min-width: 640px) 560px, 100vw"
          className="logo-scene-poster"
          onError={() => setPosterSource(sourcePoster)}
        />
        <div ref={hostRef} className="logo-scene-canvas" />
      </div>
      {status === "ready" && (
        <button
          type="button"
          className="scene-control"
          aria-label={paused ? "Resume logo animation" : "Pause logo animation"}
          aria-pressed={paused}
          onClick={() => {
            pauseRef.current = !paused;
            setPaused(!paused);
            syncRef.current?.();
          }}
        >
          <span className="scene-control-symbol" aria-hidden="true" data-paused={paused} />
          {paused ? "Resume animation" : "Pause animation"}
        </button>
      )}
    </div>
  );
}
