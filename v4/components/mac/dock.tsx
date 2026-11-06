"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Dock — a desktop dock: icons grow as the pointer passes over them (magnification), the label
 * floats above the hovered icon, and a small dot marks the active item.
 *
 * Works as real navigation: give items `href` (rendered as links) or `onClick`. Keyboard focus
 * shows the label too. On touch screens there is no hover, so icons simply stay at base size.
 *
 * USAGE
 *   <Dock className="fixed bottom-4 left-1/2 -translate-x-1/2" items={[
 *     { label: "Home", icon: <HomeIcon />, href: "#top", active: true },
 *     { label: "Motion", icon: <SparkIcon />, href: "#motion" },
 *     { label: "GitHub", icon: <GitHubIcon />, href: "https://github.com/…" },
 *   ]} />
 */

export type DockItem = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  /** Draw a thin divider before this item. */
  divider?: boolean;
};

interface DockProps {
  items: DockItem[];
  className?: string;
  /** Base icon size (px). */
  size?: number;
  /** Size under the pointer (px). */
  magnified?: number;
  /** Pointer distance (px) over which magnification fades out. */
  reach?: number;
}

function Icon({ item, mouseX, size, magnified, reach }: { item: DockItem; mouseX: MotionValue<number>; size: number; magnified: number; reach: number }) {
  const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [hover, setHover] = React.useState(false);
  const dist = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const target = useTransform(dist, [-reach, 0, reach], [size, magnified, size]);
  const w = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });

  const inner = (
    <>
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-background/90 px-2 py-0.5 text-[12px] font-medium shadow-sm backdrop-blur"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span style={{ width: w, height: w }} className="grid place-items-center rounded-[22%] border border-border/70 bg-background shadow-[0_6px_14px_-6px_rgba(0,0,0,0.35)] [&_svg]:size-[46%]">
        {item.icon}
      </motion.span>
      {item.active && <span className="absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-foreground/70" aria-hidden />}
    </>
  );
  const common = {
    ref,
    "aria-label": item.label,
    "aria-current": item.active ? ("page" as const) : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
    className: "relative flex flex-col items-center outline-hidden focus-visible:[&>span:last-of-type]:ring-1 focus-visible:[&>span:last-of-type]:ring-ring",
  };
  return item.href ? (
    <a href={item.href} {...common} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={item.onClick} {...common}>
      {inner}
    </button>
  );
}

export default function Dock({ items, className, size = 44, magnified = 68, reach = 140 }: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const reduce = useReducedMotion();
  return (
    <nav aria-label="Dock" className={cn("z-50", className)}>
      <motion.div
        onMouseMove={(e) => !reduce && mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-2.5 rounded-2xl border border-white/40 bg-background/55 px-2.5 pb-2 pt-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10"
        style={{ height: size + 18 }}
      >
        {items.map((it) => (
          <React.Fragment key={it.label}>
            {it.divider && <span className="mx-0.5 h-[60%] w-px self-center bg-border" aria-hidden />}
            <Icon item={it} mouseX={mouseX} size={size} magnified={reduce ? size : magnified} reach={reach} />
          </React.Fragment>
        ))}
      </motion.div>
    </nav>
  );
}
