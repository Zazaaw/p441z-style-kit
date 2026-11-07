import "server-only";
import { Marked } from "marked";

// Markdown → HTML for the doc pages (skills, the getting-started guide). Build time only, and only
// this repo's own files are rendered, so the HTML is trusted.

export type TocItem = { id: string; text: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

/** Headings get ids and anchors (## ones also go in the TOC); tables scroll in their own box. */
export function renderMarkdown(markdown: string) {
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

