import type { Metadata } from "next";

import Home from "@/site/home";

export const metadata: Metadata = {
  title: "p441z Style Kit — desain kalem, motion seapik keynote",
  description:
    "Design system yang kalem untuk React + Tailwind: token abu-abu, komponen gaya shadcn, motion graphic sekelas keynote, jendela ala desktop, dan 15 skill yang bikin agen AI-mu berhenti kerja asal jadi.",
  alternates: { canonical: "/id", languages: { en: "/", id: "/id" } },
  openGraph: { title: "p441z Style Kit", description: "Desain kalem. Motion seapik keynote.", url: "https://style.p441z.my.id/id", type: "website", locale: "id_ID" },
};

export default function Page() {
  return <Home lang="id" />;
}
