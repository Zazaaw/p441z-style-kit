<div align="center">

# p441z Style Kit

**A quiet, editorial design system for React + Tailwind.**

Pure greyscale surfaces. Color only as meaning. Personality from motion, not hue.

[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)](v4/)
[![Tailwind v3](https://img.shields.io/badge/Tailwind-v3-0ea5e9?logo=tailwindcss&logoColor=white)](v3/)
[![React 18+](https://img.shields.io/badge/React-18%2B-61dafb?logo=react&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Extracted from [**p441z.my.id**](https://p441z.my.id) — my portfolio, blog,
studio CMS, and AI agent.

</div>

---

## What this is

Not a component library you install from npm. It's the **actual design system**
behind a real production site, packaged so you can copy it into a new project
and get the same considered look on day one.

Eleven components, one CSS file, and — more importantly — **the reasoning
behind them**. The docs explain *why* the palette is greyscale and *why* the
easing curves are what they are, because that's what's hard to reverse-engineer
from a screenshot.

```
✓ Copy-paste, not a dependency      ✓ Light + dark, no extra classes
✓ Zero lock-in — it's your code     ✓ Rebrand in two lines
✓ Tailwind v4 and v3                ✓ Verified against a real build
```

---

## Quick start

```bash
# 1. Scaffold (answer YES to Tailwind — v4 is the default)
npx create-next-app@latest my-app
cd my-app

# 2. Install
npm i tw-animate-css clsx tailwind-merge class-variance-authority \
      @radix-ui/react-slot framer-motion next-themes

# 3. Copy the kit
#    v4/globals.css          → src/app/globals.css   (overwrite)
#    v4/lib/utils.ts         → src/lib/utils.ts
#    v4/components/ui/*      → src/components/ui/
#    v4/components/effects/* → src/components/effects/

# 4. Go
npm run dev
```

Full walkthrough with the `layout.tsx` code and a test page:
**[v4/SETUP.md](v4/SETUP.md)** · ~10 minutes.

Then write your first page:

```tsx
import BlurFade from "@/components/effects/blur-fade";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <BlurFade>
      <PageHeader
        title="Projects"
        subtitle="Several projects I've worked on, both private and open source."
        action={<Button>New project</Button>}
      />
    </BlurFade>
  );
}
```

---

## Choosing a version

| | **[v4](v4/)** | **[v3](v3/)** |
|---|---|---|
| Config | `@theme` in CSS | `tailwind.config.ts` |
| Animation plugin | `tw-animate-css` | `tailwindcss-animate` |
| Status | **Recommended** | Legacy |
| Use when | Starting fresh | Adding to an existing v3 codebase |

`create-next-app` installs v4 today. Use v3 only if something forces it.

Both kits are identical in look — only the config format and a few utility
names differ. See **[docs/MIGRATION.md](docs/MIGRATION.md)**.

---

## What's inside

**8 UI components**

| | |
|---|---|
| `Typography` | H1–H4, P, blockquote — one text scale, no drift |
| `Button` | 6 variants × 4 sizes, `asChild` for links |
| `Card` | 6 composable parts with a considered padding rhythm |
| `Badge` | Tags and labels |
| `Input` | `h-9`, aligns flush with Button |
| `Skeleton` | Theme-derived loading placeholder |
| `PageHeader` | The standard page opening — title + muted subtitle |
| `PillTabs` | Segmented filter, mobile-scroll handled |

**3 effects**

| | |
|---|---|
| `BlurFade` | The signature entrance — fade + un-blur + drift |
| `DotPattern` | Ambient background, layer 1 |
| `GridPattern` | Ambient background, layer 2 — cells twinkle and move |

**Plus** a full color token system (light + dark), 13 animation keyframes,
and a rounded pill scrollbar.

---

## The idea

> **Pure greyscale surfaces. Color only as meaning. Personality comes from
> motion, not hue.**

Every surface token is `hsl(0 0% N%)` — hue 0, **saturation 0**. Backgrounds,
borders, body text, cards: all grey.

That's not indecision. It's the decision. When surfaces carry no color:

- **Content becomes the only thing with color** — a photo, a chart, a status
  badge lands with full force
- **Hierarchy comes from contrast**, which is more reliable than hue and works
  identically in both themes
- **Nothing dates** — brand color trends move; neutral greys don't

Color appears in exactly two places: **status indicators** (a `/10` tint, a
`/20` border, full-strength text) and **one** tinted hero tile per dashboard.

With no brand color doing the work, **motion carries the personality** — blur
entrances, two masked background layers, and easing curves that decelerate
hard at the end (`[0.22, 1, 0.36, 1]`), which is what makes movement read as
expensive rather than mechanical.

The most common way to ruin it: adding a tinted background "to make it less
plain." If a page feels plain, that's the intended result.

Full reasoning: **[docs/DESIGN.md](docs/DESIGN.md)**

---

## Rebranding

The palette is greyscale, so adding a brand color is a two-line change:

```css
/* src/app/globals.css */
:root {
  --primary: 243 75% 59%;          /* indigo-600 */
  --primary-foreground: 0 0% 98%;
  --ring: 243 75% 59%;
}
.dark {
  --primary: 243 75% 68%;          /* lighten for dark backgrounds */
  --primary-foreground: 0 0% 9%;
  --ring: 243 75% 68%;
}
```

Leave `--background`, `--foreground`, `--muted`, and `--border` grey. That
restraint *is* the design.

> ⚠️ Tokens must be **bare HSL triplets** (`243 75% 59%`), not
> `hsl(243 75% 59%)`. The theme layer wraps them — writing the full function
> breaks every opacity modifier like `bg-primary/90`.

Other knobs: `--radius` (one number rescales the whole UI's roundness) and the
font in `layout.tsx` (the single biggest shift in personality).

---

## Using it with AI coding agents

The kit ships with agent instructions, because a model's defaults pull hard
against a monochrome system — left alone, it *will* add a purple gradient hero.

**[AGENTS.md](AGENTS.md)** — reading order, the rules most likely to be
broken, and a completion checklist. Point your agent at it.

**[templates/CLAUDE.md](templates/CLAUDE.md)** — drop into your new project's
root. Claude Code loads it every session automatically, so the rules persist
without re-explaining them. Works as `.cursorrules` too, with light edits.

A prompt like *"build this site, follow SETUP.md"* gets the install right but
usually misses the design rules — SETUP is installation, `docs/DESIGN.md` is
how to use it. The `CLAUDE.md` template closes that gap permanently.

---

## Documentation

| | |
|---|---|
| **[v4/SETUP.md](v4/SETUP.md)** · **[v3/SETUP.md](v3/SETUP.md)** | Step-by-step install + troubleshooting |
| **[docs/DESIGN.md](docs/DESIGN.md)** | The philosophy — read before building |
| **[docs/RECIPES.md](docs/RECIPES.md)** | 12 copy-paste patterns |
| **[docs/COMPONENTS.md](docs/COMPONENTS.md)** | Props reference |
| **[docs/MIGRATION.md](docs/MIGRATION.md)** | v3 → v4 cheat sheet |
| **[AGENTS.md](AGENTS.md)** | Instructions for AI agents |

---

## Repo layout

```
p441z-style-kit/
├── v4/                     ← Tailwind v4 (recommended)
│   ├── SETUP.md
│   ├── globals.css         ← this file IS the whole config
│   ├── lib/utils.ts
│   └── components/{ui,effects}/
├── v3/                     ← Tailwind v3
│   ├── SETUP.md
│   ├── globals.css
│   ├── tailwind.config.ts
│   ├── lib/utils.ts
│   └── components/{ui,effects}/
├── docs/
│   ├── DESIGN.md  RECIPES.md  COMPONENTS.md  MIGRATION.md
├── templates/CLAUDE.md
└── AGENTS.md
```

---

## Optional extras

Not bundled (heavier dependencies), but these complete the original's feel:

| Add | Package | Payoff |
|---|---|---|
| **Smooth scroll** | `lenis` | Inertial scrolling. Biggest perceived-quality win per line of code. Add `data-lenis-prevent` to nested scrollers. |
| **Page transitions** | `next-transition-router` | Fade only the content wrapper — chrome staying still is what makes it feel like an app |
| **UI sound** | `uisfx` | Subtle click/hover cues. Default OFF or respect `prefers-reduced-motion` |
| **Toasts** | `sonner` | `<Toaster position="top-right" richColors />` |
| **Top progress bar** | `nextjs-toploader` | |

---

## FAQ

<details>
<summary><b>Why copy-paste instead of an npm package?</b></summary>

Because a design system you can't edit isn't yours. Every file lands in your
repo where you can change it. No version bumps, no breaking changes, no
fighting someone else's abstraction to move a padding value.

It's the shadcn/ui philosophy, and it's the right one for this kind of system.
</details>

<details>
<summary><b>Does it work outside Next.js?</b></summary>

Yes. The components are plain React + Tailwind. Vite, Remix, and Astro all
work — you'll adapt the CSS import path and the font loading, and drop
`"use client"` where your framework doesn't use it.

The SETUP guides are written for Next.js because that's the common case.
</details>

<details>
<summary><b>Can I use OKLCH instead of HSL?</b></summary>

Yes, and v4 prefers it. Change two places: the token value in `:root`, and
drop the `hsl()` wrapper in the `@theme inline` mapping. Be consistent — don't
mix formats.

The kit ships HSL so the values match the original portfolio exactly.
</details>

<details>
<summary><b>Where are the marquee / bento / dock components?</b></summary>

Not included yet. The original has ~38 more in its own component library. This
kit is the *foundation* — the tokens, primitives, and rules everything else is
built on.

Open an issue if there's a specific one you want.
</details>

<details>
<summary><b>Is this tested?</b></summary>

The v4 kit is verified against a real `create-next-app` build — production
build passes, dev server serves, and the generated CSS was inspected to confirm
tokens resolve, dark mode compiles as a class selector (not a media query),
opacity modifiers produce `color-mix()`, and the `@theme` keyframes emit.

The v3 kit is extracted verbatim from the running portfolio.
</details>

---

## Credits

Built by **[Faiz Hazim Hawari](https://p441z.my.id)** (`@p441z`) —
fullstack developer & designer.

The effect components (`BlurFade`, `DotPattern`, `GridPattern`) are adapted
from [MagicUI](https://magicui.design). The component API convention follows
[shadcn/ui](https://ui.shadcn.com).

[GitHub](https://github.com/Zazaaw) ·
[LinkedIn](https://www.linkedin.com/in/zazaaw/) ·
[Instagram](https://www.instagram.com/faizhazimhawarii)

---

## License

MIT — see [LICENSE](LICENSE). Use it, ship it, sell what you build with it.
Attribution appreciated but not required.
