"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Magnetic — the element leans toward the pointer while it hovers nearby, then springs back.
 * Wrap the one CTA per page that deserves it; on every button it becomes noise.
 *
 * USAGE
 *   <Magnetic><Button size="lg">Get the kit</Button></Magnetic>
 *   <Magnetic strength={0.5}>…</Magnetic>
 */

interface MagneticProps {
  children: React.ReactNode;
  /** 0–1: how far it follows (fraction of the pointer offset). */
  strength?: number;
  className?: string;
}

export default function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div onPointerMove={move} onPointerLeave={reset} style={{ x: sx, y: sy }} className={cn("inline-block", className)}>
      {children}
    </motion.div>
  );
}
