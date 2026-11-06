"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * CountUp — a number that counts to its value when it scrolls into view.
 *
 * Writes straight to the DOM node (no React re-render per frame) and uses tabular figures so
 * the digits never wobble while counting.
 *
 * USAGE
 *   <CountUp to={24195} />                                   // 24,195
 *   <CountUp to={98.4} decimals={1} suffix="%" />
 *   <CountUp to={1250000} format={(n) => `Rp ${n.toLocaleString("id-ID")}`} />
 */

interface CountUpProps {
  to: number;
  from?: number;
  /** Seconds. */
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Full control over the text; receives the current (rounded) value. */
  format?: (n: number) => string;
  className?: string;
}

export default function CountUp({ to, from = 0, duration = 1.4, decimals = 0, prefix = "", suffix = "", format, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const text = (n: number) => {
    const v = Number(n.toFixed(decimals));
    return format ? format(v) : `${prefix}${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = text(to);
      return;
    }
    if (!seen) return;
    const c = animate(from, to, { duration, ease: EASE.reveal, onUpdate: (v) => (el.textContent = text(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, reduce, to, from, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {text(reduce ? to : from)}
    </span>
  );
}
