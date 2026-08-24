# v3 → v4 Cheat Sheet

Most Tailwind snippets on the internet are still v3. This is what to watch for.

---

## Config

| v3 | v4 |
|---|---|
| `tailwind.config.ts` | `@theme` inside CSS — **no config file** |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `darkMode: ["class"]` | `@custom-variant dark (&:where(.dark, .dark *))` |
| `content: [...]` globs | Automatic detection |
| `plugins: [require(...)]` | `@plugin "..."` or `@import` the CSS package |
| PostCSS `tailwindcss: {}` | PostCSS `"@tailwindcss/postcss": {}` |

## Packages

| v3 | v4 |
|---|---|
| `tailwindcss-animate` | `tw-animate-css` |
| `tailwindcss` + `autoprefixer` | `tailwindcss` + `@tailwindcss/postcss` |

Autoprefixer is built in now.

## Utility renames

| v3 | v4 | Why |
|---|---|---|
| `outline-none` | `outline-hidden` | v4's `outline-none` literally sets `outline: none`, breaking focus in forced-colors mode |
| `shadow-sm` | `shadow-xs` | Scale shifted one step |
| `shadow` | `shadow-sm` | |
| `bg-gradient-to-r` | `bg-linear-to-r` | Makes room for conic/radial |
| `flex-shrink-0` | `shrink-0` | |
| `flex-grow` | `grow` | |
| `overflow-ellipsis` | `text-ellipsis` | |
| `decoration-slice` | `box-decoration-slice` | |

Deprecated names mostly still work, but won't forever.

## Behavior changes that bite

**Default border color removed.** In v3, a bare `border` class rendered
`gray-200`. In v4 it renders `currentColor`. The kit restores the old behavior:

```css
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    border-color: hsl(var(--border));
  }
}
```

**Default ring width changed** from 3px to 1px.

**Flex children aren't normalized the same way.** An icon inside a flex button
can squash — the kit's Button adds `[&_svg]:shrink-0`.

**`space-x-*` / `space-y-*` selector changed** — slightly faster, but can
behave differently with inline elements. Prefer `gap-*` with flex/grid.

---

## Converting the kit's config

If you have the v3 kit installed and want to move to v4:

1. Delete `tailwind.config.ts`
2. Replace `globals.css` with the v4 version
3. `npm uninstall tailwindcss-animate autoprefixer`
4. `npm i tw-animate-css @tailwindcss/postcss`
5. Update `postcss.config.mjs`:
   ```js
   const config = { plugins: { "@tailwindcss/postcss": {} } };
   export default config;
   ```
6. Run the utility renames above across your own code

The components are nearly identical between versions — only `button.tsx`,
`badge.tsx`, `input.tsx`, and `card.tsx` differ, and only in the class strings
listed above.

---

## Which should I use?

**v4** unless you have a reason not to. It's what `create-next-app` installs
today, builds faster, and the kit is verified against a real v4 build.

**v3** if you're adding to an existing v3 codebase, or a dependency you need
hasn't shipped v4 support.
