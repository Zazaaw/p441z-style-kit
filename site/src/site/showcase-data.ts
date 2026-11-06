// Work made with the kit and its skills. Add an entry to show it on the landing page —
// put the file in public/showcase/ (keep MP4s ≤ ~15 MB, H.264, faststart) and a poster next to it.
export type ShowcaseItem = {
  title: string;
  /** One line: what it is and what made it. */
  note: string;
  /** "/showcase/…mp4", or omit for a link-only card. */
  video?: string;
  poster?: string;
  href?: string;
  /** Which skill or part of the kit produced it. */
  madeWith: string;
  featured?: boolean;
};

export const SHOWCASE: ShowcaseItem[] = [
  {
    title: "The p441z Style Kit — keynote",
    note: "A tutorial-style keynote of this very site: real screen recording, word-timed narration, virtual camera, synthesized music.",
    video: "/showcase/p441z-keynote.mp4",
    poster: "/showcase/p441z-keynote.jpg",
    madeWith: "skill-motion-video",
    featured: true,
  },
  {
    title: "p441z.my.id",
    note: "Portfolio, blog, studio CMS, and AI agent — the site this design system was extracted from.",
    href: "https://p441z.my.id",
    madeWith: "the style kit",
  },
];
