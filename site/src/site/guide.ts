import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { renderMarkdown } from "@/site/markdown";

// The getting-started guide (/docs, /id/docs). Two hand-written Markdown files in site/content —
// the Indonesian one is its own copy, not a translation — rendered at build time.
export function loadGuide(lang: "en" | "id") {
  const src = readFileSync(join(process.cwd(), "content", `docs.${lang}.md`), "utf8");
  return renderMarkdown(src);
}
