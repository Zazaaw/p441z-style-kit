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
          <a href={t("/docs", "/id/docs")}>{t("Read the guide", "Baca panduannya")}</a>
        </Button>
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
