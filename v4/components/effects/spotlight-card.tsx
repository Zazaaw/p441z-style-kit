"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * SpotlightCard — a card lit by the pointer: a soft radial glow follows the cursor across the
 * surface, and the border brightens where the light touches it. Touch devices see a calm card.
 *
 * The glow color is `--primary`, so it is neutral in the plain kit and takes your accent after a
 * rebrand. Pointer position is written to CSS variables (no React re-render per move).
 *
 * USAGE
 *   <SpotlightCard className="p-6"><Feature /></SpotlightCard>
 *   <SpotlightCard size={420} strength={0.18}>…</SpotlightCard>
 */

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glow diameter in px. */
  size?: number;
  /** Glow opacity on the surface (0–1). */
  strength?: number;
}

export default function SpotlightCard({ className, children, size = 360, strength = 0.12, style, ...rest }: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={move}
      className={cn("group/spot relative overflow-hidden rounded-2xl border border-border bg-background/80 backdrop-blur", className)}
      style={{ "--sx": "50%", "--sy": "-30%", "--spot": `${size}px`, "--spot-a": strength, ...style } as React.CSSProperties}
      {...rest}
    >
      {/* Surface glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(var(--spot) circle at var(--sx) var(--sy), hsl(var(--primary) / var(--spot-a)), transparent 70%)" }}
      />
      {/* Border glow: same light, masked to the 1px edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          padding: 1,
          background: "radial-gradient(calc(var(--spot) * 0.7) circle at var(--sx) var(--sy), hsl(var(--primary) / 0.65), transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
