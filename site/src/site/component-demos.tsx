"use client";

import { useState } from "react";

import Aurora from "@/components/effects/aurora";
import BlurFade from "@/components/effects/blur-fade";
import BorderBeam from "@/components/effects/border-beam";
import { DotPattern } from "@/components/effects/dot-pattern";
import GlassPanel, { GlassBackdrop } from "@/components/effects/glass-panel";
import { GridPattern } from "@/components/effects/grid-pattern";
import Magnetic from "@/components/effects/magnetic";
import Marquee from "@/components/effects/marquee";
import SpotlightCard from "@/components/effects/spotlight-card";
import { useNotify } from "@/components/mac/notification";
import Terminal from "@/components/mac/terminal";
import { MacWindow } from "@/components/mac/window";
import CountUp from "@/components/motion/count-up";
import MaskReveal from "@/components/motion/mask-reveal";
import Stepper from "@/components/motion/stepper";
import WordRotator from "@/components/motion/word-rotator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PillTabs from "@/components/ui/pill-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { IconBell } from "@/site/icons";

// Live previews for the component pages. Each one is the component itself, with a few props —
// not a screenshot. Components that need a whole scene (the dock, the keynote camera, the flying
// pill) link to the landing page instead.

function Tabs() {
  const [v, setV] = useState("All");
  return <PillTabs tabs={["All", "Upcoming", "Pending", "Done"]} value={v} onChange={setV} />;
}

function Steps() {
  const [i, setI] = useState(1);
  const steps = ["Request", "Review", "Approved", "Letter"];
  return (
    <div className="flex flex-col items-center gap-4">
      <Stepper id="doc-stepper" steps={steps} active={i} />
      <Button size="sm" variant="outline" onClick={() => setI((x) => (x + 1) % steps.length)}>
        Next step
      </Button>
    </div>
  );
}

function Notify() {
  const notify = useNotify();
  return <Button onClick={() => notify({ title: "Leave approved", body: "17 – 19 Nov · signed by Maya", icon: <IconBell /> })}>Send a notification</Button>;
}

// Keep DEMO_NAMES (component-demo-names.ts) in step with the keys below.
const DEMOS: Record<string, React.ReactNode> = {
  button: (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  badge: (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge>New</Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="outline">v1.0</Badge>
    </div>
  ),
  card: (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Leave balance</CardTitle>
        <CardDescription>Resets on 1 January.</CardDescription>
      </CardHeader>
      <CardContent className="font-display text-4xl font-extrabold tracking-tight">
        9 <span className="text-base font-medium text-muted-foreground">/ 12 days</span>
      </CardContent>
    </Card>
  ),
  input: <Input className="max-w-sm" placeholder="you@example.com" />,
  skeleton: (
    <div className="w-full max-w-sm space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  ),
  "pill-tabs": <Tabs />,
  "glass-panel": (
    <div className="relative grid w-full place-items-center py-6">
      <GlassBackdrop strength={1.6} />
      <GlassPanel className="w-full max-w-sm p-6" appear={false}>
        <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Glass</div>
        <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">Hover me.</div>
        <p className="mt-1 text-[14px] text-muted-foreground">Rim of light, a specular under the pointer, a small tilt.</p>
      </GlassPanel>
    </div>
  ),
  "spotlight-card": (
    <SpotlightCard className="w-full max-w-sm p-6">
      <div className="font-display text-xl font-bold">Move the pointer across.</div>
      <p className="mt-1 text-[14px] text-muted-foreground">The glow and the border follow it.</p>
    </SpotlightCard>
  ),
  "border-beam": (
    <div className="relative w-full max-w-sm rounded-2xl border border-border p-8 text-center">
      <div className="font-display text-xl font-bold">Recommended</div>
      <BorderBeam />
    </div>
  ),
  marquee: (
    <Marquee className="w-full" duration="20s">
      {["Tokens", "Components", "Motion", "Desktop", "Skills"].map((w) => (
        <span key={w} className="flex items-center gap-2 font-display text-lg font-semibold text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          {w}
        </span>
      ))}
    </Marquee>
  ),
  magnetic: (
    <Magnetic>
      <Button size="lg" className="rounded-full">
        Come closer
      </Button>
    </Magnetic>
  ),
  aurora: (
    <div className="relative grid h-48 w-full place-items-center overflow-hidden rounded-xl">
      <Aurora intensity={0.8} />
      <span className="relative font-display text-2xl font-extrabold">Soft light</span>
    </div>
  ),
  "dot-pattern": (
    <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border">
      <DotPattern width={18} height={18} cx={1} cy={1} cr={1} className="[mask-image:radial-gradient(circle,white,transparent_75%)]" />
    </div>
  ),
  "grid-pattern": (
    <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border">
      <GridPattern width={36} height={36} numSquares={20} maxOpacity={0.2} className="[mask-image:radial-gradient(circle,white,transparent_75%)]" />
    </div>
  ),
  "blur-fade": (
    <div className="space-y-2 text-center">
      {["First line,", "then the second,", "then the third."].map((l, i) => (
        <BlurFade key={l} delay={0.15 + i * 0.15} inView>
          <div className="font-display text-xl font-bold">{l}</div>
        </BlurFade>
      ))}
    </div>
  ),
  "word-rotator": (
    <div className="font-display text-3xl font-extrabold tracking-tight">
      Made to <WordRotator words={["move", "ship", "last"]} className="font-serif font-normal italic text-primary" />
    </div>
  ),
  "count-up": (
    <div className="font-display text-5xl font-extrabold tabular-nums tracking-tight">
      <CountUp to={24675} />
    </div>
  ),
  "mask-reveal": <MaskReveal as="h3" text="Download. Print. Share." className="font-display text-3xl font-extrabold tracking-tight" />,
  stepper: <Steps />,
  "mac-window": (
    <MacWindow title="Preview" className="w-full max-w-md" bodyClassName="p-6">
      <div className="text-[13px] text-muted-foreground">Leave balance</div>
      <div className="font-display text-3xl font-extrabold">9 / 12 days</div>
    </MacWindow>
  ),
  terminal: <Terminal className="w-full max-w-md" title="zsh" lines={[{ cmd: "npx shadcn@latest add style.p441z.my.id/r/terminal.json" }, { out: "✓ Created components/mac/terminal.tsx" }, { out: "Done in 1.8s", dim: true }]} />,
  notification: <Notify />,
};

export function ComponentDemo({ name }: { name: string }) {
  return <>{DEMOS[name]}</>;
}
