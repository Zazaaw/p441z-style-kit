"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";
import Swap from "@/components/motion/swap";

/**
 * Stepper — the progress line at the top of a story: Request → Review → Approved → Letter.
 *
 * The active stage is a solid pill that springs between steps (shared layout — it overshoots a hair
 * and settles). A finished step's number turns into a check that draws its own stroke, upcoming ones
 * stay muted. Drive `active` from a timeline or scroll progress.
 *
 * USAGE
 *   <Stepper steps={["Request", "Review", "Approved", "Letter"]} active={stage} />
 */

interface StepperProps {
  steps: string[];
  active: number;
  className?: string;
  /** Unique per page when several steppers are visible at once. */
  id?: string;
}

function Check() {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <motion.path d="M2.5 6.4l2.2 2.1L9.5 3.6" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} />
    </svg>
  );
}

export default function Stepper({ steps, active, className, id = "stepper" }: StepperProps) {
  const reduce = useReducedMotion();
  return (
    <ol className={cn("inline-flex items-center gap-1 rounded-full border border-border bg-background/80 p-1 text-[13px] backdrop-blur", className)} aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < active;
        const now = i === active;
        return (
          <li key={s} className="relative" aria-current={now ? "step" : undefined}>
            {now && <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-full bg-primary" transition={reduce ? { duration: 0 } : SPRING.slide} />}
            <span className={cn("relative flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors duration-300", now ? "text-primary-foreground" : done ? "text-foreground" : "text-muted-foreground")}>
              <span className={cn("grid size-4 place-items-center rounded-full text-[10px] transition-[background-color,border-color,color] duration-300", now ? "bg-primary-foreground/20" : done ? "bg-primary text-primary-foreground" : "border border-border")}>
                <Swap id={done ? "done" : "n"} mode="pop">
                  {done ? <Check /> : i + 1}
                </Swap>
              </span>
              {s}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
