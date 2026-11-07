"use client";

import { createContext, useContext, useEffect } from "react";

// Two languages, two routes: "/" is English, "/id" is Indonesian. Every section reads the page
// language from this context and keeps its two strings side by side:
//   const t = useT();  …  t("Watch it move", "Lihat geraknya")
// Works for JSX too: t(<>Hello <b>world</b></>, <>Halo <b>dunia</b></>).
export type Lang = "en" | "id";

const LangContext = createContext<Lang>("en");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  // Client-side navigation between "/" and "/id" doesn't rerun the <head> boot script.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

export function useT() {
  const lang = useLang();
  return <T,>(en: T, id: T): T => (lang === "id" ? id : en);
}

/** Number formatting per language (24,195 vs 24.195). */
export function useNum() {
  const lang = useLang();
  return (n: number) => n.toLocaleString(lang === "id" ? "id-ID" : "en-US");
}

export const homeFor = (lang: Lang) => (lang === "id" ? "/id" : "/");

/** Inline <head> script: the root layout is shared, so set <html lang> from the path before paint. */
export const LANG_BOOT = `if(location.pathname==="/id"||location.pathname.indexOf("/id/")===0)document.documentElement.lang="id"`;

/** Menu-bar switch between the English and Indonesian pages; keeps the section you're on. */
export function LangSwitch() {
  const lang = useLang();
  return (
    <div role="group" aria-label={lang === "id" ? "Bahasa" : "Language"} className="flex items-center rounded-md bg-foreground/[0.06] p-0.5 text-[11px] font-semibold">
      {(["en", "id"] as const).map((l) => (
        <a
          key={l}
          href={homeFor(l)}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "page" : undefined}
          title={l === "en" ? "English" : "Bahasa Indonesia"}
          onClick={(e) => {
            if (l === lang) return e.preventDefault();
            e.preventDefault();
            window.location.href = homeFor(l) + window.location.hash;
          }}
          className={l === lang ? "rounded-[5px] bg-background px-1.5 py-px text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "px-1.5 py-px text-foreground/55 transition-colors hover:text-foreground"}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
