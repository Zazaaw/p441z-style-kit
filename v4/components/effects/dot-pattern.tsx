"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * DotPattern — an SVG dot grid used as an ambient page background.
 *
 * Requires:  npm i framer-motion
 *
 * Pair it with a mask so it fades out instead of tiling edge-to-edge — an
 * un-masked pattern reads as noise; a masked one reads as texture. See the
 * "ambient background" recipe in the README for the exact two-layer setup.
 *
 *   <DotPattern
 *     width={20} height={20} cx={1} cy={1} cr={1}
 *     className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
 *   />
 *
 * Color comes from `currentColor`, so control it with a text utility:
 *   className="text-neutral-400/60"
 *
 * `glow` makes the dots pulse at randomized intervals. Leave it off for a
 * background; it's better suited to a small hero panel.
 *
 * Perf note: the static pattern is a single SVG <pattern> — free at any size.
 * `glow` renders one animated <circle> per dot (thousands over a viewport), so
 * keep it to small panels.
 */

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  /** Horizontal spacing between dots. */
  width?: number;
  /** Vertical spacing between dots. */
  height?: number;
  /** X-offset of the whole pattern. */
  x?: number;
  /** Y-offset of the whole pattern. */
  y?: number;
  /** X-offset of each individual dot within its cell. */
  cx?: number;
  /** Y-offset of each individual dot within its cell. */
  cy?: number;
  /** Radius of each dot. */
  cr?: number;
  className?: string;
  /** Pulse the dots at randomized delays. Costly at full-screen sizes. */
  glow?: boolean;
  [key: string]: unknown;
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  // useId() can contain ":" or "«»", which break url(#…) references.
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Only the glowing variant needs to know its size (one element per dot); the static one is a
  // single SVG <pattern>, so a full-screen background costs one node instead of thousands.
  useEffect(() => {
    if (!glow) return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setDimensions({ width: e.contentRect.width, height: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [glow]);

  if (!glow) {
    return (
      <svg ref={containerRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80", className)} {...props}>
        <defs>
          <pattern id={`${id}-dots`} width={width} height={height} x={x} y={y} patternUnits="userSpaceOnUse">
            <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-dots)`} />
      </svg>
    );
  }

  // Deterministic "random" timing per dot: render stays pure and server/client markup matches.
  const rand = (i: number, salt: number) => {
    const s = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  const cols = Math.ceil(dimensions.width / width);
  const rows = Math.ceil(dimensions.height / height);
  const dots = Array.from({ length: cols * rows }, (_, i) => ({
    x: (i % cols) * width + cx + x,
    y: Math.floor(i / cols) * height + cy + y,
    delay: rand(i, 1) * 5,
    duration: rand(i, 2) * 3 + 2,
  }));

  return (
    <svg ref={containerRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80", className)} {...props}>
      <defs>
        <radialGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map((dot) => (
        <motion.circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={cr}
          fill={`url(#${id}-gradient)`}
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
          transition={{ duration: dot.duration, repeat: Infinity, repeatType: "reverse", delay: dot.delay, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

export default DotPattern;
