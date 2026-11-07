"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import GlassPanel, { GlassBackdrop } from "@/components/effects/glass-panel";
import MaskReveal from "@/components/motion/mask-reveal";
import CountUp from "@/components/motion/count-up";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AccentDots } from "@/site/accent";
import { useT } from "@/site/i18n";


const CURVES = [
  { name: "reveal", v: [0.22, 1, 0.36, 1], note: "entrances · ≤ 500 ms", noteId: "untuk muncul · ≤ 500 ms" },
  { name: "toggle", v: [0.4, 0, 0.2, 1], note: "switches · ≤ 300 ms", noteId: "untuk toggle · ≤ 300 ms" },
  { name: "camera", v: [0.65, 0, 0.35, 1], note: "choreography · 0.9 s", noteId: "untuk koreografi · 0,9 dtk" },
] as const;

const CHIPS = [
  { en: "globals.css is the whole config", id: "semua config di globals.css" },
  { en: "shadcn conventions", id: "konvensi shadcn" },
  { en: "reduced-motion aware", id: "patuh reduced-motion" },
  { en: "no build step", id: "tanpa build step" },
  { en: "MIT", id: "MIT" },
] as const;

function CurvePlayground() {
  const t = useT();
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
          <div className="mt-1 text-[13px] text-muted-foreground">{t(c.note, c.noteId)}</div>
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

function ThemeTile() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const t = useT();
  return (
    <button type="button" onClick={() => setTheme(dark ? "light" : "dark")} className="flex h-full w-full flex-col text-left" aria-label={t("Toggle theme", "Ganti tema")}>
      <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Light + dark", "Terang + gelap")}</div>
      <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">{t("One token swap.", "Satu token, dua suasana.")}</div>
      <div className="mt-auto flex items-center gap-3 pt-6">
        <span className={cn("flex h-8 w-14 items-center rounded-full p-1 transition-colors duration-300", dark ? "bg-primary" : "bg-muted-foreground/30")}>
          <motion.span layout transition={{ duration: 0.3, ease: EASE.toggle }} className={cn("size-6 rounded-full bg-background shadow", dark && "ml-auto")} />
        </span>
        <span className="text-[13px] text-muted-foreground">{t("Click to switch the whole page", "Klik untuk ganti tema seisi halaman")}</span>
      </div>
    </button>
  );
}

export default function Bento({ componentCount, skillCount }: { componentCount: number; skillCount: number }) {
  const t = useT();
  const greys = [100, 96.1, 89.8, 63.9, 45.1, 14.9, 3.9];
  return (
    <section id="kit" className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-28">
      <GlassBackdrop className="left-1/2 right-auto w-screen -translate-x-1/2" variant="a" />
      <div className="max-w-2xl">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Inside the kit", "Di dalam kit")}</div>
        <MaskReveal as="h2" text={t("Quiet by default. Precise by design.", "Kalem dari awal. Presisi sampai detail.")} className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
      </div>
      <div className="mt-12 grid auto-rows-[minmax(200px,auto)] gap-4 md:grid-cols-6">
        <GlassPanel delay={0} className="bento-tile p-6 md:col-span-4">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Tokens", "Token")}</div>
          <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">{t("Pure greyscale. Color only as meaning.", "Serba abu-abu. Warna cuma dipakai kalau ada artinya.")}</div>
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
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[13px] text-muted-foreground">
              {t(
                <>
                  Rebrand in two lines: change <code>--primary</code> and <code>--ring</code>. Try it — the whole page follows.
                </>,
                <>
                  Ganti warna brand cukup dua baris: <code>--primary</code> dan <code>--ring</code>. Coba klik — seisi halaman ikut berganti.
                </>,
              )}
            </div>
            <AccentDots size={20} />
          </div>
        </GlassPanel>
        <GlassPanel delay={70} className="bento-tile flex flex-col justify-between p-6 md:col-span-2">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Components", "Komponen")}</div>
          <div>
            <div className="font-display text-6xl font-extrabold tracking-tight">
              <CountUp to={componentCount} />
            </div>
            <div className="mt-1 text-[13px] text-muted-foreground">{t("UI · effects · motion · desktop — copy-paste, zero lock-in", "UI · efek · motion · desktop — tinggal salin, tanpa terikat library")}</div>
          </div>
        </GlassPanel>
        <GlassPanel delay={140} className="bento-tile p-6 md:col-span-3">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Motion</div>
          <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">{t("Three curves. No linear.", "Tiga kurva. Tak ada yang linear.")}</div>
          <div className="mt-5 h-[150px]">
            <CurvePlayground />
          </div>
        </GlassPanel>
        <GlassPanel delay={210} className="bento-tile p-6 md:col-span-3">
          <ThemeTile />
        </GlassPanel>
        <GlassPanel delay={280} className="bento-tile flex flex-col justify-between p-6 md:col-span-2">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Skills", "Skill")}</div>
          <div>
            <div className="font-display text-6xl font-extrabold tracking-tight">
              <CountUp to={skillCount} />
            </div>
            <div className="mt-1 text-[13px] text-muted-foreground">{t("working guides your AI agent follows", "panduan kerja yang dipatuhi agen AI-mu")}</div>
          </div>
        </GlassPanel>
        <GlassPanel delay={350} className="bento-tile p-6 md:col-span-4">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Ships anywhere", "Jalan di mana pun")}</div>
          <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">{t("Tailwind v4 and v3. React 18 and 19.", "Tailwind v4 dan v3. React 18 dan 19.")}</div>
          <div className="mt-5 flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <span key={chip.en} className="rounded-full border border-border px-3 py-1 text-[13px] text-muted-foreground">
                {t(chip.en, chip.id)}
              </span>
            ))}
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
