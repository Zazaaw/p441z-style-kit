import { notFound } from "next/navigation";

import { GlassBackdrop } from "@/components/effects/glass-panel";
import { DocPager } from "@/site/doc-pager";
import { LangProvider, type Lang } from "@/site/i18n";
import { loadSkillDoc } from "@/site/skill-doc";
import { CopyCommand, DocToc, DocTopBar } from "@/site/skill-page-client";
import { SkillPreview } from "@/site/skill-previews";
import { ProseCopy } from "@/site/prose-copy";

const REPO = "https://github.com/Zazaaw/p441z-style-kit";

/** A whole skill as a page: header with both install routes, the before/after, a sticky table of
 *  contents, and the full guide. Server-rendered and static; the interactive bits are client islands. */
export function SkillPage({ lang, slug }: { lang: Lang; slug: string }) {
  const doc = loadSkillDoc(slug, lang);
  if (!doc) notFound();
  const { skill, html, toc, prev, next } = doc;
  const t = (en: string, id: string) => (lang === "id" ? id : en);
  const num = (n: number) => n.toLocaleString(lang === "id" ? "id-ID" : "en-US");
  const base = lang === "id" ? "/id/skills" : "/skills";
  const single = `mkdir -p .claude/skills/${skill.name} && curl -fsSL https://raw.githubusercontent.com/Zazaaw/p441z-style-kit/main/Skill.md/${skill.file} -o .claude/skills/${skill.name}/SKILL.md`;

  return (
    <LangProvider lang={lang}>
      <DocTopBar crumb={skill.title} paths={{ en: `/skills/${slug}`, id: `/id/skills/${slug}` }} />
      <main className="relative overflow-x-clip">
        <header className="relative mx-auto max-w-6xl px-6 pb-12 pt-16 md:pt-20">
          <GlassBackdrop className="left-1/2 right-auto w-screen -translate-x-1/2" variant="a" />
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary">Skill.md · {skill.name}</div>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">{skill.title}</h1>
          <p className="mt-2 font-display text-[clamp(1.15rem,2vw,1.5rem)] font-semibold text-muted-foreground">{skill.tagline}</p>
          <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-muted-foreground">{skill.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-[12.5px]">
            <span className="rounded-full border border-border bg-background/70 px-3 py-1">
              <span className="text-muted-foreground">{t("Open it when", "Pakai saat")} · </span>
              {skill.when}
            </span>
            <span className="rounded-full border border-border bg-background/70 px-3 py-1 font-mono">{num(skill.lines)} {t("lines", "baris")}</span>
            <a href={`${REPO}/blob/main/Skill.md/${skill.file}`} target="_blank" rel="noreferrer" className="rounded-full border border-border bg-background/70 px-3 py-1 text-primary hover:underline">
              GitHub ↗
            </a>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <CopyCommand label={t("Every skill, as a Claude Code plugin", "Semua skill, sebagai plugin Claude Code")} command="/plugin install p441z-skills@p441z" />
            <CopyCommand label={t("Just this one, into your project", "Hanya skill ini, ke project-mu")} command={single} />
          </div>
          <p className="mt-3 text-[12.5px] text-muted-foreground">
            {t("First time with the plugin? Add the marketplace once:", "Baru pertama pakai plugin-nya? Tambahkan marketplace-nya sekali:")} <code className="font-mono text-foreground">/plugin marketplace add Zazaaw/p441z-style-kit</code>{" "}
            · <a href={lang === "id" ? "/id/docs#jalur-3-skill-untuk-agen-ai-mu" : "/docs#route-3-skills-for-your-ai-agent"} className="font-semibold text-primary">{t("Full guide", "Panduan lengkap")} <span aria-hidden className="arrow">→</span></a>
          </p>
        </header>

        <section className="mx-auto max-w-4xl px-6">
          <SkillPreview file={skill.file} />
        </section>

        <div className="mx-auto mt-16 grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside>
            <DocToc items={toc} title={t("On this page", "Di halaman ini")} />
          </aside>
          <article className="skill-prose min-w-0" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <ProseCopy />

        <DocPager
          label={t("More skills", "Skill lainnya")}
          prev={prev && { href: `${base}/${prev.slug}`, title: prev.title }}
          next={next && { href: `${base}/${next.slug}`, title: next.title }}
          prevLabel={t("Previous", "Sebelumnya")}
          nextLabel={t("Next", "Berikutnya")}
        />
      </main>
    </LangProvider>
  );
}
