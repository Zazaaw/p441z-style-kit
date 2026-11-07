"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

import Terminal from "@/components/mac/terminal";
import { MacWindow } from "@/components/mac/window";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AccentDots } from "@/site/accent";
import { INSTALL } from "@/site/chrome";
import { useT } from "@/site/i18n";

// The hero's desktop: real kit windows floating around the headline, drifting against the pointer
// at different depths (nearer windows move more). Wide screens only — on a phone the headline is
// the whole stage. Pointer position arrives as two springs in -0.5…0.5.
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
  { app: "Quick Look", title: ["Typography", "Tipografi"], body: ["Every size has a reason — ×1.618.", "Setiap ukuran punya alasan — ×1,618."] },
  { app: "Claude Code", title: ["skill-dashboard loaded", "skill-dashboard dimuat"], body: ["Honest tables, real empty states.", "Tabel jujur, empty state yang jelas."] },
  { app: "Registry", title: ["style-kit installed", "style-kit terpasang"], body: ["35 components · 1 theme.", "35 komponen · 1 tema."] },
  { app: "Keynote", title: ["Ready to play", "Siap diputar"], body: ["Nothing is a video. It's all components.", "Ini bukan video — semuanya komponen."] },
] as const;

function Notes() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % NOTES.length), 3800);
    return () => clearInterval(t);
  }, [reduce]);
  const n = NOTES[i];
  const t = useT();
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
              <span>{t("now", "baru saja")}</span>
            </span>
            <span className="mt-0.5 block truncate text-[13.5px] font-semibold">{t(n.title[0], n.title[1])}</span>
            <span className="block truncate text-[12.5px] text-muted-foreground">{t(n.body[0], n.body[1])}</span>
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** The reveal ease drawn as a curve, with a dot riding it — the kit's motion in one glance. */
function Curve() {
  // Control points are EASE.reveal mapped onto the 160×104 box.
  const d = "M 12 108 C 47.2 4, 69.6 4, 172 4";
  return (
    <MacWindow glass title="Motion" bodyClassName="px-4 pb-3 pt-2">
      <svg viewBox="0 0 184 116" className="w-full overflow-visible" aria-hidden>
        <path d="M12 4H172M12 108H172" className="stroke-border" strokeDasharray="3 4" />
        <path d={d} fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinecap="round" />
        <circle r="5" className="fill-primary motion-reduce:hidden" style={{ offsetPath: `path("${d}")`, animation: "hero-ride 2.6s cubic-bezier(0.22,1,0.36,1) infinite" }} />
      </svg>
      <div className="mt-1 flex items-baseline justify-between font-mono text-[11px] text-muted-foreground">
        <span>EASE.reveal</span>
        <span>0.22, 1, 0.36, 1</span>
      </div>
      <style>{`@keyframes hero-ride { 0% { offset-distance: 0% } 70%, 100% { offset-distance: 100% } }`}</style>
    </MacWindow>
  );
}

function Appearance() {
  const t = useT();
  return (
    <MacWindow glass title={t("Appearance", "Tampilan")} bodyClassName="p-4">
      <div className="text-[12px] font-semibold text-muted-foreground">{t("Accent color", "Warna aksen")}</div>
      <AccentDots size={16} className="mt-2.5 gap-2" />
      <div className="mt-3 text-[11.5px] leading-snug text-muted-foreground">
        {t("The whole page follows. Two tokens: ", "Seisi halaman ikut berganti. Cukup dua token: ")}
        <code className="whitespace-nowrap text-foreground">--primary</code> + <code className="whitespace-nowrap text-foreground">--ring</code>.
      </div>
    </MacWindow>
  );
}

export default function HeroDesk({ p }: { p: Pointer }) {
  const t = useT();
  return (
    <div className="hero-desk pointer-events-none absolute inset-0 z-10 hidden xl:block [&_.hero-win]:pointer-events-auto">
      <Float p={p} depth={26} tilt={-2.5} className="left-[2.5vw] top-[20%] w-[clamp(250px,19vw,300px)]">
        <Terminal title="zsh" prompt="%" speed={48} lines={[{ cmd: INSTALL.replace("https://", "") }, { out: t("✓ 35 components · 1 theme", "✓ 35 komponen · 1 tema") }, { out: t("Done in 4.2s", "Beres dalam 4,2 detik"), dim: true }]} />
      </Float>
      <Float p={p} depth={14} tilt={2} className="right-[2.5vw] top-[17%] w-[clamp(250px,19vw,300px)]">
        <Notes />
      </Float>
      <Float p={p} depth={40} tilt={1.5} className="bottom-[13%] left-[4vw] w-[clamp(230px,17vw,270px)]">
        <Appearance />
      </Float>
      <Float p={p} depth={20} tilt={-1.5} className="bottom-[16%] right-[4vw] w-[clamp(220px,16vw,250px)]">
        <Curve />
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
