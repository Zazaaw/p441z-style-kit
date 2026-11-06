"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * MenuBar — the slim frosted bar across the top of a desktop: a brand mark and menu items on the
 * left, status items and a live clock on the right. Works as a site header. On small screens the
 * menu items and the date fold away so the bar never overflows.
 *
 * USAGE
 *   <MenuBar brand="p441z" items={[{ label: "Kit", href: "#kit" }, { label: "Motion", href: "#motion" }]}
 *     right={<ThemeToggle />} className="fixed inset-x-0 top-0" />
 */

interface MenuBarProps {
  brand: React.ReactNode;
  items?: { label: string; href?: string; onClick?: () => void }[];
  right?: React.ReactNode;
  /** Show the clock (updates every 20 s; hidden until mounted to avoid hydration mismatch). */
  clock?: boolean;
  className?: string;
}

const TICK = 20_000;
const subscribe = (cb: () => void) => {
  const t = setInterval(cb, TICK);
  return () => clearInterval(t);
};
// Snapshot = the current 20-second slot, so it stays stable between renders.
const slot = () => Math.floor(Date.now() / TICK);

function Clock() {
  const s = React.useSyncExternalStore(subscribe, slot, () => null);
  if (s === null) return <span className="w-28" />;
  const now = new Date();
  const d = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const t = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return (
    <span className="whitespace-nowrap tabular-nums">
      <span className="hidden sm:inline">{d}&nbsp;&nbsp;</span>
      {t}
    </span>
  );
}

export default function MenuBar({ brand, items = [], right, clock = true, className }: MenuBarProps) {
  return (
    <header className={cn("z-50 flex h-8 items-center gap-1 border-b border-black/5 bg-background/60 px-3 text-[13px] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10", className)}>
      <span className="mr-2 font-bold">{brand}</span>
      <nav className="hidden items-center sm:flex" aria-label="Main">
        {items.map((it) =>
          it.href ? (
            <a key={it.label} href={it.href} className="rounded px-2 py-0.5 font-medium text-foreground/85 transition-colors duration-150 hover:bg-foreground/10">
              {it.label}
            </a>
          ) : (
            <button key={it.label} type="button" onClick={it.onClick} className="rounded px-2 py-0.5 font-medium text-foreground/85 transition-colors duration-150 hover:bg-foreground/10">
              {it.label}
            </button>
          ),
        )}
      </nav>
      <div className="ml-auto flex items-center gap-3 font-medium text-foreground/85">
        {right}
        {clock && <Clock />}
      </div>
    </header>
  );
}
