# Component Reference

Eleven components. Props, variants, and when to reach for each.

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
> see the README's "Adding sound back" note.

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
through the pill.

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

## Animation utilities

Registered in the theme, available as classes:

`animate-shimmer` · `animate-marquee` · `animate-marquee-vertical` ·
`animate-spin-around` · `animate-slide` · `animate-gradient-x` ·
`animate-spin-slow` · `animate-shine` · `animate-ripple` · `animate-rainbow` ·
`animate-border-beam` · `animate-meteor` · `animate-orbit`

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
