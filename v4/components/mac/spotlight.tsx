"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE, SPRING, layerDelay } from "@/lib/motion";

/**
 * Spotlight — a desktop-search command palette: a frosted bar floating in the upper third of the
 * screen, results grouped under it, fully keyboard driven (↑ ↓ Enter, Esc to close).
 *
 * Open it with ⌘K / Ctrl+K via `useSpotlightHotkey`, or any button. Filtering matches the label
 * and optional keywords, case-insensitive. Selecting an item runs `onSelect` and closes.
 * The panel mounts fresh on every open, so the query and selection always start empty.
 *
 * Motion: the bar drops in on a spring, the results arrive one row after another (25 ms apart), and
 * the highlight is a single pill that springs to the row under the pointer or the arrow keys — it
 * travels instead of blinking. Reduced motion: no travel, no stagger.
 *
 * USAGE
 *   const [open, setOpen] = useState(false);
 *   useSpotlightHotkey(() => setOpen((o) => !o));
 *   <Spotlight open={open} onOpenChange={setOpen} items={[
 *     { group: "Sections", label: "Motion components", hint: "#motion", onSelect: () => go("#motion") },
 *     { group: "Skills", label: "skill-motion-video", keywords: "video tutorial", onSelect: … },
 *   ]} />
 */

export type SpotlightItem = {
  label: string;
  group?: string;
  hint?: string;
  icon?: React.ReactNode;
  keywords?: string;
  onSelect: () => void;
};

interface SpotlightProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SpotlightItem[];
  placeholder?: string;
}

/** ⌘K on macOS, Ctrl+K elsewhere. */
export function useSpotlightHotkey(toggle: () => void) {
  const ref = React.useRef(toggle);
  React.useEffect(() => {
    ref.current = toggle;
  }, [toggle]);
  React.useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current();
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
}

function Panel({ items, placeholder, close }: { items: SpotlightItem[]; placeholder: string; close: () => void }) {
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const list = React.useRef<HTMLDivElement>(null);
  const uid = React.useId();
  const reduce = useReducedMotion();

  const hits = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter((it) => `${it.label} ${it.keywords ?? ""} ${it.group ?? ""}`.toLowerCase().includes(t)) : items;
  }, [q, items]);

  React.useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const choose = (it?: SpotlightItem) => {
    if (!it) return;
    close();
    it.onSelect();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(hits.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(hits[sel]);
    } else if (e.key === "Escape") close();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal
      aria-label="Search"
      className="relative mx-auto mt-[18vh] w-[min(640px,92vw)] overflow-hidden rounded-2xl border border-black/10 bg-background/70 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.5)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10"
      initial={reduce ? { opacity: 0 } : { scale: 0.92, y: -18, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { scale: 0.97, y: -6, opacity: 0, transition: { duration: 0.16, ease: EASE.toggle } }}
      transition={reduce ? { duration: 0.15 } : { ...SPRING.drop, opacity: { duration: 0.18 } }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 px-4">
        <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={onKey}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-14 w-full bg-transparent text-[19px] outline-hidden placeholder:text-muted-foreground/70"
        />
        <kbd className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">esc</kbd>
      </div>
      {hits.length > 0 ? (
        // layoutScroll: the highlight measures itself inside this scroller, so it stays put while scrolling.
        <motion.div layoutScroll ref={list} className="max-h-[50vh] overflow-y-auto border-t border-border/60 p-2" role="listbox">
          {hits.map((it, i) => {
            const head = it.group && (i === 0 || hits[i - 1].group !== it.group) ? it.group : null;
            return (
              <React.Fragment key={`${it.group}-${it.label}`}>
                {head && <div className="px-2.5 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{head}</div>}
                <motion.button
                  type="button"
                  data-i={i}
                  role="option"
                  aria-selected={i === sel}
                  onMouseMove={() => setSel(i)}
                  onClick={() => choose(it)}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING.slide, delay: layerDelay(Math.min(i, 10), 0.025), opacity: { duration: 0.2, delay: layerDelay(Math.min(i, 10), 0.025) } }}
                  className={cn("relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[14px] transition-colors duration-150", i === sel ? "text-primary-foreground" : "")}
                >
                  {i === sel && <motion.span layoutId={`${uid}-hl`} className="absolute inset-0 rounded-lg bg-primary" transition={reduce ? { duration: 0 } : SPRING.slide} />}
                  {it.icon && <span className="relative grid size-6 place-items-center [&_svg]:size-4">{it.icon}</span>}
                  <span className="relative flex-1 truncate">{it.label}</span>
                  {it.hint && <span className={cn("relative text-[12px]", i === sel ? "text-primary-foreground/75" : "text-muted-foreground")}>{it.hint}</span>}
                </motion.button>
              </React.Fragment>
            );
          })}
        </motion.div>
      ) : (
        <div className="border-t border-border/60 px-4 py-6 text-center text-[14px] text-muted-foreground">No results for “{q}”</div>
      )}
    </motion.div>
  );
}

export default function Spotlight({ open, onOpenChange, items, placeholder = "Search…" }: SpotlightProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onMouseDown={() => onOpenChange(false)}>
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
          <Panel items={items} placeholder={placeholder} close={() => onOpenChange(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
