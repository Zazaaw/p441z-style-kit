"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimate, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * SoftCursor — a demo pointer that moves like a hand and clicks without any red ring or box.
 *
 * It glides along a slightly curved path with the symmetric camera ease, and a click is just the
 * arrow shrinking for a beat plus a soft halo — the way product videos show interaction.
 * Place it inside a `relative` container; points are 0–1 fractions of that container.
 *
 * `onClick(index)` fires on every click point, so the demo UI underneath can react for real
 * (toggle a switch, open a sheet). That is the rule: every click must show its consequence.
 *
 * USAGE
 *   <div className="relative">
 *     <MyDemoUI pressed={pressed} />
 *     <SoftCursor
 *       points={[{ x: 0.3, y: 0.4 }, { x: 0.72, y: 0.62, click: true }]}
 *       onClick={() => setPressed(true)}
 *       loop
 *     />
 *   </div>
 */

export type CursorPoint = { x: number; y: number; click?: boolean; /** seconds to rest here */ hold?: number };

interface SoftCursorProps {
  points: CursorPoint[];
  onClick?: (index: number) => void;
  /** Restart from the first point after the last one. */
  loop?: boolean;
  /** Seconds per move. */
  move?: number;
  className?: string;
}

const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

export default function SoftCursor({ points, onClick, loop = false, move = 0.85, className }: SoftCursorProps) {
  const [scope, animate] = useAnimate();
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [halo, setHalo] = useState<{ x: number; y: number; k: number } | null>(null);
  const clickRef = useRef(onClick);
  useEffect(() => {
    clickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    if (!seen || reduce || points.length === 0) return;
    let stop = false;
    (async () => {
      const el = box.current!;
      const pos = (p: CursorPoint) => ({ x: p.x * el.clientWidth, y: p.y * el.clientHeight });
      const start = pos(points[0]);
      await animate(scope.current, { x: start.x, y: start.y, opacity: 1 }, { duration: 0 });
      do {
        for (let i = 0; i < points.length && !stop; i++) {
          const p = pos(points[i]);
          if (i > 0) {
            // A gentle arc: route through a mid-point pushed perpendicular to the straight line.
            const a = pos(points[i - 1]);
            const mx = (a.x + p.x) / 2 - (p.y - a.y) * 0.12;
            const my = (a.y + p.y) / 2 + (p.x - a.x) * 0.12;
            await animate(scope.current, { x: [a.x, mx, p.x], y: [a.y, my, p.y] }, { duration: move, ease: EASE.camera });
          }
          if (stop) return;
          if (points[i].click) {
            setHalo({ ...p, k: Date.now() });
            clickRef.current?.(i);
            await animate(scope.current, { scale: [1, 0.84, 1] }, { duration: 0.24 });
          }
          await sleep(points[i].hold ?? 0.5);
        }
        if (loop && !stop) await sleep(0.8);
      } while (loop && !stop);
    })();
    return () => {
      stop = true;
    };
  }, [seen, reduce, points, loop, move, animate, scope]);

  if (reduce) return null;
  return (
    <div ref={box} aria-hidden className={cn("pointer-events-none absolute inset-0 z-20", className)}>
      {halo && (
        <motion.span
          key={halo.k}
          className="absolute size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20"
          style={{ left: halo.x, top: halo.y }}
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: 1.25, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE.reveal }}
        />
      )}
      <motion.svg ref={scope} width="22" height="26" viewBox="0 0 22 26" className="absolute left-0 top-0 opacity-0 drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]" style={{ originX: 0, originY: 0 }}>
        <path d="M2 1.5v19.2l5.1-4.6 3.3 7.4 3.4-1.5-3.3-7.3 6.9-.4L2 1.5z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </motion.svg>
    </div>
  );
}
