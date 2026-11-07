"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import SpotlightCard from "@/components/effects/spotlight-card";
import MaskReveal from "@/components/motion/mask-reveal";
import CountUp from "@/components/motion/count-up";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CURVES = [
  { name: "reveal", v: [0.22, 1, 0.36, 1], note: "entrances · ≤ 500 ms" },
  { name: "toggle", v: [0.4, 0, 0.2, 1], note: "switches · ≤ 300 ms" },
  { name: "camera", v: [0.65, 0, 0.35, 1], note: "choreography · 0.9 s" },
] as const;

function CurvePlayground() {
  const [k, setK] = useState(0);
  const [run, setRun] = useState(0);
  const c = CURVES[k];
  const [x1, y1, x2, y2] = c.v;
  const P = (x: number, y: number) => `${8 + x * 104} ${112 - y * 104}`;
  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1">
        {CURVES.map((cv, i) => (
          <button
            key={cv.name}
            type="button"
            onClick={() => {
              setK(i);
              setRun((r) => r + 1);
            }}
            className={cn("rounded-full px-3 py-1 font-mono text-[12px] transition-colors duration-200", i === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            {cv.name}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-1 items-center gap-6">
        <svg viewBox="0 0 120 120" className="size-32 shrink-0 overflow-visible" aria-hidden>
          <rect x="8" y="8" width="104" height="104" rx="6" className="fill-none stroke-border" />
          <path d={`M${P(0, 0)} C${P(x1, y1)} ${P(x2, y2)} ${P(1, 1)}`} className="fill-none stroke-primary" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={8} y1={112} x2={8 + x1 * 104} y2={112 - y1 * 104} className="stroke-muted-foreground/40" strokeDasharray="2 3" />
          <line x1={112} y1={8} x2={8 + x2 * 104} y2={112 - y2 * 104} className="stroke-muted-foreground/40" strokeDasharray="2 3" />
        </svg>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[12.5px]">[{c.v.join(", ")}]</div>
          <div className="mt-1 text-[13px] text-muted-foreground">{c.note}</div>
          <div className="relative mt-4 h-9 rounded-full bg-muted">
            <motion.span
              key={`${k}-${run}`}
              className="absolute left-1 top-1 size-7 rounded-full bg-primary shadow-[0_6px_16px_-6px_hsl(var(--primary))]"
              initial={{ left: 4 }}
              animate={{ left: "calc(100% - 32px)" }}
              transition={{ duration: c.name === "camera" ? 0.9 : c.name === "toggle" ? 0.3 : 0.5, ease: [...c.v] as [number, number, number, number], repeat: Infinity, repeatType: "reverse", repeatDelay: 0.6 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Golden-ratio type scale from skill-typography: base 16, every step ×/÷ 1.618, half-steps √φ.
const SCALE = [
  { role: "caption", px: 12.58, lh: 1.4, tr: 0.01 },
  { role: "body-sm", px: 14.19, lh: 1.5, tr: 0 },
  { role: "body", px: 16, lh: 1.618, tr: 0 },
  { role: "lead", px: 20.35, lh: 1.5, tr: -0.005 },
  { role: "h5", px: 25.89, lh: 1.25, tr: -0.01 },
  { role: "h4", px: 32.93, lh: 1.2, tr: -0.015 },
  { role: "h3", px: 41.89, lh: 1.15, tr: -0.02 },
  { role: "h2", px: 53.28, lh: 1.1, tr: -0.022 },
  { role: "h1", px: 67.78, lh: 1.05, tr: -0.025 },
];
const FAMILIES = [
  { key: "sans", label: "Sans", name: "Plus Jakarta Sans", cls: "font-display", note: "Everything. 400–800.", weights: [400, 800] },
  { key: "serif", label: "Serif", name: "Instrument Serif Italic", cls: "font-serif italic", note: "The accent — used once per page.", weights: [400, 400] },
  { key: "mono", label: "Mono", name: "JetBrains Mono", cls: "font-mono", note: "Code, IDs, tabular data.", weights: [400, 700] },
] as const;

function TypographyTile() {
  const [fam, setFam] = useState(0);
  const [weight, setWeight] = useState(800);
  const [step, setStep] = useState(6);
  const f = FAMILIES[fam];
  const w = Math.min(f.weights[1], Math.max(f.weights[0], weight));
  const cur = SCALE[step];
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
      <div className="flex flex-col">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Typography</div>
        <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">Every size has a reason.</div>
        <div className="mt-5 flex gap-1">
          {FAMILIES.map((x, i) => (
            <button key={x.key} type="button" onClick={() => setFam(i)} className={cn("rounded-full px-3 py-1 text-[12px] font-semibold transition-colors duration-200", i === fam ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
              {x.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-end gap-5">
          <motion.div key={f.key} initial={{ opacity: 0, y: 10, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.45, ease: EASE.reveal }} className={cn("text-[120px] leading-[0.9] tracking-[-0.04em]", f.cls)} style={{ fontWeight: w }}>
            Aa
          </motion.div>
          <div className="pb-3 text-[13px] leading-relaxed text-muted-foreground">
            <div className="font-semibold text-foreground">{f.name}</div>
            <div>{f.note}</div>
          </div>
        </div>
        <label className={cn("mt-6 block text-[12px] font-medium text-muted-foreground", f.weights[0] === f.weights[1] && "opacity-40")}>
          <span className="flex justify-between">
            <span>Weight</span>
            <span className="font-mono tabular-nums text-foreground">{w}</span>
          </span>
          <input
            type="range"
            min={400}
            max={800}
            step={100}
            value={w}
            disabled={f.weights[0] === f.weights[1]}
            onChange={(e) => setWeight(Number(e.target.value))}
            aria-label="Font weight"
            className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_2px_8px_-2px_var(--color-primary)]"
            style={{ background: `linear-gradient(to right, var(--color-primary) ${((w - 400) / 400) * 100}%, var(--color-muted) ${((w - 400) / 400) * 100}%)` }}
          />
        </label>
        <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
          A golden-ratio scale from <code className="text-[0.92em] text-foreground">skill-typography</code>: base 16px, every step × or ÷ 1.618, half-steps √φ. Product UI stops at h3; marketing pages go up to display.
        </p>
        <div className="mt-auto grid grid-cols-3 gap-2 pt-6 text-center">
          {[
            ["Ratio", "1.618"],
            [cur.role, `${cur.px}px`],
            ["Leading", String(cur.lh)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border px-2 py-2.5">
              <div className="font-mono text-[15px] font-semibold tabular-nums">{v}</div>
              <div className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{k}</div>
            </div>
          ))}
        </div>
      </div>
      <ul className="min-w-0 divide-y divide-border border-y border-border" onMouseLeave={() => setStep(6)}>
        {SCALE.map((x, i) => (
          <li key={x.role}>
            <button type="button" onMouseEnter={() => setStep(i)} onFocus={() => setStep(i)} onClick={() => setStep(i)} className="group relative flex w-full min-w-0 items-baseline gap-4 py-2 text-left">
              {i === step && <motion.span layoutId="type-step" className="absolute inset-y-1 -left-3 w-[3px] rounded-full bg-primary" transition={{ duration: 0.35, ease: EASE.reveal }} />}
              <span className={cn("w-16 shrink-0 font-mono text-[11px] tabular-nums transition-colors", i === step ? "text-primary" : "text-muted-foreground")}>
                {x.role}
                <span className="block opacity-70">{x.px}</span>
              </span>
              <span className={cn("min-w-0 truncate transition-colors duration-200", f.cls, i === step ? "text-foreground" : "text-foreground/70")} style={{ fontSize: x.px, lineHeight: x.lh, letterSpacing: `${x.tr}em`, fontWeight: i >= 4 ? w : Math.min(w, 600) }}>
                Quiet by default.
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThemeTile() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  return (
    <button type="button" onClick={() => setTheme(dark ? "light" : "dark")} className="flex h-full w-full flex-col text-left" aria-label="Toggle theme">
      <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Light + dark</div>
      <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">One token swap.</div>
      <div className="mt-auto flex items-center gap-3 pt-6">
        <span className={cn("flex h-8 w-14 items-center rounded-full p-1 transition-colors duration-300", dark ? "bg-primary" : "bg-muted-foreground/30")}>
          <motion.span layout transition={{ duration: 0.3, ease: EASE.toggle }} className={cn("size-6 rounded-full bg-background shadow", dark && "ml-auto")} />
        </span>
        <span className="text-[13px] text-muted-foreground">Click to switch the whole page</span>
      </div>
    </button>
  );
}

export default function Bento({ componentCount, skillCount }: { componentCount: number; skillCount: number }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".bento-tile", { y: 50, opacity: 0, scale: 0.97, duration: 1, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: root.current, start: "top 75%" } });
      });
    },
    { scope: root },
  );
  const greys = [100, 96.1, 89.8, 63.9, 45.1, 14.9, 3.9];
  return (
    <section id="kit" ref={root} className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-28">
      <div className="max-w-2xl">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Inside the kit</div>
        <MaskReveal as="h2" text="Quiet by default. Precise by design." className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
      </div>
      <div className="mt-12 grid auto-rows-[minmax(200px,auto)] gap-4 md:grid-cols-6">
        <SpotlightCard className="bento-tile p-6 md:col-span-4">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Tokens</div>
          <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">Pure greyscale. Color only as meaning.</div>
          <div className="mt-6 flex gap-2">
            {greys.map((l) => (
              <div key={l} className="flex-1">
                <div className="h-16 rounded-xl border border-border" style={{ background: `hsl(0 0% ${l}%)` }} />
                <div className="mt-1.5 font-mono text-[10.5px] text-muted-foreground">{l}%</div>
              </div>
            ))}
            <div className="flex-1">
              <div className="h-16 rounded-xl bg-primary shadow-[0_10px_24px_-12px_hsl(var(--primary))]" />
              <div className="mt-1.5 font-mono text-[10.5px] text-primary">--primary</div>
            </div>
          </div>
          <div className="mt-4 text-[13px] text-muted-foreground">Rebrand in two lines: change <code>--primary</code> and <code>--ring</code>. This page uses the desktop accent blue.</div>
        </SpotlightCard>
        <SpotlightCard className="bento-tile flex flex-col justify-between p-6 md:col-span-2">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Components</div>
          <div>
            <div className="font-display text-6xl font-extrabold tracking-tight">
              <CountUp to={componentCount} />
            </div>
            <div className="mt-1 text-[13px] text-muted-foreground">UI · effects · motion · desktop — copy-paste, zero lock-in</div>
          </div>
        </SpotlightCard>
        <SpotlightCard className="bento-tile p-6 md:col-span-6 md:p-8">
          <TypographyTile />
        </SpotlightCard>
        <SpotlightCard className="bento-tile p-6 md:col-span-3">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Motion</div>
          <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">Three curves. No linear.</div>
          <div className="mt-5 h-[150px]">
            <CurvePlayground />
          </div>
        </SpotlightCard>
        <SpotlightCard className="bento-tile p-6 md:col-span-3">
          <ThemeTile />
        </SpotlightCard>
        <SpotlightCard className="bento-tile flex flex-col justify-between p-6 md:col-span-2">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Skills</div>
          <div>
            <div className="font-display text-6xl font-extrabold tracking-tight">
              <CountUp to={skillCount} />
            </div>
            <div className="mt-1 text-[13px] text-muted-foreground">working guides your AI agent follows</div>
          </div>
        </SpotlightCard>
        <SpotlightCard className="bento-tile p-6 md:col-span-4">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ships anywhere</div>
          <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">Tailwind v4 and v3. React 18 and 19.</div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["globals.css is the whole config", "shadcn conventions", "reduced-motion aware", "no build step", "MIT"].map((t) => (
              <span key={t} className="rounded-full border border-border px-3 py-1 text-[13px] text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
