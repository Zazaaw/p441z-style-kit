"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * MacWindow & TrafficLights — a desktop-style window: title centered in a slim bar, the three
 * traffic-light buttons on the left that reveal their × – + glyphs on hover.
 *
 * Use it for anything that should feel like an app on the desk: code samples, previews, modals,
 * settings panels. `glass` turns the surface into frosted vibrancy (backdrop blur + saturation)
 * for windows floating over content. Colors stay greyscale except the lights — they carry meaning
 * (close / minimize / zoom), which is the kit's one rule for color.
 *
 * Generic on purpose: no system logos, no system fonts bundled (uses the platform stack).
 *
 * USAGE
 *   <MacWindow title="globals.css" toolbar={<CopyButton />}><pre>…</pre></MacWindow>
 *   <MacWindow title="Preview" glass onClose={() => setOpen(false)}>…</MacWindow>
 */

interface TrafficLightsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onZoom?: () => void;
  className?: string;
}

const LIGHTS = [
  { key: "close", color: "#ff5f57", ring: "#e0443e", glyph: "M3 3l4 4M7 3l-4 4", label: "Close" },
  { key: "minimize", color: "#febc2e", ring: "#dea123", glyph: "M2.5 5h5", label: "Minimize" },
  { key: "zoom", color: "#28c840", ring: "#1aab29", glyph: "M3 6.5V3h3.5M7 3.5V7H3.5", label: "Zoom" },
] as const;

export function TrafficLights({ onClose, onMinimize, onZoom, className }: TrafficLightsProps) {
  const act = { close: onClose, minimize: onMinimize, zoom: onZoom };
  return (
    <div className={cn("group/lights flex items-center gap-2", className)}>
      {LIGHTS.map((l) => (
        <button
          key={l.key}
          type="button"
          aria-label={l.label}
          onClick={act[l.key]}
          tabIndex={act[l.key] ? 0 : -1}
          className="grid size-3 place-items-center rounded-full outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          style={{ background: l.color, boxShadow: `inset 0 0 0 0.5px ${l.ring}` }}
        >
          <svg viewBox="0 0 10 10" className="size-2 opacity-0 transition-opacity duration-150 group-hover/lights:opacity-100" aria-hidden>
            <path d={l.glyph} stroke="rgba(0,0,0,0.55)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      ))}
    </div>
  );
}

interface MacWindowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  /** Right side of the title bar (buttons, segmented control). */
  toolbar?: React.ReactNode;
  /** Frosted vibrancy surface. */
  glass?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onZoom?: () => void;
  /** Classes for the content area under the title bar. */
  bodyClassName?: string;
}

export const MacWindow = React.forwardRef<HTMLDivElement, MacWindowProps>(
  ({ title, toolbar, glass = false, onClose, onMinimize, onZoom, className, bodyClassName, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-xl border border-black/10 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45),0_0_0_0.5px_rgba(0,0,0,0.06)] dark:border-white/10",
        glass ? "bg-background/65 backdrop-blur-2xl backdrop-saturate-150" : "bg-background",
        className,
      )}
      {...rest}
    >
      <div className={cn("relative flex h-10 items-center gap-3 border-b border-border/70 px-3.5", glass ? "bg-transparent" : "bg-muted/50")}>
        <TrafficLights onClose={onClose} onMinimize={onMinimize} onZoom={onZoom} />
        {title && <div className="pointer-events-none absolute inset-x-24 truncate text-center text-[13px] font-semibold text-foreground/80">{title}</div>}
        <div className="ml-auto flex items-center gap-2">{toolbar}</div>
      </div>
      <div className={cn("relative", bodyClassName)}>{children}</div>
    </div>
  ),
);
MacWindow.displayName = "MacWindow";
