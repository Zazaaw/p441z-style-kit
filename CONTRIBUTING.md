# Contributing

Thanks for taking a look. This is a small, opinionated kit — that's on purpose.

---

## What fits

- **Bug fixes** — a component misbehaves, a doc step is wrong, a class name is
  outdated
- **Version accuracy** — Tailwind or Next.js ships a change that breaks a step
- **Missing primitives** — something genuinely foundational is absent
- **Docs** — clearer wording, a missing gotcha, a better example

## What probably doesn't

- **More components.** The kit is a foundation, not a catalog. If you need a
  marquee or a bento grid, [MagicUI](https://magicui.design) and
  [shadcn/ui](https://ui.shadcn.com) cover that ground well.
- **Configurable theming.** No `<ThemeConfig variant="colorful">`. Rebranding
  is two CSS lines; that's the whole API on purpose.
- **Changes that soften the monochrome rule.** Adding brand-colored surfaces
  defeats the design. See [docs/DESIGN.md](docs/DESIGN.md).

Not sure? Open an issue first — cheaper than a rejected PR.

---

## Keeping the two versions in sync

`v3/` and `v4/` must stay **visually identical**. Only these differ:

| File | Difference |
|---|---|
| `globals.css` | Whole config format |
| `tailwind.config.ts` | v3 only |
| `button.tsx` | `outline-hidden` vs `outline-none`, SVG sizing |
| `badge.tsx` | `outline-hidden`, `shadow-sm` vs `shadow` |
| `input.tsx` | `outline-hidden` |
| `card.tsx` | `shadow-sm` vs `shadow` |

The other 7 files are byte-identical. **If you change one, change both.**

Quick check:

```bash
diff -r v3/components v4/components
```

Only the four files above should appear.

---

## Testing a change

There's no test suite — the kit is CSS and presentational components. Verify
by building for real:

```bash
npx create-next-app@latest /tmp/kittest --typescript --tailwind --eslint \
    --app --src-dir --import-alias "@/*" --use-npm
cd /tmp/kittest
npm i tw-animate-css clsx tailwind-merge class-variance-authority \
      @radix-ui/react-slot framer-motion next-themes

# copy your modified v4/ files in, then:
npm run build
```

**Then inspect the generated CSS.** Compiling isn't the same as being correct:

```bash
F=$(find .next -name "*.css" | head -1)

grep -o "bg-primary\\\\/50{[^}]*}" "$F"   # → color-mix(... 50%, transparent)
grep -o "\.dark[^{]\{0,30\}" "$F"          # → :where(.dark,.dark *)  NOT @media
grep -o "animate-shine{[^}]*}" "$F"        # → animation:var(--animate-shine)
grep -o "::file-selector-button{border-color:[^}]*}" "$F"
```

If opacity modifiers emit a plain color instead of `color-mix()`, a token is
written as `hsl(...)` instead of a bare triplet.

For v3, do the same with `tailwindcss@3` + the config file.

---

## Docs conventions

- **Explain the why**, not just the what. "Use `outline-hidden`" is less
  useful than "use `outline-hidden` because v4's `outline-none` breaks focus
  in forced-colors mode."
- Keep the SETUP guides **literal and copy-pasteable** — exact commands, full
  file contents, a verification checklist.
- Comments in component files carry the reasoning. That's why they're long.
- Prose in English; the SETUP guides also carry Indonesian notes where the
  original had them.

---

## Pull requests

1. Fork, branch from `main`
2. Change both `v3/` and `v4/` if the change touches a shared file
3. Verify with a real build (above)
4. Describe **what** and **why** — link an issue if there is one

Commit style — short, imperative, scoped:

```
fix(v4): use outline-hidden in input
docs(recipes): add empty-state pattern
```

---

## Reporting bugs

Include:

- Which kit (`v3` / `v4`)
- Tailwind, Next.js, and Node versions
- What you expected vs what happened
- A minimal repro if you can

Screenshots help a lot for visual issues.
