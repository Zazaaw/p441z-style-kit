"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { QuickLook, type SkillView } from "@/site/skills";

// Skill groups for the hero: what kind of work each skill is for.
const GROUPS = [
  { key: "all", label: "All", files: null },
  { key: "eng", label: "Engineering", files: ["backend.api", "database", "security", "performance", "testing", "debugging"] },
  { key: "design", label: "Design", files: ["ui.ux", "landing.page", "typography", "dashboard", "export.report", "motion.video"] },
  { key: "flow", label: "Workflow", files: ["analysis", "git.workflow", "documentation"] },
] as const;
const inGroup = (g: (typeof GROUPS)[number], s: SkillView) => !g.files || (g.files as readonly string[]).includes(s.file.replace(/^skill-|\.md$/g, ""));

/** The skills at a glance, right in the hero. Click one and it opens as a Quick Look window. */
export default function HeroCatalog({ skills }: { skills: SkillView[] }) {
  const [tab, setTab] = useState<(typeof GROUPS)[number]["key"]>("all");
  const [open, setOpen] = useState<SkillView | null>(null);
  const group = GROUPS.find((g) => g.key === tab)!;
  const list = skills.filter((s) => inGroup(group, s));
  return (
    <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-border bg-background/70 text-left shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-3 py-2.5">
        <div role="tablist" aria-label="Skill groups" className="-mx-1 flex max-w-full items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none]">
          {GROUPS.map((g) => {
            const on = g.key === tab;
            return (
              <button key={g.key} role="tab" aria-selected={on} type="button" onClick={() => setTab(g.key)} className="relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold">
                {on && <motion.span layoutId="catalog-tab" className="absolute inset-0 rounded-full bg-primary" transition={{ duration: 0.4, ease: EASE.reveal }} />}
                <span className={cn("relative transition-colors duration-200", on ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {g.label} <span className={cn("ml-0.5 tabular-nums", on ? "opacity-80" : "opacity-60")}>{skills.filter((s) => inGroup(g, s)).length}</span>
                </span>
              </button>
            );
          })}
        </div>
        <a href="#skills" className="px-2 text-[13px] font-medium text-primary hover:underline">
          Browse all skills →
        </a>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={tab}
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: EASE.reveal }}
          className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((s) => (
            <li key={s.file} className="bg-background/90">
              <motion.button
                type="button"
                layoutId={`hero-skill-${s.name}`}
                transition={{ duration: 0.55, ease: EASE.camera }}
                onClick={() => setOpen(s)}
                className={cn("group flex h-full w-full items-start gap-3 px-4 py-3.5 text-left transition-colors duration-200 hover:bg-primary/[0.04]", open?.file === s.file && "invisible")}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[14.5px] font-bold tracking-tight">{s.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{s.tagline}</span>
                </span>
                <span className="shrink-0 pt-0.5 text-right">
                  <span className="block font-mono text-[11px] tabular-nums text-muted-foreground">{s.lines.toLocaleString("en-US")}</span>
                  <span className="mt-1 block text-[11px] font-semibold text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">Quick look</span>
                </span>
              </motion.button>
            </li>
          ))}
          {/* Fill the last row so the grid lines stay even. */}
          {Array.from({ length: (3 - (list.length % 3)) % 3 }, (_, i) => (
            <li key={`pad-${i}`} aria-hidden className="hidden bg-background/90 lg:block" />
          ))}
        </motion.ul>
      </AnimatePresence>
      <AnimatePresence>{open && <QuickLook key={open.file} s={open} layoutId={`hero-skill-${open.name}`} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}
