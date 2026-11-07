import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * BorderBeam — a short beam of light that travels around a card's border. Put it inside any
 * `relative` element with a border radius; it follows the radius. CSS only, uses the kit's
 * `animate-border-beam` utility. Color defaults to the theme primary (`--color-primary`).
 *
 * Use on the single highlighted card of a section (the recommended plan, the featured video).
 * Reduced motion: the beam is hidden. The beam is clipped to the element, so it never adds scroll.
 *
 * USAGE
 *   <div className="relative rounded-2xl border">…<BorderBeam /></div>
 */

interface BorderBeamProps {
  className?: string;
  /** Beam length in px. */
  size?: number;
  /** Seconds per lap. */
  duration?: number;
  /** Seconds to offset the start. */
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export default function BorderBeam({ className, size = 220, duration = 9, delay = 0, colorFrom = "var(--color-primary)", colorTo = "transparent" }: BorderBeamProps) {
  // The beam is a pseudo-element travelling around the edge. The mask hides it visually, but its box
  // still pokes out past the corners and would widen the page (horizontal scroll on phones). The
  // outer layer has no border, so clipping it cuts exactly at the edge and keeps the beam visible.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] motion-reduce:hidden">
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit] [border:1.5px_solid_transparent]",
          "[mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
          "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:90%_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
          className,
        )}
        style={{ "--size": size, "--duration": `${duration}s`, "--delay": `-${delay}s`, "--color-from": colorFrom, "--color-to": colorTo } as React.CSSProperties}
      />
    </div>
  );
}
