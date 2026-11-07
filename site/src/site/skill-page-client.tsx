"use client";

import { useEffect, useState } from "react";

import { useNotify } from "@/components/mac/notification";
import { cn } from "@/lib/utils";
import { AccentMenu } from "@/site/accent";
import { LangSwitch, homeFor, useLang, useT } from "@/site/i18n";
import { IconCheck, IconCopy } from "@/site/icons";
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
  const [done, setDone] = useState(false);
  const copy = () =>
    navigator.clipboard?.writeText(command).then(() => {
      setDone(true);
      notify({ title: t("Copied", "Tersalin"), body: label, icon: <IconCopy /> });
      window.setTimeout(() => setDone(false), 1600);
    });
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <button
        type="button"
        onClick={copy}
        aria-label={`${t("Copy", "Salin")}: ${label}`}
        className="group mt-1.5 flex w-full items-center gap-3 rounded-xl border border-border bg-background/70 py-2 pl-3.5 pr-2 text-left font-mono text-[12.5px] text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
      >
        <span className="text-primary">$</span>
        <span className="min-w-0 flex-1 truncate">{command}</span>
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-foreground [&_svg]:size-3.5">{done ? <IconCheck /> : <IconCopy />}</span>
      </button>
    </div>
  );
}

/** Sticky table of contents; the section being read lights up. */
export function DocToc({ items, title }: { items: { id: string; text: string }[]; title: string }) {
  const [active, setActive] = useState(items[0]?.id);
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
    <nav aria-label={title} className="sticky top-20 hidden max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2 lg:block">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</div>
      <ul className="mt-3 space-y-0.5 border-l border-border text-[13px]">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              className={cn("-ml-px block border-l py-1 pl-3 leading-snug transition-colors duration-200", active === i.id ? "border-primary font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
