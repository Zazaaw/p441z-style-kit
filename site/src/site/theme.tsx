"use client";

import { useCallback, useEffect } from "react";
import { flushSync } from "react-dom";
import { ThemeProvider as Provider, useTheme } from "next-themes";
import { useHydrated } from "@/lib/use-hydrated";
import Swap from "@/components/motion/swap";

// Theme switching follows skill-darkmode §5/§7: next-themes owns storage and the pre-paint script
// (no flash); switching crossfades with the View Transitions API, falls back to a colour-only CSS
// transition, and is instant under reduced motion. The status-bar colour follows the theme.

const THEME_COLOR = { light: "#ffffff", dark: "#0a0a0a" }; // --background in each theme

function setMeta(dark: boolean) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? THEME_COLOR.dark : THEME_COLOR.light);
}

/** Keeps <meta name="theme-color"> in step with the resolved theme (first load, system changes). */
function ThemeColorSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (resolvedTheme) setMeta(resolvedTheme === "dark");
  }, [resolvedTheme]);
  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <ThemeColorSync />
      {children}
    </Provider>
  );
}

/** The one way to switch themes on this site (menu bar, bento tile, ⌘K). */
export function useThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const ready = useHydrated();
  const dark = ready && resolvedTheme === "dark";

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    // Paint the new theme on <html> ourselves, synchronously, so the transition's "after" frame is
    // already the new theme; next-themes then persists the choice (and re-applies the same class).
    const commit = () => {
      root.classList.toggle("dark", next);
      root.classList.toggle("light", !next);
      root.style.colorScheme = next ? "dark" : "light";
      setMeta(next);
      flushSync(() => setTheme(next ? "dark" : "light"));
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return commit();
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (typeof doc.startViewTransition === "function") {
      root.classList.add("vt-theme");
      doc.startViewTransition(commit).finished.finally(() => root.classList.remove("vt-theme"));
      return;
    }
    root.classList.add("theme-transition");
    commit();
    window.setTimeout(() => root.classList.remove("theme-transition"), 450);
  }, [setTheme]);

  return { dark, ready, toggle };
}

/** Sun/moon switch for the menu bar. Renders a fixed-size placeholder until mounted (no hydration flash). */
export function ThemeToggle() {
  const { dark, ready, toggle } = useThemeSwitch();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid size-6 place-items-center rounded transition-[background-color,scale] duration-300 ease-spring hover:bg-foreground/10 active:scale-[.85] active:duration-100"
    >
      {/* The sun turns away and the moon turns in (and back) — on the kit's spring. */}
      {ready && (
        <Swap id={dark ? "moon" : "sun"} mode="turn" className="size-[15px]">
          <svg viewBox="0 0 24 24" className="size-[15px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {dark ? <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /> : (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>)}
          </svg>
        </Swap>
      )}
    </button>
  );
}
