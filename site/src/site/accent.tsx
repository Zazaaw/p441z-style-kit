"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Desktop accent colors (the System Settings row). The kit rebrands through --primary/--ring only, so
// switching an accent is two CSS variables on <html> — every component, glow, and video frame follows.
export const ACCENTS = [
  { key: "blue", label: "Blue", hsl: "211 100% 50%", fg: "0 0% 100%" },
  { key: "purple", label: "Purple", hsl: "280 64% 58%", fg: "0 0% 100%" },
  { key: "pink", label: "Pink", hsl: "331 92% 61%", fg: "0 0% 100%" },
  { key: "red", label: "Red", hsl: "3 100% 59%", fg: "0 0% 100%" },
  { key: "orange", label: "Orange", hsl: "35 100% 50%", fg: "0 0% 100%" },
  { key: "yellow", label: "Yellow", hsl: "48 100% 50%", fg: "0 0% 9%" },
  { key: "green", label: "Green", hsl: "135 59% 49%", fg: "0 0% 100%" },
  { key: "graphite", label: "Graphite", hsl: "240 2% 57%", fg: "0 0% 100%" },
] as const;
export type AccentKey = (typeof ACCENTS)[number]["key"];
const STORE = "p441z:accent";

/** Inline script for <head>: applies the saved accent before first paint (no flash of blue). */
export const ACCENT_BOOT = `try{var a=${JSON.stringify(Object.fromEntries(ACCENTS.map((x) => [x.key, [x.hsl, x.fg]])))}[localStorage.getItem("${STORE}")];if(a){var s=document.documentElement.style;s.setProperty("--primary",a[0]);s.setProperty("--ring",a[0]);s.setProperty("--primary-foreground",a[1]);document.documentElement.dataset.accent=localStorage.getItem("${STORE}")}}catch(e){}`;

const listeners = new Set<() => void>();
const read = (): AccentKey => {
  try {
    const k = localStorage.getItem(STORE) as AccentKey | null;
    return ACCENTS.some((a) => a.key === k) ? (k as AccentKey) : "blue";
  } catch {
    return "blue";
  }
};
export function setAccent(key: AccentKey) {
  const a = ACCENTS.find((x) => x.key === key)!;
  const s = document.documentElement.style;
  if (key === "blue") {
    // Blue is the stylesheet default (with its own dark-mode tint) — clear the overrides.
    ["--primary", "--ring", "--primary-foreground"].forEach((v) => s.removeProperty(v));
  } else {
    s.setProperty("--primary", a.hsl);
    s.setProperty("--ring", a.hsl);
    s.setProperty("--primary-foreground", a.fg);
  }
  document.documentElement.dataset.accent = key;
  try {
    localStorage.setItem(STORE, key);
  } catch {
    /* private mode — the choice just won't persist */
  }
  listeners.forEach((l) => l());
}
export function useAccent(): AccentKey {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "blue",
  );
}

/** A row of accent dots, like the desktop's appearance settings. */
export function AccentDots({ size = 18, className }: { size?: number; className?: string }) {
  const current = useAccent();
  return (
    <div role="radiogroup" aria-label="Accent color" className={cn("flex items-center gap-2", className)}>
      {ACCENTS.map((a) => {
        const on = a.key === current;
        return (
          <button
            key={a.key}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={a.label}
            title={a.label}
            onClick={() => setAccent(a.key)}
            className="relative grid place-items-center rounded-full outline-hidden transition-transform duration-150 hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring"
            style={{ width: size, height: size, background: `hsl(${a.hsl})`, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }}
          >
            {on && <motion.span layoutId={`accent-ring-${size}`} className="absolute -inset-[3px] rounded-full border-2" style={{ borderColor: `hsl(${a.hsl})` }} transition={{ duration: 0.3, ease: EASE.reveal }} />}
            {on && <span className="size-[35%] rounded-full" style={{ background: `hsl(${a.fg})` }} />}
          </button>
        );
      })}
    </div>
  );
}

/** Menu-bar button: current accent dot that opens the picker. */
export function AccentMenu() {
  const current = useAccent();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);
  const a = ACCENTS.find((x) => x.key === current)!;
  return (
    <div ref={box} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label={`Accent color: ${a.label}`} aria-expanded={open} className="grid size-6 place-items-center rounded transition-colors duration-150 hover:bg-foreground/10">
        <span className="size-3 rounded-full ring-1 ring-black/15" style={{ background: `hsl(${a.hsl})` }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE.reveal }}
            className="absolute right-0 top-8 z-[60] w-max rounded-xl border border-black/10 bg-background/80 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10"
          >
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Accent color</div>
            <AccentDots />
            <div className="mt-2.5 text-[12px] text-muted-foreground">
              {a.label} · <code className="text-[11px]">--primary: {a.hsl}</code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
