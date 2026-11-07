"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import BlurFade from "@/components/effects/blur-fade";
import MaskReveal from "@/components/motion/mask-reveal";
import { MacWindow } from "@/components/mac/window";
import { useNotify } from "@/components/mac/notification";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { IconCopy, IconGitHub } from "@/site/icons";
import { REPO } from "@/site/chrome";
import { Compare, PREVIEWS } from "@/site/skill-previews";

export type SkillView = { file: string; name: string; title: string; tagline: string; description: string; when: string; lines: number; summary: string[]; outline: string[] };

/** "KEY   value" / "KEY → value" summary lines → [key, value]; continuation lines have no key. */
const split = (l: string): [string, string] => {
  const m = l.match(/^\s*([A-Z][A-Z0-9/&.+-]*(?: [A-Z0-9][A-Z0-9/&.+-]*)*)(?:\s*→\s*|\s{2,})(.*)$/);
  return m ? [m[1], m[2]] : ["", l.trim()];
};

/** Quick Look window for one skill. `layoutId` lets any card morph into it (grid card, hero catalog…).
 *  Rendered into <body> through a portal: an ancestor with backdrop-filter (frosted panels) would
 *  otherwise become the containing block of this fixed overlay and clip it. */
export function QuickLook({ s, onClose, layoutId = `skill-${s.name}` }: { s: SkillView; onClose: () => void; layoutId?: string }) {
  const notify = useNotify();
  const preview = PREVIEWS[s.file];
  // Condensed summary: only keyed rows (continuations dropped), first four (a 2×2 on desktop).
  const keyed = s.summary.map(split).filter(([k]) => k);
  const rows = keyed.slice(0, 4);
  const more = keyed.length - rows.length;
  const install = `mkdir -p .claude/skills/${s.name} && curl -fsSL https://raw.githubusercontent.com/Zazaaw/p441z-style-kit/main/Skill.md/${s.file} -o .claude/skills/${s.name}/SKILL.md`;
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return createPortal(
    <motion.div className="fixed inset-0 z-[75] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal aria-label={s.title}>
      <div className="absolute inset-0 bg-background/50 backdrop-blur-md" />
      <motion.div layoutId={layoutId} transition={{ duration: 0.55, ease: EASE.camera }} className="relative w-[min(1000px,96vw)]" onClick={(e) => e.stopPropagation()}>
        <MacWindow
          title={s.file}
          onClose={onClose}
          className="shadow-[0_60px_120px_-40px_rgba(0,0,0,0.6)]"
          toolbar={
            <a href={`${REPO}/blob/main/Skill.md/${s.file}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <span className="size-3.5 [&_svg]:size-3.5"><IconGitHub /></span> Open
            </a>
          }
          bodyClassName="max-h-[82vh] overflow-y-auto"
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.25 } }} className="grid gap-6 p-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:p-6">
            <div className="flex min-w-0 flex-col">
              <div className="font-display text-3xl font-extrabold tracking-tight">{s.title}</div>
              <div className="mt-1 text-[15px] font-semibold text-muted-foreground">{s.tagline}</div>
              <p className="mt-3 line-clamp-4 text-[14px] leading-relaxed text-muted-foreground">{s.description}</p>
              <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Open it when</div>
              <p className="mt-1 line-clamp-3 text-[14px]">{s.when}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
                <code className="rounded-full border border-border px-2.5 py-1">{s.name}</code>
                <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">{s.lines.toLocaleString("en-US")} lines</span>
              </div>
              <div className="mt-5 md:mt-auto md:pt-4">
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(install).then(() => notify({ title: "Install command copied", body: `Paste it in your project to add ${s.name} to Claude Code.`, icon: <IconCopy /> }))}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[14px] font-semibold text-primary-foreground shadow-[0_12px_28px_-12px_var(--color-primary)] transition-transform duration-200 active:scale-[0.98]"
                >
                  <span className="size-4 [&_svg]:size-4"><IconCopy /></span> Copy install for Claude Code
                </button>
              </div>
            </div>
            <div className="min-w-0">
              {preview ? (
                <>
                  <Compare before={preview.before} after={preview.after} />
                  <p className="mt-2 text-[12.5px] leading-snug text-muted-foreground">{preview.note}</p>
                </>
              ) : null}
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-3 md:col-span-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{rows.length ? "At a glance" : "What's inside"}</span>
                {more > 0 && (
                  <a href={`${REPO}/blob/main/Skill.md/${s.file}`} target="_blank" rel="noreferrer" className="text-[11.5px] font-medium text-primary hover:underline">
                    +{more} more in the skill
                  </a>
                )}
              </div>
              {rows.length ? (
                <div className="mt-2 grid gap-x-8 gap-y-1 font-mono text-[12px] leading-5 lg:grid-cols-2">
                  {rows.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
                      <span className="truncate font-semibold">{k}</span>
                      <span className="truncate text-muted-foreground" title={v}>{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-1.5 text-[12px] text-muted-foreground">
                  {s.outline.slice(0, 6).map((o) => (
                    <span key={o} className="rounded-full border border-border px-2 py-0.5">{o.charAt(0) + o.slice(1).toLowerCase()}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </MacWindow>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export default function Skills({ skills }: { skills: SkillView[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<SkillView | null>(null);
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? skills.filter((s) => `${s.title} ${s.tagline} ${s.description} ${s.name}`.toLowerCase().includes(t)) : skills;
  }, [q, skills]);
  const total = skills.reduce((a, s) => a + s.lines, 0);

  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Skill.md</div>
          <MaskReveal as="h2" text={`${skills.length} skills for your AI agent.`} className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
          <p className="mt-4 text-lg text-muted-foreground">
            {total.toLocaleString("en-US")} lines of rules, checklists, templates, and anti-patterns. Drop one into <code className="text-[0.9em]">.claude/skills/</code> and your agent works the way you do.
          </p>
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter skills…" aria-label="Filter skills" className="h-10 w-full rounded-lg border border-border bg-background px-3.5 text-[14px] outline-hidden transition-colors focus-visible:ring-1 focus-visible:ring-ring sm:w-64" />
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hits.map((s, i) => (
          <BlurFade key={s.file} inView delay={Math.min(i, 8) * 0.04} className="min-w-0">
            <motion.button
              type="button"
              layoutId={`skill-${s.name}`}
              transition={{ duration: 0.55, ease: EASE.camera }}
              onClick={() => setOpen(s)}
              className={cn("group flex h-full w-full flex-col rounded-2xl border border-border bg-background/80 p-5 text-left backdrop-blur transition-colors duration-200 hover:border-foreground/30", open?.file === s.file && "invisible")}
            >
              <div className="flex items-center justify-between font-mono text-[12px] text-muted-foreground">
                <span>{String(skills.indexOf(s) + 1).padStart(2, "0")}</span>
                <span>{s.lines.toLocaleString("en-US")} lines</span>
              </div>
              <div className="mt-3 font-display text-[22px] font-extrabold tracking-tight">{s.title}</div>
              <div className="mt-0.5 text-[14px] font-semibold text-muted-foreground">{s.tagline}</div>
              <p className="mt-3 line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">{s.description}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <code className="text-[12px]">{s.name}</code>
                <span className="text-[12px] font-medium text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5">Quick look →</span>
              </div>
            </motion.button>
          </BlurFade>
        ))}
        {hits.length === 0 && <div className="col-span-full py-16 text-center text-muted-foreground">No skill matches “{q}”.</div>}
      </div>

      <AnimatePresence>{open && <QuickLook key={open.file} s={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
