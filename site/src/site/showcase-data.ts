// Work made with the kit and its skills. Add an entry to show it on the landing page —
// put the file in public/showcase/ (keep MP4s ≤ ~15 MB, H.264, faststart) and a poster next to it.
export type ShowcaseItem = {
  title: string;
  /** Indonesian title for /id (falls back to `title`). */
  titleId?: string;
  /** One line: what it is and what made it. */
  note: string;
  /** Indonesian note for /id (falls back to `note`). */
  noteId?: string;
  /** "/showcase/…mp4", or omit for a link-only card. */
  video?: string;
  poster?: string;
  href?: string;
  /** Which skill or part of the kit produced it. */
  madeWith: string;
  /** Indonesian label for /id (falls back to `madeWith`). */
  madeWithId?: string;
  featured?: boolean;
};

export const SHOWCASE: ShowcaseItem[] = [
  {
    title: "The p441z Style Kit — keynote",
    titleId: "p441z Style Kit — keynote",
    note: "A tutorial-style keynote of this very site: real screen recording, word-timed narration, virtual camera, synthesized music.",
    noteId: "Keynote bergaya tutorial tentang situs ini sendiri: rekaman layar asli, narasi yang pas per kata, kamera virtual, musik sintetis.",
    video: "/showcase/p441z-keynote.mp4",
    poster: "/showcase/p441z-keynote.jpg",
    madeWith: "skill-motion-video",
    featured: true,
  },
  {
    title: "p441z.my.id",
    note: "Portfolio, blog, studio CMS, and AI agent — the site this design system was extracted from.",
    noteId: "Portofolio, blog, studio CMS, dan AI agent — situs asal design system ini diambil.",
    href: "https://p441z.my.id",
    madeWith: "the style kit",
    madeWithId: "style kit ini",
  },
];
