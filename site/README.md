# p441z Style Kit — landing page

The site for [style.p441z.my.id](https://style.p441z.my.id), built **from the kit itself**: a scroll-driven
keynote that plays every motion component, a live gallery, a draggable desktop, and the skills browser.

```bash
npm install
npm run dev      # syncs ../v4 into src/ first, then starts Next.js
npm run build
```

- **One source of truth.** `scripts/sync-kit.mjs` copies `../v4` (globals.css, lib, components) into `src/`
  before `dev` and `build`. Those copies are gitignored — edit the kit in `../v4`, never here.
  Because they are gitignored, `globals.css` registers them with `@source` (Tailwind v4 skips ignored files).
- **Skills** are read from `../Skill.md` at build time (`src/site/skills-data.ts`), following the order of
  `Skill.md/README.md`.
- Site-only code lives in `src/site/`.

Dibuat oleh Faiz Hazim Hawari
