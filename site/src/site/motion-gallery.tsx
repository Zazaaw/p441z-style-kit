"use client";

import { useEffect, useState } from "react";

import BlurFade from "@/components/effects/blur-fade";
import MaskReveal from "@/components/motion/mask-reveal";
import KaraokeText from "@/components/motion/karaoke-text";
import WordRotator from "@/components/motion/word-rotator";
import CountUp from "@/components/motion/count-up";
import SoftCursor from "@/components/motion/soft-cursor";
import FlyingPill from "@/components/motion/flying-pill";
import ElementLift from "@/components/motion/element-lift";
import Stepper from "@/components/motion/stepper";
import VirtualCamera, { type Shot } from "@/components/motion/virtual-camera";
import LogoCollapse from "@/components/motion/logo-collapse";
import { LaptopFrame, PhoneFrame } from "@/components/motion/device-frame";
import { useNotify } from "@/components/mac/notification";
import { cn } from "@/lib/utils";
import { IconBell, IconCheck, IconSend } from "@/site/icons";

function Demo({ name, file, span, children, onReplay, note }: { name: string; file: string; span?: string; children: React.ReactNode; onReplay?: () => void; note: string }) {
  return (
    <BlurFade inView className={cn("flex min-w-0 flex-col rounded-2xl border border-border bg-background/80 backdrop-blur", span)}>
      <div className="relative grid min-h-56 flex-1 place-items-center overflow-hidden rounded-t-2xl border-b border-border bg-muted/30 p-6">{children}</div>
      <div className="flex items-start gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="font-display text-[15px] font-bold">{name}</div>
          <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{note}</div>
          <code className="mt-2 inline-block text-[11.5px] text-muted-foreground">{file}</code>
        </div>
        {onReplay && (
          <button type="button" onClick={onReplay} className="shrink-0 rounded-md border border-border px-2.5 py-1 text-[12px] font-medium transition-colors duration-200 hover:bg-muted">
            Replay
          </button>
        )}
      </div>
    </BlurFade>
  );
}

function useReplay() {
  const [k, setK] = useState(0);
  return [k, () => setK((x) => x + 1)] as const;
}

function CursorDemo() {
  const [on, setOn] = useState(false);
  return (
    <div className="relative h-40 w-full max-w-72 rounded-xl border border-border bg-background p-4">
      <div className="text-[13px] font-semibold">Show photo on card</div>
      <div className="mt-1 text-[12px] text-muted-foreground">Your photo appears on the printed card.</div>
      <span className={cn("absolute bottom-5 right-5 flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-300", on ? "bg-foreground" : "bg-muted-foreground/30")}>
        <span className={cn("size-5 rounded-full bg-background shadow transition-transform duration-300", on && "translate-x-5")} />
      </span>
      <SoftCursor loop points={[{ x: 0.25, y: 0.35, hold: 0.4 }, { x: 0.86, y: 0.8, click: true, hold: 1.2 }]} onClick={() => setOn((v) => !v)} />
    </div>
  );
}

function PillDemo() {
  const [run, setRun] = useState(1);
  const [got, setGot] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRun((r) => r + 1), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative h-40 w-full">
      <div className="absolute left-[6%] top-1/2 grid size-20 -translate-y-1/2 place-items-center rounded-2xl border border-border bg-background text-[12px] font-medium">Laptop</div>
      <div className="absolute right-[6%] top-1/2 grid size-20 -translate-y-1/2 place-items-center rounded-2xl border border-border bg-background text-[12px] font-medium">
        Phone
        {got > 0 && <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-foreground text-[11px] font-bold text-background">{got}</span>}
      </div>
      <FlyingPill run={run} from={{ x: 0.2, y: 0.5 }} to={{ x: 0.8, y: 0.5 }} arc={0.32} title="Request sent" subtitle="to your manager" icon={<span className="size-3.5 [&_svg]:size-3.5"><IconSend /></span>} onLand={() => setGot((g) => g + 1)} />
    </div>
  );
}

function LiftDemo() {
  const [up, setUp] = useState(false);
  const card = (
    <div className="aspect-[1.6] rounded-2xl border border-border bg-background p-4 shadow-sm">
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
  );
  const back = (
    <div className="grid aspect-[1.6] place-items-center rounded-2xl bg-foreground p-4 text-background">
      <div className="text-center">
        <div className="mx-auto grid size-16 grid-cols-5 gap-[3px] rounded-md bg-background p-1.5" aria-hidden>
          {Array.from({ length: 25 }, (_, i) => (
            <span key={i} className={cn((i * 37) % 3 ? "bg-foreground" : "")} />
          ))}
        </div>
        <div className="mt-2 text-[12px] font-semibold">Scan to save contact</div>
      </div>
    </div>
  );
  return (
    <div className="w-60">
      <button type="button" onClick={() => setUp(true)} className="block w-full cursor-pointer text-left" aria-label="Lift the card">
        <ElementLift id="gallery-card" lifted={up} onLower={() => setUp(false)} front={card} back={back} liftedWidth={480} />
      </button>
      <div className="mt-3 text-center text-[12px] text-muted-foreground">Click the card · Esc to return</div>
    </div>
  );
}

function StepperDemo() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % 4), 1400);
    return () => clearInterval(t);
  }, []);
  return <Stepper id="gallery-stepper" steps={["Request", "Review", "Approved", "Letter"]} active={i} className="scale-90" />;
}

function CameraDemo() {
  const shots: [string, Shot][] = [
    ["Wide", { x: 0.5, y: 0.5, zoom: 1 }],
    ["Chart", { x: 0.28, y: 0.62, zoom: 2.2 }],
    ["Button", { x: 0.83, y: 0.2, zoom: 2.6 }],
  ];
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS((x) => (x + 1) % shots.length), 2200);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-background">
        <VirtualCamera shot={shots[s][1]}>
          <div className="absolute inset-0 p-3">
            <div className="flex items-center justify-between">
              <div className="h-2 w-16 rounded bg-foreground/80" />
              <div className="rounded bg-foreground px-2 py-0.5 text-[8px] font-semibold text-background">Export</div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 rounded-md border border-border" />
              ))}
            </div>
            <div className="mt-2 flex h-[45%] items-end gap-1 rounded-md border border-border p-2">
              {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-foreground/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </VirtualCamera>
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {shots.map(([l], i) => (
          <button key={l} type="button" onClick={() => setS(i)} className={cn("rounded-full px-2.5 py-0.5 text-[12px] transition-colors duration-200", i === s ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted")}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MotionGallery() {
  const [mask, replayMask] = useReplay();
  const [kara, replayKara] = useReplay();
  const [count, replayCount] = useReplay();
  const [logo, replayLogo] = useReplay();
  const chip = (t: string) => (
    <div className="grid size-20 place-items-center rounded-2xl border border-border bg-background text-[12px] font-semibold shadow-sm">{t}</div>
  );
  return (
    <section id="motion" className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-28">
      <div className="max-w-2xl">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">components/motion</div>
        <MaskReveal as="h2" text="Motion graphics, as components." className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
        <p className="mt-4 text-lg text-muted-foreground">The moves from product-launch videos — mask reveals, a camera that frames, cursors that click, cards that lift — each one a copy-paste file. Transform-only, and every one respects reduced motion.</p>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Demo name="MaskReveal" file="motion/mask-reveal.tsx" note="Keynote headline: words rise from behind a mask." onReplay={replayMask}>
          <MaskReveal key={mask} text="Download. Print. Share." className="text-center font-display text-3xl font-extrabold tracking-tight" />
        </Demo>
        <Demo name="KaraokeText" file="motion/karaoke-text.tsx" note="Words light up like a narrator — by time or by scroll." onReplay={replayKara}>
          <KaraokeText key={kara} text="Plan ahead, approved faster, signed in seconds." duration={2.6} className="text-center font-display text-2xl font-bold tracking-tight" />
        </Demo>
        <Demo name="WordRotator" file="motion/word-rotator.tsx" note="The one editorial accent: a word that keeps changing.">
          <div className="text-center font-display text-3xl font-extrabold tracking-tight">
            Made to <WordRotator words={["move", "ship", "last", "delight"]} className="font-serif font-normal italic" />
          </div>
        </Demo>
        <Demo name="SoftCursor" file="motion/soft-cursor.tsx" note="A hand-like pointer. No red rings — and every click changes something." span="lg:col-span-1">
          <CursorDemo />
        </Demo>
        <Demo name="FlyingPill" file="motion/flying-pill.tsx" note="A message that leaves one device and lands on another.">
          <PillDemo />
        </Demo>
        <Demo name="ElementLift" file="motion/element-lift.tsx" note="Rises to center, floats, flips in 3D, flies home.">
          <LiftDemo />
        </Demo>
        <Demo name="VirtualCamera" file="motion/virtual-camera.tsx" note="Frames part of a screen with a symmetric camera ease." span="lg:col-span-2">
          <CameraDemo />
        </Demo>
        <Demo name="CountUp" file="motion/count-up.tsx" note="Counts to its value in view; tabular figures never wobble." onReplay={replayCount}>
          <div key={count} className="text-center">
            <div className="font-display text-5xl font-extrabold tracking-tight">
              <CountUp to={24195} />
            </div>
            <div className="mt-1 text-[13px] text-muted-foreground">lines of guidance</div>
          </div>
        </Demo>
        <Demo name="Stepper" file="motion/stepper.tsx" note="Where the story is: the active pill glides between stages.">
          <StepperDemo />
        </Demo>
        <Demo name="LogoCollapse" file="motion/logo-collapse.tsx" note="The outro: feature cards pull into the logo." onReplay={replayLogo}>
          <LogoCollapse key={logo} auto hold={1.2} items={[chip("Tokens"), chip("Motion"), chip("Skills")]} logo={<span className="font-display text-4xl font-extrabold tracking-tight">p441z</span>} />
        </Demo>
        <Demo name="LaptopFrame · PhoneFrame" file="motion/device-frame.tsx" note="Brandless CSS devices that size to their container." span="lg:col-span-2">
          <div className="flex w-full items-end justify-center gap-6">
            <LaptopFrame url="app.example.com" className="w-[62%]">
              <div className="grid h-full place-items-center text-[13px] text-muted-foreground">Your UI here</div>
            </LaptopFrame>
            <PhoneFrame className="w-[17%]">
              <div className="grid h-full place-items-center text-[10px] text-muted-foreground">Mobile</div>
            </PhoneFrame>
          </div>
        </Demo>
        <Demo name="Notification" file="mac/notification.tsx" note="Frosted banners that slide in, stack, and leave on their own.">
          <NotifyDemo />
        </Demo>
      </div>
    </section>
  );
}

function NotifyDemo() {
  const notify = useNotify();
  const [n, setN] = useState(0);
  const msgs = [
    { title: "Leave approved", body: "17 – 19 Nov · signed by Maya", icon: <IconCheck /> },
    { title: "New task", body: "Purchase request PR-123 needs you", icon: <IconBell /> },
    { title: "Request sent", body: "Travel to Bandung · 2 days", icon: <IconSend /> },
  ];
  return (
    <button
      type="button"
      onClick={() => {
        notify(msgs[n % msgs.length]);
        setN(n + 1);
      }}
      className="rounded-full bg-foreground px-5 py-2.5 text-[14px] font-semibold text-background transition-transform duration-200 active:scale-95"
    >
      Send a notification
    </button>
  );
}
