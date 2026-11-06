"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * WordRotator — one word that keeps changing (design → code → motion → ship).
 *
 * The outgoing word blurs up and away, the incoming one rises from below, and the box width
 * glides to fit the new word so the rest of the sentence never jumps.
 *
 * This is the kit's single editorial accent: give it the serif italic, and use it ONCE per page.
 *
 * USAGE
 *   <h1>Interfaces that <WordRotator words={["move", "breathe", "ship"]} className="font-serif italic" /></h1>
 */

interface WordRotatorProps {
  words: string[];
  className?: string;
  /** Seconds each word stays. */
  interval?: number;
}

export default function WordRotator({ words, className, interval = 2.2 }: WordRotatorProps) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % words.length), interval * 1000);
    return () => clearInterval(t);
  }, [reduce, words.length, interval]);

  return (
    <motion.span layout transition={{ duration: 0.45, ease: EASE.reveal }} className={cn("relative inline-flex overflow-hidden align-bottom", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          className="inline-block whitespace-nowrap pb-[0.1em] -mb-[0.1em]"
          initial={{ y: "70%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-70%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: EASE.reveal }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
