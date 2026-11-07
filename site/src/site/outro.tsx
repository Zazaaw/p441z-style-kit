"use client";

import LogoCollapse from "@/components/motion/logo-collapse";
import KaraokeText from "@/components/motion/karaoke-text";
import { Button } from "@/components/ui/button";
import { REPO } from "@/site/chrome";
import { useT } from "@/site/i18n";
import GlassPanel, { GlassBackdrop } from "@/components/effects/glass-panel";

const CHIPS: [string, string][] = [
  ["Tokens", "Token"],
  ["Components", "Komponen"],
  ["Motion", "Motion"],
  ["Desktop", "Desktop"],
  ["Skills", "Skill"],
];

const ELSEWHERE = [
  {
    name: "Faiz Hazim Hawari",
    host: "p441z.my.id",
    href: "https://p441z.my.id",
    image: "/showcase/p441z-portfolio.jpg",
    en: "Portfolio, projects, and writing — “I build for the web — and I design.” Fullstack development, UI/UX, video, and photography.",
    id: "Portofolio, proyek, dan tulisan — “I build for the web — and I design.” Fullstack development, UI/UX, video, dan fotografi.",
    ctaEn: "See the portfolio",
    ctaId: "Lihat portofolionya",
  },
  {
    name: "Satu Visual",
    host: "satuvisual.p441z.my.id",
    href: "https://satuvisual.p441z.my.id",
    image: "/showcase/satu-visual.jpg",
    en: "A creative studio in Pematangsiantar and Medan — photo, video, and websites for bold brands, made by one team.",
    id: "Studio kreatif di Pematangsiantar dan Medan — foto, video, dan website untuk brand yang berani, dikerjakan satu tim.",
    ctaEn: "Visit the studio",
    ctaId: "Kunjungi studionya",
  },
];

export default function Outro() {
  const t = useT();
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-40 pt-24 text-center">
      <GlassBackdrop className="left-1/2 right-auto w-screen -translate-x-1/2" variant="c" strength={0.7} />
      <LogoCollapse
        auto
        hold={1.4}
        className="min-h-56"
        items={CHIPS.map(([en, id]) => (
          <GlassPanel key={en} tilt={0} appear={false} className="h-24 w-32 font-display text-[15px] font-bold" contentClassName="grid h-24 place-items-center">
            {t(en, id)}
          </GlassPanel>
        ))}
        logo={<span className="font-display text-[clamp(3.5rem,9vw,6.5rem)] font-extrabold tracking-[-0.05em]">p441z</span>}
      />
      <KaraokeText text={t("Quiet by default. Moving when it matters.", "Kalem dari awal. Bergerak saat perlu.")} duration={2.4} delay={2.4} className="mx-auto mt-6 max-w-2xl font-display text-[clamp(1.3rem,2.6vw,2rem)] font-semibold tracking-tight" />
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="h-12 rounded-full px-7 shadow-[0_14px_30px_-12px_hsl(var(--primary)/0.7)]">
          <a href={REPO} target="_blank" rel="noreferrer">
            {t("Get the kit", "Pakai kit-nya")}
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7">
          <a href={`${REPO}/blob/main/docs/GUIDE.md`} target="_blank" rel="noreferrer">
            {t("Read the guide", "Baca panduannya")}
          </a>
        </Button>
      </div>
      {/* More from the author: the portfolio and the studio. */}
      <div className="mx-auto mt-28 max-w-4xl text-left">
        <div className="text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t("From the same hands", "Dari tangan yang sama")}</div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {ELSEWHERE.map((s, i) => (
            <GlassPanel key={s.href} delay={i * 90} className="group overflow-hidden p-0">
              <a href={s.href} target="_blank" rel="noreferrer" className="block">
                <div className="overflow-hidden border-b border-border/60">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static screenshot */}
                  <img src={s.image} alt="" width={1440} height={900} loading="lazy" className="aspect-[16/9] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-xl font-extrabold tracking-tight">{s.name}</span>
                    <span className="font-mono text-[12px] text-muted-foreground">{s.host}</span>
                  </div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{t(s.en, s.id)}</p>
                  <div className="mt-3 text-[13px] font-semibold text-primary transition-transform duration-300 group-hover:translate-x-0.5">{t(s.ctaEn, s.ctaId)} →</div>
                </div>
              </a>
            </GlassPanel>
          ))}
        </div>
      </div>
      <footer className="mt-24 flex flex-col items-center gap-2 text-[13px] text-muted-foreground">
        <div>
          {t("Created by", "Karya")}{" "}
          <a href="https://p441z.my.id" className="font-semibold text-foreground underline-offset-4 hover:underline">
            Faiz Hazim Hawari
          </a>{" "}
          {t("· MIT licensed · Effects adapted from MagicUI, glass folders by Kedhareswer Naidu (21st.dev), conventions from shadcn/ui", "· Lisensi MIT · Efek diadaptasi dari MagicUI, folder kaca karya Kedhareswer Naidu (21st.dev), konvensi mengikuti shadcn/ui")}
        </div>
      </footer>
    </section>
  );
}
