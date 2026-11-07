import type { Metadata } from "next";

import Home from "@/site/home";

export const metadata: Metadata = {
  title: "p441z Style Kit — desain tenang, motion ala keynote",
  description:
    "Design system tenang dan editorial untuk React + Tailwind: token greyscale, komponen ala shadcn, motion graphic kelas keynote, jendela gaya desktop, dan 15 skill siap pakai untuk agen AI.",
  alternates: { canonical: "/id", languages: { en: "/", id: "/id" } },
  openGraph: { title: "p441z Style Kit", description: "Desain tenang. Motion ala keynote.", url: "https://style.p441z.my.id/id", type: "website", locale: "id_ID" },
};

export default function Page() {
  return <Home lang="id" />;
}
