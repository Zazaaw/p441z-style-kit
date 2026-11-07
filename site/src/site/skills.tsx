"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";

import MaskReveal from "@/components/motion/mask-reveal";
import { MacWindow } from "@/components/mac/window";
import { useNotify } from "@/components/mac/notification";
import { EASE } from "@/lib/motion";
import { useNum, useT } from "@/site/i18n";
import { IconCopy, IconGitHub } from "@/site/icons";
import { REPO } from "@/site/chrome";
import { Compare, PREVIEWS } from "@/site/skill-previews";
import { ACCENTS, useAccent } from "@/site/accent";
import GlassFolder, { type ArtRecipe } from "@/site/glass-folder";

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
  const t = useT();
  const num = useNum();
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
              <span className="size-3.5 [&_svg]:size-3.5"><IconGitHub /></span> {t("Open", "Buka")}
            </a>
          }
          bodyClassName="max-h-[82vh] overflow-y-auto"
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.25 } }} className="grid gap-6 p-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:p-6">
            <div className="flex min-w-0 flex-col">
              <div className="font-display text-3xl font-extrabold tracking-tight">{s.title}</div>
              <div className="mt-1 text-[15px] font-semibold text-muted-foreground">{s.tagline}</div>
              <p className="mt-3 line-clamp-4 text-[14px] leading-relaxed text-muted-foreground">{s.description}</p>
              <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Open it when", "Pakai saat")}</div>
              <p className="mt-1 line-clamp-3 text-[14px]">{s.when}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
                <code className="rounded-full border border-border px-2.5 py-1">{s.name}</code>
                <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">{num(s.lines)} {t("lines", "baris")}</span>
              </div>
              <div className="mt-5 md:mt-auto md:pt-4">
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(install).then(() => notify({ title: t("Install command copied", "Perintah install tersalin"), body: t(`Paste it in your project to add ${s.name} to Claude Code.`, `Tempel di terminal project-mu untuk memasang ${s.name} di Claude Code.`), icon: <IconCopy /> }))}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[14px] font-semibold text-primary-foreground shadow-[0_12px_28px_-12px_var(--color-primary)] transition-transform duration-200 active:scale-[0.98]"
                >
                  <span className="size-4 [&_svg]:size-4"><IconCopy /></span> {t("Copy install for Claude Code", "Salin install untuk Claude Code")}
                </button>
              </div>
            </div>
            <div className="min-w-0">
              {preview ? (
                <>
                  <Compare before={preview.before} after={preview.after} />
                  <p className="mt-2 text-[12.5px] leading-snug text-muted-foreground">{t(preview.note, preview.noteId)}</p>
                </>
              ) : null}
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-3 md:col-span-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{rows.length ? t("At a glance", "Intinya") : t("What's inside", "Isinya")}</span>
                {more > 0 && (
                  <a href={`${REPO}/blob/main/Skill.md/${s.file}`} target="_blank" rel="noreferrer" className="text-[11.5px] font-medium text-primary hover:underline">
                    {t(`+${more} more in the skill`, `+${more} lainnya di skill`)}
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

// Skill groups: what kind of work each skill is for (hero catalog tabs, Skills section folders).
export const GROUPS = [
  { key: "all", label: "All", labelId: "Semua", files: null },
  { key: "eng", label: "Engineering", labelId: "Engineering", files: ["backend.api", "database", "security", "performance", "testing", "debugging"] },
  { key: "design", label: "Design", labelId: "Desain", files: ["ui.ux", "landing.page", "typography", "dashboard", "export.report", "motion.video"] },
  { key: "flow", label: "Workflow", labelId: "Alur kerja", files: ["analysis", "git.workflow", "documentation"] },
] as const;
export const inGroup = (g: (typeof GROUPS)[number], s: SkillView) => !g.files || (g.files as readonly string[]).includes(s.file.replace(/^skill-|\.md$/g, ""));

/** HSL triplet ("211 100% 50%") → #rrggbb, with lightness nudged by `dl` points. */
function hslHex(triplet: string, dl = 0): string {
  const [h, s, l] = triplet.split(/\s+/).map((x) => parseFloat(x));
  const L = Math.min(100, Math.max(0, l + dl)) / 100;
  const a = (s / 100) * Math.min(L, 1 - L);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (L - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Folder art painted from the visitor's accent, so the folders follow the accent picker. */
function accentArt(hsl: string, kind: "streak" | "marble"): ArtRecipe {
  return kind === "streak"
    ? { style: "streak", colors: ["#f5f6f8", hslHex(hsl, 32), hslHex(hsl, 0), "#15171c", "#3b4250", hslHex(hsl, 22), "#eef1f5"], scale: 0.7, warp: 1.4, angle: -0.62, gloss: 0.2, veins: 0 }
    : { style: "marble", colors: ["#07090c", "#1a1e26", hslHex(hsl, -22), hslHex(hsl, 0), hslHex(hsl, 18), "#f6f3ee"], scale: 0.66, warp: 3.2, angle: -0.5, gloss: 0.5, veins: 0.5 };
}

const wideQuery = "(min-width: 400px)";
const subscribeWide = (cb: () => void) => {
  const m = window.matchMedia(wideQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** The skills as three glass folders — Engineering, Design, Workflow. Open one, pick a file, Quick Look. */
export default function Skills({ skills }: { skills: SkillView[] }) {
  const tr = useT();
  const num = useNum();
  const notify = useNotify();
  const accentKey = useAccent();
  const accent = ACCENTS.find((a) => a.key === accentKey)!;
  const { resolvedTheme } = useTheme();
  const tone = resolvedTheme === "dark" ? "dark" : "light";
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(wideQuery).matches, () => true);
  const [open, setOpen] = useState<SkillView | null>(null);
  // Build the folders only as the section approaches: their artwork is painted on the main thread.
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, { once: true, margin: "800px 0px" });
  const total = skills.reduce((a, s) => a + s.lines, 0);

  const folders = GROUPS.filter((g) => g.files).map((g, i) => {
    const list = skills.filter((s) => inGroup(g, s));
    const lines = list.reduce((a, s) => a + s.lines, 0);
    return {
      g,
      list,
      meta: `${tr(`${list.length} skills`, `${list.length} skill`)} · ${num(lines)} ${tr("lines", "baris")}`,
      art: (i === 0 ? accentArt(accent.hsl, "streak") : i === 1 ? accentArt(accent.hsl, "marble") : "none") as ArtRecipe | "none",
    };
  });
  const installAll = (list: SkillView[]) =>
    list.map((s) => `mkdir -p .claude/skills/${s.name} && curl -fsSL https://raw.githubusercontent.com/Zazaaw/p441z-style-kit/main/Skill.md/${s.file} -o .claude/skills/${s.name}/SKILL.md`).join(" && ");

  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-28">
      <div className="max-w-2xl">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Skill.md</div>
        <MaskReveal as="h2" text={tr(`${skills.length} skills for your AI agent.`, `${skills.length} skill untuk agen AI-mu.`)} className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
        <p className="mt-4 text-lg text-muted-foreground">
          {tr(
            <>{num(total)} lines of rules, checklists, templates, and anti-patterns. Drop one into <code className="text-[0.9em]">.claude/skills/</code> and your agent works the way you do.</>,
            <>{num(total)} baris aturan, checklist, template, dan contoh yang harus dihindari. Simpan satu di <code className="text-[0.9em]">.claude/skills/</code>, dan agenmu langsung bekerja dengan caramu.</>,
          )}
        </p>
      </div>

      <div ref={box} className="mt-20 grid min-h-[340px] grid-cols-1 items-end justify-items-center gap-x-14 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
        {near &&
          folders.map((f, i) => (
            <GlassFolder
              // Remount when the accent or theme changes so the art repaints in the new colour.
              key={`${f.g.key}-${accent.key}-${tone}`}
              label={tr(f.g.label, f.g.labelId)}
              meta={f.meta}
              tone={tone}
              art={f.art}
              seed={[3, 11, 7][i]}
              width={wide ? 340 : 300}
              maxVisible={6}
              files={f.list.map((s) => ({ name: s.title, meta: `${num(s.lines)} ${tr("lines", "baris")}` }))}
              action="more"
              menu={[
                {
                  label: tr("Copy install for these skills", "Salin install skill di folder ini"),
                  onSelect: () =>
                    navigator.clipboard?.writeText(installAll(f.list)).then(() =>
                      notify({ title: tr("Install command copied", "Perintah install tersalin"), body: tr(`${f.list.length} skills, one command.`, `${f.list.length} skill, satu perintah.`), icon: <IconCopy /> }),
                    ),
                },
                { label: tr("Open on GitHub", "Buka di GitHub"), onSelect: () => window.open(`${REPO}/tree/main/Skill.md`, "_blank", "noopener") },
              ]}
              className="gf-many"
              appearDelay={i * 140}
              onFileSelect={(_, k) => setOpen(f.list[k])}
              labels={tr(
                {},
                { open: "Buka", close: "Tutup", openFolder: "Buka folder", closeFolder: "Tutup folder", items: (n: number) => `${n} item`, contents: "isi", options: "opsi", addTo: "Tambah file ke", moreFor: "Opsi lain untuk" },
              )}
            />
          ))}
      </div>
      <p className="mt-14 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {tr("Hover to peek · Click to open · Pick a file for Quick Look", "Arahkan untuk mengintip · Klik untuk membuka · Pilih file untuk Quick Look")}
      </p>

      <AnimatePresence>{open && <QuickLook key={open.file} s={open} layoutId={`folder-${open.name}`} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
