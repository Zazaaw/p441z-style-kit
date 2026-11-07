import type { MetadataRoute } from "next";

import { allComponents } from "@/site/component-doc";
import { allSkillSlugs } from "@/site/skill-doc";

const BASE = "https://style.p441z.my.id";

/** Every page in both languages, each entry pointing at its counterpart (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const pair = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly",
    priority,
    alternates: { languages: { en: `${BASE}${path}`, id: `${BASE}/id${path === "/" ? "" : path}` } },
  });
  return [
    pair("/", 1),
    pair("/docs", 0.9),
    pair("/components", 0.8),
    ...allSkillSlugs().map(({ slug }) => pair(`/skills/${slug}`, 0.7)),
    ...allComponents().map(({ name }) => pair(`/components/${name}`, 0.6)),
  ];
}
