import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Skills are read from ../Skill.md at build time — add a skill there and the site picks it up.
export type Skill = {
  file: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  when: string;
  lines: number;
  summary: string[];
  outline: string[];
};

const DIR = join(process.cwd(), "..", "Skill.md");
const plain = (t: string) => t.replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();

const TITLE: Record<string, [string, string]> = {
  "skill-analysis.md": ["Analysis", "Don't ship half-baked work"],
  "skill-backend.api.md": ["Backend & API", "Clear contracts, visible failures"],
  "skill-database.md": ["Database", "Schemas that survive growth"],
  "skill-testing.md": ["Testing", "Proof, not feelings"],
  "skill-security.md": ["Security", "Safe on the server side"],
  "skill-performance.md": ["Performance", "Fast on real data"],
  "skill-debugging.md": ["Debugging", "Find the root, not the symptom"],
  "skill-git.workflow.md": ["Git & Code Review", "Small, clear, traceable"],
  "skill-dashboard.md": ["Dashboard & Admin", "Data people actually use"],
  "skill-export.report.md": ["Export & Reports", "Proud to send it to the boss"],
  "skill-documentation.md": ["Documentation", "Written for the person who doesn't know yet"],
  "skill-typography.md": ["Typography", "Every size has a reason"],
  "skill-ui.ux.md": ["UI / UX Taste", "Anti-slop frontend"],
  "skill-landing.page.md": ["Landing Page", "Strict design build prompt"],
  "skill-motion.video.md": ["Motion Video", "Product tutorials that feel like a keynote"],
};

export function loadSkills(): Skill[] {
  const index = readFileSync(join(DIR, "README.md"), "utf8");
  // Order and membership follow the folder index table — unlisted drafts stay off the site.
  const rows = index.split("\n").filter((l) => /^\| \[skill-[^\]]+\.md\]/.test(l));
  const listed = new Set(readdirSync(DIR));
  return rows
    .map((row) => {
      const cols = row.split("|").map((c) => c.trim());
      const file = cols[1].match(/\[(skill-[^\]]+\.md)\]/)![1];
      if (!listed.has(file)) return null;
      const src = readFileSync(join(DIR, file), "utf8");
      const m = src.match(/^##[^\n]*(One-screen summary|Ringkasan satu layar)[^\n]*\n[\s\S]*?^```[^\n]*\n([\s\S]*?)^```/m);
      const summary = m ? m[2].split("\n").filter((l) => l.trim() && !/^─+$/.test(l.trim()) && !/^[A-Z][A-Z-]+ — /.test(l.trim())) : [];
      const outline = (src.match(/^## (?!Attribution)[^\n]+/gm) ?? []).map((h) => h.replace(/^## /, "").replace(/^\d+\.\s*/, "").replace(/\s*\([^)]*\)/g, "").replace(/[🎯]/gu, "").trim());
      const [title, tagline] = TITLE[file] ?? [file.replace(/^skill-|\.md$/g, ""), ""];
      return {
        file,
        name: src.match(/^name:\s*(.+)$/m)?.[1].trim() ?? file.replace(/\.md$/, ""),
        title,
        tagline,
        description: plain(cols[3] ?? ""),
        when: plain(cols[4] ?? ""),
        lines: src.split("\n").length,
        summary,
        outline,
      } satisfies Skill;
    })
    .filter((s): s is Skill => s !== null);
}
