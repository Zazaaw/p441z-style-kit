import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { loadSkills, type Skill } from "@/site/skills-data";

// One page per skill (/skills/<slug>, /id/skills/<slug>): the whole markdown rendered at build time,
// with a table of contents from its ## headings. Skills are this repo's own files, so the HTML is
// trusted; nothing user-supplied is rendered here.

import { renderMarkdown as render, type TocItem } from "@/site/markdown";
import { skillSlug } from "@/site/skill-slug";

export { skillSlug };
export type { TocItem };

export type SkillDoc = { skill: Skill; slug: string; html: string; toc: TocItem[]; prev?: { slug: string; title: string }; next?: { slug: string; title: string } };

export function loadSkillDoc(slug: string, lang: "en" | "id" = "en"): SkillDoc | null {
  const skills = loadSkills(lang);
  const i = skills.findIndex((s) => skillSlug(s.file) === slug);
  if (i < 0) return null;
  const skill = skills[i];
  const src = readFileSync(join(process.cwd(), "..", "Skill.md", skill.file), "utf8");
  // Drop the YAML frontmatter and the first H1 (the page header shows the title).
  const body = src.replace(/^---\n[\s\S]*?\n---\n/, "").replace(/^\s*# .+\n/, "");
  const { html, toc } = render(body);
  const near = (k: number) => (skills[k] ? { slug: skillSlug(skills[k].file), title: skills[k].title } : undefined);
  return { skill, slug, html, toc, prev: near(i - 1), next: near(i + 1) };
}

export const allSkillSlugs = () => loadSkills().map((s) => ({ slug: skillSlug(s.file) }));
