"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * PocketCard — a picture tucked into a card like a sheet in a pocket. When the card scrolls into
 * view the sheet drops in from above and lands on a spring; on hover it slides further out of the
 * pocket and tilts, while the pocket dips to let it go. Put a screenshot, a poster, or a photo in
 * `sheet`, and the card's text as children.
 *
 * The front overlaps the bottom of the sheet by `tuck` px. Make the front translucent glass
 * (`GlassPanel`) and the tucked part frosts through it. Transforms only; one stylesheet for every
 * card. Reduced motion: no drop, no slide.
 *
 * USAGE
 *   <PocketCard sheet={<img src="/shot.jpg" alt="" className="aspect-[16/9] w-full object-cover" />}>
 *     <GlassPanel tilt={0} appear={false} className="p-5">Portfolio …</GlassPanel>
 *   </PocketCard>
 *
 *   <a href="https://…"><PocketCard sheet={…} tuck={64} delay={90}>…</PocketCard></a>
 */

interface PocketCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What sits in the pocket. */
  sheet: React.ReactNode;
  /** How far (px) the front covers the bottom of the sheet. */
  tuck?: number;
  /** Delay (ms) before the sheet drops in — stagger a row. */
  delay?: number;
  /** Classes for the sheet's frame (radius, border, inset). */
  sheetClassName?: string;
}

const CSS = `
.p441z-pocket { position: relative; isolation: isolate; }
.p441z-pocket-sheet {
  position: relative; z-index: 0; margin: 0 4.5% calc(var(--tuck) * -1);
  transform-origin: 50% 100%;
  transition: translate .8s cubic-bezier(.34, 1.36, .5, 1), rotate .8s cubic-bezier(.34, 1.36, .5, 1), scale .8s cubic-bezier(.34, 1.36, .5, 1), opacity .5s cubic-bezier(.22, 1, .36, 1);
}
.p441z-pocket[data-wait] .p441z-pocket-sheet { translate: 0 -64px; rotate: -3deg; opacity: 0; }
.p441z-pocket[data-in] .p441z-pocket-sheet { transition-delay: var(--pocket-delay, 0ms); }
.p441z-pocket-front { position: relative; z-index: 1; transition: translate .7s cubic-bezier(.34, 1.36, .5, 1); }
@media (hover: hover) {
  .p441z-pocket:hover .p441z-pocket-sheet { translate: 0 -18px; rotate: -1.4deg; scale: 1.02; transition-delay: 0ms; }
  .p441z-pocket:hover .p441z-pocket-front { translate: 0 5px; }
}
@media (prefers-reduced-motion: reduce) {
  .p441z-pocket-sheet, .p441z-pocket-front { transition: none !important; }
  .p441z-pocket[data-wait] .p441z-pocket-sheet { translate: none; rotate: none; opacity: 1; }
  .p441z-pocket:hover .p441z-pocket-sheet, .p441z-pocket:hover .p441z-pocket-front { translate: none; rotate: none; scale: none; }
}
`;

export default function PocketCard({ sheet, tuck = 48, delay = 0, sheetClassName, className, children, style, ...rest }: PocketCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      data-wait={!inView || undefined}
      data-in={inView || undefined}
      className={cn("p441z-pocket", className)}
      style={{ "--tuck": `${tuck}px`, "--pocket-delay": `${delay}ms`, ...style } as React.CSSProperties}
      {...rest}
    >
      <style href="p441z-pocket" precedence="default">
        {CSS}
      </style>
      <div className={cn("p441z-pocket-sheet overflow-hidden rounded-t-xl border border-b-0 border-border/70 shadow-[0_-10px_30px_-18px_rgb(0_0_0/0.4)]", sheetClassName)}>{sheet}</div>
      <div className="p441z-pocket-front">{children}</div>
    </div>
  );
}
