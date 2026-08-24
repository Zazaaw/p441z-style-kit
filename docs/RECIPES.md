# Recipes

Copy-paste patterns from the original site. These are what make pages look
like they belong together.

Snippets are written for **v4**. Two differences if you're on v3:

| v4 | v3 |
|---|---|
| `bg-linear-to-t` | `bg-gradient-to-t` |
| `shadow-xs` | `shadow-sm` |

---

## Page shell

Every top-level page opens this way:

```tsx
import BlurFade from "@/components/effects/blur-fade";
import PageHeader from "@/components/ui/page-header";

export default function ProjectsPage() {
  return (
    <BlurFade>
      <PageHeader
        title="Projects"
        subtitle="Several projects I've worked on, both private and open source."
      />
      {/* content */}
    </BlurFade>
  );
}
```

With a right-side action:

```tsx
<PageHeader title="Bookings" subtitle="…" action={<Button>New</Button>} />
```

---

## Ambient background

Put this once in your root layout, behind everything. The opposing masks are
the whole trick — each pattern fades toward the corner the other occupies, so
neither reads as wallpaper.

```tsx
<div className="pointer-events-none fixed inset-0 z-0">
  <DotPattern
    width={20} height={20} cx={1} cy={1} cr={1}
    className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
  />
</div>
<div className="pointer-events-none fixed inset-0 z-0">
  <GridPattern
    width={50} height={50} duration={15} repeatDelay={1}
    maxOpacity={0.1} x={-1} y={-1}
    className="[mask-image:linear-gradient(to_top_left,white,transparent,transparent)]"
  />
</div>

{/* content MUST sit above, or the patterns cover it */}
<div className="relative z-20">{children}</div>
```

---

## Elevated card

The heavier bordered surface used for list items and dashboard tiles —
distinct from the base `<Card>`:

```tsx
<div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs
                transition-all duration-300 hover:border-neutral-300
                dark:border-neutral-800 dark:bg-neutral-900/50
                dark:hover:border-neutral-700">
  …
</div>
```

`dark:bg-neutral-900/50` is semi-transparent on purpose — the ambient
background shows faintly through it in dark mode.

---

## Status pills

The only place color is allowed. Tinted, never solid:

```tsx
const statusStyles: Record<string, string> = {
  upcoming:  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  progress:  "bg-purple-500/10 text-purple-500 border-purple-500/20",
  pending:   "bg-amber-500/10 text-amber-500 border-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  neutral:   "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
};

<span className={cn(
  "rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
  statusStyles[status]
)}>
  {label}
</span>
```

Formula: `/10` fill + `/20` border + full-strength text. Works in both themes
with one set of classes.

---

## Image card with legible overlay

A bottom-up gradient so white text stays readable over any photo:

```tsx
<div className="group relative overflow-hidden rounded-xl">
  <img
    src={src}
    alt={alt}
    className="h-full w-full object-cover transition-transform duration-500
               group-hover:scale-110"
  />
  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/5 to-transparent" />
  <div className="absolute bottom-0 p-5 text-white">
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-white/80">{description}</p>
  </div>
</div>
```

The `via-black/5` matters — a plain two-stop gradient darkens the middle of the
image too much.

---

## Staggered list reveal

```tsx
<div className="grid gap-5 sm:grid-cols-2">
  {items.map((item, i) => (
    <BlurFade key={item.id} inView delay={i * 0.05}>
      <ProjectCard {...item} />
    </BlurFade>
  ))}
</div>
```

Keep the step at 0.04–0.06s. Larger and the last item feels late.

---

## Layout-matching skeleton

```tsx
// app/projects/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="mb-2 h-9 w-48" />    {/* title */}
      <Skeleton className="mb-6 h-5 w-96" />    {/* subtitle */}
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </>
  );
}
```

Mirror the real grid. Never a bare centered spinner.

---

## Filter toolbar

```tsx
"use client";
import { useState } from "react";
import PillTabs from "@/components/ui/pill-tabs";

const TABS = ["All", "Upcoming", "Pending", "Completed"] as const;

export function BookingList({ bookings }) {
  const [filter, setFilter] = useState<string>("All");
  const shown = filter === "All"
    ? bookings
    : bookings.filter((b) => b.status === filter);

  return (
    <>
      <PillTabs tabs={TABS} value={filter} onChange={setFilter} />
      <div className="mt-6 space-y-4">
        {shown.map((b) => <BookingRow key={b.id} {...b} />)}
      </div>
    </>
  );
}
```

---

## Section heading inside a page

```tsx
<Typography.H4 className="mb-3 mt-10">Find me on social media</Typography.H4>
```

`mt-10` between sections, `mb-3` before the content it labels.

---

## Two-column content + sidebar

```tsx
<div className="grid gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2 space-y-6">
    {/* main */}
  </div>
  <aside className="space-y-6">
    {/* sidebar */}
  </aside>
</div>
```

---

## Empty state

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <p className="text-sm text-muted-foreground">
    No projects yet.
  </p>
  <Button className="mt-4">Add your first project</Button>
</div>
```

Quiet, centered, with the next action attached. No giant illustration.

---

## Dark mode toggle

```tsx
"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
```

On **v4** the icons don't need `h-4 w-4` — Button sizes SVG children
automatically. On **v3**, add the classes.

---

## Marquee (infinite scroller)

Uses the `animate-marquee` keyframe. Duplicate the content for a seamless loop:

```tsx
<div className="group flex overflow-hidden [--gap:1rem] [gap:var(--gap)]">
  {[0, 1].map((i) => (
    <div
      key={i}
      className="flex shrink-0 animate-marquee [gap:var(--gap)]
                 group-hover:[animation-play-state:paused]"
      style={{ "--duration": "30s" } as React.CSSProperties}
      aria-hidden={i === 1}
    >
      {logos.map((logo) => <Logo key={logo.id} {...logo} />)}
    </div>
  ))}
</div>
```

`aria-hidden` on the duplicate keeps screen readers from reading it twice.
