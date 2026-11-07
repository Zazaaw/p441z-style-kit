# Component Reference

> Every component below also has a page with a live preview, the install command, usage, and its source: **[style.p441z.my.id/components](https://style.p441z.my.id/components)**.

Thirty-five components — 8 UI, 8 effects, 12 motion, 7 desktop (the new effects, motion, and desktop are v4 only). Props, variants, and when to reach for each.

---

## `cn()` — `lib/utils.ts`

```ts
cn("px-4 py-2", "px-8")            // → "py-2 px-8"   (conflict resolved)
cn("text-sm", isBig && "text-lg")  // → "text-lg"      when isBig
```

`clsx` handles conditionals; `twMerge` resolves Tailwind conflicts so a later
class actually wins. Every component pipes its incoming `className` through
`cn()` **last**, which is why overrides always work.

---

## UI

### `Typography`

Namespace of text primitives. Prevents scale drift across pages.

| Export | Renders | Classes |
|---|---|---|
| `Typography.H1` | `<h1>` | `text-4xl font-extrabold tracking-tight lg:text-5xl` |
| `Typography.H2` | `<h2>` | `text-3xl font-semibold` + bottom border |
| `Typography.H3` | `<h3>` | `mt-8 text-2xl font-semibold` |
| `Typography.H4` | `<h4>` | `text-xl font-semibold` |
| `Typography.P` | `<p>` | `leading-7` |
| `Typography.quote` | `<blockquote>` | `border-l-2 pl-6 italic` |

```tsx
<Typography.H3 className="text-3xl font-bold">Projects</Typography.H3>
<Typography.P className="text-muted-foreground">Subtitle.</Typography.P>
```

The page-title pattern overrides H3's size on purpose: the heading *level* is
h3 for document outline, but visually it's the largest text on the page.

---

### `Button`

```tsx
<Button variant="outline" size="sm">Click</Button>
<Button asChild><Link href="/about">About</Link></Button>
```

| Prop | Values | Default |
|---|---|---|
| `variant` | `default` `destructive` `outline` `secondary` `ghost` `link` | `default` |
| `size` | `default` `sm` `lg` `icon` | `default` |
| `asChild` | boolean — render a Slot instead of `<button>` | `false` |

Every button squishes to 95 % when pressed (100 ms) and springs back on `ease-spring`.

**When to use which:**

- `default` — the one primary action on a screen
- `outline` — secondary actions that still need to look clickable
- `secondary` — filled but quiet; also the "active nav item" look
- `ghost` — toolbars, icon buttons, nav rows
- `link` — inline text actions

`buttonVariants` is exported so other elements can borrow the styling:

```tsx
<Link className={cn(buttonVariants({ variant: "ghost", size: "icon" }))} />
```

> The original also plays UI sound cues on click/hover. That's stripped here —
> see "[Adding sound back](GUIDE.md#adding-sound-back)" in the full guide.

---

### `Card`

Six composable parts:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Supporting line.</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button>Action</Button></CardFooter>
</Card>
```

Padding rhythm: Header is `p-6`; Content and Footer are `p-6 pt-0`. That avoids
doubled vertical gaps between stacked sections.

For the heavier bordered look, use the **elevated card** recipe instead.

---

### `Badge`

```tsx
<Badge>New</Badge>
<Badge variant="secondary">Draft</Badge>
```

`variant`: `default` · `secondary` · `destructive` · `outline`

For **status** (Pending / Completed / …), don't use these — use the tinted
status-pill recipe, which reads better as state than a solid fill.

---

### `Input`

```tsx
<Input placeholder="Email" type="email" />
```

`h-9` matches Button's default height, so a field and a button sit flush in a
row. `bg-transparent` lets it inherit whatever surface it's on.

---

### `Skeleton`

```tsx
<Skeleton className="h-48 rounded-xl" />
```

`bg-primary/10` derives from the theme, so it works in both modes.

**Mirror the real layout** — see the recipe. A generic spinner makes content
jump; a matching skeleton makes it resolve.

---

### `PageHeader`

```tsx
<PageHeader
  title="Projects"
  subtitle="Several projects I've worked on."
  action={<Button>New</Button>}
/>
```

| Prop | Type | Notes |
|---|---|---|
| `title` | string | required |
| `subtitle` | string | optional, `max-w-2xl`, muted |
| `action` | ReactNode | optional right-aligned slot |
| `className` | string | merged last |

The most-repeated pattern in the system. Every page starting identically is a
large part of why the site feels coherent.

---

### `PillTabs`

```tsx
const [filter, setFilter] = useState("All");
<PillTabs tabs={["All", "Active", "Done"]} value={filter} onChange={setFilter} />
```

| Prop | Type |
|---|---|
| `tabs` | `readonly string[]` |
| `value` | string |
| `onChange` | `(tab: string) => void` |

Two mobile details built in: `w-full md:w-fit` so it stretches on phones, and
a scrollbar-hiding triple so overflow scrolls cleanly without a bar cutting
through the pill. The pill is a single element that springs to the picked tab
(`SPRING.slide`); tabs squish when pressed.

### `CopyButton`

```tsx
<CopyButton value="npx shadcn@latest add …" />                       // icon only
<CopyButton value={cmd} label="Copy" copiedLabel="Copied" onCopied={…} />

// The parts, for a bigger surface (a whole command row):
const { copied, copy } = useCopy(cmd);
<button onClick={copy} className={cn("…", PRESS)}>$ {cmd} <CopyGlyph copied={copied} /></button>
```

The clipboard turns away, a check turns in and draws its own stroke, the label
rolls to "Copied", and it announces the copy to screen readers. `PRESS` is the
squish-on-press class string — reuse it on any clickable surface.

---

## Effects

All three require `framer-motion`.

### `BlurFade`

The signature entrance — fade in while un-blurring and drifting up.

```tsx
<BlurFade>{children}</BlurFade>                    {/* on mount */}
<BlurFade inView>{section}</BlurFade>              {/* on scroll */}
<BlurFade inView delay={i * 0.05}>{card}</BlurFade> {/* staggered */}
```

| Prop | Default | Notes |
|---|---|---|
| `inView` | `false` | `false` = animate on mount; `true` = wait for scroll |
| `duration` | `0.4` | seconds; 0.5–0.6 for hero content |
| `delay` | `0` | stagger lists with `i * 0.05` |
| `yOffset` | `6` | px of travel; keep small |
| `blur` | `"6px"` | `"10px"` for a softer reveal |
| `inViewMargin` | `"-50px"` | fires slightly before visible |

Uses `once: true` — never replays on scroll-back, which would read as a glitch.

---

### `DotPattern`

SVG dot grid for ambient background.

| Prop | Default | Notes |
|---|---|---|
| `width` / `height` | `16` | spacing between dots |
| `cx` / `cy` | `1` | dot offset within its cell |
| `cr` | `1` | dot radius |
| `glow` | `false` | pulse at randomized delays — costly full-screen |

Color comes from `currentColor` — control with `text-neutral-400/60`.

**Perf:** one `<circle>` per dot. Keep spacing at 16–24px+ and don't enable
`glow` full-screen.

---

### `GridPattern`

Line grid where random cells light up and fade.

| Prop | Default | Notes |
|---|---|---|
| `width` / `height` | `40` | cell size |
| `x` / `y` | `-1` | keeps 1px lines crisp |
| `numSquares` | `50` | how many twinkle at once |
| `maxOpacity` | `0.5` | **use 0.05–0.15** for backgrounds |
| `duration` | `4` | seconds per fade cycle |

When a square finishes fading it teleports elsewhere — that's what makes the
twinkle endless without re-running the whole animation.

---

## Motion (v4)

Keynote-grade motion graphics as components — the moves of product-launch videos. All need
`framer-motion` and import the shared curves from `lib/motion.ts`; every one respects
`prefers-reduced-motion` (renders the end state, or nothing for purely decorative pieces).
Live demos: the landing page in [`site/`](../site/).

| Component | File | What it does | Key props |
|---|---|---|---|
| `MaskReveal` | `motion/mask-reveal.tsx` | Keynote headline: words rise from behind a mask | `text`, `as`, `delay`, `stagger`, `inView` |
| `KaraokeText` | `motion/karaoke-text.tsx` | Words light up like a narrator — by time or by scroll | `text`, `progress` (MotionValue) or `duration`, `dim` |
| `WordRotator` | `motion/word-rotator.tsx` | One word that keeps changing; box width glides | `words`, `interval` — use the serif italic, once per page |
| `CountUp` | `motion/count-up.tsx` | Counts to its value in view, tabular figures, one spring bump on arrival | `to`, `from`, `decimals`, `prefix`/`suffix`, `format`, `land` |
| `LaptopFrame` · `PhoneFrame` | `motion/device-frame.tsx` | Brandless CSS devices that size to their container | `url` (browser bar), `ratio` · `time` |
| `VirtualCamera` | `motion/virtual-camera.tsx` | Frames part of its content: zoom, glide, pull back | `shot={{ x, y, zoom }}` or `progress` + `path` (scroll-scrubbed) |
| `SoftCursor` | `motion/soft-cursor.tsx` | Hand-like pointer, click = shrink + soft halo | `points`, `onClick(i)`, `loop` |
| `FlyingPill` | `motion/flying-pill.tsx` | A message that flies from one place to another on an arc | `run` (bump to launch), `from`, `to`, `title`, `onLand` |
| `ElementLift` | `motion/element-lift.tsx` | Card rises to center, floats, flips in 3D, flies home | `id`, `front`, `back`, `lifted`, `onLower` |
| `LogoCollapse` | `motion/logo-collapse.tsx` | Outro: feature cards pull into the logo | `items`, `logo`, `auto` or `collapsed` |
| `Stepper` | `motion/stepper.tsx` | Story progress; the active pill springs between steps, finished steps draw a check | `steps`, `active`, `id` |
| `Swap` | `motion/swap.tsx` | Trades an icon or label for another on a spring — `turn`, `roll`, `pop` | `id` (change it to play), `mode` |

**Curves** (`lib/motion.ts`): `EASE.reveal` and `EASE.toggle` are the kit's UI curves;
`EASE.camera = [0.65, 0, 0.35, 1]` is symmetric and exists only for choreography (camera moves,
flights, devices). Never use it for hovers or toggles — there it reads as lag.

**Springs** (`lib/motion.ts` + `globals.css`): `EASE.spring` / `ease-spring` overshoots a few
percent and settles — for things that move into place. `SPRING.press | slide | pop | drop` are the
framer-motion versions, `layerDelay(n)` staggers a stack 40 ms apart. The rules are in
[`DESIGN.md` → Springs](DESIGN.md#springs--micro-interactions).

**Rule:** every click a `SoftCursor` makes must change something on screen — wire `onClick`.

---

## Desktop (v4)

Desktop-style UI. Generic on purpose: no system logos, no bundled system fonts. Color stays
greyscale except the traffic lights, which carry meaning (close / minimize / zoom).

| Component | File | What it does | Key props |
|---|---|---|---|
| `MacWindow` · `TrafficLights` | `mac/window.tsx` | Window with title bar; lights reveal × – + on hover | `title`, `toolbar`, `glass`, `onClose`/`onMinimize`/`onZoom` |
| `Terminal` | `mac/terminal.tsx` | Commands type themselves in view; output fades in; Copy | `lines` (`{ cmd }` / `{ out, dim }`), `prompt`, `speed` |
| `Dock` | `mac/dock.tsx` | Icons magnify near the pointer; labels pop; a clicked icon hops twice like an app launching | `items` (`href` or `onClick`), `size`, `magnified` |
| `Spotlight` | `mac/spotlight.tsx` | ⌘K command palette, grouped, keyboard driven; drops in, rows cascade, the highlight travels | `open`, `onOpenChange`, `items` + `useSpotlightHotkey()` |
| `NotificationProvider` · `useNotify` | `mac/notification.tsx` | Frosted banners spring in top-right, icon pops, stack, auto-dismiss | `notify({ title, body, icon, duration })` |
| `MenuBar` | `mac/menu-bar.tsx` | Slim frosted top bar with menus and a live clock | `brand`, `items`, `right`, `clock` |

Frosted surfaces use `backdrop-blur-2xl backdrop-saturate-150` over `bg-background/60–70`, so
they work in light and dark without extra tokens.

---

## More effects (v4)

Premium touches, written for this kit (MIT). All tint with `--primary`, so they stay neutral in the
plain kit and take your accent after a rebrand. Each one is a single moment — use one per section.

| Component | File | What it does | Key props |
|---|---|---|---|
| `SpotlightCard` | `effects/spotlight-card.tsx` | Card lit by the pointer; the border brightens where the light touches | `size`, `strength` |
| `Magnetic` | `effects/magnetic.tsx` | Element leans toward the pointer, springs back — for the ONE main CTA | `strength` |
| `Marquee` | `effects/marquee.tsx` | Endless seamless ribbon, faded edges, pauses on hover (CSS only) | `duration`, `gap`, `reverse` |
| `Aurora` | `effects/aurora.tsx` | Slow blurred light behind a hero (CSS only) | `intensity` |
| `BorderBeam` | `effects/border-beam.tsx` | A beam of light circling a card's border (CSS only) | `size`, `duration`, `colorFrom`/`colorTo` |
| `GlassPanel` | `effects/glass-panel.tsx` | Frosted-glass surface: blur, light rim, pointer specular, small tilt, lands on a spring on first view | `tilt`, `appear`, `delay`, `press`, `contentClassName` |
| `StackCard` | `effects/stack-card.tsx` | Sheets behind a card fan out on hover, 40 ms apart — the glass-folder move, card-sized (CSS only) | `layers` (1–3), `radius` |
| `PocketCard` | `effects/pocket-card.tsx` | A picture tucked in a card like a sheet in a pocket: drops in, slides out on hover | `sheet`, `tuck`, `delay`, `sheetClassName` |
| `GlassBackdrop` | `effects/glass-panel.tsx` | Soft pools of the primary color for glass to frost; edges fade on all sides, costs nothing to scroll | `variant` (`a`/`b`/`c`), `strength` |

`WordRotator` also gained `reserve` (the box is locked to the widest word, so a headline never reflows) and
`wordClassName` — put gradient-text / `background-clip: text` effects there, never on `className`: on the
wrapper they make the word invisible in Safari.

---

## Animation utilities

Registered in the theme, available as classes:

`animate-shimmer` · `animate-marquee` · `animate-marquee-vertical` ·
`animate-spin-around` · `animate-slide` · `animate-gradient-x` ·
`animate-spin-slow` · `animate-shine` · `animate-ripple` · `animate-rainbow` ·
`animate-border-beam` · `animate-meteor` · `animate-orbit` ·
`animate-drop-in` · `animate-pop-in` · `animate-launch` (springs — see `DESIGN.md`)

Plus the easing utilities `ease-spring`, `ease-reveal`, `ease-toggle`.

Several read a CSS variable, set per-instance:

```tsx
<div
  className="animate-marquee"
  style={{ "--duration": "20s", "--gap": "1rem" } as React.CSSProperties}
/>
```

| Variable | Used by |
|---|---|
| `--duration` | marquee, border-beam, orbit |
| `--gap` | marquee |
| `--speed` | spin-around, slide |
| `--radius` | orbit |
| `--shimmer-width` | shimmer |
