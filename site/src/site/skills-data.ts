import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Skills are read from ../Skill.md at build time — add a skill there and the site picks it up.
export type Skill = {
  file: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  when: string;
  lines: number;
  summary: string[];
  outline: string[];
};

const DIR = join(process.cwd(), "..", "Skill.md");
const plain = (t: string) => t.replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();

const TITLE: Record<string, [string, string]> = {
  "skill-analysis.md": ["Analysis", "Don't ship half-baked work"],
  "skill-backend.api.md": ["Backend & API", "Clear contracts, visible failures"],
  "skill-database.md": ["Database", "Schemas that survive growth"],
  "skill-testing.md": ["Testing", "Proof, not feelings"],
  "skill-security.md": ["Security", "Safe on the server side"],
  "skill-performance.md": ["Performance", "Fast on real data"],
  "skill-debugging.md": ["Debugging", "Find the root, not the symptom"],
  "skill-git.workflow.md": ["Git & Code Review", "Small, clear, traceable"],
  "skill-dashboard.md": ["Dashboard & Admin", "Data people actually use"],
  "skill-export.report.md": ["Export & Reports", "Proud to send it to the boss"],
  "skill-documentation.md": ["Documentation", "Written for the person who doesn't know yet"],
  "skill-typography.md": ["Typography", "Every size has a reason"],
  "skill-ui.ux.md": ["UI / UX Taste", "Anti-slop frontend"],
  "skill-landing.page.md": ["Landing Page", "Strict design build prompt"],
  "skill-motion.video.md": ["Motion Video", "Product tutorials that feel like a keynote"],
  "skill-darkmode.md": ["Dark Mode", "One token swap, no flash"],
};

// Indonesian copy for the /id page: [title, tagline, what it covers, when to open it].
// The summary/outline lines stay as written in the skill files (they are technical, monospaced).
const ID: Record<string, [string, string, string, string]> = {
  "skill-analysis.md": ["Analisis", "Tak ada kerja setengah matang", "Pahami alurnya, petakan dampaknya, cek ulang dari sisi pengguna, laporkan apa adanya.", "Selalu. Ini fondasi semua skill lain"],
  "skill-backend.api.md": ["Backend & API", "Kontrak jelas, error terus terang", "Merancang dan membangun backend/API: kontrak, validasi, bentuk error, otorisasi, paginasi, background job, webhook", "Saat membuat atau mengubah endpoint, service, integrasi"],
  "skill-database.md": ["Database", "Skema yang tahan saat data membengkak", "Skema, query, indeks, transaksi, migrasi yang aman, multi-tenant, zona waktu", "Saat menyentuh tabel, query, atau migrasi"],
  "skill-testing.md": ["Testing", "Bukti, bukan firasat", "Strategi dan penulisan tes: unit, integrasi, e2e, data ekstrem, regresi, cara agen AI memverifikasi kerjanya sendiri", "Tiap fitur atau perbaikan bug, sebelum bilang “selesai”"],
  "skill-security.md": ["Keamanan", "Aman dari sisi server", "Keamanan web defensif: autentikasi, otorisasi, injection, XSS/CSRF, unggahan, secret, logging", "Fitur yang menyentuh data pengguna, hak akses, file, atau login"],
  "skill-performance.md": ["Performa", "Tetap kencang di data sungguhan", "Ukur dulu, baru perbaiki: query, cache, bundle, gambar, rendering, pertumbuhan data", "Halaman/endpoint lambat, atau data yang bakal membesar"],
  "skill-debugging.md": ["Debugging", "Cari akarnya, bukan gejalanya", "Cari akar masalah, bukan gejala: reproduksi, persempit, bikin hipotesis, verifikasi, cegah terulang", "Bug, error, atau masalah yang “kadang muncul, kadang tidak”"],
  "skill-git.workflow.md": ["Git & Code Review", "Kecil, jelas, bisa dilacak", "Commit granular, pesan lengkap, branching, PR, code review, revert, push hanya saat diminta", "Setiap kali kerja disimpan ke git atau di-review"],
  "skill-dashboard.md": ["Dashboard & Admin", "Data yang benar-benar dipakai orang", "Dashboard, panel admin, CRUD: tabel yang jujur, filter, form, tampilan kosong/memuat/error, hak akses di UI", "Membangun halaman internal, layar admin, laporan di layar"],
  "skill-export.report.md": ["Ekspor & Laporan", "Pantas dikirim ke atasan", "Ekspor dan laporan Excel/PDF/CSV: tata letak rapi, angka benar, ikut filter, tanpa timeout", "Membuat atau mengubah ekspor, impor, tampilan cetak"],
  "skill-documentation.md": ["Dokumentasi", "Ditulis untuk orang yang baru datang", "README, panduan setup, dokumentasi API, ADR, changelog, deskripsi PR, dokumen serah terima, runbook, instruksi agen AI", "Saat menulis atau memperbarui dokumen apa pun"],
  "skill-typography.md": ["Tipografi", "Setiap ukuran punya alasan", "Tipografi sebagai sistem: memilih dan memadukan huruf (Plus Jakarta Sans, Inter, SF Pro), skala golden ratio dengan setiap ukuran ×/÷ 1,618, line-height, ketebalan, cara memuat font, dan keterbacaan", "Setiap kali menentukan hierarki teks, pilihan font, atau ukuran huruf"],
  "skill-ui.ux.md": ["Selera UI / UX", "Frontend yang anti asal jadi", "Frontend yang anti asal jadi untuk landing page, portofolio, dan redesain", "Halaman publik yang butuh selera desain sungguhan"],
  "skill-landing.page.md": ["Landing Page", "Prompt desain yang ketat", "Prompt build ketat untuk hero satu layar (carousel + marquee)", "Meniru desain hero sampai presisi ke piksel"],
  "skill-motion.video.md": ["Video Motion", "Tutorial produk serasa keynote", "Video tutorial dan penjelasan bergaya keynote untuk aplikasi web: naskah, animatic, TTS per kalimat dengan timestamp kata, rekaman layar CDP asli dengan data disamarkan, komposisi Remotion, suara, render 60fps, ekspor web", "Membuat atau merevisi video tutorial, walkthrough, atau penjelasan software"],
  "skill-darkmode.md": ["Mode Gelap", "Satu tukar token, tanpa kedip", "Mode gelap sebagai satu tukar token: variabel CSS semantik di bawah satu atribut, skrip sebelum halaman tergambar (tanpa kedip putih), pilihan terang/gelap/sistem, crossfade View Transitions, warna brand tetap, dokumen cetak tetap terang", "Saat menambah mode gelap, memperbaiki kedip putih, atau menghaluskan pergantian tema"],
};

export function loadSkills(lang: "en" | "id" = "en"): Skill[] {
  const index = readFileSync(join(DIR, "README.md"), "utf8");
  // Order and membership follow the folder index table — unlisted drafts stay off the site.
  const rows = index.split("\n").filter((l) => /^\| \[skill-[^\]]+\.md\]/.test(l));
  const listed = new Set(readdirSync(DIR));
  return rows
    .map((row) => {
      const cols = row.split("|").map((c) => c.trim());
      const file = cols[1].match(/\[(skill-[^\]]+\.md)\]/)![1];
      if (!listed.has(file)) return null;
      const src = readFileSync(join(DIR, file), "utf8");
      const m = src.match(/^##[^\n]*(One-screen summary|Ringkasan satu layar)[^\n]*\n[\s\S]*?^```[^\n]*\n([\s\S]*?)^```/m);
      const summary = m ? m[2].split("\n").filter((l) => l.trim() && !/^─+$/.test(l.trim()) && !/^[A-Z][A-Z-]+ — /.test(l.trim())) : [];
      const outline = (src.match(/^## (?!Attribution)[^\n]+/gm) ?? []).map((h) => h.replace(/^## /, "").replace(/^\d+\.\s*/, "").replace(/\s*\([^)]*\)/g, "").replace(/[🎯]/gu, "").trim());
      const [title, tagline] = (lang === "id" && ID[file]) || TITLE[file] || [file.replace(/^skill-|\.md$/g, ""), ""];
      const id = lang === "id" ? ID[file] : undefined;
      return {
        file,
        name: src.match(/^name:\s*(.+)$/m)?.[1].trim() ?? file.replace(/\.md$/, ""),
        title,
        tagline,
        description: id?.[2] ?? plain(cols[3] ?? ""),
        when: id?.[3] ?? plain(cols[4] ?? ""),
        lines: src.split("\n").length,
        summary,
        outline,
      } satisfies Skill;
    })
    .filter((s): s is Skill => s !== null);
}
