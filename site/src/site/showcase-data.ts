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
  /** Domain shown on a link card, e.g. "p441z.my.id". */
  host?: string;
  /** Call to action on a link card (and its Indonesian twin). */
  cta?: string;
  ctaId?: string;
  /** Which skill or part of the kit produced it. */
  madeWith?: string;
  /** Indonesian label for /id (falls back to `madeWith`). */
  madeWithId?: string;
  featured?: boolean;
};

export const SHOWCASE: ShowcaseItem[] = [
  {
    title: "The p441z Style Kit — keynote",
    titleId: "p441z Style Kit — keynote",
    note: "A tutorial-style keynote of this very site: real screen recording, word-timed narration, virtual camera, synthesized music.",
    noteId: "Video tutorial ala keynote tentang situs ini: rekaman layar asli, narasi yang sinkron per kata, kamera virtual, dan musik sintetis.",
    video: "/showcase/p441z-keynote.mp4",
    poster: "/showcase/p441z-keynote.jpg",
    madeWith: "skill-motion-video",
    featured: true,
  },
  {
    title: "Faiz Hazim Hawari",
    note: "Portfolio, projects, and writing — “I build for the web — and I design.” Fullstack development, UI/UX, video, and photography.",
    noteId: "Portofolio, proyek, dan tulisan — “I build for the web — and I design.” Fullstack development, UI/UX, video, dan fotografi.",
    href: "https://p441z.my.id",
    host: "p441z.my.id",
    poster: "/showcase/p441z-portfolio.jpg",
    cta: "See the portfolio",
    ctaId: "Lihat portofolionya",
  },
  {
    title: "Satu Visual",
    note: "A creative studio in Pematangsiantar and Medan — photo, video, and websites for bold brands, made by one team.",
    noteId: "Studio kreatif di Pematangsiantar dan Medan — foto, video, dan website untuk brand yang berani, dikerjakan satu tim.",
    href: "https://satuvisual.p441z.my.id",
    host: "satuvisual.p441z.my.id",
    poster: "/showcase/satu-visual.jpg",
    cta: "Visit the studio",
    ctaId: "Kunjungi studionya",
  },
];
