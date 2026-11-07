"use client";

import { useEffect, useRef, useState } from "react";

import BlurFade from "@/components/effects/blur-fade";
import Stepper from "@/components/motion/stepper";
import Swap from "@/components/motion/swap";
import { CopyGlyph } from "@/components/ui/copy-button";
import PillTabs from "@/components/ui/pill-tabs";
import { cn } from "@/lib/utils";
import { DEMOS } from "@/site/component-demos";
import { IconCheck, IconSearch } from "@/site/icons";

// Small live previews for the cards on /components. Most reuse the component page's own demo,
// shrunk; the interactive ones get a version that plays by itself (nobody clicks inside a card).
// A preview only exists while its card is near the screen, so a grid of 38 runs a handful at a time.

/** Ticks every `ms` while mounted (and thumbnails only mount near the viewport). */
function useTick(ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setN((x) => x + 1), ms);
    return () => window.clearInterval(t);
  }, [ms]);
  return n;
}

function Replay({ every, children }: { every: number; children: React.ReactNode }) {
  const n = useTick(every);
  return (
    <div key={n} className="contents">
      {children}
    </div>
  );
}

function AutoTabs() {
  const tabs = ["All", "Upcoming", "Pending", "Done"];
  const n = useTick(1500);
  return <PillTabs tabs={tabs} value={tabs[n % tabs.length]} onChange={() => {}} />;
}

function AutoStepper() {
  const n = useTick(1300);
  return <Stepper id="thumb-stepper" steps={["Request", "Review", "Approved", "Letter"]} active={n % 4} />;
}

function AutoSwap() {
  const on = useTick(1600) % 2 === 1;
  return (
    <div className="flex items-center gap-8">
      <Swap id={on ? "moon" : "sun"} mode="turn" className="size-10">
        <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {on ? <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /> : (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>)}
        </svg>
      </Swap>
      <Swap id={on ? "night" : "day"} mode="roll" className="font-display text-3xl font-extrabold">
        {on ? "Night" : "Day"}
      </Swap>
    </div>
  );
}

function AutoCopy() {
  const copied = useTick(1800) % 2 === 1;
  return (
    <div className="flex items-center gap-3 rounded-full border border-border bg-background/80 py-2 pl-4 pr-2 font-mono text-[14px] text-muted-foreground">
      <span className="text-primary">$</span> npx shadcn add …/copy-button
      <span className={cn("grid size-8 place-items-center rounded-full transition-[background-color,color,scale] duration-300 ease-spring", copied ? "scale-110 bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
        <CopyGlyph copied={copied} className="size-4" />
      </span>
    </div>
  );
}

function Banner() {
  return (
    <div className="flex w-[340px] animate-drop-in gap-3 rounded-2xl border border-black/10 bg-background/80 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl dark:border-white/10">
      <span className="grid size-9 shrink-0 animate-pop-in place-items-center rounded-[10px] bg-primary text-primary-foreground [animation-delay:.15s] [&_svg]:size-5">
        <IconCheck />
      </span>
      <span className="min-w-0 flex-1 leading-snug">
        <span className="flex items-baseline gap-2">
          <span className="flex-1 text-[13px] font-semibold">Leave approved</span>
          <span className="text-[11px] text-muted-foreground">now</span>
        </span>
        <span className="block text-[13px] text-muted-foreground">17 – 19 Nov · signed by Maya</span>
      </span>
    </div>
  );
}

function SpotlightMock() {
  const rows = ["Home", "Components", "Getting started", "Toggle the accent"];
  const sel = useTick(1100) % rows.length;
  return (
    <div className="w-[420px] overflow-hidden rounded-2xl border border-black/10 bg-background/80 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)] backdrop-blur-xl dark:border-white/10">
      <div className="flex h-12 items-center gap-3 border-b border-border/60 px-4 text-[16px] text-muted-foreground [&_svg]:size-4">
        <IconSearch /> Search…
      </div>
      <div className="relative p-2">
        <span className="absolute inset-x-2 top-2 h-9 rounded-lg bg-primary transition-transform duration-500 ease-spring" style={{ transform: `translateY(${sel * 36}px)` }} />
        {rows.map((r, i) => (
          <div key={r} className={cn("relative flex h-9 items-center rounded-lg px-3 text-[14px] transition-colors duration-300", i === sel && "text-primary-foreground")}>
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}

function LiftMock() {
  return (
    <div className="relative h-36 w-64 [perspective:900px]">
      <div className="absolute inset-x-6 bottom-0 h-24 rounded-2xl border border-dashed border-border" />
      <div className="absolute inset-x-0 top-0 aspect-[1.6] animate-[thumb-lift_3.2s_cubic-bezier(.34,1.36,.5,1)_infinite] rounded-2xl border border-border bg-background p-4 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-display text-[13px] font-extrabold text-foreground">acme</span>ID · 3000123
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-foreground text-[13px] font-bold text-background">AP</span>
          <div>
            <div className="text-[15px] font-bold">Alex Pratama</div>
            <div className="text-[12px] text-muted-foreground">Product Designer</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes thumb-lift { 0%,100% { transform: translateY(18px) rotateX(0) rotateY(0) } 40%,70% { transform: translateY(-8px) rotateX(10deg) rotateY(-16deg) } }`}</style>
    </div>
  );
}

const THUMBS: Record<string, () => React.ReactNode> = {
  "pill-tabs": () => <AutoTabs />,
  stepper: () => <AutoStepper />,
  swap: () => <AutoSwap />,
  "copy-button": () => <AutoCopy />,
  notification: () => (
    <Replay every={3200}>
      <Banner />
    </Replay>
  ),
  spotlight: () => <SpotlightMock />,
  "element-lift": () => <LiftMock />,
  "mask-reveal": () => <Replay every={3600}>{DEMOS["mask-reveal"]}</Replay>,
  // Inside a shrunk card the in-view trigger is unreliable, so the thumbnail plays on mount.
  "blur-fade": () => (
    <Replay every={3600}>
      <div className="space-y-2 text-center">
        {["First line,", "then the second,", "then the third."].map((l, i) => (
          <BlurFade key={l} delay={0.15 + i * 0.15}>
            <div className="font-display text-2xl font-bold">{l}</div>
          </BlurFade>
        ))}
      </div>
    </Replay>
  ),
  "count-up": () => <Replay every={4000}>{DEMOS["count-up"]}</Replay>,
};

/** How far each preview is shrunk; the default suits a small component, scenes get more room. */
const ZOOM: Record<string, number> = {
  badge: 1.15, button: 0.72, input: 0.85, skeleton: 0.9, magnetic: 1, "pill-tabs": 0.85, "copy-button": 0.75, card: 0.7,
  "word-rotator": 0.85, swap: 0.8, "count-up": 0.85, stepper: 0.8, "blur-fade": 0.8, "mask-reveal": 0.8, notification: 0.8, dock: 1,
  "border-beam": 0.75, "spotlight-card": 0.7, "karaoke-text": 0.7, typography: 0.7, "soft-cursor": 0.7,
  "virtual-camera": 0.5, "device-frame": 0.5, "menu-bar": 0.5, "pocket-card": 0.5, spotlight: 0.5, "stack-card": 0.55, "glass-panel": 0.55,
  "mac-window": 0.6, terminal: 0.6, "flying-pill": 0.6, "logo-collapse": 0.6, "page-header": 0.6,
};

export function ComponentThumb({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Custom = THUMBS[name];
  const body = Custom ? <Custom /> : DEMOS[name];
  if (!body) return null;
  return (
    <div ref={ref} aria-hidden inert className="relative h-40 overflow-hidden rounded-t-2xl border-b border-border/60 bg-[radial-gradient(120%_90%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_9%,transparent),transparent_70%)]">
      {near && (
        <div className="absolute inset-0 grid place-items-center p-6" style={{ zoom: ZOOM[name] ?? 0.62 }}>
          {body}
        </div>
      )}
    </div>
  );
}
