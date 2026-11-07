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
 *   EASE.spring   [0.34, 1.36, 0.5, 1] press release, sliding pills,    0.3 – 0.8 s
 *                                      sheets lifting — overshoots ~4 % and settles
 *
 * `EASE.spring` is the CSS twin of the springs below (also `--ease-spring` / `ease-spring` in
 * globals.css). Use it on transform only — on opacity or color an overshoot is invisible at best.
 */
export const EASE = {
  reveal: [0.22, 1, 0.36, 1],
  toggle: [0.4, 0, 0.2, 1],
  camera: [0.65, 0, 0.35, 1],
  spring: [0.34, 1.36, 0.5, 1],
} as const;

/** Durations in seconds — motion graphics run longer than UI, but never past ~1.1 s per move. */
export const DUR = {
  ui: 0.3,
  reveal: 0.5,
  camera: 0.9,
} as const;

/** Spring for small "pop" moments (cards, badges). */
export const POP = { type: "spring", damping: 16, stiffness: 180 } as const;

/**
 * Physical springs for framer-motion — the same feel as `EASE.spring`, but they keep their
 * velocity when interrupted (a pill re-targeted mid-slide doesn't restart).
 *
 *   SPRING.press   fast and firm: buttons, keys, anything under a finger
 *   SPRING.slide   a selection that travels: tab pills, highlights, markers
 *   SPRING.pop     things arriving: icons swapping in, checks, dots
 *   SPRING.drop    larger things landing: banners, panels, sheets
 */
export const SPRING = {
  press: { type: "spring", stiffness: 700, damping: 30, mass: 0.6 },
  slide: { type: "spring", stiffness: 420, damping: 30, mass: 0.8 },
  pop: { type: "spring", stiffness: 520, damping: 20, mass: 0.7 },
  drop: { type: "spring", stiffness: 300, damping: 22, mass: 0.9 },
} as const;

/** Delay for the n-th layer of a stack (sheets, list rows): 40 ms apart, like the folder's fan. */
export const layerDelay = (n: number, step = 0.04) => n * step;

/** Clamp helper used by camera math. */
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
