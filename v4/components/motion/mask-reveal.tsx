"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * MaskReveal — the keynote headline. Each word slides up from behind an invisible mask
 * (an `overflow: hidden` box), one after another. It is the most recognisable move of
 * product-launch videos, and it costs nothing: transform only.
 *
 * Requires:  npm i framer-motion
 *
 * USAGE
 *   <MaskReveal as="h1" text="Download. Print. Share." className="text-6xl font-extrabold" />
 *   <MaskReveal text="Quiet by default." inView={false} delay={0.2} />   // on mount
 *
 * Keep headlines to 2–5 words ending with a period — that is what makes it feel like a keynote.
 * Reduced motion: renders the text immediately.
 */

interface MaskRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** Seconds per word. 0.7 is the keynote tempo. */
  duration?: number;
  /** true = wait until scrolled into view (default). false = play on mount. */
  inView?: boolean;
  /** Replay every time it re-enters the viewport. Default false — replays read as glitches. */
  repeat?: boolean;
}

export default function MaskReveal({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.08,
  duration = 0.7,
  inView = true,
  repeat = false,
}: MaskRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: !repeat, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const show = !inView || seen;
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag ref={ref as never} className={cn("text-balance", className)} aria-label={text}>
      {words.map((w, i) => (
        // pb/-mb gives descenders (g, y, p) room inside the mask without changing line height.
        <span key={`${w}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "110%" }}
            animate={reduce || show ? { y: "0%" } : { y: "110%" }}
            transition={{ duration, delay: delay + i * stagger, ease: EASE.reveal }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
