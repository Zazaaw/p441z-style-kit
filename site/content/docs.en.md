## Before you start

The kit is plain React components and one CSS theme. You need:

| What | Version | Check with |
|---|---|---|
| Node.js | 20 or newer | `node -v` |
| React | 19 | `npm ls react` |
| Tailwind CSS | **v4** | `npm ls tailwindcss` |
| A framework | Next.js 15/16 (App Router) is what it's tested on. Vite and Remix work too, just skip the Next-only bits. | |
| TypeScript | Recommended. Every file is `.tsx`. | |

Still on Tailwind v3? The repo has a `v3/` folder with the core components, but no registry or motion pieces. Copy those by hand (Route 4).

## Pick your route

| You want… | Take | Time |
|---|---|---|
| A new project with everything: theme, all components, springs | [Route 1: one command](#route-1-the-whole-kit-in-one-command) | ~5 min |
| A few pieces in an app you already have | [Route 2: pick components](#route-2-just-the-components-you-need) | ~1 min each |
| The design skills for Claude Code or another AI agent | [Route 3: skills](#route-3-skills-for-your-ai-agent) | ~1 min |
| No CLI, every file under your control | [Route 4: copy by hand](#route-4-copy-the-files-by-hand) | ~10 min |

You can mix them. Most people take Route 1 or 2 for the code and Route 3 for the skills.

## Route 1: the whole kit in one command

### 1. Create the project

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-app
```

### 2. Set up shadcn

The kit installs through the [shadcn CLI](https://ui.shadcn.com/docs/cli). It copies files into your project; there is no package to depend on.

```bash
npx shadcn@latest init
```

Pick any base color. The kit replaces the palette in the next step. This creates `components.json` and `src/lib/utils.ts`, and adds the token block to `src/app/globals.css`.

### 3. Add the kit

```bash
npx shadcn@latest add https://style.p441z.my.id/r/style-kit.json
```

That one command:

- writes every component into your project: `src/components/ui`, `effects`, `motion` and `mac`
- adds `src/lib/motion.ts` (curves and springs) and `src/lib/use-hydrated.ts`
- installs what they import: `framer-motion`, `class-variance-authority`, `@radix-ui/react-slot`, `tw-animate-css` and friends
- writes the theme into `globals.css`: the greyscale tokens for light and dark, radius, every animation and keyframe, the spring curves, and the pill scrollbar

If the CLI asks whether to overwrite something, say yes. It's a fresh project.

### 4. Check that it works

Replace `src/app/page.tsx`:

```tsx
import CopyButton from "@/components/ui/copy-button";
import GlassPanel, { GlassBackdrop } from "@/components/effects/glass-panel";
import CountUp from "@/components/motion/count-up";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative mx-auto grid min-h-screen max-w-3xl place-items-center p-8">
      <GlassBackdrop />
      <GlassPanel className="w-full p-8">
        <p className="text-sm text-muted-foreground">Components installed</p>
        <div className="mt-1 text-6xl font-extrabold tracking-tight">
          <CountUp to={38} />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button>Press me</Button>
          <Button variant="outline">And me</Button>
          <CopyButton value="npx shadcn@latest add https://style.p441z.my.id/r/style-kit.json" label="Copy" />
        </div>
      </GlassPanel>
    </main>
  );
}
```

```bash
npm run dev
```

Open http://localhost:3000. It worked if:

- [ ] the glass card rises into place and lands with a small bounce
- [ ] the number counts up to 38, then bumps once
- [ ] the buttons squish when you press them and spring back
- [ ] **Copy** turns into a check that draws itself, and the label rolls to "Copied"
- [ ] the card tilts a little toward your pointer

## Route 2: just the components you need

Every component installs on its own. The command is on its page, under [Components](/components):

```bash
npx shadcn@latest add https://style.p441z.my.id/r/glass-panel.json
```

Whatever it imports comes along. `copy-button` brings `swap` and `lib/motion.ts`, for example. Install several at once by listing them.

### Shorter commands with a namespace

Add the registry to `components.json` once:

```json
{
  "registries": {
    "@p441z": "https://style.p441z.my.id/r/{name}.json"
  }
}
```

After that, any component is just its name:

```bash
npx shadcn@latest add @p441z/glass-panel @p441z/copy-button @p441z/stack-card
```

### Your theme stays yours

Adding single components leaves your color tokens alone. The components only use the standard shadcn names (`background`, `foreground`, `primary`, `muted`, `border`, `ring`…), so they pick up your brand.

What they do borrow from the kit's theme is motion: the `ease-spring` curve and the `animate-drop-in`, `animate-pop-in` and `animate-launch` animations. Without them everything still works, it just lands flatter. To get the bounce without taking the kit's palette, paste this into the `@theme` block of your `globals.css`:

```css
@theme {
  --ease-spring: cubic-bezier(.34, 1.36, .5, 1);
  --ease-reveal: cubic-bezier(.22, 1, .36, 1);
  --ease-toggle: cubic-bezier(.4, 0, .2, 1);
  --animate-drop-in: drop-in .75s var(--ease-spring) both;
  --animate-pop-in: pop-in .5s var(--ease-spring) both;
  --animate-launch: launch .9s var(--ease-reveal);

  @keyframes drop-in {
    0%   { translate: 0 -24px; rotate: -2deg; opacity: 0; }
    70%  { translate: 0 3px; rotate: .4deg; opacity: 1; }
    100% { translate: 0 0; rotate: 0deg; opacity: 1; }
  }
  @keyframes pop-in {
    0%   { scale: .4; opacity: 0; }
    60%  { scale: 1.12; opacity: 1; }
    100% { scale: 1; opacity: 1; }
  }
  @keyframes launch {
    0%, 100% { translate: 0 0; }
    25%      { translate: 0 -38%; }
    50%      { translate: 0 0; }
    70%      { translate: 0 -16%; }
    85%      { translate: 0 0; }
  }
}
```

Want the whole theme after all? `npx shadcn@latest add https://style.p441z.my.id/r/theme.json`. Heads up: this one **replaces** your color tokens with the kit's greyscale palette.

## Route 3: skills for your AI agent

The skills are design playbooks in Markdown: typography, landing pages, dashboards, dark mode, motion video and more. An agent reads one before it builds, so the result follows the rules instead of the usual defaults. Browse them on the [home page](/#skills).

### Claude Code: all 16 as a plugin

Run these inside Claude Code:

```text
/plugin marketplace add Zazaaw/p441z-style-kit
/plugin install p441z-skills@p441z
```

The first line adds the marketplace (once per machine), the second installs the skills. Manage or update them later from the `/plugin` menu.

### Claude Code: one skill, one project

Each skill page has its own command. For example, typography:

```bash
mkdir -p .claude/skills/skill-typography && curl -fsSL https://raw.githubusercontent.com/Zazaaw/p441z-style-kit/main/Skill.md/skill-typography.md -o .claude/skills/skill-typography/SKILL.md
```

Put it in `~/.claude/skills/` instead of `.claude/skills/` to have it in every project.

### Using them

Ask the way you normally would: *"build the pricing section"*, *"add dark mode"*. Claude Code picks the skill whose description fits. To be sure, name it: *"use skill-typography for the headings"*.

### Other agents

The skills are plain Markdown, so any agent that reads instruction files can use them. Save the file where yours looks: `AGENTS.md`, `.cursor/rules/`, `.github/copilot-instructions.md` and so on. The repo also has a starter [`templates/CLAUDE.md`](https://github.com/Zazaaw/p441z-style-kit/blob/main/templates/CLAUDE.md) for project instructions.

## Route 4: copy the files by hand

### 1. Get the kit

```bash
npx degit Zazaaw/p441z-style-kit/v4 kit-v4
```

That downloads just the `v4/` folder: `globals.css`, `lib/`, `components/` and a detailed `SETUP.md`.

### 2. Install the dependencies

```bash
npm i clsx tailwind-merge class-variance-authority @radix-ui/react-slot framer-motion tw-animate-css
```

`framer-motion` is only needed for `motion/`, `mac/` and a few effects. Skip it if you take the UI components alone.

### 3. Copy the files

| From `kit-v4/` | To your project |
|---|---|
| `globals.css` | `src/app/globals.css` (replace it) |
| `lib/*` | `src/lib/` |
| `components/*` | `src/components/` |

Tailwind v4 needs no `tailwind.config` file. Everything lives in `globals.css`. Delete the old config if there is one.

### 4. Check the import alias

Every file imports with `@/`. In `tsconfig.json`:

```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

Restart the dev server after changing it.

**One difference from the CLI route:** hand-copied tokens are bare HSL triplets (`--primary: 0 0% 9%;`), not full colors. Keep them that way, as the [brand color](#make-it-yours-brand-color) section explains.

## Fonts

The components inherit whatever font your page uses. The look on this site comes from three families:

| Role | Font | Tailwind |
|---|---|---|
| UI and headings | Plus Jakarta Sans | `font-sans`, `font-display` |
| The one editorial accent word | Instrument Serif, italic | `font-serif` |
| Code, IDs, data | JetBrains Mono | `font-mono` |

With `next/font` in `src/app/layout.tsx`:

```tsx
import { Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-instrument" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

// <html className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
```

Then map them in `globals.css`:

```css
@theme inline {
  --font-sans: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-jakarta), ui-sans-serif, sans-serif;
  --font-serif: var(--font-instrument), ui-serif, Georgia, serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;
}
```

## Make it yours: brand color

The palette is greyscale on purpose. Rebrand by changing **three tokens only**: `--primary`, `--primary-foreground` and `--ring`, in light and dark. Leave `--background`, `--foreground`, `--muted` and `--border` grey; that restraint is what keeps the design calm.

The format depends on how you installed:

```css
/* Installed with the CLI (Route 1 or 2): full colors */
:root { --primary: hsl(243 75% 59%); --primary-foreground: hsl(0 0% 100%); --ring: hsl(243 75% 59%); }
.dark { --primary: hsl(243 75% 68%); --primary-foreground: hsl(0 0% 9%); --ring: hsl(243 75% 68%); }

/* Copied by hand (Route 4): bare triplets, no hsl() */
:root { --primary: 243 75% 59%; --primary-foreground: 0 0% 100%; --ring: 243 75% 59%; }
.dark { --primary: 243 75% 68%; --primary-foreground: 0 0% 9%; --ring: 243 75% 68%; }
```

Glows, glass rims, the spotlight and the beam all tint from `--primary`, so they follow. Check that text on your primary passes contrast (4.5:1). Try the accent dots in this site's menu bar to see one token restyle every page.

## Dark mode

Every token has a dark value under `.dark`. Switch the class with [next-themes](https://github.com/pacocoursey/next-themes):

```bash
npm i next-themes
```

```tsx
// src/app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` is required: next-themes writes the class before React hydrates. For the smooth crossfade this site uses (View Transitions, a fallback, reduced motion), follow [skill-darkmode](/skills/darkmode).

## Motion and springs

- Components in `motion/` and `mac/` need `framer-motion`. Everything else is CSS.
- Every animation respects **reduced motion**: it shows the end state or simply holds still.
- Things that *appear* use calm curves (`EASE.reveal`). Things that *move into place* use a spring that overshoots a little and settles: `ease-spring` in CSS, `SPRING.press | slide | pop | drop` for framer-motion.

Borrow the springs for your own UI:

```tsx
import { PRESS } from "@/components/ui/copy-button";
import { SPRING } from "@/lib/motion";

<button className={`rounded-full px-5 py-2 ${PRESS}`}>Squishes when pressed</button>
<motion.div layoutId="pill" transition={SPRING.slide} />
<GlassPanel press><a href="/docs" className="block p-6">A card that is a link</a></GlassPanel>
```

The five rules behind them (overshoot only transforms, fast press and springy release, layers 40 ms apart, a physical object, still when off screen) are in [DESIGN.md](https://github.com/Zazaaw/p441z-style-kit/blob/main/docs/DESIGN.md#springs--micro-interactions).

## Glass needs something behind it

`GlassPanel`, `StackCard` and `PocketCard` frost whatever sits behind them. Over a flat page, glass reads as a plain card. Give it color:

```tsx
<section className="relative">
  <GlassBackdrop />            {/* soft pools of your primary, costs nothing to scroll */}
  <GlassPanel className="p-6">…</GlassPanel>
</section>
```

`Aurora`, a photo or a busy pattern work too. Blur is the expensive part, so keep a screen to a dozen glass panels or so, and don't add `saturate()` to the filter: on Retina screens it is what costs the frames.

## Updating

The files are yours, so nothing updates by itself. To pull a newer version of a component, run its `add` command again. The CLI asks before it overwrites a file you've changed; `--overwrite` skips the question. Commit first, then read the diff: keep your edits, take the fixes.

## Troubleshooting

**Components show up without styles.**
Tailwind v4 skips files listed in `.gitignore` when it scans for classes. If your components live somewhere ignored, or outside `src/`, register the folder in `globals.css`: `@source "../components";`. Also check that `globals.css` is imported in your root layout.

**`ease-spring` or `animate-pop-in` does nothing.**
The kit theme isn't in your `globals.css`. Add `theme.json`, or paste the springs block from [Route 2](#your-theme-stays-yours).

**`bg-primary/50` isn't transparent, or colors look wrong.**
Your tokens and the color mapping disagree. CLI installs use full colors (`hsl(…)`), hand copies use bare triplets with `hsl(var(--primary))` in `@theme inline`. Don't mix the two.

**`Cannot find module '@/lib/utils'`.**
Run `npx shadcn@latest init`, or add the `@/*` path alias to `tsconfig.json` and restart the dev server.

**`Module not found: framer-motion`.**
`npm i framer-motion`.

**Hydration warning on `<html>`.**
Add `suppressHydrationWarning` to the `<html>` tag (next-themes changes its class before hydration).

**Dark mode doesn't switch.**
Use `attribute="class"` on the ThemeProvider, and keep the `@custom-variant dark` line from the kit's `globals.css`.

**Glass looks flat.**
There's nothing colorful behind it. Add a `GlassBackdrop`.

**Scrolling stutters on a page full of glass.**
Fewer blurred surfaces on screen at once, and no `saturate()`.

## Where next

- [Components](/components): every piece with a live demo, its command, usage and full source
- [Skills](/#skills): the design playbooks, with before/after examples
- [DESIGN.md](https://github.com/Zazaaw/p441z-style-kit/blob/main/docs/DESIGN.md): why the kit looks and moves the way it does
- [RECIPES.md](https://github.com/Zazaaw/p441z-style-kit/blob/main/docs/RECIPES.md): ready-made page patterns
- Stuck? [Open an issue](https://github.com/Zazaaw/p441z-style-kit/issues) on GitHub
