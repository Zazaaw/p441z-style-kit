"use client";

import * as React from "react";
import { cubicBezier, motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE, DUR, clamp } from "@/lib/motion";

/**
 * VirtualCamera — frames part of its content like a film camera: zoom in on a button, glide to a
 * table, pull back to the whole screen. The content itself never re-renders; only one transform moves.
 *
 * A shot is a point and a zoom:  { x, y, zoom }  — x/y are 0–1 fractions of the content box,
 * zoom 1 = everything visible. The point is clamped so the content's edges never enter the frame.
 *
 * Two ways to drive it:
 *   • shot      — controlled: change the prop, the camera glides there (symmetric camera ease).
 *   • progress  — scroll-scrubbed: pass a MotionValue 0→1 plus `path` (shots with an `at` stop),
 *                 and the camera interpolates between them as the user scrolls.
 *
 * USAGE
 *   <VirtualCamera shot={{ x: 0.72, y: 0.3, zoom: 2 }}><Screen /></VirtualCamera>
 *
 *   <VirtualCamera progress={scrollYProgress} path={[
 *     { at: 0, x: 0.5, y: 0.5, zoom: 1 },
 *     { at: 0.4, x: 0.25, y: 0.6, zoom: 1.8 },
 *     { at: 1, x: 0.5, y: 0.5, zoom: 1 },
 *   ]}><Screen /></VirtualCamera>
 */

export type Shot = { x: number; y: number; zoom: number };
export type PathShot = Shot & { at: number };

/** Translate (as % of the box) that puts point (x, y) at the center at `zoom`, edges clamped. */
export function framing({ x, y, zoom }: Shot) {
  const s = Math.max(1, zoom);
  const cx = clamp(x, 0.5 / s, 1 - 0.5 / s);
  const cy = clamp(y, 0.5 / s, 1 - 0.5 / s);
  return { tx: (0.5 - cx * s) * 100, ty: (0.5 - cy * s) * 100, s };
}

interface VirtualCameraProps {
  children: React.ReactNode;
  className?: string;
  shot?: Shot;
  progress?: MotionValue<number>;
  path?: PathShot[];
  /** Seconds per move in controlled mode. */
  duration?: number;
}

const ease = cubicBezier(...EASE.camera);

function Scrubbed({ progress, path, children }: { progress: MotionValue<number>; path: PathShot[]; children: React.ReactNode }) {
  const at = path.map((p) => p.at);
  const f = path.map(framing);
  const opts = { ease: path.slice(1).map(() => ease) };
  const x = useTransform(progress, at, f.map((v) => `${v.tx}%`), opts);
  const y = useTransform(progress, at, f.map((v) => `${v.ty}%`), opts);
  const scale = useTransform(progress, at, f.map((v) => v.s), opts);
  return (
    <motion.div className="absolute inset-0 origin-top-left will-change-transform" style={{ x, y, scale }}>
      {children}
    </motion.div>
  );
}

export default function VirtualCamera({ children, className, shot = { x: 0.5, y: 0.5, zoom: 1 }, progress, path, duration = DUR.camera }: VirtualCameraProps) {
  const reduce = useReducedMotion();
  const f = framing(shot);
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {progress && path && path.length > 1 && !reduce ? (
        <Scrubbed progress={progress} path={path}>
          {children}
        </Scrubbed>
      ) : (
        <motion.div
          className="absolute inset-0 origin-top-left will-change-transform"
          initial={false}
          animate={{ x: `${f.tx}%`, y: `${f.ty}%`, scale: f.s }}
          transition={reduce ? { duration: 0 } : { duration, ease: EASE.camera }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
