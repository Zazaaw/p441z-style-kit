"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

import { MacWindow } from "@/components/mac/window";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Compare, PREVIEWS } from "@/site/skill-previews";
import { QuickLook, type SkillView } from "@/site/skills";

// The hero's product shot: one big window rising from the bottom of the first screen, showing what
// an agent ships without a skill vs with it. Cycles through a few skills on its own until the
// visitor grabs the slider or a tab.
const PICKS = ["skill-typography.md", "skill-dashboard.md", "skill-backend.api.md", "skill-ui.ux.md"];
const EVERY = 7; // seconds per skill while auto-playing

export default function HeroCompare({ skills }: { skills: SkillView[] }) {
  const list = PICKS.map((f) => skills.find((s) => s.file === f)).filter((s): s is SkillView => !!s && !!PREVIEWS[s.file]);
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { amount: 0.45 });
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
    <div ref={box} className="text-left">
      <MacWindow
        title={
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={s.file} className="inline-block" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
              {s.file}
            </motion.span>
          </AnimatePresence>
        }
        toolbar={
          <button type="button" onClick={() => setOpen(s)} className="rounded-md px-2 py-0.5 text-[12px] font-semibold text-primary transition-colors hover:bg-primary/10">
            Quick look
          </button>
        }
        className="shadow-[0_50px_120px_-40px_rgba(0,0,0,0.45),0_0_0_0.5px_rgba(0,0,0,0.06)]"
        bodyClassName="bg-muted/30"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-border/70 px-3 py-2">
          <div role="tablist" aria-label="Skill previews" className="-mx-1 flex max-w-full gap-1 overflow-x-auto px-1 [scrollbar-width:none]">
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
                  className="relative shrink-0 overflow-hidden whitespace-nowrap rounded-md px-3 py-1 text-[13px] font-semibold"
                >
                  {on && <motion.span layoutId="hero-cmp-tab" className="absolute inset-0 rounded-md bg-background shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.08)]" transition={{ duration: 0.4, ease: EASE.reveal }} />}
                  {/* Auto-play progress: a hairline along the bottom of the active tab. */}
                  {on && auto && <motion.span key={`bar-${i}`} className="absolute bottom-0 left-0 h-[2px] bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: EVERY, ease: "linear" }} />}
                  <span className={cn("relative transition-colors duration-200", on ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>{x.title}</span>
                </button>
              );
            })}
          </div>
          <span className="hidden text-[12.5px] text-muted-foreground md:block">Drag the line — that’s what the skill changes.</span>
        </div>
        <Compare key={s.file} before={p.before} after={p.after} play={seen} onGrab={() => setHeld(true)} className="rounded-none border-0" />
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border/70 px-4 py-2.5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={s.file} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="min-w-0 flex-1 text-[13px] text-muted-foreground">
              <span className="font-semibold text-foreground">{s.title}.</span> {p.note}
            </motion.p>
          </AnimatePresence>
          <span className="shrink-0 font-mono text-[11.5px] text-muted-foreground">{s.lines.toLocaleString("en-US")} lines</span>
        </div>
      </MacWindow>
      <AnimatePresence>{open && <QuickLook key={open.file} s={open} layoutId={`hero-cmp-${open.name}`} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}
