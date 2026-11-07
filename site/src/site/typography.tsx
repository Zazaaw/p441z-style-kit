"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import SpotlightCard from "@/components/effects/spotlight-card";
import MaskReveal from "@/components/motion/mask-reveal";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { REPO } from "@/site/chrome";
import { useNum, useT } from "@/site/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Everything here comes from skill-typography: base 16px, every step ×/÷ φ, half-steps √φ.
const PHI = 1.618034;
const SCALE = [
  { role: "caption", px: 12.58, lh: 1.4, tr: 0.01 },
  { role: "body-sm", px: 14.19, lh: 1.5, tr: 0 },
  { role: "body", px: 16, lh: 1.618, tr: 0 },
  { role: "lead", px: 20.35, lh: 1.5, tr: -0.005 },
  { role: "h5", px: 25.89, lh: 1.25, tr: -0.01 },
  { role: "h4", px: 32.93, lh: 1.2, tr: -0.015 },
  { role: "h3", px: 41.89, lh: 1.15, tr: -0.02 },
  { role: "h2", px: 53.28, lh: 1.1, tr: -0.022 },
  { role: "h1", px: 67.78, lh: 1.05, tr: -0.025 },
];
const FAMILIES = [
  { key: "sans", label: "Sans", name: "Plus Jakarta Sans", cls: "font-display", note: "Everything. 400–800.", noteId: "Untuk hampir semua teks. 400–800.", weights: [400, 800] },
  { key: "serif", label: "Serif", name: "Instrument Serif Italic", cls: "font-serif italic", note: "The accent — used once per page.", noteId: "Aksen — cukup sekali per halaman.", weights: [400, 400] },
  { key: "mono", label: "Mono", name: "JetBrains Mono", cls: "font-mono", note: "Code, IDs, tabular data.", noteId: "Kode, ID, data tabel.", weights: [400, 700] },
] as const;
const SAMPLE =
  "Good typography is invisible. The reader never notices the leading or the measure — they simply keep reading, a little longer than they planned, without ever feeling the effort.";
const SAMPLE_ID =
  "Tipografi yang baik tidak terasa. Pembaca tak pernah memikirkan leading atau measure — mereka hanya terus membaca, sedikit lebih lama dari niatnya, tanpa merasa lelah.";

/** Golden rectangle cut into squares (each φ× the next), clockwise. */
function goldenSquares(n: number, W: number) {
  let x = 0, y = 0, w = W, h = W / PHI;
  const out: { x: number; y: number; s: number; d: number }[] = [];
  for (let i = 0; i < n; i++) {
    const d = i % 4;
    if (d === 0) { out.push({ x, y, s: h, d }); x += h; w -= h; }
    else if (d === 1) { out.push({ x, y, s: w, d }); y += w; h -= w; }
    else if (d === 2) { out.push({ x: x + w - h, y, s: h, d }); w -= h; }
    else { out.push({ x, y: y + h - w, s: w, d }); h -= w; }
  }
  return out;
}
/** Quarter arc through each square — together they form the golden spiral. */
function spiralPath(sq: ReturnType<typeof goldenSquares>) {
  const start = sq[0];
  let p = `M${start.x} ${start.y + start.s}`;
  for (const { x, y, s, d } of sq) {
    const end = d === 0 ? [x + s, y] : d === 1 ? [x + s, y + s] : d === 2 ? [x, y + s] : [x, y];
    p += ` A${s} ${s} 0 0 1 ${end[0]} ${end[1]}`;
  }
  return p;
}

function GoldenSpiral() {
  const W = 560;
  const sq = goldenSquares(9, W);
  const labels = ["67.78", "41.89", "25.89", "16", "9.89"];
  const t = useT();
  return (
    <svg viewBox={`-2 -2 ${W + 4} ${W / PHI + 4}`} className="h-auto w-full overflow-visible" aria-label={t("Golden rectangle divided into squares, each 1.618 times the next, with the type scale sizes", "Persegi panjang emas yang terbagi jadi persegi-persegi, masing-masing 1,618 kali persegi berikutnya, lengkap dengan ukuran skala hurufnya")}>
      {sq.map((q, i) => (
        <g key={i} className="gold-sq">
          <rect x={q.x} y={q.y} width={q.s} height={q.s} className={cn("fill-transparent stroke-border", i === 0 && "fill-primary/[0.04]")} strokeWidth="1.2" />
          {labels[i] && (
            <text x={q.x + 12} y={q.y + 24} className="fill-muted-foreground font-mono" fontSize={Math.max(9, 15 - i * 1.6)}>
              {labels[i]}px
            </text>
          )}
        </g>
      ))}
      <path d={spiralPath(sq)} className="gold-spiral fill-none stroke-primary" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function ScaleExplorer() {
  const [fam, setFam] = useState(0);
  const [weight, setWeight] = useState(800);
  const [step, setStep] = useState(6);
  const f = FAMILIES[fam];
  const w = Math.min(f.weights[1], Math.max(f.weights[0], weight));
  const cur = SCALE[step];
  const t = useT();
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
      <div className="flex flex-col">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("The scale", "Skalanya")}</div>
        <div className="mt-2 font-display text-2xl font-extrabold tracking-tight">{t("The steps you’ll use. One ratio.", "Semua ukuran yang kamu butuhkan. Satu rasio.")}</div>
        <div className="mt-5 flex gap-1">
          {FAMILIES.map((x, i) => (
            <button key={x.key} type="button" onClick={() => setFam(i)} className={cn("rounded-full px-3 py-1 text-[12px] font-semibold transition-colors duration-200", i === fam ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
              {x.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-end gap-5">
          <motion.div key={f.key} initial={{ opacity: 0, y: 10, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.45, ease: EASE.reveal }} className={cn("text-[120px] leading-[0.9] tracking-[-0.04em]", f.cls)} style={{ fontWeight: w }}>
            Aa
          </motion.div>
          <div className="pb-3 text-[13px] leading-relaxed text-muted-foreground">
            <div className="font-semibold text-foreground">{f.name}</div>
            <div>{t(f.note, f.noteId)}</div>
          </div>
        </div>
        <label className={cn("mt-6 block text-[12px] font-medium text-muted-foreground", f.weights[0] === f.weights[1] && "opacity-40")}>
          <span className="flex justify-between">
            <span>{t("Weight", "Ketebalan")}</span>
            <span className="font-mono tabular-nums text-foreground">{w}</span>
          </span>
          <Range value={w} min={400} max={800} step={100} disabled={f.weights[0] === f.weights[1]} onChange={setWeight} label={t("Font weight", "Ketebalan font")} />
        </label>
        <div className="mt-auto grid grid-cols-3 gap-2 pt-6 text-center">
          {[
            [t("Ratio", "Rasio"), t("1.618", "1,618")],
            [cur.role, `${cur.px}px`],
            ["Leading", String(cur.lh)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border px-2 py-2.5">
              <div className="font-mono text-[15px] font-semibold tabular-nums">{v}</div>
              <div className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{k}</div>
            </div>
          ))}
        </div>
      </div>
      <ul className="min-w-0 divide-y divide-border border-y border-border" onMouseLeave={() => setStep(6)}>
        {SCALE.map((x, i) => (
          <li key={x.role}>
            <button type="button" onMouseEnter={() => setStep(i)} onFocus={() => setStep(i)} onClick={() => setStep(i)} className="relative flex w-full min-w-0 items-baseline gap-4 py-2 text-left">
              {i === step && <motion.span layoutId="type-step" className="absolute inset-y-1 -left-3 w-[3px] rounded-full bg-primary" transition={{ duration: 0.35, ease: EASE.reveal }} />}
              <span className={cn("w-16 shrink-0 font-mono text-[11px] tabular-nums transition-colors", i === step ? "text-primary" : "text-muted-foreground")}>
                {x.role}
                <span className="block opacity-70">{x.px}</span>
              </span>
              <span className={cn("min-w-0 truncate transition-colors duration-200", f.cls, i === step ? "text-foreground" : "text-foreground/70")} style={{ fontSize: x.px, lineHeight: x.lh, letterSpacing: `${x.tr}em`, fontWeight: i >= 4 ? w : Math.min(w, 600) }}>
                {t("Quiet by default.", "Kalem dari awal.")}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Blue-filled range input that looks the same in Safari, Chrome, and Firefox. */
function Range({ value, min, max, step, onChange, label, disabled }: { value: number; min: number; max: number; step: number; onChange: (v: number) => void; label: string; disabled?: boolean }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={label}
      className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_2px_8px_-2px_var(--color-primary)]"
      style={{ background: `linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-muted) ${pct}%)` }}
    />
  );
}

function Verdict({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", ok ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground")}>{children}</span>;
}

function LeadingCard() {
  const [lh, setLh] = useState(1.618);
  const good = lh >= 1.5 && lh <= 1.7;
  const t = useT();
  return (
    <SpotlightCard className="type-card flex flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Leading</div>
        <Verdict ok={good}>{Math.abs(lh - 1.618) < 0.03 ? t("φ — the body default", "φ — standar body") : good ? t("comfortable", "nyaman") : lh < 1.5 ? t("too tight", "terlalu rapat") : t("too loose", "terlalu renggang")}</Verdict>
      </div>
      <div className="mt-2 font-display text-xl font-extrabold tracking-tight">{t("Body breathes at φ.", "Body paling lega di φ.")}</div>
      <p className="mt-4 text-[15px] text-muted-foreground transition-[line-height] duration-150" style={{ lineHeight: lh }}>
        {t(SAMPLE, SAMPLE_ID)}
      </p>
      <div className="mt-auto pt-5 text-[12px] text-muted-foreground">
        <span className="flex justify-between">
          <span>line-height</span>
          <span className="font-mono tabular-nums text-foreground">{lh.toFixed(3)}</span>
        </span>
        <Range value={lh} min={1} max={2.2} step={0.001} onChange={(v) => setLh(Math.abs(v - 1.618) < 0.02 ? 1.618 : v)} label={t("Line height", "Tinggi baris")} />
        <div className="mt-2">{t("Headings tighten as they grow: h3 1.15 · h2 1.1 · h1 1.05 · display 1.0.", "Makin besar heading, makin rapat barisnya: h3 1.15 · h2 1.1 · h1 1.05 · display 1.0.")}</div>
      </div>
    </SpotlightCard>
  );
}

function MeasureCard() {
  const [ch, setCh] = useState(66);
  const good = ch >= 45 && ch <= 75;
  const t = useT();
  const sample = t(SAMPLE, SAMPLE_ID);
  return (
    <SpotlightCard className="type-card flex flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Measure</div>
        <Verdict ok={good}>{good ? (Math.abs(ch - 66) <= 3 ? "ideal" : t("readable", "enak dibaca")) : ch < 45 ? t("too short", "terlalu pendek") : t("too long", "terlalu panjang")}</Verdict>
      </div>
      <div className="mt-2 font-display text-xl font-extrabold tracking-tight">{t("45–75 characters a line.", "45–75 karakter per baris.")}</div>
      <div className="mt-4 overflow-hidden">
        <p className="text-[13px] leading-[1.6] text-muted-foreground transition-[max-width] duration-150" style={{ maxWidth: `${ch}ch` }}>
          {sample} {sample}
        </p>
      </div>
      <div className="mt-auto pt-5 text-[12px] text-muted-foreground">
        <span className="flex justify-between">
          <span>max-width</span>
          <span className="font-mono tabular-nums text-foreground">{ch}ch</span>
        </span>
        <Range value={ch} min={30} max={100} step={1} onChange={setCh} label={t("Line length", "Panjang baris")} />
        <div className="mt-2">{t("Prose caps at 65ch, captions at 50ch. Long lines lose the reader at the turn.", "Paragraf maksimal 65ch, caption 50ch. Baris yang kepanjangan bikin mata tersesat saat pindah baris.")}</div>
      </div>
    </SpotlightCard>
  );
}

const trackingFor = (px: number) => (px <= 16 ? 0 : px <= 26 ? -0.01 : px <= 42 ? -0.02 : px <= 68 ? -0.025 : -0.03);

function TrackingCard() {
  const [px, setPx] = useState(53.28);
  const tr = trackingFor(px);
  const t = useT();
  return (
    <SpotlightCard className="type-card flex flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Tracking</div>
        <Verdict ok>{tr === 0 ? t("0 at body", "0 di body") : `${tr}em`}</Verdict>
      </div>
      <div className="mt-2 font-display text-xl font-extrabold tracking-tight">{t("Bigger text, tighter letters.", "Teks makin besar, huruf makin rapat.")}</div>
      <div className="mt-4 grid h-[120px] place-items-center overflow-hidden rounded-xl bg-muted/40">
        <span className="whitespace-nowrap font-display font-extrabold leading-none transition-all duration-150" style={{ fontSize: Math.min(px, 70), letterSpacing: `${tr}em` }}>
          {t("Typography", "Tipografi")}
        </span>
      </div>
      <div className="mt-auto pt-5 text-[12px] text-muted-foreground">
        <span className="flex justify-between">
          <span>{t("font-size (step on the scale)", "font-size (langkah di skala)")}</span>
          <span className="font-mono tabular-nums text-foreground">{px}px</span>
        </span>
        <Range value={SCALE.findIndex((s) => s.px === px)} min={2} max={8} step={1} onChange={(i) => setPx(SCALE[i].px)} label={t("Font size", "Ukuran font")} />
        <div className="mt-2">{t("Small caps and overlines open up (+0.06em); display sizes close in (−0.03em).", "Huruf kapital kecil dan overline direnggangkan (+0.06em); ukuran display dirapatkan (−0.03em).")}</div>
      </div>
    </SpotlightCard>
  );
}

function NumbersCard() {
  const [tab, setTab] = useState(true);
  const t = useT();
  const rows = t(["1,111.11", "8,048.00", "12,350.70", "906.45"], ["1.111,11", "8.048,00", "12.350,70", "906,45"]);
  return (
    <SpotlightCard className="type-card flex flex-col p-6">
      <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Numbers", "Angka")}</div>
      <div className="mt-2 font-display text-xl font-extrabold tracking-tight">{t("Tables use tabular figures.", "Di tabel, pakai angka tabular.")}</div>
      <div className="mt-4 flex gap-1">
        {[
          [true, "tabular-nums"],
          [false, "proportional"],
        ].map(([v, l]) => (
          <button key={String(l)} type="button" onClick={() => setTab(v as boolean)} className={cn("rounded-full px-3 py-1 font-mono text-[12px] transition-colors duration-200", tab === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
            {l}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-border p-3 text-right font-display text-[20px] font-semibold" style={{ fontVariantNumeric: tab ? "tabular-nums" : "proportional-nums" }}>
        {rows.map((r) => (
          <div key={r} className="border-b border-border/60 py-1 last:border-0">
            Rp {r}
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4 text-[12px] text-muted-foreground">{t("Right-aligned, fixed decimals — the digits line up so the eye can compare columns.", "Rata kanan, desimal tetap — digitnya sejajar, jadi mata gampang membandingkan kolom.")}</div>
    </SpotlightCard>
  );
}

function PairingCard() {
  const t = useT();
  return (
    <SpotlightCard className="type-card flex flex-col p-6">
      <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Pairing", "Padanan")}</div>
      <div className="mt-2 font-display text-xl font-extrabold tracking-tight">{t("Two families. One mono.", "Dua jenis huruf. Satu mono.")}</div>
      <div className="mt-5 space-y-3">
        <div className="font-display text-[26px] font-extrabold leading-tight tracking-tight">{t("Sans carries the page.", "Sans memikul halaman.")}</div>
        <div className="font-serif text-[28px] italic leading-tight text-primary">{t("The serif speaks once.", "Serif cukup tampil sekali.")}</div>
        <div className="font-mono text-[14px] text-muted-foreground">{t("mono → code · IDs · data", "mono → kode · ID · data")}</div>
      </div>
      <div className="mt-auto pt-4 text-[12px] text-muted-foreground">{t("One moment of contrast reads as intent. Ten reads as indecision. SF is never self-hosted — the system stack serves it.", "Satu kontras terasa disengaja; sepuluh terasa bimbang. SF tak pernah di-host sendiri — biar system stack yang menyediakannya.")}</div>
    </SpotlightCard>
  );
}

function WeightsCard() {
  const t = useT();
  return (
    <SpotlightCard className="type-card flex flex-col p-6">
      <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Weights", "Ketebalan")}</div>
      <div className="mt-2 font-display text-xl font-extrabold tracking-tight">{t("Few weights, clear jobs.", "Sedikit ketebalan, peran yang jelas.")}</div>
      <div className="mt-5 grid grid-cols-5 gap-2 text-center">
        {[400, 500, 600, 700, 800].map((w) => (
          <div key={w}>
            <div className="font-display text-[34px] leading-none" style={{ fontWeight: w }}>
              Aa
            </div>
            <div className="mt-1.5 font-mono text-[11px] text-muted-foreground">{w}</div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4 text-[12px] text-muted-foreground">{t("400 / 500 / 600 for product UI, 400 / 600 / 700 for marketing, 800 only for display. No faux bold: font-synthesis: none.", "400 / 500 / 600 untuk UI produk, 400 / 600 / 700 untuk marketing, 800 khusus display. Tidak ada bold palsu: font-synthesis: none.")}</div>
    </SpotlightCard>
  );
}

export default function Typography({ skillLines }: { skillLines: number }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const num = useNum();
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The spiral draws itself as you scroll past it; the squares settle in one by one.
        const path = root.current!.querySelector<SVGPathElement>(".gold-spiral")!;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".gold-wrap", start: "top 80%", end: "bottom 45%", scrub: 0.8 } });
        gsap.from(".gold-sq", { opacity: 0, scale: 0.94, transformOrigin: "50% 50%", stagger: 0.08, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: ".gold-wrap", start: "top 80%" } });
        gsap.from(".type-card", { y: 40, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: ".type-cards", start: "top 80%" } });
      });
    },
    { scope: root },
  );
  return (
    <section id="type" ref={root} className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("Typography", "Tipografi")}</div>
          <MaskReveal as="h2" text={t("Built on the golden ratio.", "Berpijak pada golden ratio.")} className="mt-3 font-display text-[clamp(2.2rem,5vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.04em]" />
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {t(
              <>
                The type in this kit is <span className="font-semibold text-foreground">researched and built on the golden ratio</span>. Every size is the 16px base multiplied or divided by{" "}
                <span className="font-serif text-[1.15em] italic text-primary">φ = 1.618</span> — with a half-step of √φ when a full step is too far. Leading, measure, tracking, and weights follow the same logic.
                Nothing is picked by eye.
              </>,
              <>
                Tipografi di kit ini <span className="font-semibold text-foreground">diriset dan disusun dari golden ratio</span>. Semua ukuran berawal dari 16px, lalu dikali atau dibagi{" "}
                <span className="font-serif text-[1.15em] italic text-primary">φ = 1,618</span> — atau setengah langkah, √φ, kalau satu langkah terasa terlalu jauh. Leading, measure, tracking, dan ketebalan huruf ikut aturan yang sama.
                Tidak ada angka yang asal tebak.
              </>,
            )}
          </p>
          <div className="mt-8 grid grid-cols-4 gap-2">
            {[
              ["16", t("px base", "px dasar")],
              [t("1.618", "1,618"), t("φ ratio", "rasio φ")],
              [t("1.272", "1,272"), t("√φ half-step", "setengah langkah √φ")],
              ["11", t("steps", "langkah")],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-border bg-background/70 px-3 py-3 backdrop-blur">
                <div className="font-mono text-[17px] font-semibold tabular-nums">{v}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 font-mono text-[12.5px] leading-7 text-muted-foreground">
            9.89 · 12.58 · <span className="text-foreground">16</span> · 20.35 · 25.89 · 32.93 · 41.89 · 53.28 · 67.78 · 86.21
          </div>
        </div>
        <div className="gold-wrap rounded-3xl border border-border bg-background/60 p-6 backdrop-blur">
          <GoldenSpiral />
          <div className="mt-4 flex items-center justify-between text-[12px] text-muted-foreground">
            <span>{t("Each square is φ× the next — the same step as the type scale.", "Tiap persegi φ kali lebih besar dari persegi berikutnya — rasio yang sama dengan skala hurufnya.")}</span>
            <span className="font-mono">16 × φ = 25.89</span>
          </div>
        </div>
      </div>

      <SpotlightCard className="mt-16 p-6 md:p-8">
        <ScaleExplorer />
      </SpotlightCard>

      <div className="type-cards mt-4 grid gap-4 md:grid-cols-3">
        <LeadingCard />
        <MeasureCard />
        <TrackingCard />
        <PairingCard />
        <NumbersCard />
        <WeightsCard />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 px-6 py-5 backdrop-blur">
        <div className="text-[14px] text-muted-foreground">
          {t(
            <>
              Distilled from <code className="text-foreground">skill-typography</code> — <span className="font-semibold tabular-nums text-foreground">{num(skillLines)}</span> lines on choosing, pairing, scaling, loading, and auditing type.
            </>,
            <>
              Disarikan dari <code className="text-foreground">skill-typography</code> — <span className="font-semibold tabular-nums text-foreground">{num(skillLines)}</span> baris panduan untuk memilih, memadukan, menskalakan, memuat, dan memeriksa huruf.
            </>,
          )}
        </div>
        <a href={`${REPO}/blob/main/Skill.md/skill-typography.md`} target="_blank" rel="noreferrer" className="text-[14px] font-semibold text-primary hover:underline">
          {t("Read the skill →", "Baca skill-nya →")}
        </a>
      </div>
    </section>
  );
}
