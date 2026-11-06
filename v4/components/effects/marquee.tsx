import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Marquee — an endless ribbon of items (logos, component names, quotes). Content is rendered twice
 * and slid by exactly one copy, so the loop has no seam. Edges fade out; hover pauses.
 *
 * Uses the kit's `animate-marquee` utility (globals.css). Pure CSS — no client JS.
 * Reduced motion: the ribbon stands still.
 *
 * USAGE
 *   <Marquee duration="40s">{names.map((n) => <span key={n}>{n}</span>)}</Marquee>
 *   <Marquee reverse gap="3rem">…</Marquee>
 */

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  /** One full loop. Longer = calmer. */
  duration?: string;
  gap?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
}

export default function Marquee({ children, className, duration = "36s", gap = "2.5rem", reverse = false, pauseOnHover = true }: MarqueeProps) {
  return (
    <div
      className={cn("group/mq flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]", className)}
      style={{ "--duration": duration, "--gap": gap, gap } as React.CSSProperties}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            "flex shrink-0 animate-marquee items-center justify-around motion-reduce:animate-none",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover/mq:[animation-play-state:paused]",
          )}
          style={{ gap }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
