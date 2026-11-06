"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * Stepper — the progress line at the top of a story: Request → Review → Approved → Letter.
 *
 * The active stage is a solid pill that glides between steps (shared layout), finished steps get
 * a check, upcoming ones stay muted. Drive `active` from a timeline or scroll progress.
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

export default function Stepper({ steps, active, className, id = "stepper" }: StepperProps) {
  return (
    <ol className={cn("inline-flex items-center gap-1 rounded-full border border-border bg-background/80 p-1 text-[13px] backdrop-blur", className)} aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < active;
        const now = i === active;
        return (
          <li key={s} className="relative" aria-current={now ? "step" : undefined}>
            {now && <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-full bg-foreground" transition={{ duration: 0.5, ease: EASE.reveal }} />}
            <span className={cn("relative flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors duration-300", now ? "text-background" : done ? "text-foreground" : "text-muted-foreground")}>
              <span className={cn("grid size-4 place-items-center rounded-full text-[10px]", now ? "bg-background/20" : done ? "bg-foreground text-background" : "border border-border")}>{done ? "✓" : i + 1}</span>
              {s}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
