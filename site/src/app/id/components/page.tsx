import type { Metadata } from "next";

import { ComponentIndex } from "@/site/component-page";

export const metadata: Metadata = {
  title: "Komponen — p441z Style Kit",
  description: "Semua komponen p441z Style Kit: UI, efek, motion, dan jendela desktop — masing-masing bisa dipasang lewat shadcn CLI.",
  alternates: { canonical: "/id/components", languages: { en: "/components", id: "/id/components" } },
};

export default function Page() {
  return <ComponentIndex lang="id" />;
}
