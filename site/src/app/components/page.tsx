import type { Metadata } from "next";

import { ComponentIndex } from "@/site/component-page";

export const metadata: Metadata = {
  title: "Components — p441z Style Kit",
  description: "Every component in the p441z Style Kit: UI, effects, motion, and desktop windows — each one installable with the shadcn CLI.",
  alternates: { canonical: "/components", languages: { en: "/components", id: "/id/components" } },
};

export default function Page() {
  return <ComponentIndex lang="en" />;
}
