// Copy the kit (../v4) into this site so the site always runs the REAL kit files — one source of truth.
// Runs automatically before `dev` and `build`. The copies are gitignored; edit files in ../v4, never here.
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const site = join(dirname(fileURLToPath(import.meta.url)), "..");
const kit = join(site, "..", "v4");
const copy = (from, to) => {
  rmSync(join(site, to), { recursive: true, force: true });
  mkdirSync(dirname(join(site, to)), { recursive: true });
  cpSync(join(kit, from), join(site, to), { recursive: true });
};
copy("globals.css", "src/app/kit.css");
copy("lib", "src/lib");
copy("components", "src/components");
console.log("✓ kit synced from ../v4");
