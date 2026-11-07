"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";

import Terminal from "@/components/mac/terminal";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { INSTALL } from "@/site/chrome";
import HeroCompare from "@/site/hero-compare";
import type { SkillView } from "@/site/skills";

// The hero's right column: the before/after product window, tilted in 3D, with real kit windows
// stacked around it that drift against the pointer at different depths (nearer ones move more).
// The extra windows are for wide screens; a phone gets the product window alone, flat.
// Pointer position arrives as two springs in -0.5…0.5.
type Pointer = { x: MotionValue<number>; y: MotionValue<number> };

/** One floating window. Outer layer = pointer parallax (framer), inner = GSAP intro (.hero-win). */
function Float({ p, depth, className, tilt = 0, children }: { p: Pointer; depth: number; className: string; tilt?: number; children: React.ReactNode }) {
  const x = useTransform(p.x, (v) => v * -depth);
  const y = useTransform(p.y, (v) => v * -depth);
  return (
    <motion.div style={{ x, y }} className={cn("absolute", className)}>
      <div className="hero-win" style={{ rotate: `${tilt}deg` }}>
        {children}
      </div>
    </motion.div>
  );
}

const NOTES = [
  { app: "Quick Look", title: "Typography", body: "Every size has a reason — ×1.618." },
  { app: "Claude Code", title: "skill-dashboard loaded", body: "Honest tables, real empty states." },
  { app: "Registry", title: "style-kit installed", body: "35 components · 1 theme." },
  { app: "Keynote", title: "Ready to play", body: "Nothing is a video. It's all components." },
];

function Notes() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % NOTES.length), 3800);
    return () => clearInterval(t);
  }, [reduce]);
  const n = NOTES[i];
  return (
    <div className="relative h-[74px] w-full">
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: EASE.reveal }}
          className="absolute inset-0 flex items-start gap-3 rounded-2xl border border-black/10 bg-background/75 p-3 text-left shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-primary font-display text-[15px] font-extrabold text-primary-foreground">p</span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-2 text-[11px] text-muted-foreground">
              <span className="truncate font-semibold uppercase tracking-[0.08em]">{n.app}</span>
              <span>now</span>
            </span>
            <span className="mt-0.5 block truncate text-[13.5px] font-semibold">{n.title}</span>
            <span className="block truncate text-[12.5px] text-muted-foreground">{n.body}</span>
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}



const wideQuery = "(min-width: 1024px)";
const subscribeWide = (cb: () => void) => {
  const m = window.matchMedia(wideQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export default function HeroStack({ p, skills }: { p: Pointer; skills: SkillView[] }) {
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(wideQuery).matches, () => false);
  const reduce = useReducedMotion();
  // Resting 3D tilt that leans with the pointer, and lies flat while the pointer is on the window
  // (so dragging the slider maps 1:1).
  const flat = useMotionValue(0);
  const f = useSpring(flat, { stiffness: 120, damping: 22 });
  const on = wide && !reduce;
  const rotateY = useTransform([p.x, f] as MotionValue<number>[], ([x, k]: number[]) => (on ? (1 - k) * (-11 + x * 8) : 0));
  const rotateX = useTransform([p.y, f] as MotionValue<number>[], ([y, k]: number[]) => (on ? (1 - k) * (5 - y * 6) : 0));
  return (
    <div className="relative [perspective:2200px]">
      <Float p={p} depth={12} tilt={-3} className="-left-8 -top-24 z-0 hidden w-[300px] lg:block [@media(max-height:780px)]:!hidden">
        <Terminal title="zsh" prompt="%" speed={48} lines={[{ cmd: INSTALL.replace("https://", "") }, { out: "✓ 35 components · 1 theme" }, { out: "Done in 4.2s", dim: true }]} />
      </Float>
      <motion.div
        style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
        onPointerEnter={(e) => e.pointerType !== "touch" && flat.set(1)}
        onPointerLeave={() => flat.set(0)}
        className="hero-window-in relative z-10"
      >
        <HeroCompare skills={skills} />
      </motion.div>
      <Float p={p} depth={34} tilt={2} className="-right-6 -top-[5.5rem] z-20 hidden w-[270px] lg:block [@media(max-height:780px)]:!hidden">
        <Notes />
      </Float>
    </div>
  );
}

/** Soft light that follows the pointer, tinted with the accent. */
export function PointerGlow({ p }: { p: Pointer }) {
  const left = useTransform(p.x, (v) => `${(v + 0.5) * 100}%`);
  const top = useTransform(p.y, (v) => `${(v + 0.5) * 100}%`);
  const bg = useMotionTemplate`radial-gradient(520px circle at ${left} ${top}, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent 70%)`;
  return <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden md:block" style={{ background: bg }} />;
}
