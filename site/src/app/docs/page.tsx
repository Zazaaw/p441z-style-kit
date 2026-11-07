import type { Metadata } from "next";

import { GuidePage } from "@/site/guide-page";

export const metadata: Metadata = {
  title: "Getting started — p441z Style Kit",
  description: "Install the p441z Style Kit step by step: one command with the shadcn CLI, single components, the Claude Code skills plugin, or a manual copy — plus fonts, brand color, dark mode, and troubleshooting.",
  alternates: { canonical: "/docs", languages: { en: "/docs", id: "/id/docs" } },
};

export default function Page() {
  return <GuidePage lang="en" />;
}
