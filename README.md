<div align="center">

# p441z Style Kit

**A quiet, editorial design system for React + Tailwind.**

Pure greyscale surfaces. Color only as meaning. Personality from motion, not hue.

[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)](v4/) [![Tailwind v3](https://img.shields.io/badge/Tailwind-v3-0ea5e9?logo=tailwindcss&logoColor=white)](v3/) [![React 18+](https://img.shields.io/badge/React-18%2B-61dafb?logo=react&logoColor=white)](#) [![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](#) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Extracted from [**p441z.my.id**](https://p441z.my.id) — my portfolio, blog, studio CMS, and AI agent.

</div>

---

## Table of contents
1. [What this is, and what it is not](#what-this-is-and-what-it-is-not)
2. [Philosophy and design principles](#philosophy-and-design-principles)
3. [What's inside](#whats-inside)
4. [Requirements and compatibility](#requirements-and-compatibility)
5. [Quick start (Tailwind v4)](#quick-start-tailwind-v4)
6. [Quick start (Tailwind v3)](#quick-start-tailwind-v3)
7. [Design tokens](#design-tokens)
8. [Components reference](#components-reference)
9. [Effects](#effects)
10. [Recipes](#recipes)
11. [Spacing and layout rules](#spacing-and-layout-rules)
12. [Dark mode](#dark-mode)
13. [Tailwind v4 vs v3](#tailwind-v4-vs-v3)
14. [Using the kit with AI coding agents](#using-the-kit-with-ai-coding-agents)
15. [The Skill.md folder](#the-skillmd-folder)
16. [Customization and theming](#customization-and-theming)
17. [Accessibility notes](#accessibility-notes)
18. [Performance notes](#performance-notes)
19. [Optional extras](#optional-extras)
20. [FAQ](#faq)
21. [Troubleshooting](#troubleshooting)
22. [Project history and versioning](#project-history-and-versioning)
23. [Contributing](#contributing)
24. [License](#license)
25. [Credits](#credits)

## What this is, and what it is not
The **actual design system** behind a production site, packaged as files you copy into a Next.js project: one `globals.css`
(the entire theme — tokens, dark mode, keyframes, scrollbar), one `cn()` helper, eight UI primitives following the shadcn/ui
API convention (`cn`, `cva`, `forwardRef`, `asChild`), three effect components adapted from MagicUI, and the reasoning behind
every decision (*why* the palette is greyscale, *why* the easing curves are what they are), written down in `docs/DESIGN.md`
and enforced through agent instructions. It ships for Tailwind v4 (recommended; verified against a real `create-next-app`
build) and v3 (legacy; extracted verbatim from the running portfolio), with a folder of working skills. It is **not** an npm
package, a Tailwind preset or plugin you import, a fork of shadcn/ui (only the convention and token names are shared), a full
copy of MagicUI, a catalog of dozens of widgets, a theming system with a `variant="colorful"` switch, or a unit-tested library
— there is no test suite. No build step, no CLI, no lock-in: after you copy it, it is your code. This file is the complete
documentation; every fact in it comes from the files in this repository, and where `v3/` and `v4/` differ, the difference is stated.

```
✓ Copy-paste, not a dependency      ✓ Light + dark, no extra classes
✓ Zero lock-in — it's your code     ✓ Rebrand in two lines
✓ Tailwind v4 and v3                ✓ Verified against a real build
```

## Philosophy and design principles
> **Pure greyscale surfaces. Color only as meaning. Personality comes from motion, not hue.**

Everything in the kit is a consequence of that sentence. Every surface token is `hsl(0 0% N%)` — hue 0,
**saturation 0**. When surfaces carry no color, content becomes the only thing with color, hierarchy comes from
contrast alone (more reliable than hue), and nothing dates. The most common way to ruin it is a tinted
background "to make it less plain": a `bg-slate-50` page or an indigo gradient hero turns the design into a
template. If a page feels plain, that is the intended result.

| Principle | Rule | Why |
|---|---|---|
| Monochrome surfaces | Backgrounds, borders, body text, muted panels, cards: all grey | Photos, charts, and status land with full force; neutral greys never date |
| Color = status | `bg-{color}-500/10 text-{color}-500 border-{color}-500/20`, always paired with a text label | Reads in both themes with one set of classes, no `dark:` variant; color alone fails colorblind users and greyscale print |
| One tinted card | At most one dashboard tile carries a gradient (the hero metric) | The moment a second tile gets a gradient, both stop meaning anything |
| Motion is the accent | `BlurFade` around every page body; `inView` below the fold; stagger lists with `delay={i * 0.05}` | Most visitors won't register it, but the page feels *composed* rather than dumped |
| Easing | `[0.22, 1, 0.36, 1]` for reveals and entrances, `[0.4, 0, 0.2, 1]` for collapses and toggles — in transitions you write | Hard deceleration reads as *expensive*; linear easing is the tell of an unconsidered animation |
| Duration discipline | `200ms` color changes and hover fills, `300ms` borders, collapses, pill switches, `500ms` image zoom and large transforms | Past 500ms the interface feels like it is thinking |
| Ambient background | Dot grid + line grid, each masked toward an opposite corner, `maxOpacity` 0.05–0.15 | An unmasked pattern is wallpaper; a masked one is texture |
| One typeface | Plus Jakarta Sans everywhere, loaded in `layout.tsx` via `next/font/google`; a serif italic used **once** | One moment of contrast reads as intentional; ten reads as indecision |
| Muted-text habit | Subtitles, metadata, timestamps, helper text, empty states: `text-muted-foreground` | Roughly one high-contrast element per section; everything else stepped back |
| One radius | `--radius: 0.5rem` cascades into `--radius-sm` / `-md` / `-lg`; cards `rounded-xl` and pills `rounded-full` are deliberate exceptions | One number rescales the UI: `0.75rem` softer and friendlier, `0.25rem` sharper and more technical |
| Skeletons mirror layout | Same block count, same rough sizes, same grid as the real page | Content appears to *resolve*, not *jump*; same wait, different perceived quality |
| Consistency over expression | Every page opens with `PageHeader` (bold 3xl title, muted subtitle); every control `h-9`; every card grid `gap-5` | The site feels like one product instead of a folder of pages |

Status colors: `blue` upcoming / info, `purple` in progress, `amber` pending / warning, `emerald` completed / success, `red` cancelled /
error, `neutral` neutral. The original uses Times Ten Italic for exactly one thing, the rotating hero word (`design` / `code` / `shoot` /
`ship`); the serif is not bundled. The shipped `BlurFade` uses framer-motion's named `easeOut` and the UI components use Tailwind's
default `transition-colors` / `transition-all` timing — the two curves above are for transitions you write yourself.

## What's inside
```
p441z-style-kit/
├── AGENTS.md               ← reading order, the seven rules, and a completion checklist for AI agents
├── CONTRIBUTING.md         ← what fits, how v3/v4 stay in sync, how to verify a change
├── LICENSE                 ← MIT, © 2026 Faiz Hazim Hawari (p441z)
├── .gitattributes, .gitignore ← LF for .ts/.tsx/.css/.md/.json, png/jpg/ico binary · ignores node_modules, .next/out/build/dist, env files, editor folders, tmp/ and scratch/
├── v4/                     ← Tailwind v4 kit (recommended)
│   ├── SETUP.md            ← step-by-step install (Indonesian) with a success checklist and troubleshooting
│   ├── globals.css         ← THE config: tokens, dark variant, @theme mapping, 13 keyframes, scrollbar
│   ├── lib/utils.ts        ← cn() = clsx + tailwind-merge
│   └── components/         ← ui/ (8 files, table below) and effects/ (3 files)
├── v3/                     ← Tailwind v3 kit (legacy)
│   ├── SETUP.md            ← same walkthrough for v3, plus an appendix on converting to v4
│   ├── globals.css         ← tokens + base layer + scrollbar (@tailwind directives)
│   ├── tailwind.config.ts  ← color mapping, radius, keyframes, animations, plugins, content globs
│   ├── lib/utils.ts        ← identical to v4
│   └── components/         ← same 8 ui files (4 differ from v4 in class strings only); 3 effects byte-identical
├── docs/                   ← DESIGN.md (philosophy, read first) · COMPONENTS.md (condensed props) · RECIPES.md (13 patterns) · MIGRATION.md (v3 → v4)
├── templates/CLAUDE.md     ← drop into a new project's root; Claude Code loads it every session
└── Skill.md/               ← 14 working skills (skill-*.md) for AI agents and humans, plus README.md
```

| File | Exports | One line |
|---|---|---|
| `ui/typography.tsx` | `Typography` (default) | `H1`–`H4`, `P`, `quote` — one text scale, no drift |
| `ui/button.tsx` | `Button`, `buttonVariants` | 6 variants × 4 sizes, `asChild` for links |
| `ui/card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | 6 composable parts with a considered padding rhythm |
| `ui/badge.tsx` | `Badge`, `badgeVariants` | Tags and labels, 4 variants |
| `ui/input.tsx` | `Input` | `h-9`, aligns flush with `Button` |
| `ui/skeleton.tsx` | `Skeleton` | Theme-derived loading placeholder |
| `ui/page-header.tsx` | `PageHeader` (default) | The standard page opening — title, muted subtitle, action slot |
| `ui/pill-tabs.tsx` | `PillTabs` (default) | Segmented filter, mobile scroll handled |
| `effects/blur-fade.tsx` | `BlurFade` (default) | The signature entrance — fade + un-blur + drift |
| `effects/dot-pattern.tsx` | `DotPattern` (named and default) | Ambient background, layer 1 |
| `effects/grid-pattern.tsx` | `GridPattern` (named and default) | Ambient background, layer 2 — cells twinkle and move |
| `globals.css` | — | Color tokens (light + dark), 13 animation utilities with keyframes, three radius tokens from one number, pill scrollbar |

## Requirements and compatibility
| | v4 kit | v3 kit |
|---|---|---|
| Tailwind | `tailwindcss@4.x` + `@tailwindcss/postcss` | `tailwindcss@3.x` + `postcss` + `autoprefixer` |
| Config location | `src/app/globals.css` (`@theme`) — no config file | `tailwind.config.ts` + `globals.css` |
| Animation package | `tw-animate-css` (`@import` in CSS) | `tailwindcss-animate` (`require()` plugin) |
| Extra plugin | none | `tailwind-scrollbar-hide` |
| Framework the guides target | Next.js App Router, `src/` directory, `@/*` alias | same |
| React / TypeScript | 18+ / yes — every file is `.ts` / `.tsx` | 18+ / yes |
| Status | **Recommended** — verified against a real `create-next-app` build | Legacy — extracted verbatim from the running portfolio |
| Use when | Starting fresh | Adding to an existing v3 codebase, or a dependency lacks v4 support |

`create-next-app` installs v4 today; use v3 only if something forces it. The kits look identical apart from the shadow and
outline details in [Tailwind v4 vs v3](#tailwind-v4-vs-v3). Node is not pinned. Vite, Remix, and Astro work: adapt the CSS
import path (`v3/globals.css` names `src/index.css` for Vite) and the font loading, and drop `"use client"` where unused.

| Package | Used by | Why it is there | Removable? |
|---|---|---|---|
| `clsx` | `lib/utils.ts` | Conditional class names and arrays inside `cn()` | No |
| `tailwind-merge` | `lib/utils.ts` | Resolves Tailwind conflicts so a caller's `className` wins | No |
| `class-variance-authority` | `button.tsx`, `badge.tsx` | Declares the `variant` / `size` maps and derives their TypeScript types | Only by rewriting those two files |
| `@radix-ui/react-slot` | `button.tsx` | `asChild` — renders the child (e.g. `<Link>`) with the button's classes instead of nesting `<a>` in `<button>` | Only by dropping `asChild` |
| `framer-motion` | `blur-fade.tsx`, `dot-pattern.tsx`, `grid-pattern.tsx` | `motion`, `AnimatePresence`, `useInView` | Yes, if you skip all three effects — no UI component imports it |
| `next-themes` | your `layout.tsx` | Writes the `.dark` class on `<html>`; the kit's dark mode is class-based | Yes, if you toggle `.dark` yourself |
| `tw-animate-css` (v4) | `v4/globals.css` (`@import`) | v4-native replacement for `tailwindcss-animate`; the same package shadcn/ui uses on v4 | Yes — none of the 11 components use its utilities; delete the `@import` line |
| `tailwindcss-animate` (v3) | `v3/tailwind.config.ts` (plugin) | Enter/exit animation utilities | Yes — remove it from `plugins` |
| `tailwind-scrollbar-hide` (v3) | `v3/tailwind.config.ts` (plugin) | A `scrollbar-hide` utility | Yes — `PillTabs` hides its scrollbar with arbitrary properties instead |
| `lucide-react` (optional) | mode-toggle recipe | `Sun` / `Moon` icons | Yes |

## Quick start (Tailwind v4)
About ten minutes from an empty folder to the first animated page; the same steps as [`v4/SETUP.md`](v4/SETUP.md).

### 1. Scaffold and install
```bash
npx create-next-app@latest my-app   # TypeScript Yes · ESLint Yes · Tailwind Yes · src/ Yes · App Router Yes · Turbopack Yes · keep the @/* alias
cd my-app
npm ls tailwindcss                  # must print tailwindcss@4.x.x — if it says 3.x, use the v3 kit
npm i tw-animate-css clsx tailwind-merge class-variance-authority \
      @radix-ui/react-slot framer-motion next-themes
```

`tw-animate-css` is pure CSS imported from `globals.css` (it replaces the JavaScript `tailwindcss-animate` plugin; shadcn/ui
uses it on v4). `postcss.config.mjs` must be `plugins: { "@tailwindcss/postcss": {} }`; if it shows `tailwindcss: {}` +
`autoprefixer: {}`, replace it and run `npm i -D @tailwindcss/postcss`.

### 2. Copy the kit
```bash
KIT="/path/to/p441z-style-kit/v4"; PROJECT="/path/to/my-app"
mkdir -p "$PROJECT/src/lib" "$PROJECT/src/components/ui" "$PROJECT/src/components/effects"
cp "$KIT/globals.css" "$PROJECT/src/app/globals.css"; cp "$KIT/lib/utils.ts" "$PROJECT/src/lib/utils.ts"   # overwrite globals.css — it IS the config
cp "$KIT"/components/ui/* "$PROJECT/src/components/ui/"; cp "$KIT"/components/effects/* "$PROJECT/src/components/effects/"   # 8 + 3 files
rm -f "$PROJECT/tailwind.config.ts" "$PROJECT/tailwind.config.js"   # v4 has no config file
```

`tsconfig.json` must contain `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }` — `create-next-app` writes it;
if you add it by hand, restart the dev server.

### 3. `layout.tsx` with the font and the theme provider
```tsx
// src/app/layout.tsx (replace)
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning is REQUIRED with next-themes — it writes the theme class to <html> before React hydrates
    <html lang="en" suppressHydrationWarning>
      <body className={sans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// src/components/theme-provider.tsx (create)
"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### 4. Test page, run, verify
Replace `src/app/page.tsx`, then `npm run dev` and open http://localhost:3000:

```tsx
import BlurFade from "@/components/effects/blur-fade";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <BlurFade>
        <PageHeader title="Hello, new project" subtitle="If this text fades in from a slight blur, the style kit is working." action={<Button>Action</Button>} />
        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2].map((n) => (
            <BlurFade key={n} inView delay={n * 0.05}>
              <Card><CardHeader><CardTitle>Card {n}</CardTitle><CardDescription>A short description.</CardDescription></CardHeader></Card>
            </BlurFade>
          ))}
        </div>
        <div className="mt-10 flex gap-3">   {/* token + opacity-modifier check: the second square must be 50% transparent */}
          <div className="h-12 w-12 rounded-md bg-primary" /><div className="h-12 w-12 rounded-md bg-primary/50" />
          <div className="h-12 w-12 rounded-md bg-muted" /><div className="h-12 w-12 rounded-md border" />
        </div>
      </BlurFade>
    </main>
  );
}
```

Check: a large bold title with a grey subtitle; content **fades in from a slight blur** while drifting up; two cards with a
border, rounded corners, and a soft shadow; four squares — solid near-black, **50% transparent near-black**, light grey,
outlined; a **rounded pill scrollbar** (needs enough content to scroll; Chrome, Edge, Safari); the font is Plus Jakarta Sans.
If anything fails, see [Troubleshooting](#troubleshooting). Optional next: mount the ambient background ([Recipes](#recipes))
inside `<ThemeProvider>` in `layout.tsx` — it is the signature — and `npm i lucide-react` for the dark mode toggle, mounted as `<PageHeader … action={<ModeToggle />} />`.

## Quick start (Tailwind v3)
Same result, different plumbing. Full guide: [`v3/SETUP.md`](v3/SETUP.md). Only the differences from v4:

- **Scaffold:** say **No** to "Tailwind CSS?" so the scaffold does not install v4. If you already said Yes, run
  `npm uninstall tailwindcss @tailwindcss/postcss` first.
- **Install with the version pinned**, then confirm `npm ls tailwindcss` prints `3.x.x`:

  ```bash
  npm i -D tailwindcss@3 postcss autoprefixer tailwindcss-animate tailwind-scrollbar-hide
  npm i clsx tailwind-merge class-variance-authority @radix-ui/react-slot framer-motion next-themes
  ```

- **`postcss.config.mjs`** does not exist yet (Tailwind was skipped); create it in the v3 form: `plugins: { tailwindcss: {}, autoprefixer: {} }`.
- **One extra file to copy:** `v3/tailwind.config.ts` → `tailwind.config.ts` at the project root, alongside the same
  `globals.css`, `lib/utils.ts`, 8 UI files, and 3 effect files. Its `content` globs cover `./src/pages`, `./src/components`,
  and `./src/app` (`**/*.{js,ts,jsx,tsx,mdx}`); extend them if your files live elsewhere or Tailwind will not see your classes.
- **Identical to v4:** the `tsconfig.json` alias, `layout.tsx` + `theme-provider.tsx`, and the test page (the v3 guide's
  test page omits the four-square check, but it works on v3 too).
- **Class names to watch:** the kit's v3 components already use v3 names; when you write markup or copy a recipe (written
  for v4), translate `outline-hidden` → `outline-none`, `shadow-xs` → `shadow-sm`, `shadow-sm` → `shadow`, `bg-linear-to-t` /
  `-r` → `bg-gradient-to-t` / `-r` (`shrink-0` also works on v3). Mode-toggle icons need explicit `h-4 w-4` — the v3 `Button`
  does not size SVG children. Full mapping: [Tailwind v4 vs v3](#tailwind-v4-vs-v3).

## Design tokens
Everything visual is driven by CSS custom properties declared in `globals.css`; v4 maps them to utilities in the same
file (`@theme inline`), v3 in `tailwind.config.ts`. The values are identical in both kits.

### Color tokens
Every value is a **bare HSL triplet** (`H S% L%`). Every surface token has hue 0 and saturation 0 — pure grey; only
`--destructive` and the five `--chart-*` tokens carry hue.

| Token (`bg-*` / `text-*` utilities) | Light (`:root`) | Dark (`.dark`) | What it is for |
|---|---|---|---|
| `--background` / `--foreground` | `0 0% 100%` / `0 0% 3.9%` | `0 0% 3.9%` / `0 0% 98%` | Page background and default text; applied to `body` by the base layer |
| `--card` / `--card-foreground` | `0 0% 100%` / `0 0% 3.9%` | `0 0% 3.9%` / `0 0% 98%` | `Card` surface and its text |
| `--popover` / `--popover-foreground` | `0 0% 100%` / `0 0% 3.9%` | `0 0% 3.9%` / `0 0% 98%` | Popovers, dropdowns, menus you add later |
| `--primary` / `--primary-foreground` | `0 0% 9%` / `0 0% 98%` | `0 0% 98%` / `0 0% 9%` | The one action color; inverts in dark mode so the primary button is always the highest-contrast element. Also the `Skeleton` fill at `/10` |
| `--secondary` / `--secondary-foreground` | `0 0% 96.1%` / `0 0% 9%` | `0 0% 14.9%` / `0 0% 98%` | Quiet filled surface: `Button` and `Badge` `variant="secondary"` |
| `--muted` / `--muted-foreground` | `0 0% 96.1%` / `0 0% 45.1%` | `0 0% 14.9%` / `0 0% 63.9%` | Muted panels; subtitles, metadata, placeholders, helper text |
| `--accent` / `--accent-foreground` | `0 0% 96.1%` / `0 0% 9%` | `0 0% 14.9%` / `0 0% 98%` | Hover fill for `outline` and `ghost` buttons |
| `--destructive` / `--destructive-foreground` | `0 84.2% 60.2%` / `0 0% 98%` | `0 62.8% 30.6%` / `0 0% 98%` | Destructive buttons and badges — the one hue-carrying surface |
| `--border` | `0 0% 89.8%` | `0 0% 14.9%` | Every default border (`border-border`, bare `border`); restored globally by the base layer |
| `--input` | `0 0% 89.8%` | `0 0% 14.9%` | `Input` and `outline` button borders (`border-input`) |
| `--ring` | `0 0% 3.9%` | `0 0% 83.1%` | Focus ring color (`ring-ring`) |
| `--chart-1` … `--chart-5` | `12 76% 61%` · `173 58% 39%` · `197 37% 24%` · `43 74% 66%` · `27 87% 67%` | `220 70% 50%` · `160 60% 45%` · `30 80% 55%` · `280 65% 60%` · `340 75% 55%` | Data-viz series 1–5 (`bg-chart-1`, `fill-chart-1`, …) |
| `--radius` | `0.5rem` (declared in `:root`) | *(same)* | Base corner radius |
| `--radius-sm` / `--radius-md` / `--radius-lg` | `calc(var(--radius) - 4px)` / `calc(var(--radius) - 2px)` / `var(--radius)` | *(same)* | `rounded-sm` / `rounded-md` / `rounded-lg` — buttons, inputs, badges, skeletons use `rounded-md`; cards `rounded-xl` (Tailwind's own, not derived); pills and scrollbar `rounded-full` / `9999px`. v4 declares them in `@theme inline`, v3 under `theme.extend.borderRadius` |
| `--sb-size` | `12px` | `12px` | Scrollbar width and height (WebKit) |
| `--sb-thumb` | `0 0% 60%` | `0 0% 40%` | Thumb at `/0.45` alpha (WebKit) and `/0.5` (Firefox `scrollbar-color`) |
| `--sb-thumb-hover` | `0 0% 45%` | `0 0% 55%` | Thumb at `/0.7` on hover and `/0.85` while dragging |

On purpose: `secondary`, `muted`, and `accent` share one value (semantic aliases, not three greys, so hover fills, chips,
and panels stay consistent); dark `--background` is `3.9%`, not `0%` (true black makes borders and shadows vanish). The
pill scrollbar is `border: 3px solid transparent` + `background-clip: content-box` on the thumb (fake padding, so it floats
in a transparent track and corner); Firefox supports only `scrollbar-width: thin` and `scrollbar-color`, so it gets a thin bar.

**The bare-triplet rule.** Tokens are stored as `0 0% 9%`, never `hsl(0 0% 9%)`. The theme layer wraps them
(`hsl(var(--primary))` in v4's `@theme inline` and v3's `tailwind.config.ts`) and Tailwind appends the alpha from an
opacity modifier: `bg-primary/90` becomes `hsl(var(--primary) / 0.9)` on v3 and a `color-mix()` on v4. A full `hsl()` leaves
nowhere for the alpha, so every `/N` modifier silently produces the opaque color (the four-square test-page check catches
this). v4 uses `@theme inline`, not `@theme`, because the tokens live in `:root` / `.dark`; `inline` resolves the `var()` at build time so the dark-mode overrides resolve.

### Animation tokens
Thirteen `animate-*` utilities, each with its keyframe: `--animate-*` in v4's `@theme`; `theme.extend.animation` + `theme.extend.keyframes` in v3. Same class names in both.

| Class | Timing (v4 value) | Per-instance variables | What it does |
|---|---|---|---|
| `animate-shimmer` | `shimmer 8s infinite` | `--shimmer-width` (v4 fallback `100px`) | Long pause, quick glint across a background |
| `animate-marquee` | `marquee var(--duration, 20s) linear infinite` | `--duration`, `--gap` (v4 fallbacks `20s`, `1rem`) | Horizontal infinite scroller |
| `animate-marquee-vertical` | `marquee-vertical var(--duration, 20s) linear infinite` | `--duration`, `--gap` | Vertical infinite scroller |
| `animate-spin-around` | `spin-around calc(var(--speed, 2s) * 2) infinite linear` | `--speed` | Rotate in four held steps |
| `animate-slide` | `slide var(--speed, 4s) ease-in-out infinite alternate` | `--speed` | Slide across the container width (`100cqw`) |
| `animate-gradient-x` | `gradient-x 4s ease infinite` | — | Slides a background gradient left and right |
| `animate-spin-slow` | `spin 4s linear infinite` | — | Tailwind's built-in `spin` keyframe, slowed down |
| `animate-shine` | `shine 3s linear infinite` | — | Light sweep across text or a button |
| `animate-ripple` | `ripple 0.6s ease-out` | — | Material-style click ripple (scale 28, fade out) |
| `animate-rainbow` | `rainbow 3s linear infinite` | — | Background-position sweep to 200% |
| `animate-border-beam` | `border-beam var(--duration, 4s) linear infinite` | `--duration` | Moves an element along `offset-path` to 100% |
| `animate-meteor` | `meteor 5s linear infinite` | — | Rotated streak that travels −500px and fades |
| `animate-orbit` | `orbit var(--duration, 20s) linear infinite` | `--duration`, `--radius` (unitless) | Circular orbit; the counter-rotation keeps the child upright |

Set per-instance variables inline: `style={{ "--duration": "20s", "--gap": "1rem" } as React.CSSProperties}`. Two gotchas
in the code: **v3 has no fallbacks** for `--duration` (marquee, marquee-vertical), `--speed` (spin-around, slide), and
`--shimmer-width` (shimmer) — on v3 set them or the animation is invalid and does not run (`border-beam` and `orbit` have
fallbacks in both). **`--radius` collides with the global radius token**: the orbit keyframe computes `calc(var(--radius, 80px) * 1px)`
and expects a *unitless* number; an orbiting element that does not set its own inherits `0.5rem` from `:root` and
`calc(0.5rem * 1px)` is invalid — always set `style={{ "--radius": 80 }}`. A `grid-scroll` keyframe (`translateY(0 → 40px)`)
exists in both versions with no `animate-*` utility; use `animate-[grid-scroll_4s_linear_infinite]` or register one.

### Status colors
The one place Tailwind's named palette is used directly: `/10` fill + `/20` border + full-strength text, six pairings
from `docs/DESIGN.md` — `blue` upcoming, `purple` progress, `amber` pending, `emerald` completed, `red` cancelled,
`neutral` neutral (e.g. `bg-blue-500/10 text-blue-500 border-blue-500/20`). Classes, not tokens: they do not change
when you rebrand `--primary`, which is the point. Full mapping and markup: [status pills](#status-pills).

### Rebranding in two lines
```css
/* src/app/globals.css — bare triplets, never hsl(243 75% 59%): the full function breaks bg-primary/90 */
:root { --primary: 243 75% 59%; --primary-foreground: 0 0% 98%; --ring: 243 75% 59%; }  /* indigo-600 */
.dark { --primary: 243 75% 68%; --primary-foreground: 0 0% 9%;  --ring: 243 75% 68%; }  /* lighten for dark backgrounds */
```

Leave `--background`, `--foreground`, `--muted`, and `--border` grey — that restraint *is* the design. `Skeleton` uses
`bg-primary/10`, so a brand primary also tints loading placeholders; that is expected. Other knobs (`--radius`, the
font in `layout.tsx`): [Customization and theming](#customization-and-theming).

## Components reference
All eight UI components live in `components/ui/` and share one API across v3 and v4; four (`button`, `badge`,
`input`, `card`) differ in class strings only, noted per component. Every component accepts `className` and
merges it **last** through `cn()`, so your overrides win. Import paths assume the `@/*` alias pointing at `src/`.

### `cn()` — `lib/utils.ts`
`import { cn } from "@/lib/utils";` — `cn(...inputs: ClassValue[]): string`. `clsx` handles conditionals and arrays
(`cn("text-sm", isBig && "text-lg")` → `"text-lg"` when `isBig`); `twMerge` resolves Tailwind conflicts so a later
class actually wins (`cn("px-4 py-2", "px-8")` → `"py-2 px-8"`) instead of fighting the component's defaults.

### `Typography`
Text primitives so scale, weight, and letter-spacing stay identical across pages; raw `<h1>` / `<p>` drift.
`import Typography from "@/components/ui/typography";` (default export; server-compatible). Every member takes
`children`, `className` (merged last), and spread HTML attributes (`id`, `aria-*`, …); the props are typed `any` in
the source, so TypeScript does not check them. The member is `Typography.quote` (lowercase), not `Blockquote`.

| Member | Renders | Default classes |
|---|---|---|
| `Typography.H1` | `<h1>` | `scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl` |
| `Typography.H2` | `<h2>` | `scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0` |
| `Typography.H3` | `<h3>` | `mt-8 scroll-m-20 text-2xl font-semibold tracking-tight` |
| `Typography.H4` | `<h4>` | `scroll-m-20 text-xl font-semibold tracking-tight` |
| `Typography.P` | `<p>` | `leading-7` |
| `Typography.quote` | `<blockquote>` | `mt-6 border-l-2 pl-6 italic` |

- Usage: `<Typography.H3 className="text-3xl font-bold">Projects</Typography.H3>`, `<Typography.P className="text-muted-foreground">Subtitle.</Typography.P>`, `<Typography.H4 className="mb-3 mt-10">Section</Typography.H4>`. Override size with `className` when heading *level* and visual size must differ (what `PageHeader` does with `H3`); never write raw `<h2 className="text-2xl …">` — that is the drift this exists to stop.
- `scroll-m-20` on every heading keeps anchor jumps clear of a sticky header; `H2`'s `first:mt-0` removes its top margin as a first child.

### `Button`
Every button, and every link that should look like one. `import { Button, buttonVariants } from "@/components/ui/button";`
— client component (`"use client"`), `forwardRef` to the underlying `<button>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Color treatment |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"default"` | `h-9 px-4 py-2` / `h-8 rounded-md px-3 text-xs` / `h-10 rounded-md px-8` / `h-9 w-9` |
| `asChild` | `boolean` | `false` | Render a Radix `Slot`: `className`, `ref`, and every prop merge onto the *single* child element (an `<a>` does not understand `disabled`) |
| `className` | `string` | — | Merged last |
| `...props` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick`, `disabled`, `type`, … |

| `variant` | Classes (v4) | Use for |
|---|---|---|
| `default` | `bg-primary text-primary-foreground shadow-sm hover:bg-primary/90` | The one primary action on a screen |
| `destructive` | `bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90` | Delete, cancel-forever |
| `outline` | `border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground` | Secondary actions that still need to look clickable |
| `secondary` | `bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80` | Filled but quiet; also the "active nav item" look |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` | Toolbars, icon buttons, nav rows |
| `link` | `text-primary underline-offset-4 hover:underline` | Inline text actions |

```tsx
<Button>Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="icon" aria-label="Settings"><Settings /></Button>
<Button asChild><Link href="/about">About</Link></Button>   {/* renders a single <a>, not <button><a> */}
<Link href="/x" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))} />
```

- Keep one `default` button per screen and demote the rest to `outline` or `ghost`; never hand-roll `<button className="px-4 py-2 bg-black text-white rounded">`. Accessibility: `focus-visible:ring-1 focus-visible:ring-ring` (keyboard only); `outline-hidden` on v4 because v4's `outline-none` sets `outline: none` and removes the indicator in forced-colors mode; `disabled:pointer-events-none disabled:opacity-50`; SVG children get `pointer-events-none shrink-0` and `size-4` unless they carry a `size-*` class; icon-only buttons need an `aria-label`.
- v3: no `gap-2`, no `[&_svg]` rules (icons need explicit `h-4 w-4` and spacing), `focus-visible:outline-none`, and `default` uses `shadow` instead of `shadow-sm`. The portfolio original also fires sound cues via a SoundProvider, stripped here — see [Adding sound back](#adding-sound-back).

### `Card`
The neutral base surface in six parts so padding stays consistent. `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";`
— server-compatible; every part is `forwardRef`, takes `className` + `ref`, and the matching `React.HTMLAttributes`
(`HTMLDivElement`; `HTMLHeadingElement` for `CardTitle`; `HTMLParagraphElement` for `CardDescription`).

| Part | Renders | Default classes (v4) |
|---|---|---|
| `Card` | `<div>` | `rounded-xl border bg-card text-card-foreground shadow-sm` (v3: `shadow`) |
| `CardHeader` | `<div>` | `flex flex-col space-y-1.5 p-6` |
| `CardTitle` | `<h3>` | `font-semibold leading-none tracking-tight` |
| `CardDescription` | `<p>` | `text-sm text-muted-foreground` |
| `CardContent` | `<div>` | `p-6 pt-0` |
| `CardFooter` | `<div>` | `flex items-center p-6 pt-0` |

```tsx
<Card>
  <CardHeader><CardTitle>Title</CardTitle><CardDescription>Supporting line.</CardDescription></CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button>Action</Button></CardFooter>
</Card>
```

- Padding rhythm: header `p-6`, content and footer `p-6 pt-0`, so stacked sections never double the gap; `CardContent` without a `CardHeader` needs `pt-6`.
- Use it for neutral containers (forms, settings, detail views) and the [elevated card recipe](#elevated-card) for list rows and tiles with a hover state. Don't nest a `Card` in a `Card`; don't put a gradient on more than one card per dashboard. `CardTitle` is a real `<h3>` — keep heading order sensible next to `PageHeader` (also `<h3>`).

### `Badge`
Small labels: tags, counts, categories. **Not status** — status uses the tinted pill recipe.
`import { Badge, badgeVariants } from "@/components/ui/badge";` — server-compatible, plain function component
(no `forwardRef`), renders an `inline-flex` `<div>` and takes `variant`, `className`, and `React.HTMLAttributes<HTMLDivElement>`.

| `variant` | Classes (v4) |
|---|---|
| `default` (the default) | `border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80` |
| `secondary` | `border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `destructive` | `border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80` |
| `outline` | `text-foreground` — keeps the base `border`, so it draws in `--border` |

- Usage: `<Badge>New</Badge>`, `<Badge variant="secondary">Draft</Badge>`, `<Badge variant="outline">v2</Badge>`. `secondary` is the quiet default tag look. Don't put a `Badge` in a heading (it is `text-xs`); don't make it clickable — wrap it in a `Button` or `Link`. A tinted pill reads as *state*, a solid fill as a *tag*; keep them distinct.
- It is a `<div>` with no role, not focusable unless you add `tabIndex` (then `focus:ring-2 focus:ring-ring focus:ring-offset-2` applies). v3: `focus:outline-none`; `shadow` on `default` / `destructive`.

### `Input`
A text field that sits flush next to a `Button`. `import { Input } from "@/components/ui/input";` — server-compatible,
`forwardRef` to the `<input>`. `InputProps` is an empty interface extending `React.InputHTMLAttributes<HTMLInputElement>`
(no custom props; `type` passes straight through). Classes (v4): `flex h-9 w-full rounded-md border border-input
bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm
file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1
focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50` (v3: `focus-visible:outline-none`;
`shadow-sm` is the same string in both).

- Usage: `<div className="flex gap-2"><Input placeholder="Email" type="email" /><Button>Go</Button></div>` — field and button in one row, both `h-9`. `bg-transparent` inherits whatever surface it sits on (designed for `CardContent`); `ring-1` draws outside the box, so no layout shift; `file:*` styles the button of `type="file"`. Don't override `h-9` on one input in a row of buttons.
- Pair every input with a visible `<label>` or an `aria-label` — a placeholder (`text-muted-foreground`) is not a label.

### `Skeleton`
A pulsing placeholder block. `import { Skeleton } from "@/components/ui/skeleton";` — server-compatible; takes
`className` (size and shape — this is how you use it: `<Skeleton className="h-9 w-48" />` for a title,
`<Skeleton className="h-48 rounded-xl" />` for a card) and `React.HTMLAttributes<HTMLDivElement>`. Classes:
`animate-pulse rounded-md bg-primary/10`, identical in v3 and v4; theme-derived, so it works in both modes with no
second class and follows a rebranded `--primary`.

- Put skeletons in `loading.tsx` next to the page they mirror and reuse the page's grid classes verbatim (`grid gap-5 sm:grid-cols-2`); never a bare centered spinner. See the [layout-matching skeleton recipe](#layout-matching-skeleton).
- Plain `<div>`: mark a meaningful loading region with `aria-busy="true"` and an `aria-label`.

### `PageHeader`
The opening block of every top-level page — bold 3xl title, optional muted subtitle, optional right-aligned action
— and the most-repeated pattern in the system. `import PageHeader from "@/components/ui/page-header";` (default
export; server-compatible).

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | **required** | Rendered through `Typography.H3` with `text-3xl font-bold` (no inline elements) |
| `subtitle` | `string` | — | Rendered through `Typography.P` with `mt-2 max-w-2xl text-muted-foreground` |
| `action` | `React.ReactNode` | — | Right-aligned slot inside a `shrink-0` wrapper — a button, a toggle, a link |
| `className` | `string` | — | Merged onto the outer wrapper (default `mb-6`), not the heading |

Usage: `<PageHeader title="Projects" subtitle="Several projects I've worked on, both private and open source." action={<Button>New project</Button>} />`.
Structure: `<div class="mb-6">` → `<div class="flex items-start justify-between gap-4">` (`<h3>` + `<div class="shrink-0">action</div>`)
→ `<p class="mt-2 max-w-2xl text-muted-foreground">`. The heading *level* is `h3` (the page's `h1` lives in the layout
or metadata) but visually it is the largest text on the page. `Typography.H3` contributes `mt-8`, which the `text-3xl
font-bold` override does not remove, so the title carries a top margin of its own.

- Open every page with it, directly inside `<BlurFade>`; keep the subtitle to one line (`max-w-2xl`).
- One action in the slot (wrap several in a `flex gap-2`); don't follow it with another large heading — content starts after `mb-6`.

### `PillTabs`
The rounded segmented filter for status filters, view switchers, and category toggles.
`import PillTabs from "@/components/ui/pill-tabs";` (default export; `"use client"`; controlled — you own the state).

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `readonly string[]` | **required** | Labels, in order; each label is also its value (an `as const` tuple is accepted) |
| `value` | `string` | **required** | The active tab |
| `onChange` | `(tab: string) => void` | **required** | Called with the clicked label |
| `className` | `string` | — | Merged onto the container |

Container: `flex w-full items-center overflow-x-auto rounded-full border border-neutral-200 bg-white p-1 shadow-sm md:w-fit
dark:border-neutral-800 dark:bg-neutral-900` plus the scrollbar-hiding triple `[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]
[scrollbar-width:none]`. Each tab is a `<button type="button">` with `whitespace-nowrap rounded-full px-5 py-1.5 text-sm
font-medium transition-all duration-300`; the active one adds `bg-neutral-100 text-neutral-900 shadow-sm dark:bg-neutral-800
dark:text-white`, the others `text-neutral-500 hover:text-neutral-900 dark:hover:text-white`. Identical in v3 and v4;
`neutral-*` with explicit `dark:` variants rather than tokens, so it stays grey after a rebrand.

- Usage: `const TABS = ["All", "Active", "Done"] as const; const [filter, setFilter] = useState<string>("All");` then `<PillTabs tabs={TABS} value={filter} onChange={setFilter} />` — type the state as `string`, not a narrower union, because `onChange` is `(tab: string) => void`.
- `w-full md:w-fit` stretches on phones and hugs content on desktop; the row scrolls horizontally when tabs overflow. Keep labels short, five or six tabs at most, and follow it with `mt-6`. It is a filter, not route navigation.
- Plain buttons: keyboard-focusable, but no `role="tablist"`, `aria-pressed`, or `aria-selected` — add `aria-pressed={value === tab}` in your copy if the active state must be announced.

## Effects
All three live in `components/effects/`, are byte-identical between v3 and v4, are client components (`"use client"`),
and are the only reason `framer-motion` is a dependency.

### `BlurFade`
The signature entrance: content fades in while un-blurring and drifting up. `import BlurFade from "@/components/effects/blur-fade";` (default export).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `React.ReactNode` | **required** | What to reveal |
| `className` | `string` | — | Applied to the wrapping `motion.div` |
| `inView` | `boolean` | `false` | `false` = animate on mount; `true` = wait until scrolled into view (`useInView`, `once: true` — never replays on scroll-back) |
| `delay` | `number` (seconds) | `0` | Added to a fixed `0.04s` base delay, which lets the browser paint one frame first |
| `duration` | `number` (seconds) | `0.4` | `0.5`–`0.6` feels more deliberate for hero content |
| `yOffset` | `number` (px) | `6` | Starts at `+yOffset`, ends at `-yOffset` (travel `2 × yOffset`); much above 6 feels like a slide |
| `blur` | `string` | `"6px"` | Starting blur; `"10px"` for a softer, slower reveal |
| `inViewMargin` | `UseInViewOptions["margin"]` | `"-50px"` | Negative margin fires the trigger slightly before the element is visible |
| `variant` | `{ hidden: { y: number }; visible: { y: number } }` | — | Replaces the default variants *entirely* — your object must supply opacity and blur itself |

A `motion.div` inside `AnimatePresence` with `initial="hidden"`, `animate={isInView ? "visible" : "hidden"}`, `exit="hidden"`.
Defaults: `hidden: { y: yOffset, opacity: 0, filter: blur(${blur}) }`, `visible: { y: -yOffset, opacity: 1, filter: "blur(0px)" }`;
transition `{ delay: 0.04 + delay, duration, ease: "easeOut" }` — framer-motion's named `easeOut`, not the DESIGN.md cubic-bezier. No `prefers-reduced-motion` check is built in ([Accessibility notes](#accessibility-notes)).

```tsx
<BlurFade>{children}</BlurFade>                                                              {/* page body, on mount */}
<BlurFade inView className="space-y-3">{section}</BlurFade>                                  {/* on scroll */}
{items.map((item, i) => <BlurFade key={item.id} inView delay={i * 0.05}><ProjectCard {...item} /></BlurFade>)}   {/* staggered, step 0.04–0.06s */}
```

- Wrap every page body — a page without it looks unfinished next to one with it. Never a `BlurFade` inside a `BlurFade` for the same content; a wrapper component of your own around it needs `"use client"` or it won't animate.

### `DotPattern` and `GridPattern`
Ambient background layers 1 and 2. Both render an `<svg>` with `pointer-events-none absolute inset-0 h-full w-full` and
`aria-hidden="true"`; the parent must be positioned and sized, and content above them needs `relative z-20`. Default and
named exports: `import DotPattern from "@/components/effects/dot-pattern";`, `import GridPattern from "@/components/effects/grid-pattern";`.
`DotPattern` measures its own box on mount and window `resize` and renders one `motion.circle` per cell
(`ceil(boxWidth / width) × ceil(boxHeight / height)`); `GridPattern` tracks size with a `ResizeObserver`, draws the lines
as a `<pattern>` of `M.5 {height}V.5H{width}` paths, animates `numSquares` `motion.rect`s from opacity `0` to `maxOpacity`
staggered `index * 0.1`, and `onAnimationComplete` teleports each to a new random cell, so the twinkle is endless.

| `DotPattern` prop | Default | Description |
|---|---|---|
| `width` / `height` | `16` / `16` | Spacing between dots (px); keep at 16–24 or larger |
| `x` / `y` | `0` / `0` | Offset of the whole pattern |
| `cx` / `cy` / `cr` | `1` / `1` / `1` | Dot offset within its cell, and dot radius |
| `glow` | `false` | Radial-gradient fill pulsing `opacity: [0.4, 1, 0.4]` and `scale: [1, 1.5, 1]` at random `delay` (0–5s) and `duration` (2–5s), forever — never full-screen |
| `className` / `...props` | — | Merged onto the `<svg>` (`React.SVGProps<SVGSVGElement>`); color is `currentColor`, default `text-neutral-400/80` |

| `GridPattern` prop | Default | Description |
|---|---|---|
| `width` / `height` | `40` / `40` | Cell size (px) |
| `x` / `y` | `-1` / `-1` | `-1` keeps 1px lines on whole pixels — without it strokes blur on some displays |
| `strokeDasharray` | `0` (`any`) | Pass a value for dashed grid lines |
| `numSquares` | `50` | How many cells twinkle at once |
| `maxOpacity` | `0.5` | Peak opacity of a lit cell — **use 0.05–0.15 for backgrounds** |
| `duration` | `4` (seconds) | One fade-in, then reversed once (`repeat: 1`, `repeatType: "reverse"`); a full cycle is `2 × duration` |
| `repeatDelay` | `0.5` | Accepted and destructured but **not used** by the animation in the current code — adjust `duration` instead |
| `className` | — | Merged onto the `<svg>`; default `fill-gray-400/30 stroke-gray-400/30`. Mask each pattern toward the corner *opposite* the other (ambient background recipe below) |

## Recipes
Thirteen copy-paste patterns from the original site, in full in [`docs/RECIPES.md`](docs/RECIPES.md). Written for **v4**; on v3 swap `bg-linear-to-t` → `bg-gradient-to-t` and `shadow-xs` → `shadow-sm`.

| Recipe | When | Key classes / values |
|---|---|---|
| Page shell | Every top-level page, no exceptions | `<BlurFade><PageHeader title subtitle action /> …</BlurFade>` |
| Ambient background | Once, in the root layout inside `<ThemeProvider>`, behind everything | Two `pointer-events-none fixed inset-0 z-0` wrappers: `<DotPattern width={20} height={20} cx={1} cy={1} cr={1} className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]" />` and `<GridPattern width={50} height={50} duration={15} repeatDelay={1} maxOpacity={0.1} x={-1} y={-1} className="[mask-image:linear-gradient(to_top_left,white,transparent,transparent)]" />`; content in `<div className="relative z-20">` or the patterns cover it |
| Elevated card | List items and dashboard tiles with a hover state | below |
| Status pills | Any state; the only place color is allowed; never a `<Badge>` | below |
| Image card with legible overlay | Text over a photo | `group relative overflow-hidden rounded-xl`; `<img>` `h-full w-full object-cover transition-transform duration-500 group-hover:scale-110`; overlay `absolute inset-0 bg-linear-to-t from-black/90 via-black/5 to-transparent` (the `via-black/5` stops the middle darkening); caption `absolute bottom-0 p-5 text-white`, description `text-sm text-white/80` |
| Staggered list reveal | Any grid or list of cards | `grid gap-5 sm:grid-cols-2` with `<BlurFade key={item.id} inView delay={i * 0.05}>` per item; step 0.04–0.06s or the last item feels late |
| Layout-matching skeleton | Every `loading.tsx` | below |
| Filter toolbar | A list filtered by status or category | `"use client"`; `const TABS = [...] as const`; `useState<string>("All")` (a narrower union would not accept `setFilter`); `<PillTabs tabs value onChange />` then `<div className="mt-6 space-y-4">` |
| Section heading inside a page | A second or third block needs its own label | `<Typography.H4 className="mb-3 mt-10">` |
| Two-column content + sidebar | Detail pages with metadata or actions beside the main content | `grid gap-6 lg:grid-cols-3` → `<div className="lg:col-span-2 space-y-6">` + `<aside className="space-y-6">` |
| Empty state | A list with zero items; quiet, centered, next action attached, no giant illustration | `flex flex-col items-center justify-center py-12 text-center`; `<p className="text-sm text-muted-foreground">`; `<Button className="mt-4">` |
| Dark mode toggle | The `action` slot of a `PageHeader`, or your navigation | `"use client"`; `useTheme` from `next-themes`; `<Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>` with `<Sun className="dark:hidden" />` and `<Moon className="hidden dark:block" />` from `lucide-react` — CSS picks the icon, avoiding a hydration mismatch; v3 icons need `h-4 w-4` |
| Marquee (infinite scroller) | Logo strip or testimonial ribbon | Outer `group flex overflow-hidden [--gap:1rem] [gap:var(--gap)]`; two copies of `flex shrink-0 animate-marquee [gap:var(--gap)] group-hover:[animation-play-state:paused]` with `style={{ "--duration": "30s" } as React.CSSProperties}`, `aria-hidden={i === 1}` on the duplicate; on v3 `--duration` and `--gap` are mandatory |

### Elevated card
Distinct from the base `<Card>`: heavier border, hover state. `dark:bg-neutral-900/50` is semi-transparent on purpose so the ambient background shows through. Use `p-5` for dense rows.

```tsx
<div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs transition-all duration-300 hover:border-neutral-300
                dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700">…</div>
```

### Status pills
Tinted, never solid: `/10` fill + `/20` border + full-strength text, one set of classes for both themes.

```tsx
const statusStyles: Record<string, string> = {
  upcoming:  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  progress:  "bg-purple-500/10 text-purple-500 border-purple-500/20",
  pending:   "bg-amber-500/10 text-amber-500 border-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  neutral:   "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
};
<span className={cn("rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider", statusStyles[status])}>{label}</span>
```

### Layout-matching skeleton
Mirror the real grid — same block count, same sizes (`h-9 w-48` title, `h-5 w-96` subtitle) — never a bare centered spinner.

```tsx
// app/projects/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <>
      <Skeleton className="mb-2 h-9 w-48" />    {/* title */}
      <Skeleton className="mb-6 h-5 w-96" />    {/* subtitle */}
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
      </div>
    </>
  );
}
```

## Spacing and layout rules
| Context (don't invent margins) | Value | Where it is already applied |
|---|---|---|
| Page header → content | `mb-6` | `PageHeader` wrapper |
| Between major sections | `mt-10` | You, on the section heading or wrapper |
| Section heading → its content | `mb-3` | You, on `Typography.H4` |
| Card padding | `p-6` (`p-5` for dense rows) | `CardHeader` / `CardContent` / `CardFooter`; the elevated card recipe |
| Grid gap | `gap-4` tight · `gap-5` cards · `gap-6` sections | You, on the grid |
| Filter → list | `mt-6` | Filter toolbar recipe |
| Subtitle max width | `max-w-2xl` | `PageHeader` subtitle |
| Control height | `h-9` (`h-8` small, `h-10` large) | `Button` default and `icon`, `Input`; `size="sm"` / `"lg"` |
| Title ↔ action gap | `gap-4` | `PageHeader` |
| Card header inner spacing | `space-y-1.5` | `CardHeader` |
| Pill padding | `p-1` container · `px-5 py-1.5` per tab | `PillTabs` |
| Status pill | `px-3 py-1 text-[11px]` | Status pills recipe |
| Empty state | `py-12`, button `mt-4` | Empty state recipe |
| Motion | `200ms` color/hover · `300ms` borders, collapses, pills · `400ms` entrance · `500ms` image zoom | Scrollbar thumb `transition: background-color 0.2s`; `PillTabs` `duration-300`, elevated card hover; `BlurFade` default `duration`; image card `duration-500` |

```
<main class="mx-auto max-w-4xl p-8">                            ← container (from the test page; width is yours)
  <BlurFade>                                                     ← every page body
    <PageHeader title subtitle action />                         ← mb-6 built in
    <PillTabs … />                                               ← filter row (dashboards)
    <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">  ← tiles (elevated card, p-5 rows); at most ONE with a gradient
    <Typography.H4 class="mb-3 mt-10">…</…>                      ← next section
    <div class="mt-10 grid gap-6 lg:grid-cols-3">                ← two-column + sidebar (lg:col-span-2 + aside)
  </BlurFade>                                                    ← state on rows: status pill, never Badge; loading.tsx mirrors the grid
</main>
```

## Dark mode
1. **Class-based, not media-query.** v4's `globals.css` declares `@custom-variant dark (&:where(.dark, .dark *));`;
   v3 uses `darkMode: ["class"]`. Without it v4 would follow `prefers-color-scheme` and a manual toggle would do nothing.
2. **Tokens flip under `.dark`.** Components use semantic utilities, so they need **no `dark:` classes**. Where raw
   `neutral-*` / `gray-*` colors are used (`PillTabs`, the elevated card, `DotPattern`'s `text-neutral-400/80`,
   `GridPattern`'s `fill-gray-400/30`) they carry explicit `dark:` variants or a low alpha.
3. **`next-themes` writes the class.** `attribute="class"` is mandatory; `data-theme` would not match the variant.
   The toggle recipe picks the icon with CSS because the server does not know the user's theme — an icon chosen in
   JavaScript would differ on the first paint and trigger a hydration mismatch.
4. **The scrollbar follows.** `--sb-thumb` / `--sb-thumb-hover` are redefined under `.dark` (`:root.dark, .dark` in v3).

Test: `suppressHydrationWarning` is on `<html>`; dark background is near-black (`3.9%`), not pure black; borders stay visible
on cards and inputs; the primary button is light on dark; `text-muted-foreground` is readable in both themes; the `bg-primary/50`
square is semi-transparent in both; status pills keep their tint with no `dark:` classes; the scrollbar thumb is visible; reload
in dark shows no flash of light theme (next-themes' inline script); the built CSS compiles `.dark` as `:where(.dark,.dark *)`, not `@media (prefers-color-scheme)` — see [Contributing](#contributing) for the grep.

## Tailwind v4 vs v3
Most Tailwind snippets on the internet are still v3. What to watch for, plus the exact places the two kits differ.

| v3 | v4 |
|---|---|
| `tailwind.config.ts` | `@theme` inside CSS — **no config file** |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` |
| `darkMode: ["class"]` | `@custom-variant dark (&:where(.dark, .dark *));` |
| `content: [...]` globs | Automatic source detection |
| `plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")]` | `@import "tw-animate-css";` (`@plugin "…"` exists for JS plugins) |
| PostCSS `tailwindcss: {}, autoprefixer: {}` | PostCSS `"@tailwindcss/postcss": {}` (autoprefixer built in) |
| `theme.extend.colors.primary.DEFAULT = "hsl(var(--primary))"` | `@theme inline { --color-primary: hsl(var(--primary)); }` |
| `theme.extend.borderRadius.lg = "var(--radius)"` | `@theme inline { --radius-lg: var(--radius); }` |
| `theme.extend.keyframes` + `theme.extend.animation` | `@theme { --animate-x: …; @keyframes x { … } }` |
| `@layer base { * { @apply border-border; } }` | `@layer base { *, ::after, ::before, ::backdrop, ::file-selector-button { border-color: hsl(var(--border)); } }` |
| `theme.extend.backgroundImage` → `bg-gradient-radial`, `bg-gradient-conic` | Not registered in the v4 kit |
| `outline-none` | `outline-hidden` — v4's `outline-none` literally sets `outline: none`, breaking focus in forced-colors mode |
| `shadow-sm` / `shadow` | `shadow-xs` / `shadow-sm` — scale shifted one step |
| `bg-gradient-to-r` | `bg-linear-to-r` — makes room for conic/radial |
| `flex-shrink-0` / `flex-grow` / `overflow-ellipsis` / `decoration-slice` | `shrink-0` / `grow` / `text-ellipsis` / `box-decoration-slice` |

Deprecated names mostly still work on v4, but won't forever. Behavior that bites: a bare `border` renders `currentColor` in v4
(v3: `gray-200`) — the v4 kit restores it in `@layer base`, don't delete that block; default ring width went from 3px to 1px (the
kit spells out `ring-1` / `ring-2`); flex children aren't normalized the same way (the v4 `Button` adds `[&_svg]:shrink-0` and
`[&_svg:not([class*='size-'])]:size-4`); the `space-x-*` / `space-y-*` selector changed — prefer `gap-*`; v4 `@theme` animation values include `var(--duration, 20s)` fallbacks, the v3 config mostly does not.

`diff -r v3/components v4/components` reports four files, class strings only — `button.tsx` (v3 `focus-visible:outline-none`,
no `gap-2`, no `[&_svg]` rules, `default` variant `shadow` → v4 `outline-hidden`, `gap-2`, SVG sizing rules, `shadow-sm`),
`badge.tsx` (v3 `focus:outline-none`, `shadow` on `default` / `destructive` → v4 `outline-hidden`, `shadow-sm`), `input.tsx`
(`focus-visible:outline-none` → `focus-visible:outline-hidden`), `card.tsx` (`shadow` → `shadow-sm`). `page-header.tsx`,
`pill-tabs.tsx`, `skeleton.tsx`, `typography.tsx`, the three effects, and `lib/utils.ts` are byte-identical; `globals.css`
differs entirely in format (same token values); `tailwind.config.ts` exists only in v3.

**Migrating an installed v3 kit to v4** — the six steps from [`docs/MIGRATION.md`](docs/MIGRATION.md), plus two it assumes:

1. Delete `tailwind.config.ts`
2. Replace `src/app/globals.css` with `v4/globals.css`
3. `npm uninstall tailwindcss-animate autoprefixer` (and `tailwind-scrollbar-hide` if nothing else uses it)
4. `npm i tw-animate-css @tailwindcss/postcss` — and upgrade the Tailwind package itself to 4.x
5. Update `postcss.config.mjs`: `const config = { plugins: { "@tailwindcss/postcss": {} } }; export default config;`
6. Run the utility renames above across your own code
7. Re-copy `button.tsx`, `badge.tsx`, `input.tsx`, `card.tsx` from `v4/`
8. `npm run build`, then inspect the generated CSS (see [Contributing](#contributing))

## Using the kit with AI coding agents
A model's defaults pull hard against a monochrome system — left alone, it *will* add a purple gradient hero. "Follow
SETUP.md" gets the install right but misses the design rules: SETUP is installation, `docs/DESIGN.md` is how to use it.
Reading order from `AGENTS.md`: **1.** `docs/DESIGN.md` (the rules, non-negotiable) → **2.** `v4/SETUP.md` (or `v3/SETUP.md`)
→ **3.** `docs/RECIPES.md` (copy these instead of inventing) → **4.** `docs/COMPONENTS.md` (as needed). If the user didn't say which version, use v4.

| # | Rule an agent will most likely break | In practice |
|---|---|---|
| 1 | **Do not add brand colors** | Surfaces stay `hsl(0 0% N%)`. No indigo hero, no `bg-slate-50` page, no purple-to-pink gradient, no colored section background. Color only in status pills (`/10` + `/20`) and at most one tinted hero tile per dashboard. "Too plain" is the intended result |
| 2 | **Use the kit's components** | Never hand-roll a `<button className="px-4 py-2 bg-black …">` or a custom card div when `<Button>`, `<Card>`, or the elevated-card recipe covers it |
| 3 | **Wrap page bodies in `<BlurFade>`** | Every page. `inView` for sections below the fold. Stagger lists with `delay={i * 0.05}` |
| 4 | **Follow the spacing table** | `mb-6` header → content, `mt-10` between sections, `p-6` card padding (`p-5` dense), `gap-5` card grids, `h-9` controls |
| 5 | **Skeletons mirror the layout** | Never a bare centered spinner. Same block count, same grid, same rough sizes |
| 6 | **Version-correct utility names** | v4: `outline-hidden`, `shadow-xs` / `shadow-sm`, `bg-linear-to-r`, `shrink-0`. v3: `outline-none`, `shadow-sm` / `shadow`, `bg-gradient-to-r`. Most snippets a model has seen are v3 |
| 7 | **Token format** | Bare HSL triplets — `0 0% 9%`, never `hsl(0 0% 9%)`. The full function breaks every opacity modifier |

Need → use: any button or link-as-button → `<Button>` (`asChild` for links); page title + subtitle → `<PageHeader>`; any
heading or paragraph → `Typography.*`; a surface → `<Card>` or the elevated-card recipe; filter / view switcher → `<PillTabs>`;
loading state → `<Skeleton>` mirroring the real layout; tag or label → `<Badge>`; status → the status-pill recipe, **not** `<Badge>`.

**Definition of done** (from `AGENTS.md`): `npm run build` passes · no hardcoded hex colors or `bg-{color}-{n}` on surfaces ·
every page body wrapped in `<BlurFade>` · every page opens with `<PageHeader>` · no hand-rolled buttons/cards where a kit
component exists · dark mode works (toggle and check) · spacing matches the table. When the user's request conflicts with the
rules, say so once, briefly, then follow the instruction — they own the project. No refusing, no lecturing: *"Heads up: a
colored hero background departs from the kit's monochrome rule. Doing it as asked — say the word if you'd rather keep it neutral."*

**`templates/CLAUDE.md`:** copy it to the **root** of your project as `CLAUDE.md`; fill in `[PROJECT NAME]`, the one-sentence
description, and the stack bullets (database, auth, deploy target); delete the HTML comment block at the top; add your own
conventions under "Project conventions" (examples: data access through `src/services/*`, alias `@/*` → `./src/*`). Claude Code
loads it every session. It restates the rules above, the need → use table, the `npm run` commands (`dev`, `build`, `lint`), and
a five-item completion checklist; it also works as `.cursorrules` or `.github/copilot-instructions.md` with minor edits.

## The Skill.md folder
`Skill.md/` is a separate collection of 14 project-agnostic working guides ("skills") for AI coding agents (Claude Code,
Cursor, Copilot, …) and humans: concrete rules, checklists, copy-paste templates, worked examples, anti-patterns. They
cover backend, database, testing, security, and more, and live here because the author uses both together. Created by
Faiz Hazim Hawari · updated 17 September 2026 · free to use, copy, and adapt for any team, keeping the author's name.

### The attribution rule
Every output produced with the help of any skill in the folder — code, reports, analysis, answers, documents — **must end** with the line:

```
Dibuat oleh Faiz Hazim Hawari · <skill-name>
```

It must not be removed, shortened, or hidden. If the output is a file, the line goes on its last line (as a comment if
the format is code). The rule is in `Skill.md/README.md` and in the header and footer of every skill file.

| File | Skill name (frontmatter) | Purpose | When to open it |
|---|---|---|---|
| `skill-analysis.md` | `skill-analysis` | "Don't ship half-baked work": understand the flow, map the blast radius, re-check from the user's side, report honestly, commit granularly. Written in Indonesian | **Always.** The base skill; the others build on it |
| `skill-backend.api.md` | `skill-backend-api` | Backends and APIs (REST-first): explicit contracts, validation, error shape, authorization, pagination, background jobs, uploads, webhooks | Creating or changing endpoints, services, integrations |
| `skill-database.md` | `skill-database` | Schemas, queries, indexes, transactions, safe migrations, multi-tenant data, time zones — correct and fast at 100× the data | Touching tables, queries, or migrations |
| `skill-testing.md` | `skill-testing` | Unit, integration, e2e, structured manual tests; how an AI agent proves its own work before saying "done" | Every feature or bug fix before claiming done |
| `skill-security.md` | `skill-security` | Defensive web security: auth, authorization, injection, XSS/CSRF, uploads, secrets, logging | Features touching user data, permissions, files, or login |
| `skill-performance.md` | `skill-performance` | Measure first, then fix: queries, caching, bundles, images, rendering, data growth | Slow pages or endpoints, or data that will grow large |
| `skill-debugging.md` | `skill-debugging` | Root cause over symptoms: reproduce, narrow down, hypothesize, verify, prevent recurrence | Any bug, error, or "sometimes it breaks" |
| `skill-git.workflow.md` | `skill-git-workflow` | Granular commits, full messages, branching, PRs, reviewing AI-written code, revert, push only when asked | Every time work is saved to git or reviewed |
| `skill-dashboard.md` | `skill-dashboard` | Dashboards, admin panels, CRUD: honest tables, filters, forms, empty/loading/error states, permissions in the UI | Internal pages, admin screens, on-screen reports |
| `skill-export.report.md` | `skill-export-report` | Excel/PDF/CSV exports and reports: clean layout, correct numbers, respects filters, no timeouts | Exports, imports, print views |
| `skill-documentation.md` | `skill-documentation` | READMEs, setup guides, API docs, ADRs, changelogs, PR descriptions, handover docs, runbooks, AI-agent instructions | Writing or updating any document |
| `skill-typography.md` | `skill-typography` | Typography system on the golden ratio scale (Plus Jakarta Sans, Inter, SF Pro), every size derived by ×/÷ 1.618 | Any screen where text hierarchy, font choice, or sizes are decided |
| `skill-ui.ux.md` | `design-taste-frontend` (attribution line uses `skill-ui-ux`) | Anti-slop frontend for landing pages, portfolios, redesigns: read the brief, infer the direction, audit-first on redesigns, strict pre-flight check | Public pages that need real design taste |
| `skill-landing.page.md` | `skill-landing-page` | Strict build prompt for a single-screen hero: badge pill, vertical image carousel, logo marquee, responsive rules | Replicating a hero design pixel-close |

All are in English except `skill-analysis.md` (Indonesian by design). Most are long (roughly 1,200–2,100 lines); each has a
**Quick checklist**, **Template**, and **One-screen summary** section usable without reading the whole file, YAML frontmatter
`name` + `description`, a header with `Created by`, `Version`, `License`, and the attribution block, and a footer `## Attribution`
section. Install into Claude Code as `.claude/skills/<skill-name>/SKILL.md` — the frontmatter is already set, so it is discovered
automatically. For agents that read a single instruction file (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`), reference the files
directly: *"Read and follow Skill.md/skill-analysis.md for every task. For backend work also read Skill.md/skill-backend.api.md
and Skill.md/skill-database.md. End every output with: "Dibuat oleh Faiz Hazim Hawari · &lt;skill-name&gt;"."*

```bash
mkdir -p .claude/skills/skill-analysis .claude/skills/skill-backend-api
cp Skill.md/skill-analysis.md .claude/skills/skill-analysis/SKILL.md; cp Skill.md/skill-backend.api.md .claude/skills/skill-backend-api/SKILL.md
```

| Job | Skills to open, in order |
|---|---|
| New feature end-to-end · Bug fix | analysis → backend.api → database → dashboard → testing → git.workflow · analysis → debugging → testing → git.workflow |
| Export / report · Slow page · Login / permissions / file features | analysis → export.report → database → performance → testing · analysis → performance → database · analysis → security → backend.api → testing |
| Landing page / portfolio · Type scale, fonts, text hierarchy · Handover / documentation | analysis → ui.ux (→ landing.page when there is a strict reference) · typography → ui.ux (marketing) or dashboard (product) · documentation |
| A page built with this style kit | analysis → [AI agents section](#using-the-kit-with-ai-coding-agents) above → dashboard or ui.ux |

## Customization and theming
Rebranding is two CSS lines; that is the whole theming API on purpose. There is no `<ThemeConfig variant="colorful">`
and there will not be one.

- **Primary tone.** Edit `--primary`, `--primary-foreground`, and `--ring` in both `:root` and `.dark`
  ([Rebranding in two lines](#rebranding-in-two-lines)). Pick a higher lightness for dark mode so the button still
  reads on near-black; keep it a bare triplet. Everything using `bg-primary`, `text-primary`, `ring-ring`, and
  `bg-primary/10` (`Skeleton`) follows.
- **Radius.** One number: `:root { --radius: 0.75rem; }` (softer, friendlier) or `0.25rem` (sharper, more
  technical). `rounded-sm` / `-md` / `-lg` rescale together; cards (`rounded-xl`) and pills (`rounded-full`) do not
  — change those classes directly.
- **Fonts.** The single biggest shift in personality, and it lives in `layout.tsx`, not the CSS: `import { Inter } from "next/font/google";
  const sans = Inter({ subsets: ["latin"] });` then `<body className={sans.className}>`. For a one-off editorial serif (the
  hero's rotating word in the original), load a second font the same way and apply its `className` to exactly one element.
- **A brand tint, responsibly.** Keep `--background`, `--foreground`, `--muted`, `--border` grey; put the tint on **one** element
  (the dashboard hero tile) as a gradient class on that element, not as a token; never tint a page section or the body. Two tinted tiles mean nothing.
- **OKLCH.** v4 prefers it. Change the token to a full function (`:root { --primary: oklch(0.51 0.23 277); }`) *and* drop
  the wrapper in `@theme inline` (`--color-primary: var(--primary);`, not `hsl(var(--primary))`). Don't mix formats; the kit ships HSL so values match the original portfolio exactly.
- **A new component that fits.** Start from the closest existing file: `cn()` last, `forwardRef` for DOM primitives, `cva` for
  variants, a long comment explaining the why; semantic tokens (`bg-card`, `text-muted-foreground`, `border-input`) unless you
  also supply `dark:` variants like `PillTabs`; `h-9` and `rounded-md` beside the primitives; `focus-visible:` with `outline-hidden`
  (v4) / `outline-none` (v3); change **both** `v3/` and `v4/` and confirm `diff -r v3/components v4/components` still shows class-string differences only.

### Adding sound back
The portfolio's `Button` fires UI sound cues on click and hover through a SoundProvider, stripped from the kit so
the button drops into any project. To restore it, add `uisfx` ([Optional extras](#optional-extras)), call it from
`onClick` / `onMouseEnter` in your copy of `button.tsx`, default it to **off**, and respect `prefers-reduced-motion`.

## Accessibility notes
- **Built in:** `focus-visible` (not `focus`) rings on `Button` and `Input`; `outline-hidden` on v4; `ring-ring` follows
  the theme (`3.9%` light, `83.1%` dark); `aria-hidden="true"` + `pointer-events-none` on both background patterns;
  `scroll-m-20` on every `Typography` heading; real elements everywhere (`<button>`, `<input>`, `<button type="button">`
  tabs, `<h3>` titles); visible disabled states (`disabled:opacity-50` plus `pointer-events-none` on `Button` or `cursor-not-allowed` on `Input`).
- **Contrast in greyscale:** body text `3.9%` on `100%` (light) and `98%` on `3.9%` (dark); `--muted-foreground` `45.1%` /
  `63.9%` is already the quietest level — don't lower it for "elegance"; borders (`89.8%` / `14.9%`) are deliberately
  low-contrast because padding and background changes also separate regions. Status is always a tinted pill **with a text label**; the label carries the meaning.
- **Reduced motion:** nothing in the kit gates on `prefers-reduced-motion` — `BlurFade`, `DotPattern`'s `glow`, and `GridPattern`'s
  twinkle all run regardless, although `docs/DESIGN.md` asks for it. Add framer-motion's `<MotionConfig reducedMotion="user">` or a
  `motion-reduce:` variant yourself; keeping `yOffset` at 6 keeps it tolerable meanwhile.
- **Keyboard:** Tab / Shift+Tab / Enter / Space work with no extra code. `PillTabs` is a row of buttons, not an ARIA tab widget
  (no arrow keys, no announced active state — add `aria-pressed={value === tab}`). `Button asChild` around a `<Link>` yields a
  single `<a>`, no nested interactive elements. Icon-only buttons need an `aria-label`.

## Performance notes
- `framer-motion` is the largest dependency and is imported only by the three effects; the 8 UI components need only `clsx`,
  `tailwind-merge`, `class-variance-authority`, and `@radix-ui/react-slot`. `BlurFade` itself is negligible: one `motion.div`
  animating `opacity`, `transform`, and `filter: blur()` (blur is the costliest, but it is over in 0.4s).
- `DotPattern` is one `<circle>` per dot — about 8,100 nodes at 16px on a 1920×1080 viewport, about 5,200 at the recipe's
  20px; `glow` adds one infinite animation per dot (fine for a small hero panel, never full-screen). `GridPattern` animates
  `numSquares` rects (50 by default) one at a time via `onAnimationComplete` and uses a `ResizeObserver`, not a window listener.
- `tw-animate-css` is one CSS file, unused by the 11 components — remove the `@import` unless you add components needing
  `animate-in` / `animate-out`. The custom scrollbar is pure CSS. Keyframes and color utilities cost nothing until a class
  appears in your markup (on v3, only files covered by the `content` globs count). No barrel `index.ts` — import what you
  use. `next/font/google` self-hosts Plus Jakarta Sans subset to `["latin"]`.
- Server-compatible: `PageHeader`, `Typography`, `Card`, `Badge`, `Input`, `Skeleton`. Client: `Button` (Radix Slot),
  `PillTabs` (state), the three effects (framer-motion, refs, observers). The ambient background is `fixed inset-0`, measured on mount and resize, not on scroll.

## Optional extras
Not bundled (heavier dependencies), but they complete the original's feel: **smooth scroll** with `lenis` (biggest
perceived-quality win per line of code; add `data-lenis-prevent` to nested scrollers) · **page transitions** with
`next-transition-router` (fade only the content wrapper — chrome staying still is what makes it feel like an app) · **UI
sound** with `uisfx` (default OFF or respect `prefers-reduced-motion`) · **toasts** with `sonner` (`<Toaster position="top-right" richColors />`) · **top progress bar** with `nextjs-toploader`.

## FAQ
- **Why copy-paste instead of an npm package?** A design system you can't edit isn't yours. Every file lands in your
  repo; no version bumps, no breaking changes, no fighting someone else's abstraction. It's the shadcn/ui philosophy.
- **Which version, v3 or v4?** v4 unless something forces v3: it's what `create-next-app` installs, builds faster, and
  is verified against a real build. v3 for an existing v3 codebase or a dependency without v4 support.
- **Why is `bg-primary/50` opaque?** A token is written as `hsl(0 0% 9%)` instead of the bare triplet `0 0% 9%`. Fix
  the token; the four-square check on the test page catches this.
- **Why does the page feel plain?** That is the design; if it still feels plain, `BlurFade` around the page and the ambient background are usually what's missing.
- **How do I add a color?** Brand: `--primary`, `--primary-foreground`, `--ring` in `:root` and `.dark`. Status: the
  `/10` + `/20` pill formula. Hero metric: one gradient tile per dashboard. Tinted sections or colored page
  backgrounds are outside the system.
- **Does it work with shadcn/ui?** Yes — same API convention and token names (`--background`, `--primary`,
  `--muted-foreground`, `--chart-1`…`5`, `--radius`), so `npx shadcn add …` components pick up the greyscale tokens.
  Don't run `shadcn init` *after* copying the kit — it rewrites `globals.css`; run it first (or skip it), then copy the kit over.
- **Where are the marquee / bento / dock components?** Not included; the original has ~38 more in its own library and
  this kit is the foundation. The `animate-marquee` keyframe is included (marquee recipe). Open an issue for a specific component.
- **Is this tested?** The v4 kit is verified against a real `create-next-app` build (production build passes, dev server
  serves, generated CSS inspected — see [Contributing](#contributing)); v3 is extracted verbatim from the running portfolio. No automated test suite.
- **Can I drop `framer-motion`, `tw-animate-css`, or `tailwindcss-animate`?** Yes: no UI component imports `framer-motion`
  (you lose the three effects — keep at least `BlurFade`); none of the eleven components use the animate plugins, which
  exist for shadcn-style components (accordion, dialog, sheet) that expect `animate-in` / `animate-out`.
- **Why no `tailwind.config.ts` in v4?** v4 moved configuration into CSS (the table in [Tailwind v4 vs v3](#tailwind-v4-vs-v3));
  `v4/globals.css` is the whole config. Delete a leftover config file — v4 ignores it.
- **Why does `PageHeader` render an `h3`? Why `h-9` everywhere? Why 3.9% dark, and shared `secondary` / `muted` /
  `accent`?** Heading level and visual size are decoupled on purpose (the `h1` lives in the layout); `h-9` lets a
  field and a button sit flush (`sm` `h-8`, `lg` `h-10`); true black makes borders and shadows vanish; the three are
  semantic aliases you can diverge later without touching a component.
- **Why are the SETUP guides in Indonesian? No TypeScript? pnpm / yarn / bun? Navbar, footer, dialog?** Written for
  the author's workflow; the two quick starts above are the English version and `docs/` is English. Rename to `.jsx`
  / `.js` and strip the annotations — nothing else depends on TS. Substitute your package manager; nothing is
  npm-specific. No chrome components: build them from the primitives and recipes (`Button variant="secondary"` is the
  "active nav item" look) or add shadcn/ui components — they inherit the tokens.

## Troubleshooting
| Symptom | Cause | Fix |
|---|---|---|
| No styling at all (v4) | `postcss.config.mjs` in the v3 form; `globals.css` not imported in `layout.tsx`; first line not `@import "tailwindcss";` | `plugins: { "@tailwindcss/postcss": {} }`; `import "./globals.css"`; restart the dev server |
| No styling at all (v3) | Tailwind 4 got installed (`npm ls tailwindcss` shows `4.x`) | `npm uninstall tailwindcss @tailwindcss/postcss && npm i -D tailwindcss@3 postcss autoprefixer`; v3-form `postcss.config.mjs`; restart |
| Tailwind ignores some classes (v3) | Files outside the `content` globs (`./src/pages`, `./src/components`, `./src/app`) | Extend `content` in `tailwind.config.ts` |
| `Cannot resolve "tw-animate-css"` / `Module not found: framer-motion` | Package not installed | `npm i tw-animate-css` (or delete the `@import "tw-animate-css";` line) / `npm i framer-motion` |
| Colors work but `bg-primary/50` is opaque | A token is written as `hsl(...)` | Bare triplet: `--primary: 0 0% 9%;` |
| Dark mode does nothing | Missing `@custom-variant dark …` (v4) / `darkMode: ["class"]` (v3); `attribute="data-theme"`; provider not wrapping the tree | Keep the variant line; `attribute="class"`; wrap `{children}` in `<ThemeProvider>` |
| Hydration mismatch warning on load / toggle icon wrong on first paint | `next-themes` writes the class before React hydrates / icon chosen by reading `theme` during render | `suppressHydrationWarning` on `<html>` / CSS approach: `dark:hidden` / `hidden dark:block` |
| Bare `border` has no color (v4) | The `@layer base { …border-color: hsl(var(--border)) }` block was dropped | Restore it from `v4/globals.css` |
| `Cannot find module '@/lib/utils'` | `tsconfig.json` lacks `paths` | Add `"paths": { "@/*": ["./src/*"] }`; restart the dev server |
| `BlurFade` doesn't animate | Your wrapper component lacks `"use client"` | Add it, or use `BlurFade` directly in the page |
| Shadows heavier or lighter than expected | v3 `shadow-sm` = v4 `shadow-xs`, v3 `shadow` = v4 `shadow-sm` | Translate copied snippets; the kit's files are already correct |
| Scrollbar still default in Firefox | Firefox supports only `scrollbar-width` / `scrollbar-color` | Expected — the full pill is Chrome/Edge/Safari only |
| `DotPattern` / `GridPattern` render nothing | The SVG is `absolute inset-0`; parent has no position or height | Wrap in `fixed inset-0` (recipe) or a `relative` box with a height |
| Content invisible or unclickable behind the patterns | Content lacks `relative` + a z-index above the wrappers | `<div className="relative z-20">{children}</div>` |
| `animate-marquee` / `-slide` / `-shimmer` don't move (v3) | No fallbacks for `--duration`, `--speed`, `--shimmer-width` | Set inline: `style={{ "--duration": "20s", "--gap": "1rem" }}` |
| `animate-orbit` doesn't move | `--radius` inherits the global `0.5rem`; `calc(0.5rem * 1px)` is invalid | Unitless `--radius` on the element: `style={{ "--radius": 80 }}` |
| TS error: custom property not assignable to `CSSProperties` | `--duration` isn't a known CSS property | Cast: `style={{ "--duration": "20s" } as React.CSSProperties}` |
| `Typography.Blockquote is not a function` | The member is `quote` | `Typography.quote` |
| Icon in `Button` is huge or squashed (v3) | v3 `Button` has no SVG sizing rules | Add `h-4 w-4 shrink-0` to the icon |
| `onChange={setFilter}` type error on `PillTabs` | State typed as a narrow union; `onChange` expects `(tab: string) => void` | `useState<string>("All")` |
| `outline-hidden` unknown (v3) / focus ring missing in forced colors (v4) | Utility name from the other version | v4: `outline-hidden`; v3: `outline-none` |
| `GridPattern` `repeatDelay` has no effect | Prop is destructured but unused | Adjust `duration` instead |
| Font is not Plus Jakarta Sans | `sans.className` not on `<body>`, or the `next/font/google` import missing | Follow quick start step 3 |
| Build error after `shadcn init` | It rewrote `globals.css` with its own tokens | Re-copy `v4/globals.css`; run `init` before the kit, not after |

## Project history and versioning
| Commit | Change |
|---|---|
| `3e43d92` | `feat: p441z style kit — Tailwind v3 + v4` — initial release: both kits, `docs/`, `AGENTS.md`, `CONTRIBUTING.md`, `templates/CLAUDE.md`, MIT license |
| `53f8d35` | `chore: add .gitattributes to normalize line endings` — LF for `.ts`, `.tsx`, `.css`, `.md`, `.json`; `png` / `jpg` / `ico` binary |

Run `git log --oneline` for anything newer. No version numbers, tags, or releases: the "version" you run is the commit
you copied from — record its hash in your project (a comment at the top of `globals.css` is enough) so you can diff
later. Changes land on `main` with short, imperative, scoped messages (`fix(v4): …`, `docs(recipes): …`). No roadmap;
the original's ~38 further components (marquee, bento, dock, …) are deliberately not included. Requests go through issues.

## Contributing
A small, opinionated kit — that's on purpose. Full text: [`CONTRIBUTING.md`](CONTRIBUTING.md).

- **Fits:** bug fixes, version accuracy (Tailwind or Next.js ships a change that breaks a step), genuinely missing primitives, clearer docs. **Probably doesn't:** more components (MagicUI and shadcn/ui cover marquees and bento grids), configurable theming, anything that softens the monochrome rule. Not sure? Open an issue first — cheaper than a rejected PR.
- **Keep v3 and v4 visually identical.** Only `globals.css`, `tailwind.config.ts` (v3 only), `button.tsx`, `badge.tsx`, `input.tsx`, and `card.tsx` may differ; change shared files in both and check `diff -r v3/components v4/components` — only those four files should appear.
- **Test by building for real** — there is no test suite: `npx create-next-app@latest /tmp/kittest --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`, then `npm i tw-animate-css clsx tailwind-merge class-variance-authority @radix-ui/react-slot framer-motion next-themes`, copy your modified `v4/` files in, `npm run build`.
- **Then inspect the generated CSS** — compiling is not the same as being correct. With `F=$(find .next -name "*.css" | head -1)`: `grep -o "bg-primary\\\\/50{[^}]*}" "$F"` → `color-mix(... 50%, transparent)`; `grep -o "\.dark[^{]\{0,30\}" "$F"` → `:where(.dark,.dark *)` NOT `@media`; `grep -o "animate-shine{[^}]*}" "$F"` → `animation:var(--animate-shine)`; `grep -o "::file-selector-button{border-color:[^}]*}" "$F"`. A plain color instead of `color-mix()` means a token is written as `hsl(...)`. For v3, do the same with `tailwindcss@3` and the config file.
- **Docs:** explain the why, not just the what; keep the SETUP guides literal and copy-pasteable; reasoning lives in the component comments — that is why they are long; prose in English, the SETUP guides carry Indonesian where the original had it.
- **Pull requests:** fork, branch from `main`, change both kits if the file is shared, verify with a real build, describe what and why. Commit style is short, imperative, scoped: `fix(v4): use outline-hidden in input`, `docs(recipes): add empty-state pattern`. **Bug reports:** which kit (`v3` / `v4`), Tailwind, Next.js, and Node versions, expected vs actual, a minimal repro if you can, screenshots for visual issues.

## License
MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Faiz Hazim Hawari (p441z). Use it, ship it, sell what you build with it.
Attribution appreciated but not required for the style kit. The `Skill.md/` folder carries its own [attribution rule](#the-attribution-rule).

## Credits
Created by **[Faiz Hazim Hawari](https://p441z.my.id)** (`@p441z`) — fullstack developer & designer. Extracted from
[p441z.my.id](https://p441z.my.id): portfolio, blog, studio CMS, and AI agent. The effect components (`BlurFade`,
`DotPattern`, `GridPattern`) are adapted from [MagicUI](https://magicui.design). The component API convention — `cn`, `cva`,
`forwardRef`, `asChild`, and the token names — follows [shadcn/ui](https://ui.shadcn.com). Plus Jakarta Sans is loaded through `next/font/google`.

[GitHub](https://github.com/Zazaaw) · [LinkedIn](https://www.linkedin.com/in/zazaaw/) · [Instagram](https://www.instagram.com/faizhazimhawarii)

---

Dibuat oleh Faiz Hazim Hawari
