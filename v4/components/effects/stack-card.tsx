"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * StackCard — a card with sheets behind it. At rest they peek out underneath like a small pile;
 * on hover they fan out one after another (40 ms apart) on a spring, and the front card lifts.
 * The same move the kit's glass folders make, sized for a grid of cards.
 *
 * Pure CSS (transform only, one stylesheet for every card), so a grid of thirty costs nothing while
 * scrolling. The sheets take the theme: the first is tinted with `--color-primary`, the rest are
 * neutral. Reduced motion and touch: the pile stays still.
 *
 * USAGE
 *   <StackCard>
 *     <GlassPanel press><a href="/components/button" className="block p-5">Button</a></GlassPanel>
 *   </StackCard>
 *   <StackCard layers={3} radius="1.5rem" className="h-full">…</StackCard>
 */

interface StackCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sheets behind the card, 1–3. */
  layers?: 1 | 2 | 3;
  /** Corner radius of the sheets — match the card on top. */
  radius?: string;
}

// Where each sheet goes when the pile fans out: [x, y, rotate]. Alternating sides, smaller each time.
const FAN: [string, string, string][] = [
  ["-7%", "-9px", "-4.5deg"],
  ["8%", "-5px", "5deg"],
  ["-3%", "-14px", "-1.5deg"],
];

const CSS = `
.p441z-stack { position: relative; isolation: isolate; }
.p441z-stack-sheet {
  position: absolute; inset: 0; z-index: -1; border-radius: var(--stack-r, 1rem); pointer-events: none;
  border: 1px solid color-mix(in oklab, var(--color-foreground) 10%, transparent);
  background: color-mix(in oklab, var(--color-foreground) 5%, var(--color-background));
  box-shadow: 0 10px 24px -16px rgb(0 0 0 / .35);
  transform: translateY(calc(var(--i) * 5px)) scale(calc(1 - var(--i) * .035));
  transform-origin: 50% 100%;
  transition: transform .75s cubic-bezier(.34, 1.36, .5, 1) calc(var(--i) * 40ms);
}
.p441z-stack-sheet[data-tint] { background: color-mix(in oklab, var(--color-primary) 16%, var(--color-background)); border-color: color-mix(in oklab, var(--color-primary) 30%, transparent); }
.dark .p441z-stack-sheet { background: color-mix(in oklab, var(--color-foreground) 8%, var(--color-background)); border-color: color-mix(in oklab, var(--color-foreground) 14%, transparent); }
.dark .p441z-stack-sheet[data-tint] { background: color-mix(in oklab, var(--color-primary) 28%, var(--color-background)); border-color: color-mix(in oklab, var(--color-primary) 45%, transparent); }
.p441z-stack-front { position: relative; transition: transform .75s cubic-bezier(.34, 1.36, .5, 1); }
@media (hover: hover) {
  .p441z-stack:hover .p441z-stack-sheet { transform: translate(var(--fx), var(--fy)) rotate(var(--fr)); transition-delay: calc(var(--i) * 40ms); }
  .p441z-stack:hover .p441z-stack-front { transform: translateY(-4px) rotate(-.4deg); }
}
@media (prefers-reduced-motion: reduce) {
  .p441z-stack-sheet, .p441z-stack-front { transition: none !important; }
  .p441z-stack:hover .p441z-stack-sheet { transform: translateY(calc(var(--i) * 5px)) scale(calc(1 - var(--i) * .035)); }
  .p441z-stack:hover .p441z-stack-front { transform: none; }
}
`;

export default function StackCard({ layers = 2, radius = "1rem", className, children, style, ...rest }: StackCardProps) {
  return (
    <div className={cn("p441z-stack", className)} style={{ "--stack-r": radius, ...style } as React.CSSProperties} {...rest}>
      <style href="p441z-stack" precedence="default">
        {CSS}
      </style>
      {FAN.slice(0, layers).map(([fx, fy, fr], i) => (
        <span key={i} aria-hidden data-tint={i === 0 || undefined} className="p441z-stack-sheet" style={{ "--i": i + 1, "--fx": fx, "--fy": fy, "--fr": fr } as React.CSSProperties} />
      ))}
      <div className="p441z-stack-front h-full">{children}</div>
    </div>
  );
}
