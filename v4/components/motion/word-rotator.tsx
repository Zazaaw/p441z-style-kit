"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * WordRotator — one word that keeps changing (design → code → motion → ship).
 *
 * The outgoing word blurs up and away, the incoming one rises from below. By default the box width
 * glides to fit each word; with `reserve` it is locked to the widest word, so nothing around it
 * ever moves — use that in headlines, where a reflowing line looks broken.
 *
 * This is the kit's single editorial accent: give it the serif italic, and use it ONCE per page.
 *
 * Text-painting effects (gradient text via `background-clip: text`) go in `wordClassName`, which
 * lands on the word's own text node. On the wrapper they vanish in Safari: the animated word is
 * composited on its own layer, so the clipped background never reaches it and the text stays
 * transparent.
 *
 * USAGE
 *   <h1>Interfaces that <WordRotator words={["move", "breathe", "ship"]} className="font-serif italic" /></h1>
 */

interface WordRotatorProps {
  words: string[];
  className?: string;
  /** Seconds each word stays. */
  interval?: number;
  /** Lock the width to the widest word (no reflow). */
  reserve?: boolean;
  /** Horizontal alignment inside a reserved box. */
  align?: "start" | "center" | "end";
  /** Classes on the word itself — put gradient-text / background-clip effects here. */
  wordClassName?: string;
}

export default function WordRotator({ words, className, interval = 2.2, reserve = false, align = "start", wordClassName }: WordRotatorProps) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  // Only rotate while on screen: an off-screen word swap still costs a layout pass every interval.
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref);

  useEffect(() => {
    if (reduce || !seen || words.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % words.length), interval * 1000);
    return () => clearInterval(t);
  }, [reduce, seen, words.length, interval]);

  if (reserve) {
    return (
      <span ref={ref} className={cn("relative inline-grid overflow-hidden align-bottom", className)} aria-live="polite">
        {/* Every word sits invisibly in the same cell, so the cell is exactly as wide as the widest. */}
        {words.map((w) => (
          <span key={w} aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap pb-[0.1em]">
            {w}
          </span>
        ))}
        <AnimatePresence initial={false}>
          <motion.span
            key={words[i]}
            className={cn("col-start-1 row-start-1 whitespace-nowrap pb-[0.1em]", align === "center" && "justify-self-center", align === "end" && "justify-self-end")}
            initial={{ y: "70%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-70%", opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: EASE.reveal }}
          >
            <span className={wordClassName}>{words[i]}</span>
          </motion.span>
        </AnimatePresence>
      </span>
    );
  }

  return (
    <motion.span ref={ref} layout transition={{ duration: 0.45, ease: EASE.reveal }} className={cn("relative inline-flex overflow-hidden align-bottom", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          className="inline-block whitespace-nowrap pb-[0.1em] -mb-[0.1em]"
          initial={{ y: "70%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-70%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: EASE.reveal }}
        >
          <span className={wordClassName}>{words[i]}</span>
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
