# Design Philosophy

The reasoning behind the system. Read this before writing any UI with the kit —
it's what separates "used the components" from "looks like the original."

---

## The one rule

> **Pure greyscale surfaces. Color only as meaning. Personality comes from
> motion, not hue.**

Everything below is a consequence of that sentence.

---

## Why monochrome

Every surface token in this kit is `hsl(0 0% N%)` — hue 0, **saturation 0**.
Backgrounds, borders, body text, muted panels, cards: all grey.

This is not a lack of decision. It's the decision.

When surfaces carry no color, three things happen:

1. **Content becomes the only thing with color.** A photo, a chart, a status
   badge — each lands with full force because nothing behind it competes.
2. **Hierarchy comes from contrast alone**, which is more reliable than hue.
   A `text-muted-foreground` subtitle recedes in both light and dark mode
   without a second thought.
3. **Nothing dates.** Brand color trends move; neutral greys don't.

The most common way to ruin this: adding a tinted background "to make it less
plain." A `bg-slate-50` page or an indigo gradient hero immediately makes the
whole design look like a template. Resist it.

---

## Where color IS allowed

Exactly two places.

### 1. Status

State needs to be scannable. The formula:

```
bg-{color}-500/10   text-{color}-500   border-{color}-500/20
```

A 10% tint, a 20% border, full-strength text. It reads clearly in both themes
with a single set of classes — no `dark:` variant needed.

| State | Color |
|---|---|
| Upcoming / info | blue |
| In progress | purple |
| Pending / warning | amber |
| Completed / success | emerald |
| Cancelled / error | red |
| Neutral | neutral |

**Always pair color with a text label.** Color alone fails for colorblind users
and in grayscale printing.

### 2. A single tinted card

One dashboard tile may carry a gradient to mark it as the hero metric. One.
The moment a second tile gets its own gradient, both stop meaning anything.

---

## Motion as the accent

With no brand color doing the work, motion carries the personality.

### The entrance

`BlurFade` is the signature: content fades in while un-blurring and drifting
up a few pixels. It's subtle enough that most visitors won't consciously
register it, but the page feels *composed* rather than dumped.

Wrap every page body in one. Use `inView` for sections below the fold, and
stagger lists with `delay={i * 0.05}`.

### Easing

Two curves, both decelerating hard at the end:

```
[0.22, 1, 0.36, 1]    reveals, entrances
[0.4, 0, 0.2, 1]      collapses, toggles
```

That hard deceleration is what makes motion read as *expensive* rather than
mechanical. Linear easing is the tell of an unconsidered animation.

### Duration discipline

| Duration | Use |
|---|---|
| `200ms` | Color changes, hover fills |
| `300ms` | Borders, collapses, pill switches |
| `500ms` | Image zoom, large transforms |

Anything past 500ms starts to feel like the interface is thinking.

### The ambient background

Two SVG layers behind everything — a dot grid and a line grid where random
cells softly light up — each masked toward an **opposite corner**.

The masks are the entire trick. An unmasked pattern is wallpaper; a masked one
is texture. Neither layer is noticeable alone, but together they give the page
depth that a flat background can't.

Keep `maxOpacity` at 0.05–0.15. Above that it competes with content.

---

## Typography

| Role | Face |
|---|---|
| Everything | Plus Jakarta Sans |
| Editorial accent | A serif italic, used **once** |

The original uses Times Ten Italic for exactly one thing: the rotating word in
the hero (`design` / `code` / `shoot` / `ship`).

That restraint is the point. One moment of contrast reads as intentional. Ten
reads as indecision.

### The muted-text habit

Subtitles, metadata, timestamps, helper text, empty states — all
`text-muted-foreground`. High contrast everywhere is exhausting to read; the
eye needs somewhere to rest.

A good page has roughly one high-contrast element per section and everything
else stepped back.

---

## The radius variable

`--radius: 0.5rem` cascades into three derived values:

```
--radius-sm  = calc(var(--radius) - 4px)
--radius-md  = calc(var(--radius) - 2px)
--radius-lg  = var(--radius)
```

Change one number and the entire UI's roundness rescales coherently. `0.75rem`
reads softer and friendlier; `0.25rem` reads sharper and more technical.

Cards use `rounded-xl` (larger than the token) and pills use `rounded-full` —
those are deliberate exceptions, not drift.

---

## Consistency conventions

These exist so pages look related without anyone having to think about it.

| Context | Value |
|---|---|
| Page header → content | `mb-6` |
| Between major sections | `mt-10` |
| Card padding | `p-6` (`p-5` for dense rows) |
| Grid gap | `gap-4` tight · `gap-5` cards · `gap-6` sections |
| Subtitle max width | `max-w-2xl` |
| Control height | `h-9` — Button and Input match, so they align in a row |

**Every page opens the same way:** a bold 3xl title, a muted one-line subtitle.
That's the `PageHeader` component. When every page starts identically, the site
feels like one product instead of a folder of pages.

---

## Loading states

A skeleton must **mirror the real layout** of the page it stands in for — same
block count, same rough sizes, same grid.

A generic centered spinner makes content appear to *jump* into place. A
matching skeleton makes it appear to *resolve*. Same wait, completely different
perceived quality.

```tsx
// mirrors a 2-column card grid
<div className="grid gap-5 sm:grid-cols-2">
  {Array.from({ length: 4 }).map((_, i) => (
    <Skeleton key={i} className="h-48 rounded-xl" />
  ))}
</div>
```

---

## Accessibility, built in

Things that are easy to lose and hard to notice:

- **`focus-visible`, not `focus`** — keyboard users get the ring, mouse users
  don't get a stray outline.
- **`outline-hidden`, not `outline-none`** (v4) — the latter literally removes
  the outline and breaks focus indication in forced-colors mode.
- **`aria-hidden="true"` + `pointer-events-none`** on both background patterns.
  They're decorative; they must not reach a screen reader or eat clicks.
- **`scroll-m-20`** on headings so anchor jumps don't tuck them under a sticky
  header.
- **Status always carries a text label**, never color alone.
- **Respect `prefers-reduced-motion`** — gate sound and heavy animation.

---

## Rebranding without breaking it

Change **`--primary`** and **`--ring`**. That's it.

```css
:root {
  --primary: 243 75% 59%;
  --primary-foreground: 0 0% 98%;
  --ring: 243 75% 59%;
}
.dark {
  --primary: 243 75% 68%;   /* lighten for dark backgrounds */
  --primary-foreground: 0 0% 9%;
  --ring: 243 75% 68%;
}
```

Leave `--background`, `--foreground`, `--muted`, and `--border` grey.

If you find yourself wanting to tint the surfaces too — that's the instinct
this system is designed to overrule.
