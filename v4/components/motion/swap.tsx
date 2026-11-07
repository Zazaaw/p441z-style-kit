"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";

/**
 * Swap — trades one small thing for another on a spring: an icon turns in while the old one turns
 * out, a label rolls up, a dot pops. Change `id` and it plays; same `id`, nothing moves.
 *
 * Both states share one grid cell while they cross, so nothing around it jumps. `roll` clips to its
 * own box (the words slide through a slot); `turn` and `pop` don't, so a rotating icon never gets
 * its corners cut. Reduced motion: a plain crossfade.
 *
 * USAGE
 *   <Swap id={copied ? "done" : "idle"}>{copied ? <CheckIcon /> : <CopyIcon />}</Swap>
 *   <Swap id={dark ? "moon" : "sun"} mode="turn">{dark ? <Moon /> : <Sun />}</Swap>
 *   <Swap id={label} mode="roll">{label}</Swap>
 */

type Mode = "turn" | "roll" | "pop";

const MOVES = {
  turn: { from: { rotate: -90, scale: 0.4, opacity: 0 }, to: { rotate: 0, scale: 1, opacity: 1 }, out: { rotate: 90, scale: 0.4, opacity: 0 } },
  roll: { from: { y: "110%", opacity: 0 }, to: { y: "0%", opacity: 1 }, out: { y: "-110%", opacity: 0 } },
  pop: { from: { scale: 0.3, opacity: 0 }, to: { scale: 1, opacity: 1 }, out: { scale: 0.3, opacity: 0 } },
} as const;

interface SwapProps {
  /** What is showing. A new value plays the swap. */
  id: string | number;
  mode?: Mode;
  children: React.ReactNode;
  className?: string;
}

export default function Swap({ id, mode = "turn", children, className }: SwapProps) {
  const reduce = useReducedMotion();
  const m = MOVES[mode];
  return (
    <span className={cn("relative inline-grid place-items-center", mode === "roll" && "overflow-hidden", className)}>
      <AnimatePresence initial={false}>
        <motion.span
          key={id}
          className="col-start-1 row-start-1 inline-grid place-items-center"
          initial={reduce ? { opacity: 0 } : m.from}
          animate={reduce ? { opacity: 1 } : m.to}
          exit={reduce ? { opacity: 0 } : m.out}
          transition={{ ...(mode === "roll" ? SPRING.slide : SPRING.pop), opacity: { duration: 0.16 } }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
