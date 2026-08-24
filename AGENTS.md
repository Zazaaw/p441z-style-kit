# Instructions for AI Coding Agents

You are being asked to build a UI using this style kit. Read this file fully
before writing any code.

---

## Reading order

1. **`docs/DESIGN.md`** — the rules. Non-negotiable.
2. **`v4/SETUP.md`** (or `v3/SETUP.md`) — installation steps.
3. **`docs/RECIPES.md`** — copy these patterns instead of inventing your own.
4. **`docs/COMPONENTS.md`** — props reference, consult as needed.

If the user didn't say which version: **use v4**. It's the current default for
`create-next-app`.

---

## The rules you will most likely break

These are listed because they are the failure modes that actually happen — a
model's defaults pull against every one of them.

### 1. Do not add brand colors

Surfaces stay **pure greyscale** (`hsl(0 0% N%)`). No indigo hero, no
`bg-slate-50` page, no purple-to-pink gradient, no colored section background.

Color appears in exactly two places:
- **Status indicators** — using the `/10` fill + `/20` border formula
- **One** tinted hero tile per dashboard, at most

If the design feels "too plain" to you, that is the intended result. Do not
correct it. The user chose this.

### 2. Use the kit's components — don't write your own

If a component exists, use it. Do not hand-roll a `<button className="px-4
py-2 bg-black text-white rounded">`. Do not build a custom card div when
`<Card>` or the elevated-card recipe covers it.

| Need | Use |
|---|---|
| Any button or link-as-button | `<Button>` (`asChild` for links) |
| Page title + subtitle | `<PageHeader>` |
| Any heading or paragraph | `Typography.*` |
| A surface | `<Card>` or the elevated-card recipe |
| Filter / view switcher | `<PillTabs>` |
| Loading state | `<Skeleton>`, mirroring the real layout |
| Tag or label | `<Badge>` |
| Status | The status-pill recipe, **not** `<Badge>` |

### 3. Wrap page bodies in `<BlurFade>`

Every page. `inView` for sections below the fold. Stagger lists with
`delay={i * 0.05}`.

This is the system's signature. A page without it looks unfinished next to one
with it.

### 4. Follow the spacing table

Don't invent margins. From `docs/DESIGN.md`:

```
mb-6   page header → content
mt-10  between major sections
p-6    card padding (p-5 for dense rows)
gap-5  card grids
h-9    control height (Button and Input already match)
```

### 5. Skeletons mirror the layout

Never a bare centered spinner. Same block count, same grid, same rough sizes
as the real content.

### 6. Version-correct utility names

On **v4**: `outline-hidden`, `shadow-xs`/`shadow-sm`, `bg-linear-to-r`,
`shrink-0`.
On **v3**: `outline-none`, `shadow-sm`/`shadow`, `bg-gradient-to-r`.

Most snippets you've seen are v3. Check `docs/MIGRATION.md` when unsure.

### 7. Token format

CSS variables are **bare HSL triplets** — `0 0% 9%`, never `hsl(0 0% 9%)`.
Writing the full function breaks every opacity modifier (`bg-primary/90`).

---

## What "done" looks like

Before reporting completion, verify:

- [ ] `npm run build` passes
- [ ] No hardcoded hex colors or `bg-{color}-{n}` on surfaces
- [ ] Every page body wrapped in `<BlurFade>`
- [ ] Every page opens with `<PageHeader>`
- [ ] No hand-rolled buttons/cards where a kit component exists
- [ ] Dark mode works — toggle and check
- [ ] Spacing matches the table

---

## When the user's request conflicts with these rules

Say so once, briefly, then follow the user's instruction. They own the project.

> "Heads up: a colored hero background departs from the kit's monochrome rule.
> Doing it as asked — say the word if you'd rather keep it neutral."

Don't refuse, don't lecture, don't repeat the objection.

---

## Setting up a new project

Copy `templates/CLAUDE.md` into the new project's root and fill in the
placeholders. That file gets loaded automatically every session, so the rules
persist without the user re-explaining them.
