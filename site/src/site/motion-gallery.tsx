"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useInView } from "framer-motion";

import GlassPanel, { GlassBackdrop } from "@/components/effects/glass-panel";
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
import { IconBell, IconCheck, IconCopy, IconSend } from "@/site/icons";
import { installFor } from "@/site/chrome";
import { useLang, useNum, useT } from "@/site/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Ticks `fn` every `ms` — only while `ref` is on screen. Off-screen demos cost nothing (Safari
 *  was re-laying-out the whole page every time an unseen Stepper pill moved). */
function useVisibleInterval(ref: React.RefObject<Element | null>, fn: () => void, ms: number) {
  const seen = useInView(ref);
  const cb = useRef(fn);
  useEffect(() => {
    cb.current = fn;
  });
  useEffect(() => {
    if (!seen) return;
    const t = setInterval(() => cb.current(), ms);
    return () => clearInterval(t);
  }, [seen, ms]);
}

function Demo({ name, file, wide, children, onReplay, note }: { name: string; file: string; wide?: boolean; children: React.ReactNode; onReplay?: () => void; note: string }) {
  const t = useT();
  const lang = useLang();
  const doc = `${lang === "id" ? "/id" : ""}/components/${file === "mac/window.tsx" ? "mac-window" : file.replace(/^.*\//, "").replace(/\.tsx?$/, "")}`;
  return (
    <GlassPanel tilt={2} className={cn("demo-card flex min-w-0 flex-col lg:shrink-0", wide ? "sm:col-span-2 lg:w-[640px]" : "lg:w-[380px]")}>
      <div className="relative grid min-h-56 flex-1 place-items-center overflow-hidden border-b border-border bg-muted/30 p-6 lg:min-h-[300px]">{children}</div>
      <div className="flex items-start gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="font-display text-[15px] font-bold">{name}</div>
          <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{note}</div>
          <a href={doc} className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-muted-foreground transition-colors hover:text-primary">
            <code>{file}</code>
            <span aria-hidden className="arrow">→</span>
            <span className="sr-only">{t("Docs", "Dokumentasi")}</span>
          </a>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {onReplay && (
            <button type="button" onClick={onReplay} className="rounded-md border border-border px-2.5 py-1 text-[12px] font-medium transition-colors duration-200 hover:bg-muted">
              {t("Replay", "Putar ulang")}
            </button>
          )}
          <CopyInstall file={file} />
        </div>
      </div>
    </GlassPanel>
  );
}

/** Copies the shadcn command that installs this one component (and whatever it depends on). */
function CopyInstall({ file }: { file: string }) {
  const [done, setDone] = useState(false);
  const t = useT();
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard
          ?.writeText(installFor(file))
          .then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          })
          .catch(() => undefined)
      }
      className="flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium text-primary transition-colors duration-200 hover:bg-primary/10"
      aria-label={t(`Copy install command for ${file}`, `Salin perintah install untuk ${file}`)}
    >
      <span className="size-3.5 [&_svg]:size-3.5">{done ? <IconCheck /> : <IconCopy />}</span>
      {done ? t("Copied", "Tersalin") : "Install"}
    </button>
  );
}

function useReplay() {
  const [k, setK] = useState(0);
  return [k, () => setK((x) => x + 1)] as const;
}

function CursorDemo() {
  const [on, setOn] = useState(false);
  const t = useT();
  return (
    <div className="relative h-40 w-full max-w-72 rounded-xl border border-border bg-background p-4">
      <div className="text-[13px] font-semibold">{t("Show photo on card", "Tampilkan foto di kartu")}</div>
      <div className="mt-1 text-[12px] text-muted-foreground">{t("Your photo appears on the printed card.", "Fotomu ikut tercetak di kartu.")}</div>
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
  const tr = useT();
  const box = useRef<HTMLDivElement>(null);
  useVisibleInterval(box, () => setRun((r) => r + 1), 3200);
  return (
    <div ref={box} className="relative h-40 w-full">
      <div className="absolute left-[6%] top-1/2 grid size-20 -translate-y-1/2 place-items-center rounded-2xl border border-border bg-background text-[12px] font-medium">Laptop</div>
      <div className="absolute right-[6%] top-1/2 grid size-20 -translate-y-1/2 place-items-center rounded-2xl border border-border bg-background text-[12px] font-medium">
        {tr("Phone", "Ponsel")}
        {got > 0 && <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-foreground text-[11px] font-bold text-background">{got}</span>}
      </div>
      <FlyingPill run={run} from={{ x: 0.2, y: 0.5 }} to={{ x: 0.8, y: 0.5 }} arc={0.32} title={tr("Request sent", "Pengajuan terkirim")} subtitle={tr("to your manager", "ke atasanmu")} icon={<span className="size-3.5 [&_svg]:size-3.5"><IconSend /></span>} onLand={() => setGot((g) => g + 1)} />
    </div>
  );
}

function LiftDemo() {
  const [up, setUp] = useState(false);
  const t = useT();
  const card = (
    <div className="aspect-[1.6] rounded-2xl border border-border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="font-display text-[13px] font-extrabold text-foreground">acme</span>ID · 3000123
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-foreground text-[13px] font-bold text-background">AP</span>
        <div>
          <div className="text-[15px] font-bold">Alex Pratama</div>
          <div className="text-[12px] text-muted-foreground">{t("Product Designer", "Desainer Produk")}</div>
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
        <div className="mt-2 text-[12px] font-semibold">{t("Scan to save contact", "Pindai untuk simpan kontak")}</div>
      </div>
    </div>
  );
  return (
    <div className="w-60">
      <button type="button" onClick={() => setUp(true)} className="block w-full cursor-pointer text-left" aria-label={t("Lift the card", "Angkat kartu")}>
        <ElementLift id="gallery-card" lifted={up} onLower={() => setUp(false)} front={card} back={back} liftedWidth={480} />
      </button>
      <div className="mt-3 text-center text-[12px] text-muted-foreground">{t("Click the card · Esc to return", "Klik kartu · Esc untuk kembali")}</div>
    </div>
  );
}

function StepperDemo() {
  const [i, setI] = useState(0);
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  useVisibleInterval(box, () => setI((x) => (x + 1) % 4), 1400);
  return (
    <div ref={box}>
      <Stepper id="gallery-stepper" steps={[t("Request", "Pengajuan"), t("Review", "Peninjauan"), t("Approved", "Persetujuan"), t("Letter", "Surat")]} active={i} className="scale-90" />
    </div>
  );
}

function CameraDemo() {
  const t = useT();
  const shots: [string, Shot][] = [
    [t("Wide", "Penuh"), { x: 0.5, y: 0.5, zoom: 1 }],
    [t("Chart", "Grafik"), { x: 0.28, y: 0.62, zoom: 2.2 }],
    [t("Button", "Tombol"), { x: 0.83, y: 0.2, zoom: 2.6 }],
  ];
  const [s, setS] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  useVisibleInterval(box, () => setS((x) => (x + 1) % shots.length), 2200);
  return (
    <div ref={box} className="w-full">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-background">
        <VirtualCamera shot={shots[s][1]}>
          <div className="absolute inset-0 p-3">
            <div className="flex items-center justify-between">
              <div className="h-2 w-16 rounded bg-foreground/80" />
              <div className="rounded bg-foreground px-2 py-0.5 text-[8px] font-semibold text-background">{t("Export", "Ekspor")}</div>
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
  const t = useT();
  const num = useNum();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  // Desktop: pin the section and turn vertical scroll into a horizontal pan across the cards.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - el.clientWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: 0.6, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
        });
      });
    },
    { scope: root },
  );
  const [mask, replayMask] = useReplay();
  const [kara, replayKara] = useReplay();
  const [count, replayCount] = useReplay();
  const [logo, replayLogo] = useReplay();
  const chip = (label: string) => (
    <div className="grid size-20 place-items-center rounded-2xl border border-border bg-background text-[12px] font-semibold shadow-sm">{label}</div>
  );
  return (
    <section id="motion" ref={root} className="relative overflow-hidden py-24 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-10">
      <GlassBackdrop variant="c" />
      <div className="mx-auto w-full max-w-6xl px-6">
      <div className="max-w-2xl">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">components/motion</div>
        <MaskReveal as="h2" text={t("Motion graphics, as components.", "Motion graphic, tinggal pasang.")} className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
        <p className="mt-4 text-lg text-muted-foreground">{t("The moves from product-launch videos — mask reveals, a camera that frames, cursors that click, cards that lift — each one a copy-paste file. Transform-only, and every one respects reduced motion.", "Gerakan khas video peluncuran produk — teks yang muncul dari balik mask, kamera yang membidik, kursor yang mengklik, kartu yang terangkat. Masing-masing satu file, tinggal salin. Semuanya cuma pakai transform dan patuh pada setelan reduced motion.")}</p>
      </div>
      </div>
      <div ref={track} className="mt-12 grid gap-5 px-6 sm:grid-cols-2 lg:mt-10 lg:flex lg:w-full lg:gap-5 lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
        <Demo name="MaskReveal" file="motion/mask-reveal.tsx" note={t("Keynote headline: words rise from behind a mask.", "Judul gaya keynote: kata demi kata naik dari balik mask.")} onReplay={replayMask}>
          <MaskReveal key={mask} text={t("Download. Print. Share.", "Unduh. Cetak. Bagikan.")} className="text-center font-display text-3xl font-extrabold tracking-tight" />
        </Demo>
        <Demo name="KaraokeText" file="motion/karaoke-text.tsx" note={t("Words light up like a narrator — by time or by scroll.", "Kata menyala mengikuti narasi — berdasarkan waktu atau scroll.")} onReplay={replayKara}>
          <KaraokeText key={kara} text={t("Plan ahead, approved faster, signed in seconds.", "Ajukan lebih awal, cepat disetujui, sah dalam hitungan detik.")} duration={2.6} className="text-center font-display text-2xl font-bold tracking-tight" />
        </Demo>
        <Demo name="WordRotator" file="motion/word-rotator.tsx" note={t("The one editorial accent: a word that keeps changing.", "Satu sentuhan editorial: kata yang terus berganti.")}>
          <div className="text-center font-display text-3xl font-extrabold tracking-tight">
            {t("Made to", "Dibuat untuk")} <WordRotator words={t(["move", "ship", "last", "delight"], ["bergerak", "dipakai", "bertahan", "memikat"])} className="font-serif font-normal italic" />
          </div>
        </Demo>
        <Demo name="SoftCursor" file="motion/soft-cursor.tsx" note={t("A hand-like pointer. No red rings — and every click changes something.", "Kursor yang bergerak luwes seperti tangan sungguhan. Tanpa lingkaran merah — dan tiap klik ada hasilnya.")}>
          <CursorDemo />
        </Demo>
        <Demo name="FlyingPill" file="motion/flying-pill.tsx" note={t("A message that leaves one device and lands on another.", "Pesan yang terbang dari satu perangkat dan mendarat di perangkat lain.")}>
          <PillDemo />
        </Demo>
        <Demo name="ElementLift" file="motion/element-lift.tsx" note={t("Rises to center, floats, flips in 3D, flies home.", "Naik ke tengah, melayang, berputar 3D, lalu kembali ke tempatnya.")}>
          <LiftDemo />
        </Demo>
        <Demo name="VirtualCamera" file="motion/virtual-camera.tsx" note={t("Frames part of a screen with a symmetric camera ease.", "Menyorot bagian layar dengan gerak kamera yang mulus.")} wide>
          <CameraDemo />
        </Demo>
        <Demo name="CountUp" file="motion/count-up.tsx" note={t("Counts to its value in view; tabular figures never wobble.", "Angka naik perlahan ke nilainya saat terlihat — lebar digitnya tetap, jadi tidak goyang.")} onReplay={replayCount}>
          <div key={count} className="text-center">
            <div className="font-display text-5xl font-extrabold tracking-tight">
              <CountUp to={24195} format={num} />
            </div>
            <div className="mt-1 text-[13px] text-muted-foreground">{t("lines of guidance", "baris panduan")}</div>
          </div>
        </Demo>
        <Demo name="Stepper" file="motion/stepper.tsx" note={t("Where the story is: the active pill glides between stages.", "Penanda alur: pill aktif meluncur dari tahap ke tahap.")}>
          <StepperDemo />
        </Demo>
        <Demo name="LogoCollapse" file="motion/logo-collapse.tsx" note={t("The outro: feature cards pull into the logo.", "Penutup video: kartu fitur tersedot masuk ke logo.")} onReplay={replayLogo}>
          <LogoCollapse key={logo} auto hold={1.2} items={[chip("Tokens"), chip("Motion"), chip("Skills")]} logo={<span className="font-display text-4xl font-extrabold tracking-tight">p441z</span>} />
        </Demo>
        <Demo name="LaptopFrame · PhoneFrame" file="motion/device-frame.tsx" note={t("Brandless CSS devices that size to their container.", "Bingkai laptop dan ponsel dari CSS murni, tanpa merek, ikut ukuran wadahnya.")} wide>
          <div className="flex w-full items-end justify-center gap-6">
            <LaptopFrame url="app.example.com" className="w-[62%]">
              <div className="grid h-full place-items-center text-[13px] text-muted-foreground">{t("Your UI here", "UI-mu di sini")}</div>
            </LaptopFrame>
            <PhoneFrame className="w-[17%]">
              <div className="grid h-full place-items-center text-[10px] text-muted-foreground">{t("Mobile", "Ponsel")}</div>
            </PhoneFrame>
          </div>
        </Demo>
        <Demo name="Notification" file="mac/notification.tsx" note={t("Frosted banners that slide in, stack, and leave on their own.", "Banner bening yang muncul, menumpuk, lalu hilang sendiri.")}>
          <NotifyDemo />
        </Demo>
      </div>
    </section>
  );
}

function NotifyDemo() {
  const notify = useNotify();
  const [n, setN] = useState(0);
  const t = useT();
  const msgs = [
    { title: t("Leave approved", "Cuti disetujui"), body: t("17 – 19 Nov · signed by Maya", "17 – 19 Nov · disetujui Maya"), icon: <IconCheck /> },
    { title: t("New task", "Tugas baru"), body: t("Purchase request PR-123 needs you", "PR-123 butuh persetujuanmu"), icon: <IconBell /> },
    { title: t("Request sent", "Pengajuan terkirim"), body: t("Travel to Bandung · 2 days", "Dinas ke Bandung · 2 hari"), icon: <IconSend /> },
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
      {t("Send a notification", "Kirim notifikasi")}
    </button>
  );
}
