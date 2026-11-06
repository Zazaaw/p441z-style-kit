/**
 * Motion vocabulary shared by every component in `components/motion` and `components/mac`.
 *
 * The first two curves are the kit's UI curves (see docs/DESIGN.md → Easing). The third,
 * `camera`, is symmetric — it leaves slowly AND lands slowly — and exists only for
 * choreographed motion graphics (camera moves, devices entering, cards flying). Never use it
 * for UI feedback such as hovers or toggles: there it reads as lag.
 *
 *   EASE.reveal   [0.22, 1, 0.36, 1]   entrances, text, labels          ≤ 500 ms
 *   EASE.toggle   [0.4, 0, 0.2, 1]     collapses, switches, pills       ≤ 300 ms
 *   EASE.camera   [0.65, 0, 0.35, 1]   choreography: camera, flights    0.7 – 1.1 s
 */
export const EASE = {
  reveal: [0.22, 1, 0.36, 1],
  toggle: [0.4, 0, 0.2, 1],
  camera: [0.65, 0, 0.35, 1],
} as const;

/** Durations in seconds — motion graphics run longer than UI, but never past ~1.1 s per move. */
export const DUR = {
  ui: 0.3,
  reveal: 0.5,
  camera: 0.9,
} as const;

/** Spring for small "pop" moments (cards, badges). */
export const POP = { type: "spring", damping: 16, stiffness: 180 } as const;

/** Clamp helper used by camera math. */
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
