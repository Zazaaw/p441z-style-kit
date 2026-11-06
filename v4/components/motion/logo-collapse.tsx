"use client";

import * as React from "react";
import { useAnimate, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE, POP } from "@/lib/motion";

/**
 * LogoCollapse — the outro of a product video: feature cards pop in one by one, then all of them
 * pull into the center and become the logo.
 *
 * Each card measures its own offset from the stage center at the moment of collapse, so it
 * travels exactly to the middle whatever the layout or screen size. Controlled with `collapsed`,
 * or set `auto` to play the whole sequence once when scrolled into view.
 *
 * USAGE
 *   <LogoCollapse auto items={[<Card key="a"/>, <Card key="b"/>, <Card key="c"/>]} logo={<Wordmark />} />
 */

interface LogoCollapseProps {
  items: React.ReactNode[];
  logo: React.ReactNode;
  /** Controlled mode. */
  collapsed?: boolean;
  /** Play pop-in → collapse once on scroll-into-view. */
  auto?: boolean;
  /** Seconds the cards stay before collapsing (auto mode). */
  hold?: number;
  className?: string;
}

export default function LogoCollapse({ items, logo, collapsed, auto = false, hold = 1.6, className }: LogoCollapseProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const seen = useInView(scope, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();

  // Imperative choreography: the DOM is the external system here, so no state round-trips.
  const show = React.useCallback(() => {
    if (!scope.current) return;
    const cards = [...scope.current.querySelectorAll<HTMLElement>("[data-card]")];
    cards.forEach((c, i) => animate(c, { x: 0, y: 0, scale: 1, opacity: 1, filter: "blur(0px)" }, { ...POP, delay: i * 0.12 }));
    animate("[data-logo]", { opacity: 0, scale: 0.85, filter: "blur(8px)" }, { duration: 0.3 });
  }, [animate, scope]);

  const collapse = React.useCallback(() => {
    if (!scope.current) return;
    const s = scope.current.getBoundingClientRect();
    const cx = s.left + s.width / 2;
    const cy = s.top + s.height / 2;
    const cards = [...scope.current.querySelectorAll<HTMLElement>("[data-card]")];
    cards.forEach((c, i) => {
      // Cards are at rest (no transform) when this runs, so the rect is their true layout position.
      const r = c.getBoundingClientRect();
      const ox = cx - (r.left + r.width / 2);
      const oy = cy - (r.top + r.height / 2);
      animate(c, { x: ox, y: oy, scale: 0.35, opacity: 0, filter: "blur(4px)" }, { duration: 0.8, ease: EASE.camera, delay: i * 0.03 });
    });
    animate("[data-logo]", { opacity: 1, scale: 1, filter: "blur(0px)" }, { duration: 0.7, ease: EASE.reveal, delay: 0.45 });
  }, [animate, scope]);

  React.useEffect(() => {
    if (reduce) {
      animate("[data-card]", { opacity: 0 }, { duration: 0 });
      animate("[data-logo]", { opacity: 1, scale: 1, filter: "blur(0px)" }, { duration: 0 });
      return;
    }
    if (collapsed === undefined) return;
    if (collapsed) collapse();
    else show();
  }, [collapsed, reduce, show, collapse, animate]);

  React.useEffect(() => {
    if (!auto || !seen || reduce) return;
    show();
    const t = setTimeout(collapse, (0.12 * items.length + hold) * 1000);
    return () => clearTimeout(t);
  }, [auto, seen, reduce, hold, items.length, show, collapse]);

  return (
    <div ref={scope} className={cn("relative grid place-items-center", className)}>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {items.map((it, i) => (
          <div key={i} data-card style={{ opacity: 0, transform: "translateY(16px) scale(0.9)" }}>
            {it}
          </div>
        ))}
      </div>
      <div data-logo className="pointer-events-none absolute inset-0 grid place-items-center" style={{ opacity: 0, transform: "scale(0.85)", filter: "blur(8px)" }}>
        {logo}
      </div>
    </div>
  );
}
