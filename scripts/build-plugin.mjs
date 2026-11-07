// Package Skill.md/ as a Claude Code plugin with its own marketplace, so the whole set installs in
// one step:
//   /plugin marketplace add Zazaaw/p441z-style-kit
//   /plugin install p441z-skills@p441z
// Run from the repo root after editing any skill:  node scripts/build-plugin.mjs
//
// Layout (Claude Code plugin docs): the marketplace lives at .claude-plugin/marketplace.json, the
// plugin in plugin/ with plugin/.claude-plugin/plugin.json, and every skill as
// plugin/skills/<frontmatter name>/SKILL.md. Skills are real copies, not symlinks (a GitHub install
// copies the plugin folder into a cache, and links that point outside it are dropped).
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "Skill.md");
const PLUGIN = join(ROOT, "plugin");
const REPO = "https://github.com/Zazaaw/p441z-style-kit";

// Only skills listed in the index table ship (drafts in the folder stay out).
const index = readFileSync(join(SRC, "README.md"), "utf8");
const listed = [...index.matchAll(/^\| \[(skill-[^\]]+\.md)\]/gm)].map((m) => m[1]);
const onDisk = new Set(readdirSync(SRC));

rmSync(join(PLUGIN, "skills"), { recursive: true, force: true });
const shipped = [];
for (const file of listed) {
  if (!onDisk.has(file)) throw new Error(`${file} is listed in Skill.md/README.md but missing on disk`);
  const src = readFileSync(join(SRC, file), "utf8");
  const fm = src.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) throw new Error(`${file}: no YAML frontmatter`);
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const description = fm[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) throw new Error(`${file}: frontmatter name must be lowercase kebab-case (got ${name})`);
  if (!description) throw new Error(`${file}: frontmatter description is missing`);
  if (description.length > 1536) throw new Error(`${file}: description is ${description.length} chars; Claude Code truncates the listing at 1,536`);
  mkdirSync(join(PLUGIN, "skills", name), { recursive: true });
  writeFileSync(join(PLUGIN, "skills", name, "SKILL.md"), src);
  shipped.push({ file, name, lines: src.split("\n").length });
}

const json = (v) => JSON.stringify(v, null, 2) + "\n";
mkdirSync(join(PLUGIN, ".claude-plugin"), { recursive: true });
writeFileSync(
  join(PLUGIN, ".claude-plugin", "plugin.json"),
  json({
    name: "p441z-skills",
    version: "1.0.0",
    displayName: "p441z Skills",
    description: `${shipped.length} working skills for AI coding agents: analysis, backend, database, testing, security, performance, debugging, git, dashboards, exports, docs, typography, dark mode, UI/UX taste, landing pages, and motion video.`,
    author: { name: "Faiz Hazim Hawari", url: "https://p441z.my.id" },
    homepage: "https://style.p441z.my.id",
    repository: REPO,
    license: "MIT",
    icon: ".claude-plugin/icon.png",
    keywords: ["skills", "design-system", "frontend", "backend", "typography", "dark-mode", "testing", "workflow"],
  }),
);
mkdirSync(join(ROOT, ".claude-plugin"), { recursive: true });
writeFileSync(
  join(ROOT, ".claude-plugin", "marketplace.json"),
  json({
    name: "p441z",
    owner: { name: "Faiz Hazim Hawari", url: "https://p441z.my.id" },
    description: "Skills and tools by p441z.",
    plugins: [{ name: "p441z-skills", source: "./plugin", description: "The p441z Skill.md collection, packaged as one plugin.", category: "productivity" }],
  }),
);

const table = shipped.map((s) => `| \`/p441z-skills:${s.name}\` | \`Skill.md/${s.file}\` | ${s.lines.toLocaleString("en-US")} |`).join("\n");
writeFileSync(
  join(PLUGIN, "README.md"),
  `# p441z Skills — Claude Code plugin

Generated from [\`Skill.md/\`](../Skill.md/) by \`node scripts/build-plugin.mjs\`. Do not edit the copies in
\`skills/\`; edit the originals and run the script again.

## Install

\`\`\`
/plugin marketplace add Zazaaw/p441z-style-kit
/plugin install p441z-skills@p441z
\`\`\`

From a shell: \`claude plugin marketplace add Zazaaw/p441z-style-kit\` then
\`claude plugin install p441z-skills@p441z --scope user\`.

Claude picks a skill up by itself when your request matches its description, or call one directly:

| Command | Source | Lines |
|---|---|---|
${table}

Every output made with these skills ends with the attribution line described in
[\`Skill.md/README.md\`](../Skill.md/README.md). Created by Faiz Hazim Hawari · MIT.
`,
);
console.log(`✓ plugin: ${shipped.length} skills → plugin/skills/, manifest + marketplace written`);
