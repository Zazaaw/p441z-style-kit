"use client";

import BlurFade from "@/components/effects/blur-fade";
import { Button } from "@/components/ui/button";
import MaskReveal from "@/components/motion/mask-reveal";
import WordRotator from "@/components/motion/word-rotator";
import CountUp from "@/components/motion/count-up";
import Terminal from "@/components/mac/terminal";
import { REPO } from "@/site/chrome";

export default function Hero({ skillCount, skillLines }: { skillCount: number; skillLines: number }) {
  return (
    <section id="top" className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-14 px-6 pb-20 pt-28 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <BlurFade delay={0.05}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-[13px] font-medium text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-foreground" />
            Tailwind v4 + v3 · Light + dark · {skillCount} skills
          </span>
        </BlurFade>
        <h1 className="mt-7 font-display text-[clamp(2.75rem,7vw,5.25rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">
          <MaskReveal as="span" inView={false} delay={0.1} text="Interfaces that" className="block" />
          <span className="block">
            <WordRotator words={["move", "breathe", "ship", "feel right"]} interval={2.4} className="font-serif text-[1.1em] font-normal italic tracking-[-0.02em]" />
          </span>
          <MaskReveal as="span" inView={false} delay={0.35} text="like a keynote." className="block" />
        </h1>
        <BlurFade delay={0.55}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A quiet, editorial design system for React + Tailwind — greyscale tokens, shadcn-style components, keynote-grade motion graphics, and desktop-style windows. Copy the files; it is your code.
          </p>
        </BlurFade>
        <BlurFade delay={0.65} className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a href="#keynote">Watch it move</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={REPO} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </Button>
        </BlurFade>
        <BlurFade delay={0.75} className="mt-12 flex gap-10 text-sm">
          {[
            [<CountUp key="c" to={30} />, "components"],
            [<CountUp key="s" to={skillCount} />, "working skills"],
            [<CountUp key="l" to={skillLines} />, "lines of guidance"],
          ].map(([n, label], i) => (
            <div key={i}>
              <div className="font-display text-3xl font-extrabold tracking-tight">{n}</div>
              <div className="mt-1 text-muted-foreground">{label}</div>
            </div>
          ))}
        </BlurFade>
      </div>
      <BlurFade delay={0.4} yOffset={14}>
        <Terminal
          title="zsh — my-app"
          lines={[
            { cmd: "npx create-next-app@latest my-app" },
            { out: "✓ Created my-app with Tailwind v4", dim: true },
            { cmd: "npm i framer-motion clsx tailwind-merge next-themes" },
            { out: "added 10 packages in 3s", dim: true },
            { cmd: "cp -R p441z-style-kit/v4/* src/" },
            { out: "✓ globals.css · lib · components/{ui,effects,motion,mac}" },
            { cmd: "npm run dev" },
            { out: "▲ Ready on http://localhost:3000" },
          ]}
        />
      </BlurFade>
    </section>
  );
}
