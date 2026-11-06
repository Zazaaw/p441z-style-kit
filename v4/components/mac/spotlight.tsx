"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * Spotlight — a desktop-search command palette: a frosted bar floating in the upper third of the
 * screen, results grouped under it, fully keyboard driven (↑ ↓ Enter, Esc to close).
 *
 * Open it with ⌘K / Ctrl+K via `useSpotlightHotkey`, or any button. Filtering matches the label
 * and optional keywords, case-insensitive. Selecting an item runs `onSelect` and closes.
 * The panel mounts fresh on every open, so the query and selection always start empty.
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
      initial={{ scale: 0.96, y: -8, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.97, y: -6, opacity: 0 }}
      transition={{ duration: 0.22, ease: EASE.reveal }}
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
        <div ref={list} className="max-h-[50vh] overflow-y-auto border-t border-border/60 p-2" role="listbox">
          {hits.map((it, i) => {
            const head = it.group && (i === 0 || hits[i - 1].group !== it.group) ? it.group : null;
            return (
              <React.Fragment key={`${it.group}-${it.label}`}>
                {head && <div className="px-2.5 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{head}</div>}
                <button
                  type="button"
                  data-i={i}
                  role="option"
                  aria-selected={i === sel}
                  onMouseMove={() => setSel(i)}
                  onClick={() => choose(it)}
                  className={cn("flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[14px] transition-colors duration-100", i === sel ? "bg-foreground text-background" : "hover:bg-muted")}
                >
                  {it.icon && <span className="grid size-6 place-items-center [&_svg]:size-4">{it.icon}</span>}
                  <span className="flex-1 truncate">{it.label}</span>
                  {it.hint && <span className={cn("text-[12px]", i === sel ? "text-background/70" : "text-muted-foreground")}>{it.hint}</span>}
                </button>
              </React.Fragment>
            );
          })}
        </div>
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
