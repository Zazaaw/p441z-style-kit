import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * LaptopFrame & PhoneFrame — brandless CSS device mockups for showing a UI inside a "real" device.
 *
 * Pure CSS (no images), so they stay crisp at any size and re-theme with the kit. Both size to
 * their container's width and keep the device's aspect ratio; children fill the screen.
 * No manufacturer logos or names — keeps every page free of trademark questions.
 *
 * USAGE
 *   <LaptopFrame url="app.example.com"><Dashboard /></LaptopFrame>
 *   <PhoneFrame className="w-[300px]"><MobileScreen /></PhoneFrame>
 *
 * Inside a VirtualCamera, put the camera INSIDE the frame (around the screen content) so the
 * device stays still while the camera moves across the UI.
 */

const TrafficDots = () => (
  <div className="flex gap-1.5" aria-hidden>
    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
      <span key={c} className="size-[9px] rounded-full" style={{ background: c }} />
    ))}
  </div>
);

interface LaptopFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Show a browser bar with this URL. Omit for a bare screen. */
  url?: string;
  /** Screen aspect ratio. 16/10 matches most laptops. */
  ratio?: number;
}

export function LaptopFrame({ children, className, url, ratio = 16 / 10 }: LaptopFrameProps) {
  return (
    <div className={cn("relative w-full select-none", className)}>
      {/* Lid: dark bezel, soft radius, tiny camera notch. */}
      <div className="relative rounded-[1.4rem] bg-linear-to-b from-neutral-800 to-neutral-950 p-[1.6%] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)] ring-1 ring-black/40 dark:ring-white/10">
        <div aria-hidden className="absolute left-1/2 top-[0.55%] h-[1.1%] w-[12%] -translate-x-1/2 rounded-b-md bg-black" />
        <div className="relative overflow-hidden rounded-[0.8rem] bg-background" style={{ aspectRatio: ratio }}>
          {url !== undefined && (
            <div className="flex h-8 items-center gap-3 border-b border-border bg-muted/70 px-3 backdrop-blur">
              <TrafficDots />
              <div className="mx-auto max-w-[60%] truncate rounded-md bg-background/80 px-3 py-0.5 text-[11px] text-muted-foreground">{url}</div>
              <div className="w-[42px]" />
            </div>
          )}
          <div className={cn("relative", url !== undefined ? "h-[calc(100%-2rem)]" : "h-full")}>{children}</div>
        </div>
      </div>
      {/* Base: brushed-metal wedge, wider than the lid. */}
      <div aria-hidden className="relative -mx-[6%] h-3 rounded-b-[1.2rem] bg-linear-to-b from-neutral-300 to-neutral-400 shadow-[0_18px_30px_-18px_rgba(0,0,0,0.6)] dark:from-neutral-500 dark:to-neutral-700">
        <div className="absolute left-1/2 top-0 h-1.5 w-[16%] -translate-x-1/2 rounded-b-lg bg-neutral-400/80 dark:bg-neutral-800/80" />
      </div>
    </div>
  );
}

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Status-bar clock text. */
  time?: string;
}

export function PhoneFrame({ children, className, time = "9:41" }: PhoneFrameProps) {
  return (
    <div className={cn("relative w-[280px] select-none", className)}>
      <div className="relative rounded-[3rem] bg-neutral-900 p-[3.2%] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] ring-1 ring-black/50 dark:ring-white/10">
        <div className="relative overflow-hidden rounded-[2.6rem] bg-background" style={{ aspectRatio: 9 / 19.5 }}>
          {/* Status bar is taller than the island so the island never covers app content. */}
          <div className="relative z-10 flex h-11 items-center justify-between px-7 text-[12px] font-semibold">
            <span>{time}</span>
            <div aria-hidden className="absolute left-1/2 top-2.5 h-[26px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1" aria-hidden>
              <span className="flex items-end gap-[2px]">
                {[4, 6, 8, 10].map((h) => (
                  <span key={h} className="w-[3px] rounded-sm bg-current" style={{ height: h }} />
                ))}
              </span>
              <span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-current p-[1px]">
                <span className="block h-full w-3/4 rounded-[1px] bg-current" />
              </span>
            </span>
          </div>
          <div className="relative h-[calc(100%-2.75rem)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
