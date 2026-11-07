import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Marked } from "marked";

import { loadSkills, type Skill } from "@/site/skills-data";

// One page per skill (/skills/<slug>, /id/skills/<slug>): the whole markdown rendered at build time,
// with a table of contents from its ## headings. Skills are this repo's own files, so the HTML is
// trusted; nothing user-supplied is rendered here.

import { skillSlug } from "@/site/skill-slug";

export { skillSlug };

export type TocItem = { id: string; text: string };
export type SkillDoc = { skill: Skill; slug: string; html: string; toc: TocItem[]; prev?: { slug: string; title: string }; next?: { slug: string; title: string } };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

function render(markdown: string) {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();
  const md = new Marked({ gfm: true });
  md.use({
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        let id = slugify(text) || `section-${seen.size + 1}`;
        const n = seen.get(id) ?? 0;
        seen.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        if (depth === 2) toc.push({ id, text: text.replace(/[`*_]/g, "").replace(/^\d+\.\s*/, "") });
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${depth}>\n`;
      },
    },
  });
  // Wide tables scroll inside their own box instead of widening the page.
  const html = (md.parse(markdown, { async: false }) as string).replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, "</table></div>")
    // Checklist items: a decorative box instead of an unlabelled disabled checkbox (the text says it all).
    .replace(/<input (checked="" )?disabled="" type="checkbox">/g, (_, done) => `<span class="task-box${done ? " is-done" : ""}" aria-hidden="true"></span>`);
  return { html, toc };
}

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
