"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * FlyingPill — a small "message" that leaves one place and lands in another along an arc:
 * "Request sent to your manager" flying from the laptop's button to the phone.
 *
 * Put it in a `relative` stage that contains both ends; `from`/`to` are 0–1 fractions of that
 * stage. Bump `run` (any changing number) to launch it again. `onLand` fires on arrival — use it
 * to make the destination react (a notification appears, a badge increments). The pill lingers a
 * beat after landing, then shrinks away by itself.
 *
 * USAGE
 *   const [run, setRun] = useState(0);
 *   <div className="relative">
 *     …both devices…
 *     <FlyingPill run={run} from={{ x: 0.3, y: 0.6 }} to={{ x: 0.82, y: 0.3 }}
 *       title="Sent to your manager" subtitle="Leave · 3 days" onLand={() => setNotify(true)} />
 *   </div>
 */

interface FlyingPillProps {
  /** Change this value to launch. 0 = idle. */
  run: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  /** How high the arc rises, as a fraction of the stage height. */
  arc?: number;
  /** Seconds in flight. */
  duration?: number;
  /** Seconds the pill stays after landing before it leaves. */
  linger?: number;
  onLand?: () => void;
  className?: string;
}

export default function FlyingPill({ run, from, to, title, subtitle, icon, arc = 0.22, duration = 1.1, linger = 0.35, onLand, className }: FlyingPillProps) {
  const reduce = useReducedMotion();
  // The last run that has landed and left; the pill shows while `run` is newer than it.
  const [done, setDone] = React.useState(0);
  const peakY = Math.min(from.y, to.y) - arc;
  const pct = (v: number) => `${v * 100}%`;

  React.useEffect(() => {
    if (run && reduce) onLand?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, reduce]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-30">
      <AnimatePresence>
        {run > 0 && done !== run && !reduce && (
          <motion.div
            key={run}
            className={cn(
              "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-background/90 py-2 pl-2.5 pr-4 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.45)] backdrop-blur-md",
              className,
            )}
            initial={{ left: pct(from.x), top: pct(from.y), scale: 0.6, opacity: 0 }}
            animate={{
              left: [pct(from.x), pct((from.x + to.x) / 2), pct(to.x)],
              top: [pct(from.y), pct(peakY), pct(to.y)],
              scale: [0.6, 1, 0.9],
              opacity: [0, 1, 1],
              filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
            }}
            exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration, ease: EASE.camera, times: [0, 0.5, 1] }}
            onAnimationComplete={() => {
              onLand?.();
              setTimeout(() => setDone(run), linger * 1000);
            }}
          >
            <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">{icon ?? "↗"}</span>
            <span className="leading-tight">
              <span className="block text-[13px] font-semibold">{title}</span>
              {subtitle && <span className="block text-[11px] text-muted-foreground">{subtitle}</span>}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
