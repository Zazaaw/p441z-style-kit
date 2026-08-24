# Setup — Pakai Style Kit di Project Baru

Panduan langkah-demi-langkah dari nol sampai halaman pertama jalan.
Estimasi: **10–15 menit**.

---

## ⚠️ Baca ini dulu: Tailwind v3 vs v4

Kit ini ditulis untuk **Tailwind v3** (sama seperti portfolio aslinya).

Per hari ini, `create-next-app` default sudah pakai **Tailwind v4**, yang
berbeda cukup jauh:

| | v3 (kit ini) | v4 (default baru) |
|---|---|---|
| Konfigurasi | `tailwind.config.ts` | Di dalam CSS, pakai `@theme` |
| Import | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| Plugin | `require()` di config | `@plugin` di CSS |

**Kalau kamu install v4 lalu copy file kit apa adanya, styling-nya nggak akan
muncul.**

Dua pilihan:

- **Jalur A — pakai Tailwind v3** (rekomendasi). Copy-paste langsung, nol
  konversi. Ikuti panduan di bawah.
- **Jalur B — pakai Tailwind v4**. Perlu konversi config → CSS. Lihat
  [Lampiran A](#lampiran-a--kalau-mau-pakai-tailwind-v4) di bagian bawah.

Panduan utama di bawah ini **Jalur A**.

---

## Langkah 1 — Bikin project Next.js

```bash
npx create-next-app@latest nama-project-baru
```

Jawab prompt-nya seperti ini:

| Pertanyaan | Jawab | Alasan |
|---|---|---|
| TypeScript? | **Yes** | Kit-nya `.ts`/`.tsx` |
| ESLint? | Yes | Bebas |
| Tailwind CSS? | **No** ← penting | Biar nggak keinstall v4; kita install v3 manual |
| `src/` directory? | **Yes** | Path alias `@/*` mengarah ke `src/` |
| App Router? | **Yes** | |
| Turbopack? | Yes | Bebas |
| Import alias? | **No** (pakai default `@/*`) | |

```bash
cd nama-project-baru
```

> **Kenapa Tailwind-nya "No"?** Supaya kita bisa install v3 secara eksplisit
> di langkah berikutnya. Kalau kamu terlanjur jawab Yes, jalankan
> `npm uninstall tailwindcss @tailwindcss/postcss` dulu, lalu lanjut.

---

## Langkah 2 — Install dependencies

```bash
# Tailwind v3 + tooling  (perhatikan pin @3 — ini yang penting)
npm i -D tailwindcss@3 postcss autoprefixer
npm i -D tailwindcss-animate tailwind-scrollbar-hide

# Utilities inti
npm i clsx tailwind-merge class-variance-authority

# Untuk Button asChild
npm i @radix-ui/react-slot

# Untuk BlurFade / DotPattern / GridPattern
npm i framer-motion

# Dark mode toggle
npm i next-themes
```

Verifikasi versinya benar:

```bash
npm ls tailwindcss
```

Harus tampil `tailwindcss@3.x.x`. Kalau `4.x`, ulangi `npm i -D tailwindcss@3`.

---

## Langkah 3 — Bikin `postcss.config.mjs`

Karena Tailwind di-skip saat scaffold, file ini belum ada. Bikin di root:

```js
// postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

> Kalau file ini sudah ada tapi isinya `"@tailwindcss/postcss"`, itu format
> v4 — timpa dengan isi di atas.

---

## Langkah 4 — Copy file dari kit

Dari folder `v3/` di repo ini, salin ke project baru:

| Dari | Ke |
|---|---|
| `globals.css` | `src/app/globals.css` *(timpa yang ada)* |
| `tailwind.config.ts` | `tailwind.config.ts` *(root)* |
| `lib/utils.ts` | `src/lib/utils.ts` |
| `components/ui/*` (8 file) | `src/components/ui/` |
| `components/effects/*` (3 file) | `src/components/effects/` |

**Cara cepat via terminal** — ganti `<KIT>` dan `<PROJECT>` dengan path
sebenarnya:

```bash
# Git Bash / macOS / Linux
KIT="d:/path/ke/p441z-style-kit/v3"
PROJECT="d:/path/ke/project-baru"

mkdir -p "$PROJECT/src/lib" "$PROJECT/src/components/ui" "$PROJECT/src/components/effects"
cp "$KIT/globals.css"        "$PROJECT/src/app/globals.css"
cp "$KIT/tailwind.config.ts" "$PROJECT/tailwind.config.ts"
cp "$KIT/lib/utils.ts"       "$PROJECT/src/lib/utils.ts"
cp "$KIT"/components/ui/*        "$PROJECT/src/components/ui/"
cp "$KIT"/components/effects/*   "$PROJECT/src/components/effects/"
```

Struktur akhirnya:

```
project-baru/
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── lib/
    │   └── utils.ts
    └── components/
        ├── ui/          (8 file)
        └── effects/     (3 file)
```

---

## Langkah 5 — Cek path alias

Buka `tsconfig.json`, pastikan ada:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

`create-next-app` biasanya sudah menuliskannya. Kalau belum, tambahkan.

---

## Langkah 6 — Setup `layout.tsx`

Timpa `src/app/layout.tsx`:

```tsx
import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Baru",
  description: "Deskripsi singkat.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning WAJIB kalau pakai next-themes —
    // library-nya menulis class tema ke <html> sebelum React hydrate.
    <html lang="id" suppressHydrationWarning>
      <body className={sans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Lalu bikin `src/components/theme-provider.tsx`:

```tsx
"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

---

## Langkah 7 — Halaman uji

Timpa `src/app/page.tsx`:

```tsx
import BlurFade from "@/components/effects/blur-fade";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <BlurFade>
        <PageHeader
          title="Halo, ini project baru"
          subtitle="Kalau teks ini muncul sambil fade-in dari blur tipis, style kit-nya sudah jalan."
          action={<Button>Tombol</Button>}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2].map((n) => (
            <BlurFade key={n} inView delay={n * 0.05}>
              <Card>
                <CardHeader>
                  <CardTitle>Kartu {n}</CardTitle>
                  <CardDescription>Deskripsi pendek di sini.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </BlurFade>
    </main>
  );
}
```

---

## Langkah 8 — Jalankan

```bash
npm run dev
```

Buka http://localhost:3000

### Checklist "berhasil"

- [ ] Judul besar tebal, subtitle abu-abu di bawahnya
- [ ] Semua konten **fade-in dari blur tipis** sambil naik sedikit
- [ ] Dua kartu punya border + rounded + shadow halus
- [ ] Lima tombol tampil beda-beda
- [ ] Scrollbar berbentuk **pil membulat** (bukan bawaan browser) — perlu
      konten panjang untuk terlihat
- [ ] Font-nya Plus Jakarta Sans, bukan Times/Arial

Kalau ada yang gagal, lihat [Troubleshooting](#troubleshooting).

---

## Langkah 9 — Tambah ambient background (opsional tapi khas)

Ini yang bikin halaman terasa "hidup". Update `layout.tsx`, di dalam
`<ThemeProvider>`:

```tsx
import DotPattern from "@/components/effects/dot-pattern";
import GridPattern from "@/components/effects/grid-pattern";

// ...
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {/* Dua lapis tekstur, mask-nya saling berlawanan arah */}
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

  {/* Konten WAJIB relative + z di atas 0, kalau nggak ketutup pattern */}
  <div className="relative z-20">{children}</div>
</ThemeProvider>
```

---

## Langkah 10 — Tombol dark mode (opsional)

`src/components/mode-toggle.tsx`:

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
      aria-label="Ganti tema"
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </Button>
  );
}
```

Butuh ikon: `npm i lucide-react`

Pasang lewat prop `action` di PageHeader:

```tsx
<PageHeader title="…" subtitle="…" action={<ModeToggle />} />
```

---

## Langkah 11 — Ganti warna brand (opsional)

Buka `src/app/globals.css`, ubah **hanya** 3 token ini:

```css
:root {
  --primary: 243 75% 59%;          /* indigo-600 */
  --primary-foreground: 0 0% 98%;
  --ring: 243 75% 59%;
}
.dark {
  --primary: 243 75% 68%;          /* lebih terang buat background gelap */
  --primary-foreground: 0 0% 9%;
  --ring: 243 75% 68%;
}
```

**Jangan** ubah `--background`, `--foreground`, `--muted`, `--border`.
Biarkan abu-abu — justru itu yang bikin desainnya bersih.

⚠️ Format wajib triplet telanjang (`243 75% 59%`), **bukan**
`hsl(243 75% 59%)`. Kalau ditulis lengkap, semua opacity modifier seperti
`bg-primary/90` akan rusak.

---

## Troubleshooting

### Styling nggak muncul sama sekali

Cek versi Tailwind:
```bash
npm ls tailwindcss
```
Kalau `4.x` → itu masalahnya. Jalankan:
```bash
npm uninstall tailwindcss @tailwindcss/postcss
npm i -D tailwindcss@3 postcss autoprefixer
```
Pastikan juga `postcss.config.mjs` isinya format v3 (Langkah 3), lalu restart
dev server.

### `Cannot find module '@/lib/utils'`

`tsconfig.json` belum punya `paths`. Lihat Langkah 5. Restart dev server
setelah mengubahnya — TS server tidak reload otomatis.

### `Module not found: framer-motion`

```bash
npm i framer-motion
```

### Warna jalan tapi opacity nggak (`bg-primary/90` nggak ngefek)

Token di `globals.css` ditulis `hsl(...)`. Harus triplet telanjang:
```css
--primary: 0 0% 9%;        /* ✅ */
--primary: hsl(0 0% 9%);   /* ❌ */
```

### Dark mode nggak jalan

Tiga hal harus benar:
1. `darkMode: ["class"]` di `tailwind.config.ts` ✅ (sudah ada di kit)
2. `<ThemeProvider attribute="class">` — bukan `attribute="data-theme"`
3. `suppressHydrationWarning` di tag `<html>`

### Error hydration mismatch

Tambahkan `suppressHydrationWarning` di `<html>` (Langkah 6).

### Animasi BlurFade nggak muncul

File pakai `"use client"` di baris pertama — sudah ada di kit. Kalau kamu
membungkusnya dalam komponen sendiri, komponen itu juga perlu `"use client"`.

### Scrollbar masih bawaan browser

Firefox hanya mendukung `scrollbar-width`/`scrollbar-color` (sudah termasuk,
tampilannya lebih sederhana). Pil penuh hanya di Chrome/Edge/Safari.

---

## Lampiran A — Kalau mau pakai Tailwind v4

Kalau kamu tetap ingin v4, `tailwind.config.ts` tidak dipakai. Semua pindah
ke CSS. Ganti bagian **atas** `globals.css` jadi:

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

/* Dark mode berbasis class (v4 defaultnya media query) */
@custom-variant dark (&:where(.dark, .dark *));

/* Petakan token ke nama warna Tailwind */
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}
```

Lalu:
- **Hapus** tiga baris `@tailwind base/components/utilities`
- **Pertahankan** blok `:root { … }` dan `.dark { … }` apa adanya
- **Pertahankan** bagian scrollbar apa adanya
- **Hapus** `tailwind.config.ts` (tidak terpakai)
- Keyframes animasi perlu dipindah ke `@theme` juga — atau lewati saja kalau
  belum butuh marquee/shimmer/dll
- PostCSS pakai `@tailwindcss/postcss`, bukan `tailwindcss`

Jujur saja: **Jalur A (v3) jauh lebih cepat** kalau tujuanmu langsung
membangun. Pilih v4 hanya kalau memang butuh fiturnya.

---

## Referensi lanjutan

Setelah jalan, baca dokumen ini:

- **[docs/DESIGN.md](../docs/DESIGN.md)** - filosofi desain. Baca ini sebelum
  bikin UI; isinya yang bikin hasilnya "kelihatan seperti aslinya"
- **[docs/RECIPES.md](../docs/RECIPES.md)** - 12 pola siap tempel
- **[docs/COMPONENTS.md](../docs/COMPONENTS.md)** - referensi props
- **[docs/MIGRATION.md](../docs/MIGRATION.md)** - cheat sheet v3 ke v4
- **[../README.md](../README.md)** - ikhtisar repo

Kalau pakai AI coding agent, arahkan ke **[../AGENTS.md](../AGENTS.md)** dan
salin **[../templates/CLAUDE.md](../templates/CLAUDE.md)** ke root project baru.

---

## Ringkasan perintah

```bash
# 1. Scaffold (Tailwind = No)
npx create-next-app@latest nama-project-baru
cd nama-project-baru

# 2. Dependencies
npm i -D tailwindcss@3 postcss autoprefixer tailwindcss-animate tailwind-scrollbar-hide
npm i clsx tailwind-merge class-variance-authority @radix-ui/react-slot framer-motion next-themes

# 3. Bikin postcss.config.mjs (lihat Langkah 3)
# 4. Copy file kit (lihat Langkah 4)
# 5-7. Setup layout + halaman uji
# 8. Jalankan
npm run dev
```
