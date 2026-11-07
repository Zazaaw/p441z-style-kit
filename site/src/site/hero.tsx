"use client";

import { useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import WordRotator from "@/components/motion/word-rotator";
import Aurora from "@/components/effects/aurora";
import Magnetic from "@/components/effects/magnetic";
import BorderBeam from "@/components/effects/border-beam";
import { REPO, INSTALL } from "@/site/chrome";
import { IconCheck, IconCopy } from "@/site/icons";
import HeroCatalog from "@/site/hero-catalog";
import HeroDesk, { PointerGlow } from "@/site/hero-desk";
import HeroCompare from "@/site/hero-compare";
import type { SkillView } from "@/site/skills";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export default function Hero({ skillCount, skillLines, componentCount, skills }: { skillCount: number; skillLines: number; componentCount: number; skills: SkillView[] }) {
  const root = useRef<HTMLElement>(null);
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
          .from(".hero-win", { y: 40, opacity: 0, scale: 0.94, duration: 1.2, stagger: 0.12 }, 0.85)
          .from(".hero-window-in", { y: 80, opacity: 0, duration: 1.4 }, 0.7);
        // The product window rises from the fold tilted back, and lies flat as it scrolls up.
        gsap.fromTo(
          ".hero-window",
          { rotateX: 16, scale: 0.94, transformPerspective: 2000, transformOrigin: "50% 0%" },
          { rotateX: 0, scale: 1, ease: "none", scrollTrigger: { trigger: ".hero-window", start: "top bottom", end: "top 18%", scrub: true } },
        );
        // Leaving the first screen: the headline sinks back while the desk windows fly past the camera.
        const out = { trigger: stage.current, start: "top top", end: "bottom top", scrub: true };
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

      {/* First screen: the headline, the kit's own windows floating around it (wide screens), and a
          product window rising from the fold. */}
      <div ref={stage} onPointerMove={onMove} className="relative isolate">
        <PointerGlow p={pointer} />
        <HeroDesk p={pointer} />
        <div className="hero-stage flex flex-col items-center px-6 pb-12 pt-24 text-center md:pt-28 [@media(max-height:760px)]:pt-16">
          <a href="#kit" className="hero-chip relative inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background/70 py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground">
            <span className="rounded-full bg-primary px-2 py-px text-[11px] font-semibold text-primary-foreground">New</span>
            <span className="truncate">
              <b className="font-semibold text-foreground">{componentCount}</b> components · <b className="font-semibold text-foreground">{skillCount}</b> skills<span className="hidden sm:inline"> · <b className="font-semibold text-foreground">{skillLines.toLocaleString("en-US")}</b> lines of guidance</span>
            </span>
            <span aria-hidden>→</span>
            <BorderBeam size={60} duration={6} />
          </a>

          {/* Each line is its own block and never wraps — the rotating word can't push anything around.
              Tight tracking also tightens the word gap, so the spaces get a little back. */}
          <h1 className="mt-7 font-display text-[clamp(2.6rem,min(7.2vw,10.5svh),7.4rem)] font-extrabold leading-[0.98] tracking-[-0.05em] [word-spacing:0.12em] [@media(max-height:760px)]:mt-5">
            <span className="hero-line block whitespace-nowrap">Interfaces that</span>
            <span className="hero-rot block whitespace-nowrap py-[0.04em]">
              <WordRotator reserve align="center" words={["move", "breathe", "ship", "feel right"]} interval={2.6} wordClassName="text-sheen" className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em]" />
            </span>
            <span className="hero-line block whitespace-nowrap">like a keynote.</span>
          </h1>

          <p className="hero-fade mx-auto mt-6 max-w-[34rem] text-pretty text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-muted-foreground">
            A quiet design system for React + Tailwind — components, keynote-grade motion, desktop windows, and skills that keep your AI agent from shipping slop.
          </p>

          <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Button asChild size="lg" className="h-12 rounded-full px-7 text-[15px] shadow-[0_14px_30px_-12px_var(--color-primary)]">
                <a href="#keynote">Watch it move</a>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full bg-background/60 px-7 text-[15px] backdrop-blur">
              <a href={REPO} target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>

          <button
            type="button"
            onClick={copy}
            className="hero-fade group mt-5 inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-background/70 py-2 pl-4 pr-2 font-mono text-[12.5px] text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
            aria-label="Copy install command"
          >
            <span className="text-primary">$</span>
            <span className="truncate">npx shadcn@latest add style.p441z.my.id/r/style-kit.json</span>
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-foreground [&_svg]:size-3.5">{copied ? <IconCheck /> : <IconCopy />}</span>
          </button>
        </div>
      </div>

      <div className="relative px-4 pb-24 sm:px-6">
        <div className="hero-window-in mx-auto w-full max-w-4xl">
          <div className="hero-window">
            <HeroCompare skills={skills} />
          </div>
        </div>
        <div className="mx-auto mt-20 flex w-full max-w-6xl justify-center">
          <HeroCatalog skills={skills} />
        </div>
      </div>
    </section>
  );
}
