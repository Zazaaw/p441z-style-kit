"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * GlassPanel — a frosted-glass surface with depth. It blurs and saturates whatever sits behind it,
 * wears a rim of light that is brightest where the light comes from, catches a soft specular that
 * follows the pointer, tilts a few degrees toward the cursor, and assembles itself the first time it
 * scrolls into view — it rises, comes into focus, and lands on a spring (a few pixels past its spot,
 * then back), the way the sheets in a folder settle. Give clickable cards `press` and they squish
 * under the finger too.
 *
 * Glass needs something to frost: put it over color — the kit's `GlassBackdrop` (below), an
 * `Aurora`, a photo, or a busy pattern. Over a flat page it reads as a plain card.
 *
 * Tinted from the theme (`--color-background`, `--color-primary`) with `color-mix()`, so it works
 * in light and dark and follows a rebrand. Pointer position is written to CSS variables — no React
 * re-render per move. Reduced motion: no tilt, no entrance; the glass itself stays.
 *
 * USAGE
 *   <section className="relative">
 *     <GlassBackdrop />
 *     <GlassPanel className="p-6">…</GlassPanel>
 *     <GlassPanel className="p-6" delay={80} tilt={0}>…</GlassPanel>   // stagger, no tilt
 *     <GlassPanel contentClassName="flex items-center justify-between gap-4 px-6 py-5">…</GlassPanel>
 *     <GlassPanel press><a href="/docs" className="block p-6">…</a></GlassPanel>   // a card that is a link
 *   </section>
 */

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum tilt toward the pointer, in degrees. 0 turns it off (use it on drag surfaces). */
  tilt?: number;
  /** Assemble on first view. Off for things that are already on screen or animated by a parent. */
  appear?: boolean;
  /** Entrance delay in ms — stagger a grid with `delay={i * 70}`. */
  delay?: number;
  /** Classes for the content wrapper (the panel wraps its children) — put flex/grid layout here. */
  contentClassName?: string;
  /** Squish to 98.5 % while pressed and spring back — for panels that are (or wrap) a link or button. */
  press?: boolean;
}

const CSS = `
.p441z-glass {
  --gx: .5; --gy: 0; --tx: 0; --ty: 0; --lift: 0px;
  position: relative;
  isolation: isolate;
  background: linear-gradient(160deg, color-mix(in oklab, var(--color-background) 64%, transparent), color-mix(in oklab, var(--color-background) 40%, transparent));
  /* No saturate(): on a Retina screen it is what costs the frames (Chrome fell from 120 to ~75 fps
     with a page of saturated glass; blur alone holds 120). */
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .6), 0 1px 2px rgb(0 0 0 / .05), 0 28px 56px -32px rgb(0 0 0 / .38);
  transform: perspective(1200px) rotateX(calc(var(--ty) * var(--tilt, 3) * -1deg)) rotateY(calc(var(--tx) * var(--tilt, 3) * 1deg)) translateY(var(--lift));
  /* translate + scale land on the spring (they overshoot a few px, then settle); opacity and blur
     can't overshoot, so they ease. */
  transition:
    transform .7s cubic-bezier(.22, 1, .36, 1),
    box-shadow .5s cubic-bezier(.22, 1, .36, 1),
    opacity .9s cubic-bezier(.22, 1, .36, 1) var(--glass-delay, 0ms),
    translate 1s cubic-bezier(.34, 1.36, .5, 1) var(--glass-delay, 0ms),
    scale 1s cubic-bezier(.34, 1.36, .5, 1) var(--glass-delay, 0ms),
    filter .9s cubic-bezier(.22, 1, .36, 1) var(--glass-delay, 0ms);
}
/* Once landed, the entrance delay is dropped so a press answers at once. */
.p441z-glass[data-settled] {
  transition: transform .7s cubic-bezier(.22, 1, .36, 1), box-shadow .5s cubic-bezier(.22, 1, .36, 1), scale .45s cubic-bezier(.34, 1.36, .5, 1);
}
.p441z-glass[data-press][data-settled]:active { scale: .985; transition-duration: .7s, .5s, .1s; }
.dark .p441z-glass {
  background: linear-gradient(160deg, color-mix(in oklab, var(--color-background) 58%, transparent), color-mix(in oklab, var(--color-background) 32%, transparent));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .09), 0 1px 2px rgb(0 0 0 / .3), 0 28px 56px -28px rgb(0 0 0 / .75);
}
.p441z-glass:hover { --lift: -3px; box-shadow: inset 0 1px 0 rgb(255 255 255 / .7), 0 1px 2px rgb(0 0 0 / .05), 0 36px 64px -30px rgb(0 0 0 / .42); }
.dark .p441z-glass:hover { box-shadow: inset 0 1px 0 rgb(255 255 255 / .12), 0 1px 2px rgb(0 0 0 / .3), 0 36px 64px -26px rgb(0 0 0 / .8); }

/* Rim: a 1px gradient border, bright at the top-left, picking up the accent at the far corner. */
.p441z-glass > .p441z-glass-rim {
  position: absolute; inset: 0; z-index: 1; border-radius: inherit; padding: 1px; pointer-events: none;
  background: linear-gradient(145deg, rgb(255 255 255 / .9), rgb(255 255 255 / .2) 38%, rgb(0 0 0 / .06) 62%, color-mix(in oklab, var(--color-primary) 40%, transparent));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
}
.dark .p441z-glass > .p441z-glass-rim {
  background: linear-gradient(145deg, rgb(255 255 255 / .3), rgb(255 255 255 / .06) 40%, rgb(255 255 255 / .02) 62%, color-mix(in oklab, var(--color-primary) 55%, transparent));
}
/* Specular: soft light under the pointer. */
.p441z-glass > .p441z-glass-spec {
  position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0;
  background: radial-gradient(480px circle at calc(var(--gx) * 100%) calc(var(--gy) * 100%), rgb(255 255 255 / .55), transparent 60%);
  mix-blend-mode: soft-light;
  transition: opacity .5s cubic-bezier(.22, 1, .36, 1);
}
.dark .p441z-glass > .p441z-glass-spec {
  background: radial-gradient(480px circle at calc(var(--gx) * 100%) calc(var(--gy) * 100%), color-mix(in oklab, var(--color-primary) 22%, transparent), transparent 60%);
  mix-blend-mode: screen;
}
.p441z-glass:hover > .p441z-glass-spec { opacity: 1; }

/* Entrance: rise and come into focus. */
.p441z-glass[data-appear]:not([data-shown]) { opacity: 0; translate: 0 36px; scale: .94; filter: blur(8px); }

@media (prefers-reduced-motion: reduce) {
  .p441z-glass { transform: none !important; transition: none !important; }
  .p441z-glass:active { scale: none !important; }
  .p441z-glass[data-appear]:not([data-shown]) { opacity: 1; translate: none; scale: none; filter: none; }
}
`;

/** One copy of the stylesheet no matter how many panels (React 19 dedupes by `href`). */
function GlassStyles() {
  return (
    <style href="p441z-glass" precedence="default">
      {CSS}
    </style>
  );
}

export default function GlassPanel({ className, contentClassName, children, style, tilt = 3, appear = true, delay = 0, press = false, onPointerMove, onPointerLeave, ...rest }: GlassPanelProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(!appear);
  const [settled, setSettled] = React.useState(!appear);

  React.useEffect(() => {
    if (!shown || settled) return;
    const t = window.setTimeout(() => setSettled(true), delay + 1000);
    return () => window.clearTimeout(t);
  }, [shown, settled, delay]);
  const raf = React.useRef(0);

  React.useEffect(() => {
    if (!appear) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [appear]);

  React.useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const write = (gx: number, gy: number) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--gx", gx.toFixed(3));
      el.style.setProperty("--gy", gy.toFixed(3));
      el.style.setProperty("--tx", (gx * 2 - 1).toFixed(3));
      el.style.setProperty("--ty", (gy * 2 - 1).toFixed(3));
    });
  };

  return (
    <div
      ref={ref}
      data-appear={appear || undefined}
      data-shown={shown || undefined}
      data-settled={settled || undefined}
      data-press={press || undefined}
      className={cn("p441z-glass rounded-2xl", className)}
      style={{ "--tilt": tilt, "--glass-delay": `${delay}ms`, ...style } as React.CSSProperties}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        if (e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        write((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        write(0.5, 0.5);
      }}
      {...rest}
    >
      <GlassStyles />
      <div aria-hidden className="p441z-glass-spec" />
      <div aria-hidden className="p441z-glass-rim" />
      <div className={cn("relative z-[2]", contentClassName)}>{children}</div>
    </div>
  );
}

/**
 * GlassBackdrop — soft pools of the theme's primary color for glass to frost. Static (no animation,
 * no filter): radial gradients only, so it costs nothing while scrolling. Put it first inside a
 * `relative` section; it sits behind everything. Its edges fade out on all four sides, so it never
 * shows a hard line — make it wider than the section (full-bleed) for a softer spread.
 *
 * USAGE
 *   <section className="relative"><GlassBackdrop variant="b" />…</section>
 */
const FADE = "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent), linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)";

export function GlassBackdrop({ className, variant = "a", strength = 1 }: { className?: string; variant?: "a" | "b" | "c"; strength?: number }) {
  const spots = {
    a: [["18% 22%", 34], ["82% 38%", 26], ["46% 88%", 20]],
    b: [["78% 18%", 32], ["14% 60%", 24], ["60% 92%", 18]],
    c: [["50% 12%", 30], ["10% 84%", 22], ["92% 74%", 24]],
  }[variant] as [string, number][];
  const pool = (at: string, pct: number) => `radial-gradient(38% 46% at ${at}, color-mix(in oklab, var(--color-primary) ${Math.round(pct * strength)}%, transparent), transparent 70%)`;
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        background: [...spots.map(([at, pct]) => pool(at, pct)), "radial-gradient(30% 36% at 60% 40%, color-mix(in oklab, var(--color-foreground) 5%, transparent), transparent 70%)"].join(", "),
        maskImage: FADE,
        WebkitMaskImage: FADE,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  );
}
