"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import WordRotator from "@/components/motion/word-rotator";
import CountUp from "@/components/motion/count-up";
import Aurora from "@/components/effects/aurora";
import Magnetic from "@/components/effects/magnetic";
import BorderBeam from "@/components/effects/border-beam";
import { REPO, INSTALL } from "@/site/chrome";
import { IconCheck, IconCopy } from "@/site/icons";

gsap.registerPlugin(SplitText, useGSAP);

export default function Hero({ skillCount, skillLines, componentCount }: { skillCount: number; skillLines: number; componentCount: number }) {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

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
          .from(".hero-fade", { y: 18, opacity: 0, filter: "blur(6px)", duration: 1, stagger: 0.08 }, 0.6);
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
    <section id="top" ref={root} className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32 text-center">
      <Aurora intensity={0.55} className="-z-10" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-background" />

      <a href="#motion" className="hero-chip relative inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground">
        <span className="rounded-full bg-primary px-1.5 py-px text-[11px] font-semibold text-primary-foreground">New</span>
        12 motion + 7 desktop components
        <span aria-hidden>→</span>
        <BorderBeam size={60} duration={6} />
      </a>

      {/* Each line is its own block and never wraps — the rotating word can't push anything around. */}
      <h1 className="mt-8 font-display text-[clamp(2.6rem,7.2vw,7.4rem)] font-extrabold leading-[0.98] tracking-[-0.05em]">
        <span className="hero-line block whitespace-nowrap">Interfaces that</span>
        <span className="hero-rot block whitespace-nowrap py-[0.04em]">
          <WordRotator reserve align="center" words={["move", "breathe", "ship", "feel right"]} interval={2.6} wordClassName="text-sheen" className="font-serif text-[1.08em] font-normal italic tracking-[-0.02em]" />
        </span>
        <span className="hero-line block whitespace-nowrap">like a keynote.</span>
      </h1>

      <p className="hero-fade mx-auto mt-8 max-w-2xl text-pretty text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-muted-foreground">
        A quiet, editorial design system for React + Tailwind — greyscale tokens, shadcn-style components, keynote-grade motion graphics, and desktop-style windows. Copy the files. It is your code.
      </p>

      <div className="hero-fade mt-10 flex flex-wrap items-center justify-center gap-3">
        <Magnetic>
          <Button asChild size="lg" className="h-12 rounded-full px-7 text-[15px] shadow-[0_14px_30px_-12px_hsl(var(--primary)/0.7)]">
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
        className="hero-fade group mt-6 inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-background/70 py-2 pl-4 pr-2 font-mono text-[12.5px] text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        aria-label="Copy install command"
      >
        <span className="text-primary">$</span>
        <span className="truncate">npx shadcn@latest add style.p441z.my.id/r/style-kit.json</span>
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-foreground [&_svg]:size-3.5">{copied ? <IconCheck /> : <IconCopy />}</span>
      </button>

      <div className="hero-fade mt-16 grid w-full max-w-3xl grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-background/60 backdrop-blur">
        {[
          [componentCount, "components"],
          [skillCount, "working skills"],
          [skillLines, "lines of guidance"],
        ].map(([n, label]) => (
          <div key={label} className="px-4 py-5">
            <div className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold tracking-tight">
              <CountUp to={Number(n)} />
            </div>
            <div className="mt-0.5 text-[13px] text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
