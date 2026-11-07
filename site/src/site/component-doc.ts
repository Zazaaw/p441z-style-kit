import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// One page per installable component (/components/<name>), built from the shadcn registry the site
// already publishes (../registry.json) and the kit source it points at (../v4/…). Read at build time.

type RegistryItem = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  categories?: string[];
  files: { path: string }[];
};

export type ComponentDoc = {
  name: string;
  title: string;
  description: string;
  group: string;
  file: string;
  source: string;
  lines: number;
  intro: string[];
  usage: string;
  dependencies: string[];
  uses: string[];
  install: string;
  prev?: { name: string; title: string };
  next?: { name: string; title: string };
};

const ROOT = join(process.cwd(), "..");
const REGISTRY = "https://style.p441z.my.id/r";
const GROUP_ORDER = ["ui", "effects", "motion", "desktop", "mac"];

function items(): RegistryItem[] {
  const r = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8")) as { items: RegistryItem[] };
  return r.items
    .filter((i) => i.type === "registry:component" || i.type === "registry:ui")
    .map((i) => ({ ...i, categories: i.categories?.length ? i.categories : [i.type === "registry:ui" ? "ui" : (i.files[0]?.path.split("/").at(-2) ?? "other")] }))
    .sort((a, b) => GROUP_ORDER.indexOf(a.categories![0]) - GROUP_ORDER.indexOf(b.categories![0]) || (a.title ?? a.name).localeCompare(b.title ?? b.name));
}

/** The file's first JSDoc block → an intro (prose paragraphs) and a usage snippet (indented code). */
function parseDoc(src: string) {
  const block = src.match(/\/\*\*([\s\S]*?)\*\//)?.[1] ?? "";
  const lines = block.split("\n").map((l) => l.replace(/^\s*\*\s?/, ""));
  const intro: string[] = [];
  let para: string[] = [];
  let i = 0;
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s{2,}\S/.test(l) || /^[A-Z][A-Z0-9 &/—-]{3,}$/.test(l.trim())) break;
    if (!l.trim()) {
      if (para.length) intro.push(para.join(" "));
      para = [];
      continue;
    }
    para.push(l.trim());
  }
  if (para.length) intro.push(para.join(" "));
  const u = lines.findIndex((l) => /^USAGE\b/.test(l.trim()));
  const code: string[] = [];
  for (let k = u >= 0 ? u + 1 : i; k < lines.length; k++) {
    const l = lines[k];
    if (/^\s{2,}\S/.test(l) || !l.trim()) code.push(l);
    else if (code.some((c) => c.trim())) break;
  }
  const body = code.join("\n").replace(/^\n+|\n+$/g, "");
  const indent = Math.min(...body.split("\n").filter((l) => l.trim()).map((l) => l.match(/^\s*/)![0].length), 99);
  return { intro, usage: body.split("\n").map((l) => l.slice(indent)).join("\n") };
}

export function allComponents() {
  return items().map((i) => ({ name: i.name, title: i.title ?? i.name, description: i.description ?? "", group: i.categories![0] }));
}

export function loadComponentDoc(name: string): ComponentDoc | null {
  const list = items();
  const k = list.findIndex((i) => i.name === name);
  if (k < 0) return null;
  const it = list[k];
  const file = it.files[0].path;
  const source = readFileSync(join(ROOT, file), "utf8");
  const { intro, usage } = parseDoc(source);
  const near = (j: number) => (list[j] ? { name: list[j].name, title: list[j].title ?? list[j].name } : undefined);
  return {
    name: it.name,
    title: it.title ?? it.name,
    description: it.description ?? "",
    group: it.categories![0],
    file: file.replace(/^v4\//, ""),
    source,
    lines: source.split("\n").length,
    intro,
    usage,
    dependencies: it.dependencies ?? [],
    uses: (it.registryDependencies ?? []).map((d) => d.replace(/^.*\/r\//, "").replace(/\.json$/, "")).filter((d) => d !== "utils"),
    install: `npx shadcn@latest add ${REGISTRY}/${it.name}.json`,
    prev: near(k - 1),
    next: near(k + 1),
  };
}
