import type { Metadata } from "next";

import Home from "@/site/home";

export const metadata: Metadata = {
  title: "p441z Style Kit — desain kalem, motion sekelas keynote",
  description:
    "Design system yang kalem untuk React + Tailwind: token abu-abu, komponen gaya shadcn, motion graphic sekelas keynote, jendela ala desktop, plus 15 skill supaya agen AI-mu tidak lagi kerja asal jadi.",
  alternates: { canonical: "/id", languages: { en: "/", id: "/id" } },
  openGraph: { title: "p441z Style Kit", description: "Desain kalem. Motion sekelas keynote.", url: "https://style.p441z.my.id/id", type: "website", locale: "id_ID" },
};

export default function Page() {
  return <Home lang="id" />;
}
