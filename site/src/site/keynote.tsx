"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LaptopFrame, PhoneFrame } from "@/components/motion/device-frame";
import VirtualCamera from "@/components/motion/virtual-camera";
import FlyingPill from "@/components/motion/flying-pill";
import KaraokeText from "@/components/motion/karaoke-text";
import Stepper from "@/components/motion/stepper";
import MaskReveal from "@/components/motion/mask-reveal";
import { Badge } from "@/components/ui/badge";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { IconCalendar, IconCheck, IconSend } from "@/site/icons";

// One self-playing story. A single progress value p (0 → 1) is the clock: it advances by itself
// while the section is on screen, and every visual — camera, cursor, captions, phone — reads it.
const STAGES = [
  { at: 0, label: "Request", caption: "Fill in the dates and a short reason." },
  { at: 0.27, label: "Review", caption: "Submit — it flies straight to your manager." },
  { at: 0.5, label: "Approved", caption: "Approved on the phone, in a single tap." },
  { at: 0.72, label: "Letter", caption: "Your letter is ready, signed and verifiable." },
];
const CLICK_AT = 0.36;
gsap.registerPlugin(ScrollTrigger, useGSAP);

const W = 1200; // design width of the app inside the laptop

/** Scales a fixed-width design canvas to its container (keeps the fake app pixel-identical at any size). */
function Fit({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() => setS(el.clientWidth / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {s > 0 && (
        <div style={{ width: W, height: `${100 / s}%`, transform: `scale(${s})`, transformOrigin: "0 0" }} className="absolute left-0 top-0">
          {children}
        </div>
      )}
    </div>
  );
}

const typed = (text: string, t: number) => text.slice(0, Math.round(text.length * Math.min(1, Math.max(0, t))));

function AppScreen({ p, typing, sent, approved }: { p: MotionValue<number>; typing: number; sent: boolean; approved: boolean }) {
  // The cursor lives in app coordinates so it rides the camera like the real UI does.
  // Ends on the Submit button (≈ 766 × 478 in the 1200-wide canvas) — the camera frames the same point.
  const cxs = useTransform(p, [0.27, 0.34], [560, 758]);
  const cys = useTransform(p, [0.27, 0.34], [330, 470]);
  const cOpacity = useTransform(p, [0.26, 0.28, 0.42, 0.45], [0, 1, 1, 0]);
  const cScale = useTransform(p, [CLICK_AT - 0.01, CLICK_AT, CLICK_AT + 0.012], [1, 0.84, 1]);
  const field = "h-11 rounded-lg border border-border bg-background px-3.5 text-[15px] leading-[2.75rem]";
  return (
    <div className="relative flex h-full bg-muted/40 font-sans text-foreground">
      <aside className="flex w-[220px] flex-col gap-1 border-r border-border bg-background p-4 text-[14px]">
        <div className="mb-4 px-2 font-display text-[17px] font-extrabold tracking-tight">acme hr</div>
        {["Home", "Attendance", "Leave", "Travel", "Payslip"].map((x) => (
          <div key={x} className={cn("rounded-md px-2.5 py-2", x === "Leave" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
            {x}
          </div>
        ))}
      </aside>
      <main className="flex-1 p-8">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[13px] text-muted-foreground">Leave</div>
            <div className="font-display text-[30px] font-extrabold tracking-tight">New request</div>
          </div>
          <Badge variant={approved ? "default" : "secondary"} className="h-7 px-3 text-[13px]">
            {approved ? "✓ Approved" : sent ? "Waiting for approval" : "Draft"}
          </Badge>
        </div>
        <div className="mt-6 grid grid-cols-[1fr_300px] gap-6">
          <div className="space-y-5 rounded-xl border border-border bg-background p-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                ["From", typed("Mon, 17 Nov", typing * 3)],
                ["To", typed("Wed, 19 Nov", typing * 3 - 1)],
              ].map(([l, v]) => (
                <label key={l} className="block text-[13px] font-medium">
                  {l}
                  <div className={cn(field, "mt-1.5 flex items-center gap-2")}>
                    <span className="size-4 text-muted-foreground [&_svg]:size-4">
                      <IconCalendar />
                    </span>
                    {v || <span className="text-muted-foreground/60">Pick a date</span>}
                  </div>
                </label>
              ))}
            </div>
            <label className="block text-[13px] font-medium">
              Type
              <div className="mt-1.5 flex gap-2">
                {["Annual", "Sick", "Family"].map((t, i) => (
                  <span key={t} className={cn("rounded-full border px-3.5 py-1.5 text-[14px]", i === 2 && typing > 0.55 ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground")}>
                    {t}
                  </span>
                ))}
              </div>
            </label>
            <label className="block text-[13px] font-medium">
              Reason
              <div className={cn(field, "mt-1.5 h-24 leading-6 py-2.5")}>{typed("My sister's wedding in Bandung.", typing * 1.6 - 0.6) || <span className="text-muted-foreground/60">A short note for your manager</span>}</div>
            </label>
            <div className="flex justify-end">
              <span className={cn("inline-flex h-11 items-center gap-2 rounded-lg px-6 text-[15px] font-semibold transition-colors duration-300", sent ? "bg-muted text-foreground" : "bg-primary text-primary-foreground shadow-[0_10px_24px_-10px_hsl(var(--primary)/0.8)]")}>
                {sent ? (
                  <>
                    <span className="size-4 [&_svg]:size-4">
                      <IconCheck />
                    </span>
                    Sent
                  </>
                ) : (
                  <>
                    <span className="size-4 [&_svg]:size-4">
                      <IconSend />
                    </span>
                    Submit request
                  </>
                )}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-5">
              <div className="text-[13px] text-muted-foreground">Remaining</div>
              <div className="mt-1 font-display text-[40px] font-extrabold tracking-tight">{typing > 0.2 ? 9 : 12}<span className="ml-1 text-[16px] font-semibold text-muted-foreground">/ 12 days</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div className="h-full rounded-full bg-primary" animate={{ width: typing > 0.2 ? "75%" : "100%" }} transition={{ duration: 0.6, ease: EASE.reveal }} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-5 text-[14px]">
              <div className="text-[13px] text-muted-foreground">Approver</div>
              <div className="mt-2 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">MK</span>
                <div>
                  <div className="font-semibold">Maya Kusuma</div>
                  <div className="text-muted-foreground">Head of People Ops</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <motion.svg width="26" height="30" viewBox="0 0 22 26" className="pointer-events-none absolute left-0 top-0 drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]" style={{ x: cxs, y: cys, opacity: cOpacity, scale: cScale, originX: 0, originY: 0 }} aria-hidden>
        <path d="M2 1.5v19.2l5.1-4.6 3.3 7.4 3.4-1.5-3.3-7.3 6.9-.4L2 1.5z" fill="#0a0a0a" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </motion.svg>
    </div>
  );
}

function PhoneScreen({ notes }: { notes: { title: string; body: string; done?: boolean }[] }) {
  // Sizes in cqw (PhoneFrame is a size container) so the lock screen scales with the phone.
  return (
    <div className="flex h-full flex-col items-center bg-linear-to-b from-sky-100 via-neutral-100 to-neutral-200 px-[4cqw] pt-[6cqw] text-neutral-900 dark:from-sky-950/60 dark:via-neutral-900 dark:to-neutral-950 dark:text-neutral-100">
      <div className="text-[4.4cqw] font-medium opacity-70">Monday, 17 November</div>
      <div className="font-display text-[22cqw] font-bold leading-none tracking-tight">9:41</div>
      <div className="mt-[7cqw] w-full space-y-[2.5cqw]">
        <AnimatePresence initial={false}>
          {notes.map((n) => (
            <motion.div
              key={n.title}
              layout
              initial={{ y: -20, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: EASE.reveal }}
              className="flex gap-[3cqw] rounded-[5cqw] bg-white/75 p-[3cqw] shadow-sm backdrop-blur dark:bg-white/10"
            >
              <span className={cn("grid size-[10cqw] shrink-0 place-items-center rounded-[2.8cqw] text-white [&_svg]:size-[5cqw]", n.done ? "bg-[#28c840]" : "bg-primary")}>{n.done ? <IconCheck /> : <IconSend />}</span>
              <span className="min-w-0 text-[3.7cqw] leading-snug">
                <span className="block font-semibold">{n.title}</span>
                <span className="block opacity-70">{n.body}</span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Letter({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.74, 0.79], [0, 1]);
  const y = useTransform(p, [0.74, 0.82], [60, 0]);
  const scale = useTransform(p, [0.74, 0.82], [0.82, 1]);
  const rotateY = useTransform(p, [0.86, 0.94], [0, 180]);
  return (
    <motion.div className="pointer-events-none absolute inset-0 z-20 grid place-items-center" style={{ opacity }}>
      <motion.div style={{ y, scale, perspective: 1600 }} className="w-[min(520px,82%)]">
        <motion.div style={{ rotateY }} className="relative aspect-[1.42] [transform-style:preserve-3d]">
          <div className="absolute inset-0 rounded-2xl border border-border bg-background p-6 shadow-[0_50px_80px_-30px_rgba(0,0,0,0.5)] [backface-visibility:hidden]">
            <div className="flex items-center justify-between text-[12px] text-muted-foreground">
              <span className="font-display text-[15px] font-extrabold text-foreground">acme hr</span>
              No. LV/2026/11/0417
            </div>
            <div className="mt-4 font-display text-[22px] font-extrabold tracking-tight">Leave approval letter</div>
            <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-[13px]">
              {[["Employee", "Alex Pratama"], ["Dates", "17 – 19 Nov 2026"], ["Type", "Family"], ["Status", "Approved"]].map(([k, v]) => (
                <span key={k} className="contents">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </span>
              ))}
            </div>
            <div className="absolute bottom-5 right-6 text-right text-[11px] text-muted-foreground">
              Signed digitally
              <div className="font-serif text-[22px] italic text-foreground">Maya K.</div>
            </div>
          </div>
          <div className="absolute inset-0 grid place-items-center rounded-2xl border border-border bg-foreground p-6 text-background shadow-[0_50px_80px_-30px_rgba(0,0,0,0.5)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex items-center gap-6">
              <div className="grid size-32 grid-cols-7 gap-[3px] rounded-lg bg-background p-2.5" aria-hidden>
                {Array.from({ length: 49 }, (_, i) => (
                  <span key={i} className={cn("rounded-[1px]", (i * 7919) % 5 < 3 || [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(i) ? "bg-foreground" : "bg-transparent")} />
                ))}
              </div>
              <div>
                <div className="font-display text-[20px] font-extrabold">Scan to verify</div>
                <div className="mt-1 max-w-[180px] text-[13px] opacity-70">Every signature on the letter carries its own QR code.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

const DURATION = 17; // seconds for one play-through
const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

/** Video-style controls: play/pause, replay, chapter ticks, click-to-seek, elapsed time. */
function Controls({ p, playing, onToggle, onReplay, onSeek }: { p: MotionValue<number>; playing: boolean; onToggle: () => void; onReplay: () => void; onSeek: (v: number) => void }) {
  const time = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const fill = useTransform(p, (v) => `${v * 100}%`);
  useMotionValueEvent(p, "change", (v) => {
    if (time.current) time.current.textContent = mmss(v * DURATION);
    bar.current?.setAttribute("aria-valuenow", String(Math.round(v * 100)));
  });
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-full border border-border bg-background/75 px-2 py-1.5 backdrop-blur-xl">
      <button type="button" onClick={onToggle} aria-label={playing ? "Pause" : "Play"} className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 active:scale-90">
        <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
          {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5.5v13l10.5-6.5z" />}
        </svg>
      </button>
      <div
        ref={bar}
        role="slider"
        aria-label="Seek"
        aria-valuenow={0}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        className="group relative h-8 flex-1 cursor-pointer"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onSeek((e.clientX - r.left) / r.width);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onSeek(Math.min(1, p.get() + 0.05));
          if (e.key === "ArrowLeft") onSeek(Math.max(0, p.get() - 0.05));
        }}
      >
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full rounded-full bg-primary" style={{ width: fill }} />
        </div>
        {STAGES.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSeek(s.at + 0.001);
            }}
            className="absolute top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
            style={{ left: `${s.at * 100}%` }}
            aria-label={`Jump to ${s.label}`}
          >
            <span className="block size-2.5 rounded-full border-2 border-background bg-foreground/60 transition-transform duration-200 group-hover:scale-125" />
          </button>
        ))}
      </div>
      <span ref={time} className="w-9 text-right font-mono text-[12px] tabular-nums text-muted-foreground">0:00</span>
      <span className="font-mono text-[12px] text-muted-foreground/60">/ {mmss(DURATION)}</span>
      <button type="button" onClick={onReplay} aria-label="Replay" className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
}

export default function Keynote() {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  // Arrival: the devices rise and tilt up into place as the section scrolls in (scrubbed, so it
  // tracks the scroll exactly). Reduced motion: they are simply there.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        frame.current,
        { scale: 0.84, rotateX: 24, yPercent: 10, opacity: 0.35, transformPerspective: 1600, transformOrigin: "50% 100%" },
        { scale: 1, rotateX: 0, yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "top 30%", scrub: true } },
      );
    });
    return () => mm.revert();
  });
  const reduce = useReducedMotion();
  // The story's clock. Plays by itself while the section is on screen — no scrolling required.
  const p = useMotionValue(0);
  const inView = useInView(ref, { amount: 0.55 });
  const [paused, setPaused] = useState<boolean | null>(null); // null = follow reduced-motion preference
  const [seek, setSeek] = useState(0);
  const isPaused = paused ?? !!reduce;
  const playing = inView && !isPaused;

  useEffect(() => {
    if (reduce && paused === null) p.set(0.6); // a meaningful still frame instead of an empty form
  }, [reduce, paused, p]);

  useEffect(() => {
    if (!playing) return;
    let ctl: ReturnType<typeof animate> | null = null;
    let loop: ReturnType<typeof setTimeout> | null = null;
    const run = () => {
      const from = p.get() >= 0.999 ? 0 : p.get();
      p.set(from);
      ctl = animate(p, 1, {
        duration: DURATION * (1 - from),
        ease: "linear",
        onComplete: () => {
          loop = setTimeout(() => {
            p.set(0);
            run();
          }, 2600);
        },
      });
    };
    run();
    return () => {
      ctl?.stop();
      if (loop) clearTimeout(loop);
    };
  }, [playing, seek, p]);

  const [stage, setStage] = useState(0);
  const [typing, setTyping] = useState(0);
  const [sent, setSent] = useState(false);
  const [run, setRun] = useState(0);
  const [landed, setLanded] = useState(false);
  const approved = stage >= 2;

  useMotionValueEvent(p, "change", (v) => {
    const s = STAGES.reduce((a, st, i) => (v >= st.at ? i : a), 0);
    if (s !== stage) setStage(s);
    const t = Math.round(Math.min(1, Math.max(0, (v - 0.04) / 0.2)) * 40) / 40;
    if (t !== typing) setTyping(t);
    const nowSent = v >= CLICK_AT;
    if (nowSent !== sent) {
      setSent(nowSent);
      if (nowSent) setRun((r) => r + 1);
      else setLanded(false);
    }
  });

  const segment = useTransform(p, (v) => {
    const i = STAGES.reduce((a, st, k) => (v >= st.at ? k : a), 0);
    const end = STAGES[i + 1]?.at ?? 1;
    return Math.min(1, Math.max(0, (v - STAGES[i].at) / (end - STAGES[i].at - 0.04)));
  });
  const dim = useTransform(p, [0.72, 0.78], [0, 1]);
  const devicesFilter = useTransform(dim, (d) => `blur(${d * 6}px)`);
  const devicesOpacity = useTransform(dim, [0, 1], [1, 0.35]);

  const notes = [
    ...(landed || stage >= 2 ? [{ title: "Leave request · Alex Pratama", body: "17 – 19 Nov · Family" }] : []),
    ...(stage >= 2 ? [{ title: "Approved", body: "You approved Alex's leave.", done: true }] : []),
  ];

  return (
    <section id="keynote" ref={ref} className="relative scroll-mt-10">
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-5 overflow-hidden px-4 py-20">
        <div className="text-center">
          <MaskReveal as="h2" text="Watch it move." className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
          <p className="mt-2 text-sm text-muted-foreground">It plays by itself — every piece is a kit component, nothing is a video.</p>
        </div>
        <Stepper steps={STAGES.map((s) => s.label)} active={stage} id="keynote" className="hidden sm:inline-flex" />
        <div className="h-9 w-full max-w-3xl text-center">
          <AnimatePresence mode="wait">
            <motion.div key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: EASE.reveal }}>
              <KaraokeText text={STAGES[stage].caption} progress={segment} className="font-display text-[clamp(1.05rem,2vw,1.45rem)] font-semibold tracking-tight" />
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Width follows the viewport height too, so laptop + phone always fit above the fold. */}
        <div ref={frame} className="relative w-full" style={{ maxWidth: "min(72rem, calc((100svh - 300px) * 1.9))" }}>
          <motion.div style={{ filter: devicesFilter, opacity: devicesOpacity }} className="flex items-end justify-center gap-6 md:gap-10">
            <LaptopFrame url="hr.acme.example/leave/new" className="w-[100%] md:w-[74%]">
              <VirtualCamera
                progress={p}
                path={[
                  { at: 0, x: 0.5, y: 0.5, zoom: 1 },
                  { at: 0.08, x: 0.42, y: 0.48, zoom: 1.45 },
                  { at: 0.24, x: 0.42, y: 0.52, zoom: 1.45 },
                  { at: 0.33, x: 0.64, y: 0.68, zoom: 1.9 },
                  { at: 0.42, x: 0.64, y: 0.68, zoom: 1.9 },
                  { at: 0.52, x: 0.5, y: 0.5, zoom: 1 },
                  { at: 1, x: 0.5, y: 0.5, zoom: 1 },
                ]}
              >
                <Fit>
                  <AppScreen p={p} typing={typing} sent={sent} approved={approved} />
                </Fit>
              </VirtualCamera>
            </LaptopFrame>
            <PhoneFrame className="hidden md:block md:w-[19%]">
              <PhoneScreen notes={notes} />
            </PhoneFrame>
          </motion.div>
          <div className="absolute inset-0 hidden md:block">
          <FlyingPill run={run} from={{ x: 0.39, y: 0.5 }} to={{ x: 0.885, y: 0.4 }} title="Sent to your manager" subtitle="Leave · 3 days" icon={<span className="size-3.5 [&_svg]:size-3.5"><IconSend /></span>} onLand={() => setLanded(true)} />
          </div>
          <Letter p={p} />
        </div>
        <Controls
          p={p}
          playing={playing}
          onToggle={() => setPaused(!isPaused)}
          onReplay={() => {
            p.set(0);
            setPaused(false);
            setSeek((x) => x + 1);
          }}
          onSeek={(v) => {
            p.set(Math.min(0.999, Math.max(0, v)));
            setSeek((x) => x + 1);
          }}
        />
      </div>
    </section>
  );
}
