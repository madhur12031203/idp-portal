"use client";

import { useEffect, useRef } from "react";

export function AmbientBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!backdrop || reducedMotion.matches) return;

    let frame = 0;
    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const xRatio = x / window.innerWidth;
        const yRatio = y / window.innerHeight;
        backdrop.style.setProperty("--cursor-x", `${(xRatio * 100).toFixed(2)}%`);
        backdrop.style.setProperty("--cursor-y", `${(yRatio * 100).toFixed(2)}%`);
        backdrop.style.setProperty("--ambient-x", `${((xRatio - .5) * 16).toFixed(2)}px`);
        backdrop.style.setProperty("--ambient-y", `${((yRatio - .5) * 12).toFixed(2)}px`);
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <div ref={backdropRef} className="ambient-backdrop" aria-hidden="true"><span /><i /></div>;
}
