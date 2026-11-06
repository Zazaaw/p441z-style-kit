"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";

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

// One scroll-driven story. The section is 420vh tall; its stage sticks to the viewport while the
// scrollbar plays the "video". Every visual reads one progress value p (0 → 1).
const STAGES = [
  { at: 0, label: "Request", caption: "Fill in the dates and a short reason." },
  { at: 0.27, label: "Review", caption: "Submit — it flies straight to your manager." },
  { at: 0.5, label: "Approved", caption: "Approved on the phone, in a single tap." },
  { at: 0.72, label: "Letter", caption: "Your letter is ready, signed and verifiable." },
];
const CLICK_AT = 0.36;
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
          <div key={x} className={cn("rounded-md px-2.5 py-2", x === "Leave" ? "bg-foreground text-background" : "text-muted-foreground")}>
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
                  <span key={t} className={cn("rounded-full border px-3.5 py-1.5 text-[14px]", i === 2 && typing > 0.55 ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground")}>
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
              <span className={cn("inline-flex h-11 items-center gap-2 rounded-lg px-6 text-[15px] font-semibold transition-colors duration-300", sent ? "bg-muted text-foreground" : "bg-foreground text-background")}>
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
                <motion.div className="h-full rounded-full bg-foreground" animate={{ width: typing > 0.2 ? "75%" : "100%" }} transition={{ duration: 0.6, ease: EASE.reveal }} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-5 text-[14px]">
              <div className="text-[13px] text-muted-foreground">Approver</div>
              <div className="mt-2 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-foreground text-[13px] font-bold text-background">MK</span>
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
  return (
    <div className="flex h-full flex-col items-center bg-linear-to-b from-neutral-200 to-neutral-300 px-3 pt-6 text-neutral-900 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-100">
      <div className="text-[13px] font-medium opacity-70">Monday, 17 November</div>
      <div className="font-display text-[64px] font-bold leading-none tracking-tight">9:41</div>
      <div className="mt-6 w-full space-y-2">
        <AnimatePresence initial={false}>
          {notes.map((n) => (
            <motion.div
              key={n.title}
              layout
              initial={{ y: -20, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: EASE.reveal }}
              className="flex gap-2.5 rounded-2xl bg-white/70 p-2.5 shadow-sm backdrop-blur dark:bg-white/10"
            >
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-[9px] text-white [&_svg]:size-4", n.done ? "bg-[#28c840]" : "bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900")}>{n.done ? <IconCheck /> : <IconSend />}</span>
              <span className="min-w-0 text-[11px] leading-snug">
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

export default function Keynote() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
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
    <section id="keynote" ref={ref} className="relative" style={{ height: "420vh" }}>
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-5 overflow-hidden px-4 pt-10">
        <div className="text-center">
          <MaskReveal as="h2" text="Watch it move." className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
          <p className="mt-2 text-sm text-muted-foreground">Scroll to play — every piece below is a kit component.</p>
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
        <div className="relative w-full" style={{ maxWidth: "min(72rem, calc((100svh - 300px) * 1.9))" }}>
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
      </div>
    </section>
  );
}
