"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Compare, PREVIEWS } from "@/site/skill-previews";
import { QuickLook, type SkillView } from "@/site/skills";
import { useNum, useT } from "@/site/i18n";

// The kit's strongest argument, right under the headline: what an agent ships without a skill vs
// with it. Cycles through a few skills on its own until the visitor grabs the slider or a tab.
const PICKS = ["skill-typography.md", "skill-dashboard.md", "skill-backend.api.md", "skill-ui.ux.md"];
const EVERY = 7; // seconds per skill while auto-playing

export default function HeroCompare({ skills }: { skills: SkillView[] }) {
  const list = PICKS.map((f) => skills.find((s) => s.file === f)).filter((s): s is SkillView => !!s && !!PREVIEWS[s.file]);
  const box = useRef<HTMLDivElement>(null);
  const t = useT();
  const num = useNum();
  const seen = useInView(box, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [open, setOpen] = useState<SkillView | null>(null);
  const auto = seen && !held && !reduce && !open;

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setI((n) => (n + 1) % list.length), EVERY * 1000);
    return () => clearTimeout(t);
  }, [auto, i, list.length]);

  if (!list.length) return null;
  const s = list[i];
  const p = PREVIEWS[s.file];

  return (
    <div ref={box} className="mx-auto w-full max-w-6xl text-left">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary">{t("What the skills do", "Sebelum & sesudah")}</div>
          <h2 className="mt-2 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
            {t("Drag the line. ", "Geser garisnya. ")}
            <span className="text-muted-foreground">{t("That’s the difference.", "Lihat bedanya.")}</span>
          </h2>
        </div>
        <div role="tablist" aria-label={t("Skill previews", "Contoh hasil skill")} className="-mx-1 flex max-w-full gap-1 overflow-x-auto px-1 [scrollbar-width:none]">
          {list.map((x, k) => {
            const on = k === i;
            return (
              <button
                key={x.file}
                role="tab"
                type="button"
                aria-selected={on}
                onClick={() => {
                  setI(k);
                  setHeld(true);
                }}
                className="relative shrink-0 overflow-hidden whitespace-nowrap rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur"
              >
                {on && <motion.span layoutId="hero-cmp-tab" className="absolute inset-0 rounded-full bg-foreground" transition={{ duration: 0.4, ease: EASE.reveal }} />}
                {/* Auto-play progress: a hairline along the bottom of the active pill. */}
                {on && auto && <motion.span key={`bar-${i}`} className="absolute bottom-0 left-0 h-[2.5px] rounded-full bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: EVERY, ease: "linear" }} />}
                <span className={cn("relative transition-colors duration-200", on ? "text-background" : "text-muted-foreground hover:text-foreground")}>{x.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid items-center gap-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)] lg:gap-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={s.file} initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(4px)" }} transition={{ duration: 0.35, ease: EASE.reveal }} className="order-2 lg:order-1">
            <div className="font-display text-2xl font-extrabold tracking-tight">{s.title}</div>
            <div className="mt-0.5 text-[15px] font-semibold text-muted-foreground">{s.tagline}</div>
            <p className="mt-4 text-[15px] leading-relaxed">{t(p.note, p.noteId)}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px]">
              <button type="button" onClick={() => setOpen(s)} className="rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-[0_10px_24px_-12px_var(--color-primary)] transition-transform duration-200 active:scale-[0.97]">
                Quick Look
              </button>
              <span className="font-mono text-[12px] text-muted-foreground">{num(s.lines)} {t("lines of guidance", "baris panduan")}</span>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="order-1 min-w-0 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.5)] lg:order-2">
          <Compare key={s.file} before={p.before} after={p.after} play={seen} onGrab={() => setHeld(true)} />
        </div>
      </div>
      <AnimatePresence>{open && <QuickLook key={open.file} s={open} layoutId={`hero-cmp-${open.name}`} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}
