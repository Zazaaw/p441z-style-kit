import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type CatalogItem = { name: string; title: string; description: string; group: "ui" | "effects" | "motion" | "desktop" };

/** Components for the hero catalog, straight from the registry (../registry.json) — always in sync with v4/. */
export function loadCatalog(): CatalogItem[] {
  const reg = JSON.parse(readFileSync(join(process.cwd(), "..", "registry.json"), "utf8")) as {
    items: { name: string; title: string; description: string; categories?: string[] }[];
  };
  return reg.items
    .filter((i) => i.categories && i.categories[0] !== "lib")
    .map((i) => ({ name: i.name, title: i.title, description: i.description, group: i.categories![0] as CatalogItem["group"] }));
}
