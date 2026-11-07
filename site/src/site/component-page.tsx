import { notFound } from "next/navigation";

import GlassPanel, { GlassBackdrop } from "@/components/effects/glass-panel";
import StackCard from "@/components/effects/stack-card";
import { DocPager } from "@/site/doc-pager";
import { LangProvider, type Lang } from "@/site/i18n";
import { allComponents, loadComponentDoc } from "@/site/component-doc";
import { ComponentDemo } from "@/site/component-demos";
import { ComponentThumb } from "@/site/component-thumbs";
import { DEMO_NAMES, SCENES } from "@/site/component-demo-names";
import { CopyCommand, DocTopBar } from "@/site/skill-page-client";

const REPO = "https://github.com/Zazaaw/p441z-style-kit";
const GROUPS: Record<string, [string, string]> = { ui: ["UI", "UI"], effects: ["Effects", "Efek"], motion: ["Motion", "Motion"], desktop: ["Desktop", "Desktop"], mac: ["Desktop", "Desktop"] };

/** One installable component: what it is, a live preview, install, usage, and the full source. */
export function ComponentPage({ lang, name }: { lang: Lang; name: string }) {
  const doc = loadComponentDoc(name);
  if (!doc) notFound();
  const t = (en: string, id: string) => (lang === "id" ? id : en);
  const home = lang === "id" ? "/id" : "/";
  const base = lang === "id" ? "/id/components" : "/components";
  const group = GROUPS[doc.group] ?? [doc.group, doc.group];

  return (
    <LangProvider lang={lang}>
      <DocTopBar crumb={doc.title} root={{ href: base, label: t("Components", "Komponen") }} paths={{ en: `/components/${name}`, id: `/id/components/${name}` }} />
      <main className="relative overflow-x-clip">
        <header className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 md:pt-20">
          <GlassBackdrop className="left-1/2 right-auto w-screen -translate-x-1/2" variant="b" />
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary">
            {t(group[0], group[1])} · {doc.file}
          </div>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">{doc.title}</h1>
          <p className="mt-3 max-w-3xl text-[18px] leading-relaxed text-muted-foreground">{doc.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-[12.5px]">
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 font-mono">{doc.lines.toLocaleString(lang === "id" ? "id-ID" : "en-US")} {t("lines", "baris")}</span>
            {doc.dependencies.map((d) => (
              <span key={d} className="rounded-full border border-border bg-background/70 px-3 py-1 font-mono text-muted-foreground">
                {d}
              </span>
            ))}
            <a href={`${REPO}/blob/main/v4/${doc.file}`} target="_blank" rel="noreferrer" className="rounded-full border border-border bg-background/70 px-3 py-1 text-primary hover:underline">
              GitHub ↗
            </a>
          </div>
          <div className="mt-8 max-w-3xl">
            <CopyCommand label={t("Install with the shadcn CLI", "Pasang lewat shadcn CLI")} command={doc.install} />
          </div>
        </header>

        <section aria-label={t("Preview", "Pratinjau")} className="mx-auto max-w-6xl px-6">
          <GlassPanel tilt={0} className="rounded-3xl" contentClassName="grid min-h-[300px] place-items-center p-8 md:p-12">
            {DEMO_NAMES.has(name) ? (
              <ComponentDemo name={name} />
            ) : (
              <div className="max-w-md text-center">
                <div className="font-display text-xl font-bold">{t("It needs a whole scene.", "Komponen ini butuh satu adegan utuh.")}</div>
                <p className="mt-2 text-[14px] text-muted-foreground">{t("See it working on the landing page — it's built from these components.", "Lihat langsung di landing page — halamannya dibangun dari komponen-komponen ini.")}</p>
                <a href={`${home}${SCENES[name] ?? ""}`} className="mt-4 inline-block text-[14px] font-semibold text-primary hover:underline">
                  {t("Open the live scene →", "Buka adegannya →")}
                </a>
              </div>
            )}
          </GlassPanel>
        </section>

        <div className="skill-prose mx-auto max-w-4xl px-6 pb-8 pt-14">
          {doc.intro.length > 0 && (
            <>
              <h2 id="about">{t("About", "Tentang")}</h2>
              {doc.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </>
          )}
          {doc.usage && (
            <>
              <h2 id="usage">{t("Usage", "Cara pakai")}</h2>
              <pre>
                <code>{doc.usage}</code>
              </pre>
            </>
          )}
          {doc.uses.length > 0 && (
            <>
              <h2 id="uses">{t("Installs with it", "Ikut terpasang")}</h2>
              <ul>
                {doc.uses.map((u) => (
                  <li key={u}>
                    <a href={`${base}/${u}`}>{u}</a>
                  </li>
                ))}
              </ul>
            </>
          )}
          <h2 id="source">{t("Source", "Kode sumber")}</h2>
          <details>
            <summary className="cursor-pointer font-medium text-foreground">
              {doc.file} · {doc.lines} {t("lines", "baris")}
            </summary>
            <pre>
              <code>{doc.source}</code>
            </pre>
          </details>
        </div>

        <DocPager
          label={t("More components", "Komponen lainnya")}
          prev={doc.prev && { href: `${base}/${doc.prev.name}`, title: doc.prev.title }}
          next={doc.next && { href: `${base}/${doc.next.name}`, title: doc.next.title }}
          prevLabel={t("Previous", "Sebelumnya")}
          nextLabel={t("Next", "Berikutnya")}
        />
      </main>
    </LangProvider>
  );
}

/** Every installable component, grouped, with a one-line description. */
export function ComponentIndex({ lang }: { lang: Lang }) {
  const t = (en: string, id: string) => (lang === "id" ? id : en);
  const base = lang === "id" ? "/id/components" : "/components";
  const list = allComponents();
  const groups = [...new Set(list.map((c) => c.group))];
  return (
    <LangProvider lang={lang}>
      <DocTopBar crumb={t("All", "Semua")} root={{ href: base, label: t("Components", "Komponen") }} paths={{ en: "/components", id: "/id/components" }} />
      <main className="relative overflow-x-clip">
        <header className="relative mx-auto max-w-6xl px-6 pb-6 pt-16 md:pt-20">
          <GlassBackdrop className="left-1/2 right-auto w-screen -translate-x-1/2" variant="c" />
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary">{t("Registry", "Registry")} · @p441z</div>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">
            {t(`${list.length} components, one command each.`, `${list.length} komponen, masing-masing satu perintah.`)}
          </h1>
          <p className="mt-3 max-w-2xl text-[18px] leading-relaxed text-muted-foreground">
            {t("Every one is a single file you own: install it with the shadcn CLI, read it, change it.", "Masing-masing satu file yang jadi milikmu: pasang lewat shadcn CLI, baca, lalu ubah sesukamu.")}
          </p>
        </header>
        <div className="mx-auto max-w-6xl space-y-14 px-6 pb-24 pt-8">
          {groups.map((g) => (
            <section key={g}>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t(GROUPS[g]?.[0] ?? g, GROUPS[g]?.[1] ?? g)}</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list
                  .filter((c) => c.group === g)
                  .map((c, i) => (
                    // A pile of sheets behind each card fans out on hover — the folder move, card-sized.
                    <StackCard key={c.name} className="h-full">
                    <GlassPanel delay={i * 40} press className="h-full p-0" contentClassName="h-full">
                      <a href={`${base}/${c.name}`} className="flex h-full flex-col">
                        <ComponentThumb name={c.name} />
                        <div className="p-5">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-display text-lg font-bold tracking-tight">{c.title}</span>
                        </div>
                        <p className="mt-1 text-[13.5px] leading-snug text-muted-foreground">{c.description}</p>
                        </div>
                      </a>
                    </GlassPanel>
                    </StackCard>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </LangProvider>
  );
}
