import "server-only";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const KIT = join(process.cwd(), "..", "v4", "components");

/** Component families exported across ../v4/components (hooks, helpers, and sub-parts excluded). */
export function kitComponents(): { name: string; group: string }[] {
  const out: { name: string; group: string }[] = [];
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (f.endsWith(".tsx")) {
        const src = readFileSync(p, "utf8");
        const re = /export\s+(?:default\s+)?(?:function\s+([A-Z]\w*)|const\s+([A-Z]\w*)\s*=)/g;
        const names = new Set<string>();
        for (const m of src.matchAll(re)) names.add(m[1] ?? m[2]);
        // `export { Button, buttonVariants }` style (shadcn files)
        for (const m of src.matchAll(/export\s*\{([^}]+)\}/g)) m[1].split(",").map((s) => s.trim()).filter((s) => /^[A-Z]/.test(s)).forEach((s) => names.add(s));
        // One family = one component: CardHeader/CardTitle… belong to Card. A file exporting only an
        // object (Typography) still counts once, named after the file.
        const fam = [...names].filter((n) => ![...names].some((o) => o !== n && n.startsWith(o)));
        if (!fam.length) fam.push(f.replace(/\.tsx$/, "").replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase()));
        fam.forEach((name) => out.push({ name, group: dir.split("/").pop()! }));
      }
    }
  };
  walk(KIT);
  return out;
}
