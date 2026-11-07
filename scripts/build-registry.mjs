// Build the @p441z shadcn registry from the kit itself (v4/). Run from the repo root:
//   node scripts/build-registry.mjs            → writes registry.json
//   npx shadcn@latest build ./registry.json --output ./site/public/r
// (or simply: cd site && npm run registry). BASE=… overrides the public URL (e.g. for local tests).
//
// Every file in v4/components and v4/lib becomes one item. npm dependencies and links between items
// are read from each file's imports; titles and descriptions from its JSDoc header. The theme item is
// translated from v4/globals.css — tokens, the hsl() color mapping, animations, keyframes, base layer.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const KIT = join(ROOT, "v4");
const BASE = (process.env.BASE || "https://style.p441z.my.id").replace(/\/$/, "");
const url = (name) => `${BASE}/r/${name}.json`;

// ── Items from files ─────────────────────────────────────────────────────────
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : /\.(tsx?|ts)$/.test(f) && files.push(join(d, f))));
walk(join(KIT, "components"));
walk(join(KIT, "lib"));

// File → item name. The desktop window gets a prefix so it never shadows a generic "window".
const nameOf = (abs) => {
  const rel = relative(KIT, abs).replace(/\\/g, "/");
  const base = basename(rel).replace(/\.tsx?$/, "");
  if (rel === "components/mac/window.tsx") return "mac-window";
  return base;
};
const byImport = new Map(files.map((f) => [`@/${relative(KIT, f).replace(/\\/g, "/").replace(/\.tsx?$/, "")}`, nameOf(f)]));
const BUILTIN = new Set(["react", "react-dom", "next", "react/jsx-runtime"]);

// Catalog copy: one short line per item (shown in the CLI, the registry, and the site's catalog).
// Anything not listed falls back to the first sentence of the file's JSDoc.
const COPY = {
  button: ["Button", "6 variants × 4 sizes, asChild for links."],
  badge: ["Badge", "Small labels for tags, counts, and status."],
  card: ["Card", "The base surface, in six composable parts."],
  input: ["Input", "Text field that sits flush with Button."],
  "page-header": ["PageHeader", "Title, muted subtitle, and an action slot."],
  "pill-tabs": ["PillTabs", "Rounded segmented filter that scrolls on mobile."],
  skeleton: ["Skeleton", "Theme-aware pulsing placeholder."],
  typography: ["Typography", "H1–H4, P, and quote on one text scale."],
  "blur-fade": ["BlurFade", "The signature entrance: fade, un-blur, drift."],
  "dot-pattern": ["DotPattern", "Ambient dot grid for backgrounds."],
  "grid-pattern": ["GridPattern", "Line grid whose cells softly twinkle."],
  "spotlight-card": ["SpotlightCard", "A card lit by the pointer, border included."],
  magnetic: ["Magnetic", "Leans toward the pointer, springs back."],
  marquee: ["Marquee", "Endless seamless ribbon, pauses on hover."],
  aurora: ["Aurora", "Slow blurred light behind a hero."],
  "border-beam": ["BorderBeam", "A beam of light circling a card's border."],
  "glass-panel": ["GlassPanel", "Frosted glass with a light rim, a pointer specular, and an entrance."],
  "mask-reveal": ["MaskReveal", "Keynote headline: words rise from a mask."],
  "karaoke-text": ["KaraokeText", "Words light up like a narrator — by time or scroll."],
  "word-rotator": ["WordRotator", "One word that keeps changing, without reflow."],
  "count-up": ["CountUp", "Counts to its value in view, digits never wobble."],
  "device-frame": ["LaptopFrame · PhoneFrame", "Brandless CSS devices that size to their container."],
  "virtual-camera": ["VirtualCamera", "Zooms and glides across a UI like a film camera."],
  "soft-cursor": ["SoftCursor", "A hand-like pointer that clicks without red rings."],
  "flying-pill": ["FlyingPill", "A message that flies from one place to another."],
  "element-lift": ["ElementLift", "A card rises, flips in 3D, and flies home."],
  "logo-collapse": ["LogoCollapse", "Outro: feature cards pull into the logo."],
  stepper: ["Stepper", "Story progress with a gliding active pill."],
  "mac-window": ["MacWindow · TrafficLights", "Window with traffic lights and a centered title."],
  terminal: ["Terminal", "Commands type themselves; one-click copy."],
  dock: ["Dock", "Icons magnify near the pointer, with labels."],
  spotlight: ["Spotlight", "⌘K command palette, fully keyboard driven."],
  notification: ["Notifications", "Frosted banners that slide in and stack."],
  "menu-bar": ["MenuBar", "Slim frosted top bar with menus and a clock."],
  utils: ["utils", "cn() — clsx + tailwind-merge."],
  motion: ["motion", "Shared easing curves and durations."],
  "use-hydrated": ["useHydrated", "True after hydration, without setState-in-effect."],
};

const items = files.map((abs) => {
  const rel = relative(KIT, abs).replace(/\\/g, "/");
  const src = readFileSync(abs, "utf8");
  const name = nameOf(abs);
  const group = rel.split("/")[1];
  const isLib = rel.startsWith("lib/");
  const deps = new Set();
  const reg = new Set();
  for (const m of src.matchAll(/from\s+["']([^"']+)["']/g)) {
    const spec = m[1];
    if (spec.startsWith("@/")) {
      const target = byImport.get(spec);
      if (target && target !== name) reg.add(url(target));
    } else if (!spec.startsWith(".") && !spec.startsWith("node:")) {
      const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
      if (!BUILTIN.has(pkg)) deps.add(pkg);
    }
  }
  // Title + description from the JSDoc header: "Name — what it does." (first sentence).
  const doc = src.match(/\/\*\*([\s\S]*?)\*\//)?.[1].replace(/^\s*\* ?/gm, "").trim() ?? "";
  const head = doc.split("\n\n")[0].replace(/\s+/g, " ");
  const [title, rest] = head.includes(" — ") ? head.split(" — ") : [name, head];
  const sentence = (rest ?? "").split(/(?<=\.)\s/)[0].replace(/`/g, "");
  const description = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  const type = isLib ? "registry:lib" : group === "ui" ? "registry:ui" : "registry:component";
  const target = isLib ? `@lib/${basename(rel)}` : group === "ui" ? undefined : `@components/${group}/${basename(rel)}`;
  const [cTitle, cDesc] = COPY[name] ?? [];
  return {
    name,
    type,
    title: cTitle ?? title.split(" & ")[0].split(" · ")[0].trim(),
    description: cDesc ?? (description || `${name} from the p441z Style Kit.`),
    ...(deps.size ? { dependencies: [...deps].sort() } : {}),
    ...(reg.size ? { registryDependencies: [...reg].sort() } : {}),
    categories: [isLib ? "lib" : group === "mac" ? "desktop" : group],
    files: [{ path: `v4/${rel}`, type, ...(target ? { target } : {}) }],
  };
});

// ── Theme from globals.css ───────────────────────────────────────────────────
// A tiny CSS reader: enough for the kit's own file (blocks, declarations, nested at-rules).
const css = readFileSync(join(KIT, "globals.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
function parse(text) {
  const out = [];
  let i = 0;
  const readBlock = () => {
    const body = [];
    let buf = "";
    while (i < text.length) {
      const c = text[i++];
      if (c === "{") {
        body.push({ sel: buf.trim(), body: readBlock() });
        buf = "";
      } else if (c === "}") {
        if (buf.trim()) body.push({ decl: buf.trim() });
        return body;
      } else if (c === ";") {
        if (buf.trim()) body.push({ decl: buf.trim() });
        buf = "";
      } else buf += c;
    }
    if (buf.trim()) body.push({ decl: buf.trim() });
    return body;
  };
  out.push(...readBlock());
  return out;
}
const toObj = (body) =>
  Object.fromEntries(
    body.map((n) => {
      if (n.decl) {
        const k = n.decl.slice(0, n.decl.indexOf(":")).trim();
        return [k, n.decl.slice(n.decl.indexOf(":") + 1).trim()];
      }
      return [n.sel.replace(/\s+/g, " "), toObj(n.body)];
    }),
  );
const vars = (body) => Object.fromEntries(body.filter((n) => n.decl?.startsWith("--")).map((n) => [n.decl.slice(2, n.decl.indexOf(":")).trim(), n.decl.slice(n.decl.indexOf(":") + 1).trim()]));

// shadcn projects (Tailwind v4) hold FULL colors in their tokens and generate `--color-x: var(--x)`
// themselves. So: ship tokens as hsl(…) colors, skip the kit's own color mapping, and rewrite the
// kit's `hsl(var(--x) / a)` rules into color-mix() so they work on full-color tokens.
const TRIPLET = /^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/;
const asColor = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, TRIPLET.test(v) ? `hsl(${v})` : v]));
const fullColor = (v) =>
  typeof v === "string"
    ? v
        .replace(/hsl\(var\((--[\w-]+)\)\s*\/\s*([\d.]+)\)/g, (_, x, a) => `color-mix(in oklab, var(${x}) ${Math.round(Number(a) * 100)}%, transparent)`)
        .replace(/hsl\(var\((--[\w-]+)\)\)/g, "var($1)")
    : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fullColor(x)]));

const tree = parse(css);
const light = {}, dark = {}, theme = {}, rules = {};
for (const n of tree) {
  if (!n.sel) continue;
  if (n.sel === ":root") Object.assign(light, vars(n.body));
  else if (n.sel === ".dark") Object.assign(dark, vars(n.body));
  else if (n.sel.startsWith("@theme")) {
    Object.assign(theme, vars(n.body));
    for (const k of n.body.filter((x) => x.sel?.startsWith("@keyframes"))) rules[k.sel] = toObj(k.body);
  } else if (n.sel === "@layer base") rules["@layer base"] = { ...(rules["@layer base"] ?? {}), ...toObj(n.body) };
  else if (!n.sel.startsWith("@")) rules["@layer base"] = { ...(rules["@layer base"] ?? {}), [n.sel.replace(/\s+/g, " ")]: toObj(n.body) };
}

const themeItem = {
  name: "theme",
  type: "registry:theme",
  title: "p441z theme",
  description: "Greyscale tokens (HSL triplets), the hsl() color mapping, radius scale, 13 animations with keyframes, and the pill scrollbar.",
  dependencies: ["tw-animate-css"],
  cssVars: {
    theme: Object.fromEntries(Object.entries(theme).filter(([k]) => !k.startsWith("color-"))),
    light: asColor(light),
    dark: asColor(dark),
  },
  css: fullColor(rules),
};

// The bundle carries the theme itself (not as a dependency): shadcn only overwrites existing tokens
// for the item you add directly, so this is what makes one command install the kit's real palette.
const everything = {
  name: "style-kit",
  type: "registry:theme",
  title: "p441z Style Kit",
  description: "Everything: the theme plus every UI, effect, motion, and desktop component.",
  dependencies: themeItem.dependencies,
  registryDependencies: items.map((i) => url(i.name)),
  cssVars: themeItem.cssVars,
  css: themeItem.css,
};

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "p441z",
  homepage: BASE,
  items: [everything, themeItem, ...items.sort((a, b) => a.categories[0].localeCompare(b.categories[0]) || a.name.localeCompare(b.name))],
};
writeFileSync(join(ROOT, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`✓ registry.json — ${registry.items.length} items (base ${BASE})`);
for (const i of registry.items) console.log(`  ${i.type.padEnd(19)} ${i.name.padEnd(16)} ${(i.dependencies ?? []).join(" ")}`);
