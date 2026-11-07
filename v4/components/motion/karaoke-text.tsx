"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * KaraokeText — words light up one by one, like subtitles following a narrator.
 *
 * Two ways to drive it:
 *   • time   — plays once over `duration` seconds when scrolled into view (default);
 *   • scroll — pass a MotionValue `progress` (0 → 1), e.g. from useScroll(), and the words
 *              follow the scrollbar instead. Scrub back and they dim again.
 *
 * USAGE
 *   <KaraokeText text="Plan ahead, approved faster." duration={2.4} />
 *
 *   const { scrollYProgress } = useScroll({ target: ref });
 *   <KaraokeText text="…" progress={scrollYProgress} />
 *
 * Upcoming words stay at `dim` opacity (0.25) so the whole sentence is readable at a glance.
 */

interface KaraokeTextProps {
  text: string;
  className?: string;
  /** Scroll-driven mode: 0 → 1. When set, `duration` is ignored. */
  progress?: MotionValue<number>;
  /** Time-driven mode: seconds for the whole sentence. */
  duration?: number;
  delay?: number;
  /** Opacity of words not spoken yet. */
  dim?: number;
  /** Class for the word currently being "spoken" — e.g. a color accent on the last word. */
  activeClassName?: string;
}

function Word({ word, i, n, p, dim }: { word: string; i: number; n: number; p: MotionValue<number>; dim: number }) {
  // Each word owns a short slice of the progress: it brightens as the pointer passes it.
  const start = i / n;
  const end = (i + 1) / n;
  const opacity = useTransform(p, [start, end], [dim, 1]);
  const y = useTransform(p, [start, end], [2, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

export default function KaraokeText({ text, className, progress, duration = 2.5, delay = 0, dim = 0.25 }: KaraokeTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const seen = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const local = useMotionValue(reduce ? 1 : 0);
  const p = progress ?? local;
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    if (progress || reduce || !seen) return;
    const c = animate(local, 1, { duration, delay, ease: "linear" });
    return () => c.stop();
  }, [progress, reduce, seen, local, duration, delay]);

  return (
    // aria-label isn't allowed on a <p>; screen readers get the sentence once, as plain text.
    <p ref={ref} className={cn("text-pretty", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={`${w}-${i}`} word={w} i={i} n={words.length} p={p} dim={dim} />
        ))}
      </span>
    </p>
  );
}
