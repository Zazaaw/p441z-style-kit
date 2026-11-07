"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import MaskReveal from "@/components/motion/mask-reveal";
import { MacWindow } from "@/components/mac/window";
import BorderBeam from "@/components/effects/border-beam";
import GlassPanel, { GlassBackdrop } from "@/components/effects/glass-panel";
import { SHOWCASE, type ShowcaseItem } from "@/site/showcase-data";
import { useT } from "@/site/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Plays muted while on screen (like a product page), with native controls for sound and seeking. */
function AutoVideo({ item }: { item: ShowcaseItem }) {
  const ref = useRef<HTMLVideoElement>(null);
  const t = useT();
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => undefined) : v.pause()), { threshold: 0.5 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  if (missing) {
    return <div className="grid aspect-video place-items-center bg-muted/40 text-[14px] text-muted-foreground">{t("Rendering — the video lands here soon.", "Sedang dirender — videonya segera muncul di sini.")}</div>;
  }
  return <video ref={ref} src={item.video} poster={item.poster} muted loop playsInline controls preload="metadata" onError={() => setMissing(true)} className="block aspect-video w-full bg-black" />;
}

export default function Showcase() {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  const featured = SHOWCASE.find((s) => s.featured);
  const rest = SHOWCASE.filter((s) => s !== featured);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The window grows from a slight tilt into place as it scrolls in — a product-shot entrance.
        gsap.fromTo(".show-window", { rotateX: 14, scale: 0.9, y: 80, opacity: 0.4 }, { rotateX: 0, scale: 1, y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".show-window", start: "top 95%", end: "top 35%", scrub: 0.8 } });
      });
    },
    { scope: root },
  );
  return (
    <section id="showcase" ref={root} className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-28">
      <GlassBackdrop className="left-1/2 right-auto w-screen -translate-x-1/2" variant="a" strength={0.8} />
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Made with the skills", "Karya nyata")}</div>
        <MaskReveal as="h2" text={t("See what it produces.", "Lihat hasilnya.")} className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
        <p className="mt-4 text-lg text-muted-foreground">
          {t(
            <>Not mock-ups — real output. The video below was produced end to end with <code className="text-[0.9em]">skill-motion-video</code>.</>,
            <>Bukan mock-up. Video di bawah ini dibuat dari nol sampai jadi dengan <code className="text-[0.9em]">skill-motion-video</code>.</>,
          )}
        </p>
      </div>
      {featured && (
        <div className="mt-14 [perspective:1600px]">
          <div className="show-window relative mx-auto max-w-5xl rounded-xl">
            <MacWindow title={t(featured.title, featured.titleId ?? featured.title)} className="relative shadow-[0_60px_120px_-50px_hsl(var(--primary)/0.55)]" toolbar={<span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">{t(featured.madeWith, featured.madeWithId ?? featured.madeWith)}</span>}>
              <AutoVideo item={featured} />
            </MacWindow>
            <BorderBeam duration={10} />
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-center text-[14px] text-muted-foreground">{t(featured.note, featured.noteId ?? featured.note)}</p>
        </div>
      )}
      {rest.length > 0 && (
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {rest.map((s) => (
            <GlassPanel delay={0} key={s.title} className="p-0">
              {s.video && <AutoVideo item={s} />}
              {!s.video && s.poster && (
                <a href={s.href} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden className="block overflow-hidden rounded-t-2xl border-b border-border/60">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static poster, sized by its container */}
                  <img src={s.poster} alt="" width={1440} height={900} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]" />
                </a>
              )}
              <a href={s.href ?? s.video} target={s.href ? "_blank" : undefined} rel="noreferrer" className="block p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-display text-xl font-extrabold tracking-tight">{t(s.title, s.titleId ?? s.title)}</div>
                  <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-[12px] text-muted-foreground">{t(s.madeWith, s.madeWithId ?? s.madeWith)}</span>
                </div>
                <p className="mt-1.5 text-[14px] text-muted-foreground">{t(s.note, s.noteId ?? s.note)}</p>
                {s.href && <div className="mt-3 text-[13px] font-semibold text-primary">{t("Visit →", "Kunjungi →")}</div>}
              </a>
            </GlassPanel>
          ))}
        </div>
      )}
    </section>
  );
}
