"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { REGISTRY } from "@/site/chrome";
import { IconCheck, IconCopy } from "@/site/icons";
import type { CatalogItem } from "@/site/catalog-data";

const GROUPS: { key: CatalogItem["group"]; label: string; demo: string }[] = [
  { key: "motion", label: "Motion", demo: "#motion" },
  { key: "desktop", label: "Desktop", demo: "#desk" },
  { key: "effects", label: "Effects", demo: "#kit" },
  { key: "ui", label: "UI", demo: "#kit" },
];

function Install({ name }: { name: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard
          ?.writeText(`npx shadcn@latest add ${REGISTRY}/${name}.json`)
          .then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          })
          .catch(() => undefined)
      }
      aria-label={`Copy install command for ${name}`}
      className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary [&_svg]:size-3.5"
    >
      {done ? <IconCheck /> : <IconCopy />}
    </button>
  );
}

/** The whole kit at a glance, right in the hero: grouped components, one line each, one-click install. */
export default function HeroCatalog({ items }: { items: CatalogItem[] }) {
  const [tab, setTab] = useState<CatalogItem["group"]>("motion");
  const group = GROUPS.find((g) => g.key === tab)!;
  const list = items.filter((i) => i.group === tab);
  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-background/70 text-left shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-3 py-2.5">
        <div role="tablist" aria-label="Component groups" className="-mx-1 flex max-w-full items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none]">
          {GROUPS.map((g) => {
            // Count components, not files: "LaptopFrame · PhoneFrame" is two.
            const n = items.filter((i) => i.group === g.key).reduce((a, i) => a + i.title.split(" · ").length, 0);
            const on = g.key === tab;
            return (
              <button key={g.key} role="tab" aria-selected={on} type="button" onClick={() => setTab(g.key)} className="relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold">
                {on && <motion.span layoutId="catalog-tab" className="absolute inset-0 rounded-full bg-primary" transition={{ duration: 0.4, ease: EASE.reveal }} />}
                <span className={cn("relative transition-colors duration-200", on ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {g.label} <span className={cn("ml-0.5 tabular-nums", on ? "opacity-80" : "opacity-60")}>{n}</span>
                </span>
              </button>
            );
          })}
        </div>
        <a href={group.demo} className="px-2 text-[13px] font-medium text-primary hover:underline">
          See them move →
        </a>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={tab}
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: EASE.reveal }}
          className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((c) => (
            <li key={c.name} className="flex items-start gap-3 bg-background/90 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="font-display text-[14.5px] font-bold tracking-tight">{c.title}</div>
                <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{c.description}</div>
              </div>
              <Install name={c.name} />
            </li>
          ))}
          {/* Fill the last row so the grid lines stay even. */}
          {Array.from({ length: (3 - (list.length % 3)) % 3 }, (_, i) => (
            <li key={`pad-${i}`} aria-hidden className="hidden bg-background/90 lg:block" />
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
