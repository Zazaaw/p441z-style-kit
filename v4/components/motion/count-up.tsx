"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * CountUp — a number that counts to its value when it scrolls into view.
 *
 * Writes straight to the DOM node (no React re-render per frame) and uses tabular figures so
 * the digits never wobble while counting. When it lands, the number gives one small spring bump
 * (108 % and back) — the moment the count "clicks" into place. `land={false}` turns that off.
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
  /** The spring bump on arrival. */
  land?: boolean;
}

export default function CountUp({ to, from = 0, duration = 1.4, decimals = 0, prefix = "", suffix = "", format, className, land = true }: CountUpProps) {
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
    let bump: { stop: () => void } | undefined;
    const c = animate(from, to, {
      duration,
      ease: EASE.reveal,
      onUpdate: (v) => (el.textContent = text(v)),
      onComplete: () => {
        if (land) bump = animate(el, { scale: [1, 1.08, 1] }, { duration: 0.45, ease: EASE.spring, times: [0, 0.4, 1] });
      },
    });
    return () => {
      c.stop();
      bump?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, reduce, to, from, duration, land]);

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)}>
      {text(reduce ? to : from)}
    </span>
  );
}
