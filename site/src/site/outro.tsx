"use client";

import LogoCollapse from "@/components/motion/logo-collapse";
import KaraokeText from "@/components/motion/karaoke-text";
import { Button } from "@/components/ui/button";
import { REPO } from "@/site/chrome";
import { useT } from "@/site/i18n";

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
      <LogoCollapse
        auto
        hold={1.4}
        className="min-h-56"
        items={CHIPS.map(([en, id]) => (
          <div key={en} className="grid h-24 w-32 place-items-center rounded-2xl border border-border bg-background font-display text-[15px] font-bold shadow-sm">
            {t(en, id)}
          </div>
        ))}
        logo={<span className="font-display text-[clamp(3.5rem,9vw,6.5rem)] font-extrabold tracking-[-0.05em]">p441z</span>}
      />
      <KaraokeText text={t("Quiet by default. Moving when it matters.", "Tenang secara default. Bergerak saat perlu.")} duration={2.4} delay={2.4} className="mx-auto mt-6 max-w-2xl font-display text-[clamp(1.3rem,2.6vw,2rem)] font-semibold tracking-tight" />
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="h-12 rounded-full px-7 shadow-[0_14px_30px_-12px_hsl(var(--primary)/0.7)]">
          <a href={REPO} target="_blank" rel="noreferrer">
            {t("Get the kit", "Ambil kit-nya")}
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7">
          <a href={`${REPO}/blob/main/docs/GUIDE.md`} target="_blank" rel="noreferrer">
            {t("Read the guide", "Baca panduannya")}
          </a>
        </Button>
      </div>
      <footer className="mt-24 flex flex-col items-center gap-2 text-[13px] text-muted-foreground">
        <div>
          {t("Created by", "Karya")}{" "}
          <a href="https://p441z.my.id" className="font-semibold text-foreground underline-offset-4 hover:underline">
            Faiz Hazim Hawari
          </a>{" "}
          {t("· MIT licensed · Effects adapted from MagicUI, conventions from shadcn/ui", "· Lisensi MIT · Efek diadaptasi dari MagicUI, konvensi dari shadcn/ui")}
        </div>
      </footer>
    </section>
  );
}
