import type { Metadata } from "next";

import { GuidePage } from "@/site/guide-page";

export const metadata: Metadata = {
  title: "Mulai — p441z Style Kit",
  description: "Cara memasang p441z Style Kit langkah demi langkah: satu perintah lewat shadcn CLI, komponen satuan, plugin skill Claude Code, atau salin manual. Lengkap dengan font, warna brand, dark mode, dan solusi masalah.",
  alternates: { canonical: "/id/docs", languages: { en: "/docs", id: "/id/docs" } },
};

export default function Page() {
  return <GuidePage lang="id" />;
}
