"use client";

import { useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import WordRotator from "@/components/motion/word-rotator";
import CountUp from "@/components/motion/count-up";
import Aurora from "@/components/effects/aurora";
import Magnetic from "@/components/effects/magnetic";
import BorderBeam from "@/components/effects/border-beam";
import { REPO, INSTALL } from "@/site/chrome";
import { IconCheck, IconCopy } from "@/site/icons";
import HeroCatalog from "@/site/hero-catalog";
import { useNum, useT } from "@/site/i18n";
import HeroDesk, { PointerGlow } from "@/site/hero-desk";
import HeroCompare from "@/site/hero-compare";
import { AccentDots } from "@/site/accent";
import type { SkillView } from "@/site/skills";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export default function Hero({ skillCount, skillLines, componentCount, skills }: { skillCount: number; skillLines: number; componentCount: number; skills: SkillView[] }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const num = useNum();
  const stage = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  // Pointer position over the first screen, -0.5…0.5, smoothed — drives the desk parallax and the glow.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const pointer = { x: useSpring(px, { stiffness: 70, damping: 20 }), y: useSpring(py, { stiffness: 70, damping: 20 }) };
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  // GSAP intro: headline characters rise from a mask line by line, then the rest settles in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".hero-line", { type: "chars", mask: "chars" });
        // Masks are as tall as the (tight) line box, which would clip descenders like the "y" in
        // "keynote" — give each mask room below the baseline without changing the line height.
        split.masks.forEach((m) => {
          (m as HTMLElement).style.paddingBottom = "0.2em";
          (m as HTMLElement).style.marginBottom = "-0.2em";
        });
        // Once the intro is done, put the headline back to plain text (no masks left behind).
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => split.revert() });
        tl.from(".hero-chip", { y: 12, opacity: 0, duration: 0.8 })
          .from(split.chars, { yPercent: 110, duration: 1.1, stagger: 0.018 }, 0.1)
          .from(".hero-rot", { yPercent: 40, opacity: 0, filter: "blur(10px)", duration: 1.1 }, 0.35)
          .from(".hero-fade", { y: 18, opacity: 0, filter: "blur(6px)", duration: 1, stagger: 0.08 }, 0.6)
          .from(".hero-win", { y: 40, opacity: 0, scale: 0.94, duration: 1.2, stagger: 0.12 }, 0.85);
        // Leaving the first screen: the headline sinks back while the desk windows fly past the camera.
        const out = { trigger: stage.current, start: "top top", end: "bottom 10%", scrub: true };
        gsap.to(".hero-stage", { scale: 0.9, yPercent: 8, opacity: 0, ease: "none", scrollTrigger: out });
        gsap.to(".hero-desk", { scale: 1.18, opacity: 0, ease: "none", scrollTrigger: { ...out } });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <section id="top" ref={root} className="relative isolate overflow-hidden">
      <Aurora intensity={0.55} className="-z-10" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-background" />

      {/* First screen: headline in the middle, the kit's own windows floating around it. */}
      <div ref={stage} onPointerMove={onMove} className="relative isolate min-h-[100svh]">
        <PointerGlow p={pointer} />
        <HeroDesk p={pointer} />
        <div className="hero-stage flex min-h-[100svh] flex-col items-center justify-center px-6 pb-24 pt-24 text-center [@media(max-height:760px)]:pt-14">
          <a href="#motion" className="hero-chip relative inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground">
            <span className="rounded-full bg-primary px-1.5 py-px text-[11px] font-semibold text-primary-foreground">{t("New", "Baru")}</span>
            {t("12 motion + 7 desktop components", "12 komponen motion, 7 jendela desktop")}
            <span aria-hidden>→</span>
            <BorderBeam size={60} duration={6} />
          </a>

          {/* Each line is its own block and never wraps — the rotating word can't push anything around.
              Tight tracking also tightens the word gap, so the spaces get a little back. */}
          <h1 className="mt-7 font-display text-[clamp(2.6rem,min(7.2vw,10.5svh),7.4rem)] font-extrabold leading-[0.98] tracking-[-0.05em] [word-spacing:0.12em] [@media(max-height:760px)]:mt-5">
            <span className="hero-line block whitespace-nowrap">{t("Interfaces that", "Antarmuka yang")}</span>
            <span className="hero-rot block whitespace-nowrap py-[0.04em]">
              <WordRotator reserve align="center" words={t(["move", "breathe", "ship", "feel right"], ["bergerak", "hidup", "mengalir", "memikat"])} interval={2.6} wordClassName="text-sheen" className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em]" />
            </span>
            <span className="hero-line block whitespace-nowrap">{t("like a keynote.", "seperti keynote.")}</span>
          </h1>

          <p className="hero-fade mx-auto mt-6 max-w-[34rem] text-pretty text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-muted-foreground">
            {t(
              "A quiet design system for React + Tailwind — components, keynote-grade motion, desktop windows, and skills that keep your AI agent from shipping slop.",
              "Design system yang kalem untuk React + Tailwind: komponen, motion sekelas keynote, jendela ala desktop, plus skill supaya agen AI-mu tidak lagi kerja asal jadi.",
            )}
          </p>

          <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Button asChild size="lg" className="h-12 rounded-full px-7 text-[15px] shadow-[0_14px_30px_-12px_var(--color-primary)]">
                <a href="#keynote">{t("Watch it move", "Tonton demonya")}</a>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-background/60 px-7 text-[15px] backdrop-blur">
              <a href={REPO} target="_blank" rel="noreferrer">
                {t("View on GitHub", "Buka GitHub")}
              </a>
            </Button>
          </div>

          <button
            type="button"
            onClick={copy}
            className="hero-fade group mt-5 inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-background/70 py-2 pl-4 pr-2 font-mono text-[12.5px] text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
            aria-label={t("Copy install command", "Salin perintah install")}
          >
            <span className="text-primary">$</span>
            <span className="truncate">npx shadcn@latest add style.p441z.my.id/r/style-kit.json</span>
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-foreground [&_svg]:size-3.5">{copied ? <IconCheck /> : <IconCopy />}</span>
          </button>

          {/* The numbers, as one quiet line. Short desktop screens drop it (the dock would cover it; the bento repeats them). */}
          <div className="hero-fade mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground md:[@media(max-height:760px)]:hidden">
            {[
              [componentCount, t("components", "komponen")],
              [skillCount, t("skills", "skill")],
              [skillLines, t("lines of guidance", "baris panduan")],
            ].map(([n, label]) => (
              <span key={label}>
                <span className="font-display text-[15px] font-extrabold tabular-nums text-foreground">
                  <CountUp to={Number(n)} format={num} />
                </span>{" "}
                {label}
              </span>
            ))}
          </div>
          {/* Phones get the accent picker inline. From md up the menu bar has it (and the dock would cover this row). */}
          <div className="hero-fade mt-5 flex items-center gap-3 rounded-full border border-border bg-background/70 px-3.5 py-2 backdrop-blur md:hidden">
            <span className="text-[12px] font-semibold text-muted-foreground">{t("Accent", "Aksen")}</span>
            <AccentDots size={16} className="gap-1.5" />
          </div>
        </div>
      </div>

      <div className="relative px-6 pb-24 pt-6">
        <HeroCompare skills={skills} />
        <div className="mx-auto mt-16 flex w-full max-w-6xl justify-center">
          <HeroCatalog skills={skills} />
        </div>
      </div>
    </section>
  );
}
