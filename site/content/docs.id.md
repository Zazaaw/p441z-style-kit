## Sebelum mulai

Isi kit ini cuma komponen React biasa dan satu tema CSS. Yang kamu perlukan:

| Apa | Versi | Cara cek |
|---|---|---|
| Node.js | 20 ke atas | `node -v` |
| React | 19 | `npm ls react` |
| Tailwind CSS | **v4** | `npm ls tailwindcss` |
| Framework | Diuji di Next.js 15/16 (App Router). Vite dan Remix juga bisa, lewati saja bagian yang khusus Next. | |
| TypeScript | Disarankan, karena semua file berformat `.tsx`. | |

Masih pakai Tailwind v3? Di repo ada folder `v3/` berisi komponen inti, tapi tanpa registry dan tanpa komponen motion. Salin manual saja (Jalur 4).

## Pilih jalurmu

| Kamu ingin… | Ambil | Waktu |
|---|---|---|
| Project baru yang langsung lengkap: tema, semua komponen, animasi pegas | [Jalur 1: satu perintah](#jalur-1-seluruh-kit-dengan-satu-perintah) | ±5 menit |
| Beberapa komponen saja untuk aplikasi yang sudah ada | [Jalur 2: pilih komponen](#jalur-2-ambil-komponen-yang-perlu-saja) | ±1 menit per komponen |
| Skill desain untuk Claude Code atau agen AI lain | [Jalur 3: skill](#jalur-3-skill-untuk-agen-ai-mu) | ±1 menit |
| Tanpa CLI, semua file kamu pegang sendiri | [Jalur 4: salin manual](#jalur-4-salin-file-secara-manual) | ±10 menit |

Boleh dikombinasikan. Biasanya orang ambil Jalur 1 atau 2 untuk kodenya, lalu Jalur 3 untuk skill-nya.

## Jalur 1: seluruh kit dengan satu perintah

### 1. Buat project

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-app
```

### 2. Siapkan shadcn

Kit ini dipasang lewat [shadcn CLI](https://ui.shadcn.com/docs/cli). CLI-nya menyalin file ke project-mu, jadi tidak ada package yang perlu kamu jadikan dependensi.

```bash
npx shadcn@latest init
```

Pilih base color apa saja, karena palet itu nanti diganti kit di langkah berikutnya. Perintah ini membuat `components.json` dan `src/lib/utils.ts`, lalu menambahkan blok token ke `src/app/globals.css`.

### 3. Pasang kit-nya

```bash
npx shadcn@latest add https://style.p441z.my.id/r/style-kit.json
```

Satu perintah itu langsung:

- menyalin semua komponen ke `src/components/ui`, `effects`, `motion`, dan `mac`
- menambahkan `src/lib/motion.ts` (kurva dan pegas) serta `src/lib/use-hydrated.ts`
- memasang semua yang mereka butuhkan: `framer-motion`, `class-variance-authority`, `@radix-ui/react-slot`, `tw-animate-css`, dan lainnya
- menulis tema ke `globals.css`: token abu-abu untuk mode terang dan gelap, radius, semua animasi dan keyframe, kurva pegas, serta scrollbar berbentuk pil

Kalau CLI bertanya apakah file mau ditimpa, jawab yes. Toh project-nya masih baru.

### 4. Pastikan semuanya jalan

Ganti isi `src/app/page.tsx`:

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
        <p className="text-sm text-muted-foreground">Komponen terpasang</p>
        <div className="mt-1 text-6xl font-extrabold tracking-tight">
          <CountUp to={38} />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button>Tekan aku</Button>
          <Button variant="outline">Aku juga</Button>
          <CopyButton value="npx shadcn@latest add https://style.p441z.my.id/r/style-kit.json" label="Salin" copiedLabel="Tersalin" />
        </div>
      </GlassPanel>
    </main>
  );
}
```

```bash
npm run dev
```

Buka http://localhost:3000. Kit-nya sudah jalan kalau:

- [ ] kartu kacanya naik ke posisinya lalu mendarat dengan sedikit pantulan
- [ ] angkanya menghitung sampai 38, lalu memantul sekali
- [ ] tombolnya mengecil saat ditekan dan memantul balik
- [ ] **Salin** berubah jadi centang yang tergambar sendiri, dan labelnya bergulir jadi "Tersalin"
- [ ] kartunya sedikit miring mengikuti kursor

## Jalur 2: ambil komponen yang perlu saja

Tiap komponen bisa dipasang sendiri-sendiri. Perintahnya tertera di halaman masing-masing, di [Komponen](/id/components):

```bash
npx shadcn@latest add https://style.p441z.my.id/r/glass-panel.json
```

Apa pun yang di-import komponen itu ikut terpasang. Misalnya `copy-button` ikut membawa `swap` dan `lib/motion.ts`. Mau pasang beberapa sekaligus? Tulis saja berderet.

### Perintah lebih pendek dengan namespace

Daftarkan registry-nya sekali di `components.json`:

```json
{
  "registries": {
    "@p441z": "https://style.p441z.my.id/r/{name}.json"
  }
}
```

Setelah itu cukup sebut namanya:

```bash
npx shadcn@latest add @p441z/glass-panel @p441z/copy-button @p441z/stack-card
```

### Tema milikmu tetap utuh

Memasang komponen satuan tidak mengubah token warnamu. Komponennya hanya memakai nama standar shadcn (`background`, `foreground`, `primary`, `muted`, `border`, `ring`…), jadi otomatis ikut warna brand-mu.

Yang mereka pinjam dari tema kit hanya urusan gerak: kurva `ease-spring` serta animasi `animate-drop-in`, `animate-pop-in`, dan `animate-launch`. Tanpa itu semuanya tetap jalan, cuma mendaratnya lebih datar. Kalau mau pantulannya tanpa ikut mengganti palet, tempel blok ini ke dalam `@theme` di `globals.css`:

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

Ternyata mau temanya juga? Jalankan `npx shadcn@latest add https://style.p441z.my.id/r/theme.json`. Tapi hati-hati: perintah ini **mengganti** token warnamu dengan palet abu-abu milik kit.

## Jalur 3: skill untuk agen AI-mu

Skill di kit ini berupa panduan desain dalam Markdown: tipografi, landing page, dashboard, dark mode, video motion, dan lainnya. Agen membacanya sebelum mulai membangun, jadi hasilnya mengikuti aturan, bukan pilihan bawaan yang itu-itu saja. Lihat daftarnya di [beranda](/id#skills).

### Claude Code: ke-16 skill sebagai plugin

Jalankan di dalam Claude Code:

```text
/plugin marketplace add Zazaaw/p441z-style-kit
/plugin install p441z-skills@p441z
```

Baris pertama menambahkan marketplace (cukup sekali per komputer), baris kedua memasang skill-nya. Untuk mengatur atau memperbarui nanti, buka menu `/plugin`.

### Claude Code: satu skill untuk satu project

Tiap halaman skill punya perintahnya sendiri. Contohnya untuk tipografi:

```bash
mkdir -p .claude/skills/skill-typography && curl -fsSL https://raw.githubusercontent.com/Zazaaw/p441z-style-kit/main/Skill.md/skill-typography.md -o .claude/skills/skill-typography/SKILL.md
```

Simpan di `~/.claude/skills/` (bukan `.claude/skills/`) supaya skill itu tersedia di semua project.

### Cara memakainya

Minta seperti biasa saja: *"buatkan bagian harga"*, *"tambahkan dark mode"*. Claude Code akan memilih skill yang deskripsinya paling cocok. Kalau mau pasti, sebut namanya: *"pakai skill-typography untuk judul-judulnya"*.

### Agen lain

Skill-nya Markdown biasa, jadi bisa dipakai agen apa pun yang membaca file instruksi. Taruh file-nya di tempat yang dibaca agenmu: `AGENTS.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, dan sejenisnya. Di repo juga ada [`templates/CLAUDE.md`](https://github.com/Zazaaw/p441z-style-kit/blob/main/templates/CLAUDE.md) sebagai titik awal instruksi project.

## Jalur 4: salin file secara manual

### 1. Ambil kit-nya

```bash
npx degit Zazaaw/p441z-style-kit/v4 kit-v4
```

Perintah ini hanya mengunduh folder `v4/`: `globals.css`, `lib/`, `components/`, dan `SETUP.md` yang berisi langkah lebih rinci.

### 2. Pasang dependensinya

```bash
npm i clsx tailwind-merge class-variance-authority @radix-ui/react-slot framer-motion tw-animate-css
```

`framer-motion` hanya dibutuhkan oleh `motion/`, `mac/`, dan beberapa efek. Kalau kamu cuma ambil komponen UI, boleh dilewati.

### 3. Salin file-nya

| Dari `kit-v4/` | Ke project-mu |
|---|---|
| `globals.css` | `src/app/globals.css` (timpa) |
| `lib/*` | `src/lib/` |
| `components/*` | `src/components/` |

Tailwind v4 tidak memakai file `tailwind.config`, karena semuanya ada di `globals.css`. Kalau masih ada file config lama, hapus saja.

### 4. Cek alias import

Semua file meng-import lewat `@/`. Pastikan `tsconfig.json` punya:

```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

Restart dev server setelah mengubahnya.

**Satu bedanya dengan jalur CLI:** token hasil salin manual berupa triplet HSL polos (`--primary: 0 0% 9%;`), bukan warna lengkap. Biarkan formatnya begitu. Penjelasannya ada di bagian [warna brand](#warna-brand-mu-sendiri).

## Font

Komponen kit memakai font apa pun yang dipakai halamanmu. Tampilan situs ini berasal dari tiga keluarga font:

| Peran | Font | Tailwind |
|---|---|---|
| UI dan judul | Plus Jakarta Sans | `font-sans`, `font-display` |
| Satu kata aksen bergaya editorial | Instrument Serif, italic | `font-serif` |
| Kode, ID, data | JetBrains Mono | `font-mono` |

Pakai `next/font` di `src/app/layout.tsx`:

```tsx
import { Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-instrument" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

// <html className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
```

Lalu petakan di `globals.css`:

```css
@theme inline {
  --font-sans: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-jakarta), ui-sans-serif, sans-serif;
  --font-serif: var(--font-instrument), ui-serif, Georgia, serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;
}
```

## Warna brand-mu sendiri

Paletnya sengaja abu-abu. Untuk memasang warna brand, cukup ubah **tiga token**: `--primary`, `--primary-foreground`, dan `--ring`, di mode terang dan gelap. Biarkan `--background`, `--foreground`, `--muted`, dan `--border` tetap abu-abu, karena justru itu yang membuat desainnya tenang.

Formatnya tergantung cara kamu memasang:

```css
/* Lewat CLI (Jalur 1 atau 2): warna lengkap */
:root { --primary: hsl(243 75% 59%); --primary-foreground: hsl(0 0% 100%); --ring: hsl(243 75% 59%); }
.dark { --primary: hsl(243 75% 68%); --primary-foreground: hsl(0 0% 9%); --ring: hsl(243 75% 68%); }

/* Salin manual (Jalur 4): triplet polos, tanpa hsl() */
:root { --primary: 243 75% 59%; --primary-foreground: 0 0% 100%; --ring: 243 75% 59%; }
.dark { --primary: 243 75% 68%; --primary-foreground: 0 0% 9%; --ring: 243 75% 68%; }
```

Cahaya, tepi kaca, spotlight, dan beam semuanya mengambil warna dari `--primary`, jadi otomatis ikut berubah. Pastikan teks di atas warna primary tetap kontras (minimal 4,5:1). Coba klik titik-titik aksen di menu bar situs ini: satu token mengubah warna seluruh halaman.

## Dark mode

Setiap token punya nilai gelap di bawah `.dark`. Ganti class-nya pakai [next-themes](https://github.com/pacocoursey/next-themes):

```bash
npm i next-themes
```

```tsx
// src/app/layout.tsx
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` wajib ada, karena next-themes menulis class sebelum React melakukan hydrate. Untuk transisi tema yang halus seperti di situs ini (View Transitions, fallback, dan dukungan reduced motion), ikuti [skill-darkmode](/id/skills/darkmode).

## Gerak dan pegas

- Komponen di `motion/` dan `mac/` butuh `framer-motion`. Sisanya cukup CSS.
- Semua animasi mematuhi setelan **reduced motion**: langsung tampil di posisi akhir, atau diam saja.
- Sesuatu yang *muncul* memakai kurva yang tenang (`EASE.reveal`). Sesuatu yang *bergerak ke posisinya* memakai pegas yang sedikit kebablasan lalu kembali: `ease-spring` di CSS, `SPRING.press | slide | pop | drop` di framer-motion.

Pegasnya bisa kamu pakai untuk UI buatanmu sendiri:

```tsx
import { PRESS } from "@/components/ui/copy-button";
import { SPRING } from "@/lib/motion";

<button className={`rounded-full px-5 py-2 ${PRESS}`}>Mengecil saat ditekan</button>
<motion.div layoutId="pill" transition={SPRING.slide} />
<GlassPanel press><a href="/docs" className="block p-6">Kartu yang berupa tautan</a></GlassPanel>
```

Lima aturan di baliknya ada di [DESIGN.md](https://github.com/Zazaaw/p441z-style-kit/blob/main/docs/DESIGN.md#springs--micro-interactions):

- pantulan hanya untuk transform
- tekan cepat, lepas memantul
- antarlapis berjeda 40 ms
- selalu meniru benda fisik
- diam saat di luar layar

## Kaca butuh sesuatu di belakangnya

`GlassPanel`, `StackCard`, dan `PocketCard` membuat buram apa pun yang ada di belakangnya. Di atas halaman polos, kaca cuma terlihat seperti kartu biasa. Beri warna di belakangnya:

```tsx
<section className="relative">
  <GlassBackdrop />            {/* genangan lembut warna primary, ringan saat di-scroll */}
  <GlassPanel className="p-6">…</GlassPanel>
</section>
```

`Aurora`, foto, atau pola yang ramai juga cocok. Bagian yang berat adalah blur-nya, jadi batasi sekitar selusin panel kaca per layar. Jangan tambahkan `saturate()` ke filter-nya, karena di layar Retina itulah yang paling menurunkan fps.

## Memperbarui

File-nya milikmu, jadi tidak ada yang berubah dengan sendirinya. Untuk mengambil versi terbaru sebuah komponen, jalankan lagi perintah `add`-nya. CLI akan bertanya dulu sebelum menimpa file yang sudah kamu ubah; tambahkan `--overwrite` untuk melewati pertanyaan itu. Commit dulu sebelumnya, lalu cek diff-nya: pertahankan ubahanmu, ambil perbaikannya.

## Kalau ada masalah

**Komponen tampil tanpa style.**
Tailwind v4 melewati file yang tercantum di `.gitignore` saat memindai class. Kalau komponenmu ada di folder yang di-ignore atau di luar `src/`, daftarkan foldernya di `globals.css`: `@source "../components";`. Pastikan juga `globals.css` di-import di root layout.

**`ease-spring` atau `animate-pop-in` tidak berefek.**
Tema kit belum ada di `globals.css`-mu. Pasang `theme.json`, atau tempel blok pegas dari [Jalur 2](#tema-milikmu-tetap-utuh).

**`bg-primary/50` tidak transparan, atau warnanya aneh.**
Format token dan pemetaan warnamu tidak cocok. Hasil pasang lewat CLI memakai warna lengkap (`hsl(…)`), sedangkan hasil salin manual memakai triplet polos dengan `hsl(var(--primary))` di `@theme inline`. Jangan dicampur.

**`Cannot find module '@/lib/utils'`.**
Jalankan `npx shadcn@latest init`, atau tambahkan alias `@/*` di `tsconfig.json` lalu restart dev server.

**`Module not found: framer-motion`.**
`npm i framer-motion`.

**Peringatan hydration di `<html>`.**
Tambahkan `suppressHydrationWarning` di tag `<html>`, karena next-themes mengubah class-nya sebelum hydrate.

**Dark mode tidak berganti.**
Pakai `attribute="class"` di ThemeProvider, dan jangan hapus baris `@custom-variant dark` dari `globals.css` kit.

**Kacanya terlihat datar.**
Tidak ada warna di belakangnya. Tambahkan `GlassBackdrop`.

**Scroll tersendat di halaman yang penuh kaca.**
Kurangi jumlah permukaan blur yang tampil bersamaan, dan jangan pakai `saturate()`.

## Langkah berikutnya

- [Komponen](/id/components): semua komponen lengkap dengan demo langsung, perintah pasang, contoh pakai, dan kode sumbernya
- [Skill](/id#skills): panduan desain, dengan contoh sebelum dan sesudah
- [DESIGN.md](https://github.com/Zazaaw/p441z-style-kit/blob/main/docs/DESIGN.md): alasan di balik tampilan dan gerak kit ini
- [RECIPES.md](https://github.com/Zazaaw/p441z-style-kit/blob/main/docs/RECIPES.md): pola halaman siap pakai
- Mentok? [Buka issue](https://github.com/Zazaaw/p441z-style-kit/issues) di GitHub
