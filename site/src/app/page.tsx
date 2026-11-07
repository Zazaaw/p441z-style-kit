import type { Metadata } from "next";

import Home from "@/site/home";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { en: "/", id: "/id" } },
};

export default function Page() {
  return <Home lang="en" />;
}
