"use client";

import { createContext, useContext, useEffect, useState } from "react";

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

/** Menu-bar switch between the English and Indonesian pages; keeps the section you're on.
 *  `paths` maps each language to the same page elsewhere (e.g. a skill page); default is home. */
export function LangSwitch({ paths }: { paths?: Partial<Record<Lang, string>> }) {
  const lang = useLang();
  const to = (l: Lang) => paths?.[l] ?? homeFor(l);
  // The white key is one element: on click it springs to the other language while the page loads.
  const [shown, setShown] = useState<Lang>(lang);
  return (
    <div role="group" aria-label={lang === "id" ? "Bahasa" : "Language"} className="relative grid grid-cols-2 items-center rounded-md bg-foreground/[0.06] p-0.5 text-[11px] font-semibold">
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-[5px] bg-background shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-spring motion-reduce:transition-none"
        style={{ transform: shown === "id" ? "translateX(100%)" : "none" }}
      />
      {(["en", "id"] as const).map((l) => (
        <a
          key={l}
          href={to(l)}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "page" : undefined}
          title={l === "en" ? "English" : "Bahasa Indonesia"}
          onClick={(e) => {
            e.preventDefault();
            if (l === lang) return;
            setShown(l);
            window.location.href = to(l) + window.location.hash;
          }}
          className={`relative grid min-h-6 min-w-7 place-items-center px-1.5 transition-[color,scale] duration-300 ease-spring active:scale-90 active:duration-100 ${l === shown ? "text-foreground" : "text-foreground/55 hover:text-foreground"}`}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
