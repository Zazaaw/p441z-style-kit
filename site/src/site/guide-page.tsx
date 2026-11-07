import GlassPanel, { GlassBackdrop } from "@/components/effects/glass-panel";
import { LangProvider, type Lang } from "@/site/i18n";
import { loadGuide } from "@/site/guide";
import { ProseCopy } from "@/site/prose-copy";
import { DocToc, DocTopBar } from "@/site/skill-page-client";

// The four ways in, as cards at the top. Each anchor matches a ## heading in content/docs.<lang>.md.
const ROUTES = {
  en: [
    ["1", "One command", "Theme, every component, the springs — in a new project.", "~5 min", "#route-1-the-whole-kit-in-one-command"],
    ["2", "Pick components", "A few pieces in an app you already have. Your theme stays.", "~1 min each", "#route-2-just-the-components-you-need"],
    ["3", "Skills for your agent", "16 design playbooks for Claude Code, Cursor and friends.", "~1 min", "#route-3-skills-for-your-ai-agent"],
    ["4", "Copy by hand", "No CLI. Every file goes exactly where you put it.", "~10 min", "#route-4-copy-the-files-by-hand"],
  ],
  id: [
    ["1", "Satu perintah", "Tema, semua komponen, dan animasi pegas di project baru.", "±5 menit", "#jalur-1-seluruh-kit-dengan-satu-perintah"],
    ["2", "Pilih komponen", "Beberapa komponen untuk aplikasi yang sudah ada. Temamu tetap.", "±1 menit/komponen", "#jalur-2-ambil-komponen-yang-perlu-saja"],
    ["3", "Skill untuk agenmu", "16 panduan desain untuk Claude Code, Cursor, dan lainnya.", "±1 menit", "#jalur-3-skill-untuk-agen-ai-mu"],
    ["4", "Salin manual", "Tanpa CLI. Tiap file kamu taruh sendiri.", "±10 menit", "#jalur-4-salin-file-secara-manual"],
  ],
} as const;

/** /docs — how to install and use the kit, start to finish. */
export function GuidePage({ lang }: { lang: Lang }) {
  const { html, toc } = loadGuide(lang);
  const t = (en: string, id: string) => (lang === "id" ? id : en);
  return (
    <LangProvider lang={lang}>
      <DocTopBar crumb={t("Getting started", "Mulai")} root={{ href: lang === "id" ? "/id/docs" : "/docs", label: t("Docs", "Panduan") }} paths={{ en: "/docs", id: "/id/docs" }} />
      <main className="relative overflow-x-clip">
        <header className="relative mx-auto max-w-6xl px-6 pb-6 pt-16 md:pt-20">
          <GlassBackdrop className="left-1/2 right-auto w-screen -translate-x-1/2" variant="b" />
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary">{t("Docs · Getting started", "Panduan · Mulai")}</div>
          <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">
            {t("Install the kit, step by step.", "Pasang kit-nya, langkah demi langkah.")}
          </h1>
          <p className="mt-4 max-w-2xl text-[18px] leading-relaxed text-muted-foreground">
            {t(
              "Everything from an empty folder to your first springy button: four ways to install, fonts, your brand color, dark mode, motion, and what to do when something looks off.",
              "Semua yang kamu perlukan, dari folder kosong sampai tombol pertama yang memantul: empat cara pasang, font, warna brand, dark mode, animasi, sampai solusi kalau ada yang tidak beres.",
            )}
          </p>
          <nav aria-label={t("Pick your route", "Pilih jalurmu")} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTES[lang].map(([n, title, body, time, href], i) => (
              <GlassPanel key={n} delay={i * 70} press className="h-full p-0" contentClassName="h-full">
                <a href={href} className="group flex h-full flex-col p-5">
                  <span className="grid size-8 place-items-center rounded-full bg-primary font-display text-[14px] font-extrabold text-primary-foreground transition-[scale] duration-500 ease-spring group-hover:scale-110">{n}</span>
                  <span className="mt-4 font-display text-lg font-bold tracking-tight">{title}</span>
                  <span className="mt-1 flex-1 text-[13.5px] leading-snug text-muted-foreground">{body}</span>
                  <span className="mt-4 flex items-center justify-between text-[12px] font-semibold">
                    <span className="text-muted-foreground">{time}</span>
                    <span className="text-primary">
                      {t("Go", "Lihat")} <span aria-hidden className="arrow">→</span>
                    </span>
                  </span>
                </a>
              </GlassPanel>
            ))}
          </nav>
        </header>

        <div className="mx-auto mt-10 grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside>
            <DocToc items={toc} title={t("On this page", "Di halaman ini")} />
          </aside>
          <article className="skill-prose min-w-0" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <ProseCopy />
      </main>
    </LangProvider>
  );
}
