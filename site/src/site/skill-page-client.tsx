"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useNotify } from "@/components/mac/notification";
import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";
import { AccentMenu } from "@/site/accent";
import { LangSwitch, homeFor, useLang, useT } from "@/site/i18n";
import { IconCopy } from "@/site/icons";
import { CopyGlyph, PRESS, useCopy } from "@/components/ui/copy-button";
import { ThemeToggle } from "@/site/theme";

/** Slim top bar for skill and component pages: back home, then language, accent, theme. */
export function DocTopBar({ paths, crumb, root }: { paths: { en: string; id: string }; crumb: string; root?: { href: string; label: string } }) {
  const lang = useLang();
  const t = useT();
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background/70 backdrop-blur-xl dark:border-white/10">
      <div className="mx-auto flex h-12 max-w-6xl items-center gap-3 px-6 text-[13px]">
        <a href={homeFor(lang)} className="font-display font-extrabold tracking-tight transition-opacity hover:opacity-70">
          p441z
        </a>
        <span className="text-muted-foreground/60">/</span>
        <a href={root?.href ?? `${homeFor(lang)}#skills`} className="text-muted-foreground transition-colors hover:text-foreground">
          {root?.label ?? t("Skills", "Skill")}
        </a>
        <span className="text-muted-foreground/60">/</span>
        <span className="truncate font-medium">{crumb}</span>
        <div className="ml-auto flex items-center gap-2">
          <LangSwitch paths={paths} />
          <AccentMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/** A labelled command with a copy button (and a toast to confirm). */
export function CopyCommand({ label, command }: { label: string; command: string }) {
  const t = useT();
  const notify = useNotify();
  const { copied: done, copy } = useCopy(command, { onCopied: () => notify({ title: t("Copied", "Tersalin"), body: label, icon: <IconCopy /> }) });
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <button
        type="button"
        onClick={copy}
        className={cn("group mt-1.5 flex w-full items-center gap-3 rounded-xl border border-border bg-background/70 py-2 pl-3.5 pr-2 text-left font-mono text-[12.5px] text-muted-foreground backdrop-blur hover:text-foreground", PRESS)}
      >
        <span className="sr-only">{t("Copy:", "Salin:")} </span>
        <span className="text-primary">$</span>
        <span className="min-w-0 flex-1 truncate">{command}</span>
        <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg transition-[background-color,color,scale] duration-300 ease-spring", done ? "scale-110 bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
          <CopyGlyph copied={done} className="size-3.5" />
        </span>
      </button>
    </div>
  );
}

/** Sticky table of contents; the section being read lights up and the marker springs to it. */
export function DocToc({ items, title }: { items: { id: string; text: string }[]; title: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const reduce = useReducedMotion();
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (es) => {
        const hit = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-72px 0px -70% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <motion.nav layoutScroll aria-label={title} className="sticky top-20 hidden max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2 lg:block">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</div>
      <ul className="mt-3 space-y-0.5 border-l border-border text-[13px]">
        {items.map((i) => (
          <li key={i.id} className="relative">
            {active === i.id && <motion.span layoutId="toc-mark" aria-hidden className="absolute -left-px inset-y-0.5 w-[2px] rounded-full bg-primary" transition={reduce ? { duration: 0 } : SPRING.slide} />}
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              className={cn("block py-1 pl-3 leading-snug transition-[color,translate] duration-300 ease-spring", active === i.id ? "translate-x-0.5 font-medium text-foreground" : "text-muted-foreground hover:translate-x-0.5 hover:text-foreground")}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
