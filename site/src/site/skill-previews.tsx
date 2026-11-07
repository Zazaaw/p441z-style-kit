"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useT } from "@/site/i18n";

// Before/after previews for each skill: what an AI agent typically produces WITHOUT the skill (left)
// and what the same request looks like WITH it (right). Drawn on a 560×350 canvas, scaled to fit.
const W = 560;
const H = 350;

function Scaled({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() => setS(el.clientWidth / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: `${W} / ${H}` }}>
      <div className="absolute left-0 top-0" style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        {children}
      </div>
    </div>
  );
}

/** Drag (or arrow-key) the divider to compare. Opens with a short nudge so people see it moves. */
export function Compare({ before, after, play = true, onGrab }: { before: React.ReactNode; after: React.ReactNode; /** Run the intro sweep (pass false until it is on screen). */ play?: boolean; onGrab?: () => void }) {
  const t = useT();
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const reduce = useReducedMotion();
  const dragging = useRef(false);
  useEffect(() => {
    if (reduce || !play) return;
    const c = animate(50, [82, 50], { duration: 1.9, delay: 0.45, ease: "easeInOut", onUpdate: setPos });
    return () => c.stop();
  }, [reduce, play]);
  const at = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={box}
      className="relative cursor-ew-resize select-none overflow-hidden rounded-xl border border-border"
      onPointerDown={(e) => {
        dragging.current = true;
        onGrab?.();
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        at(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && at(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Scaled>{after}</Scaled>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Scaled>{before}</Scaled>
      </div>
      <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white" style={{ opacity: pos > 18 ? 1 : 0 }}>
        {t("Without the skill", "Tanpa skill")}
      </span>
      <span className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground" style={{ opacity: pos < 82 ? 1 : 0 }}>
        {t("With the skill", "Pakai skill")}
      </span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" style={{ left: `${pos}%` }} />
      <button
        type="button"
        role="slider"
        aria-label={t("Compare without and with the skill", "Bandingkan hasil tanpa dan dengan skill")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") onGrab?.();
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
        }}
        className="absolute top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-900 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.5)] outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        style={{ left: `${pos}%` }}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
        </svg>
      </button>
    </div>
  );
}

// ── Shared bits ──────────────────────────────────────────────────────────────
const Slop = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("h-full w-full bg-white p-6 text-black", className)} style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
    {children}
  </div>
);
const Kit = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("h-full w-full bg-background p-6 font-display text-foreground", className)}>{children}</div>
);
const Code = ({ children, dark = true }: { children: React.ReactNode; dark?: boolean }) => (
  <pre className={cn("whitespace-pre-wrap rounded-lg p-4 font-mono text-[12.5px] leading-[1.6]", dark ? "bg-neutral-950 text-neutral-200" : "bg-neutral-100 text-neutral-800")}>{children}</pre>
);
const Tick = ({ ok = true }: { ok?: boolean }) => <span className={cn("mr-2 inline-grid size-4 place-items-center rounded-full text-[10px] font-bold", ok ? "bg-primary text-primary-foreground" : "bg-red-500 text-white")}>{ok ? "✓" : "✗"}</span>;

type Pair = { before: React.ReactNode; after: React.ReactNode; /** English note. */ note: string; /** Indonesian note. */ noteId: string };

export const PREVIEWS: Record<string, Pair> = {
  "skill-typography.md": {
    note: "Same content. Sizes from a golden-ratio scale, real leading, a 65ch measure, one accent.",
    noteId: "Isinya sama. Bedanya: ukuran dari skala golden ratio, leading yang lega, lebar baris 65ch, dan satu aksen saja.",
    before: (
      <Slop className="flex flex-col justify-center text-center">
        <div style={{ fontSize: 31, fontWeight: 700, lineHeight: 1 }}>WELCOME TO OUR AMAZING PLATFORM!!!</div>
        <div style={{ fontSize: 19, color: "#555", marginTop: 6, fontStyle: "italic" }}>The Best Solution For All Your Needs</div>
        <p style={{ fontSize: 13, lineHeight: 1.15, marginTop: 14, color: "#333" }}>
          Our platform helps teams of every size move faster with tools that are powerful, flexible and easy to use, built for the way modern companies work today and tomorrow and every day after that.
        </p>
        <div style={{ fontSize: 22, fontFamily: "Georgia", marginTop: 14 }}>Features</div>
        <div style={{ fontSize: 15, fontFamily: "Courier New", marginTop: 4 }}>Fast · Secure · Reliable</div>
      </Slop>
    ),
    after: (
      <Kit className="flex flex-col justify-center px-10">
        <div className="text-[12.58px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Platform</div>
        <div className="mt-2 text-[41.89px] font-extrabold leading-[1.1] tracking-[-0.02em]">
          Ship faster, <span className="font-serif font-normal italic text-primary">calmly</span>.
        </div>
        <p className="mt-3 max-w-[46ch] text-[16px] leading-[1.618] text-muted-foreground">Tools for teams of every size — powerful when you need them, quiet when you don’t.</p>
        <div className="mt-6 grid grid-cols-3 gap-6 border-t border-border pt-4">
          {[["Fast", "Deploys in seconds."], ["Secure", "Encrypted by default."], ["Reliable", "99.99% uptime."]].map(([h, d]) => (
            <div key={h}>
              <div className="text-[14.19px] font-semibold">{h}</div>
              <div className="mt-0.5 text-[12.58px] leading-[1.5] text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </Kit>
    ),
  },
  "skill-ui.ux.md": {
    note: "No purple gradient, no emoji headings, no three identical cards — a design direction read from the brief.",
    noteId: "Tak ada gradien ungu, judul penuh emoji, atau tiga kartu kembar — arah desainnya lahir dari brief.",
    before: (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 p-6 text-center text-white" style={{ fontFamily: "Arial" }}>
        <div className="text-[30px] font-bold">🚀 Supercharge Your Workflow ✨</div>
        <div className="mt-2 text-[14px] opacity-90">AI-powered. Next-gen. Revolutionary.</div>
        <div className="mt-4 rounded-full bg-white/20 px-5 py-2 text-[14px] font-semibold backdrop-blur">Get Started Now →</div>
        <div className="mt-5 grid w-full grid-cols-3 gap-3">
          {["⚡ Fast", "🔒 Secure", "🎯 Smart"].map((t) => (
            <div key={t} className="rounded-2xl bg-white/15 p-3 text-[13px]">{t}<div className="mt-1 text-[10px] opacity-80">Lorem ipsum dolor sit amet.</div></div>
          ))}
        </div>
      </div>
    ),
    after: (
      <Kit className="grid grid-cols-[1.1fr_1fr] items-center gap-6 px-8">
        <div>
          <div className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em]">Review contracts in minutes.</div>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">Flags risky clauses, explains them in plain words, keeps a trail.</p>
          <div className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground">Try a contract</div>
        </div>
        <div className="rounded-xl border border-border p-3 text-[12px]">
          <div className="font-semibold">Clause 7.2 — Liability</div>
          <div className="mt-1 rounded-md bg-primary/10 px-2 py-1 text-primary">Uncapped liability for the supplier</div>
          <div className="mt-2 text-muted-foreground">Suggested: cap at 12 months of fees.</div>
        </div>
      </Kit>
    ),
  },
  "skill-landing.page.md": {
    note: "A strict hero: badge, one headline, one action, proof — instead of everything at once.",
    noteId: "Hero yang tahu diri: satu badge, satu headline, satu ajakan, satu bukti — bukan semua dijejalkan.",
    before: (
      <Slop className="text-center">
        <div className="text-[11px]">HOME | ABOUT | PRICING | BLOG | CONTACT | LOGIN | SIGN UP</div>
        <div className="mt-3 text-[26px] font-bold">The #1 All-In-One Platform For Everything You Need</div>
        <div className="mt-2 flex justify-center gap-2 text-[12px]">
          {["Start Free Trial", "Book a Demo", "Watch Video", "Learn More"].map((b) => (
            <span key={b} className="rounded bg-blue-600 px-2 py-1 text-white">{b}</span>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-gray-500">★★★★★ Rated 4.9 by 10,000+ users · Free forever · No credit card · Cancel anytime · GDPR</div>
        <div className="mt-3 h-24 rounded bg-gray-200 text-[12px] leading-[96px] text-gray-500">[ screenshot ]</div>
      </Slop>
    ),
    after: (
      <Kit className="flex flex-col items-center justify-center text-center">
        <span className="rounded-full border border-border px-3 py-1 text-[12px] text-muted-foreground"><span className="mr-1.5 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">New</span>Shared inboxes</span>
        <div className="mt-4 text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em]">Every customer email,<br />answered once.</div>
        <div className="mt-4 rounded-full bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground">Start free</div>
        <div className="mt-5 flex gap-6 text-[13px] font-bold text-muted-foreground/70"><span>Acme</span><span>Globex</span><span>Initech</span><span>Umbrella</span></div>
      </Kit>
    ),
  },
  "skill-dashboard.md": {
    note: "Honest tables: aligned numbers, real status, filters, and an empty state that says what to do.",
    noteId: "Tabel yang jujur: angka rata kanan, status yang jelas, filter, dan empty state yang memberi tahu langkah berikutnya.",
    before: (
      <Slop>
        <div className="text-[18px] font-bold">Orders Dashboard</div>
        <table className="mt-3 w-full text-[12px]">
          <tbody>
            {[["#1021", "1250000", "true"], ["#1022", "98000", "null"], ["#1023", "3400000.5", "PENDING"], ["#1024", "NaN", "true"]].map((r) => (
              <tr key={r[0]} className="border-b">{r.map((c, i) => <td key={i} className="py-1.5">{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 text-[11px] text-gray-500">Showing all 48,213 rows</div>
      </Slop>
    ),
    after: (
      <Kit>
        <div className="flex items-center justify-between">
          <div className="text-[18px] font-extrabold tracking-tight">Orders</div>
          <div className="flex gap-1 text-[11px]">{["All", "Paid", "Pending"].map((t, i) => <span key={t} className={cn("rounded-full px-2.5 py-1", i === 2 ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{t}</span>)}</div>
        </div>
        <table className="mt-3 w-full text-[12.5px]">
          <thead><tr className="border-b border-border text-left text-[11px] text-muted-foreground"><th className="py-1.5 font-medium">Order</th><th className="font-medium">Status</th><th className="text-right font-medium">Total</th></tr></thead>
          <tbody className="tabular-nums">
            {[["#1021", "Paid", "Rp 1.250.000"], ["#1023", "Pending", "Rp 3.400.000"], ["#1024", "Failed", "—"]].map((r) => (
              <tr key={r[0]} className="border-b border-border/60"><td className="py-2 font-medium">{r[0]}</td><td><span className={cn("rounded-full px-2 py-0.5 text-[11px]", r[1] === "Paid" ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground")}>{r[1]}</span></td><td className="text-right">{r[2]}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 text-[11.5px] text-muted-foreground">Page 1 of 1,205 · 40 per page</div>
      </Kit>
    ),
  },
  "skill-export.report.md": {
    note: "An export you could send to the boss: title, period, filters, totals, aligned figures.",
    noteId: "Ekspor yang pantas dikirim ke atasan: ada judul, periode, filter, total, dan angka yang rapi.",
    before: (
      <Slop className="font-mono">
        <div className="text-[11px]">export_final_v3 (2).csv</div>
        <div className="mt-2 text-[11px] leading-[1.5]">id,name,amt,dt,flag<br />1,Budi,1250000,2026-11-01T00:00:00.000Z,1<br />2,ANI ,98000.0000001,11/2/2026,true<br />3,null,3400000,undefined,0<br />4,Rina,,2026-11-04,</div>
      </Slop>
    ),
    after: (
      <Kit>
        <div className="text-[11px] text-muted-foreground">Sales report · 1–30 Nov 2026 · Branch: Medan</div>
        <div className="mt-1 text-[18px] font-extrabold tracking-tight">Sales by employee</div>
        <table className="mt-3 w-full text-[12.5px] tabular-nums">
          <thead><tr className="bg-muted text-left text-[11px] text-muted-foreground"><th className="px-2 py-1.5 font-medium">Name</th><th className="px-2 text-right font-medium">Orders</th><th className="px-2 text-right font-medium">Total</th></tr></thead>
          <tbody>{[["Budi Santoso", "41", "Rp 12.500.000"], ["Ani Wijaya", "18", "Rp 980.000"], ["Rina Hartono", "33", "Rp 3.400.000"]].map((r) => <tr key={r[0]} className="border-b border-border/60"><td className="px-2 py-1.5">{r[0]}</td><td className="px-2 text-right">{r[1]}</td><td className="px-2 text-right">{r[2]}</td></tr>)}</tbody>
          <tfoot><tr className="font-bold"><td className="px-2 py-1.5">Total</td><td className="px-2 text-right">92</td><td className="px-2 text-right">Rp 16.880.000</td></tr></tfoot>
        </table>
      </Kit>
    ),
  },
  "skill-backend.api.md": {
    note: "Failures you can see: the right status, a stable code, a message a person can act on.",
    noteId: "Error yang terus terang: status yang tepat, kode yang konsisten, pesan yang jelas maksudnya.",
    before: (
      <Slop className="bg-neutral-50">
        <div className="text-[12px] font-bold">POST /api/leave → 200 OK</div>
        <Code dark={false}>{`{
  "success": false,
  "data": null,
  "msg": "error"
}`}</Code>
        <div className="mt-2 text-[11px] text-gray-500">{"// TODO validate input"}</div>
      </Slop>
    ),
    after: (
      <Kit>
        <div className="flex items-center gap-2 text-[12px] font-semibold"><span className="rounded bg-primary/12 px-1.5 py-0.5 font-mono text-primary">422</span> POST /api/leave</div>
        <Code>{`{
  "error": {
    "code": "LEAVE_BALANCE_EXCEEDED",
    "message": "Only 9 days left this year.",
    "details": { "requested": 12, "remaining": 9 },
    "requestId": "req_7f3a2c"
  }
}`}</Code>
      </Kit>
    ),
  },
  "skill-database.md": {
    note: "Queries that survive growth: an index for the filter, no N+1, a plan you checked.",
    noteId: "Query yang tetap kencang saat data membengkak: indeks untuk filter, tanpa N+1, query plan sudah dicek.",
    before: (
      <Slop className="bg-neutral-50">
        <Code dark={false}>{`users = SELECT * FROM users
for u in users:            -- 48,213 users
  SELECT * FROM orders
   WHERE user_id = u.id    -- one query each

⏱ 38.4 s`}</Code>
      </Slop>
    ),
    after: (
      <Kit>
        <Code>{`CREATE INDEX orders_user_created
  ON orders (user_id, created_at DESC);

SELECT u.id, u.name, count(o.id) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.branch_id = $1
GROUP BY u.id
LIMIT 50;   -- Index Scan · 41 ms`}</Code>
      </Kit>
    ),
  },
  "skill-security.md": {
    note: "Safe on the server: parameters, permission per record, secrets out of the code.",
    noteId: "Aman dari sisi server: query berparameter, izin dicek per record, secret tidak ditaruh di kode.",
    before: (
      <Slop className="bg-neutral-50">
        <Code dark={false}>{`const KEY = "sk_live_9f3c...e21"

app.get("/api/payslip", (req) => {
  return db.query(
    "SELECT * FROM payslips WHERE nik=" + req.query.nik
  )
})`}</Code>
      </Slop>
    ),
    after: (
      <Kit>
        <Code>{`const key = process.env.PAYROLL_KEY

app.get("/api/payslip", requireSession, async (req) => {
  const nik = req.session.nik          // never from the URL
  return db.query(
    "SELECT period, net FROM payslips WHERE nik = $1",
    [nik]
  )
})`}</Code>
      </Kit>
    ),
  },
  "skill-performance.md": {
    note: "Measured first, then fixed: parallel requests and one cached lookup instead of a waterfall.",
    noteId: "Ukur dulu, baru perbaiki: request jalan paralel dan lookup di-cache, bukan antre satu per satu.",
    before: (
      <Slop>
        <div className="text-[13px] font-bold">Network · page load 4.2 s</div>
        {[[0, 30, "session"], [30, 55, "profile"], [55, 80, "leave"], [80, 100, "payslip"]].map(([a, b, n]) => (
          <div key={n} className="mt-2 flex items-center gap-2 text-[11px]"><span className="w-14">{n}</span><div className="relative h-3 flex-1 bg-gray-100"><div className="absolute h-3 bg-orange-400" style={{ left: `${a}%`, width: `${Number(b) - Number(a)}%` }} /></div></div>
        ))}
      </Slop>
    ),
    after: (
      <Kit>
        <div className="text-[13px] font-bold">Network · page load <span className="text-primary">0.6 s</span></div>
        {[[0, 14, "session"], [14, 40, "profile"], [14, 46, "leave"], [14, 38, "payslip"]].map(([a, b, n]) => (
          <div key={n} className="mt-2 flex items-center gap-2 text-[11px]"><span className="w-14 text-muted-foreground">{n}</span><div className="relative h-3 flex-1 rounded bg-muted"><div className="absolute h-3 rounded bg-primary" style={{ left: `${a}%`, width: `${Number(b) - Number(a)}%` }} /></div></div>
        ))}
        <div className="mt-4 text-[11.5px] text-muted-foreground">Promise.all · session cached 10 min · p95 measured on real data</div>
      </Kit>
    ),
  },
  "skill-testing.md": {
    note: "Proof instead of feelings: the cases that break in production, checked before “done”.",
    noteId: "Bukti, bukan firasat: kasus yang biasa bikin production jebol sudah dites sebelum bilang “selesai”.",
    before: (
      <Slop>
        <div className="text-[14px]">✅ Done! The feature works.</div>
        <div className="mt-2 text-[12px] text-gray-500">(tested on my machine with my account)</div>
      </Slop>
    ),
    after: (
      <Kit className="text-[12.5px]">
        <div className="mb-2 text-[13px] font-bold">leave-request.test.ts — 8 passed</div>
        {["submits a valid request", "rejects more days than the balance (422)", "rejects a date in the past", "blocks another employee’s request (403)", "is idempotent on double submit", "handles the 31 Dec → 2 Jan range", "works with an empty history", "keeps p95 < 300 ms at 10k rows"].map((t) => <div key={t} className="py-0.5"><Tick />{t}</div>)}
      </Kit>
    ),
  },
  "skill-debugging.md": {
    note: "The root, not the symptom: reproduce, narrow down, fix the cause, guard against it.",
    noteId: "Cari akarnya, bukan tambal gejalanya: reproduksi, persempit, perbaiki sumbernya, cegah terulang.",
    before: (
      <Slop className="bg-neutral-50">
        <Code dark={false}>{`try {
  const rows = await getReport(month)
  return rows
} catch (e) {
  return []   // fixed the crash 👍
}`}</Code>
      </Slop>
    ),
    after: (
      <Kit className="text-[12.5px] leading-relaxed">
        <div className="text-[13px] font-bold">Report empty for August — root cause</div>
        <div className="mt-2"><span className="font-semibold">Repro</span> <span className="text-muted-foreground">branch B, Aug 2026 → 0 rows (expected 312)</span></div>
        <div><span className="font-semibold">Cause</span> <span className="text-muted-foreground">month boundary built in UTC; WIB rows fall in July</span></div>
        <div><span className="font-semibold">Fix</span> <span className="text-muted-foreground">boundaries in Asia/Jakarta (lib/dates.ts)</span></div>
        <div><span className="font-semibold">Guard</span> <span className="text-muted-foreground">test for 31 Jul 23:30 WIB; 2 other callers fixed</span></div>
      </Kit>
    ),
  },
  "skill-git.workflow.md": {
    note: "History you can read and revert: small commits, real messages, nothing pushed unasked.",
    noteId: "Riwayat yang enak dibaca dan gampang di-revert: commit kecil, pesan jelas, tidak push sebelum diminta.",
    before: (
      <Slop className="font-mono text-[12.5px] leading-[1.9]">
        <div>a91f2c3 fix stuff</div>
        <div>7c3e0d1 wip</div>
        <div>e02b44a asdf</div>
        <div>9d1f7a8 final fix FINAL</div>
        <div className="text-gray-500">→ pushed to main (force)</div>
      </Slop>
    ),
    after: (
      <Kit className="font-mono text-[12.5px] leading-[1.9]">
        <div><span className="text-primary">f3a799c</span> feat(leave): show remaining balance before submit</div>
        <div><span className="text-primary">2c41e9b</span> fix(dates): build month bounds in Asia/Jakarta</div>
        <div><span className="text-primary">8a0d5f2</span> test(leave): cover the year-boundary range</div>
        <div><span className="text-primary">1b77c30</span> docs(api): document LEAVE_BALANCE_EXCEEDED</div>
        <div className="font-sans text-muted-foreground">→ waiting for review on development</div>
      </Kit>
    ),
  },
  "skill-documentation.md": {
    note: "Written for the person who doesn’t know yet: what it is, how to run it, what to check.",
    noteId: "Ditulis untuk orang yang baru datang: ini apa, cara menjalankannya, dan apa yang perlu dicek.",
    before: (
      <Slop>
        <div className="text-[18px] font-bold"># project</div>
        <div className="mt-2 text-[13px]">run it with npm. ask me if it doesnt work. env vars are in slack somewhere</div>
      </Slop>
    ),
    after: (
      <Kit className="text-[12.5px]">
        <div className="text-[18px] font-extrabold tracking-tight">Branch Reporting Portal</div>
        <div className="mt-1 text-muted-foreground">Monthly sales and stock reports for branch managers.</div>
        <div className="mt-3 font-semibold">Run it locally (≈ 5 min)</div>
        <Code>{`cp .env.example .env.local   # fill DB_URL, AUTH_SECRET
npm install && npm run dev    # → http://localhost:3000`}</Code>
        <div className="mt-2 text-muted-foreground">Check: log in as demo@branch.test and open /reports.</div>
      </Kit>
    ),
  },
  "skill-analysis.md": {
    note: "No half-baked work: the flow understood, the blast radius mapped, an honest report.",
    noteId: "Tak ada kerja setengah matang: alurnya dipahami, dampaknya dipetakan, laporannya jujur.",
    before: (
      <Slop>
        <div className="text-[15px]">Done ✅ I updated the leave form.</div>
      </Slop>
    ),
    after: (
      <Kit className="text-[12.5px] leading-relaxed">
        <div className="text-[13px] font-bold">Leave form — what changed and what I checked</div>
        <div className="mt-2"><Tick />Balance now read from the server (was cached 24 h)</div>
        <div><Tick />Also affects: approval inbox, monthly report — both re-tested</div>
        <div><Tick />Typecheck, lint, 8 tests, checked as employee and as manager</div>
        <div><Tick ok={false} />Not checked: mobile Safari — needs a device</div>
        <div className="mt-2 text-muted-foreground">Committed in 3 parts · not pushed</div>
      </Kit>
    ),
  },
  "skill-motion.video.md": {
    note: "A real recording with a virtual camera and timed narration — not screenshots with red boxes.",
    noteId: "Rekaman layar asli dengan kamera virtual dan narasi yang pas momennya — bukan tangkapan layar penuh kotak merah.",
    before: (
      <div className="relative h-full w-full bg-neutral-200 p-4" style={{ fontFamily: "Arial" }}>
        <div className="h-full w-full bg-white p-3 text-[12px] text-neutral-500">[ screenshot 1 of 14 ]<div className="mt-16 ml-24 h-10 w-40 border-[3px] border-red-600" /><div className="mt-2 ml-24 text-[14px] font-bold text-red-600">← CLICK HERE!!</div></div>
      </div>
    ),
    after: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/showcase/p441z-keynote.jpg" alt="A frame from the p441z keynote video" className="h-full w-full object-cover" />
    ),
  },
  "skill-darkmode.md": {
    note: "One attribute swaps a dozen tokens, the theme is set before the first paint, and the switch crossfades.",
    noteId: "Satu atribut menukar belasan token, tema terpasang sebelum halaman tergambar, dan pergantiannya crossfade.",
    before: (
      <Slop>
        <div className="text-[13px] font-bold">Reload on dark</div>
        <div className="mt-2 flex gap-2">
          {[["0 ms", "#ffffff", "#000"], ["120 ms", "#ffffff", "#000"], ["300 ms", "#111111", "#fff"]].map(([ms, bg, fg]) => (
            <div key={ms} className="flex-1">
              <div className="grid h-20 place-items-center rounded border border-gray-300 text-[11px] font-bold" style={{ background: bg, color: fg }}>{ms === "120 ms" ? "FLASH!" : "page"}</div>
              <div className="mt-1 text-center text-[10px] text-gray-500">{ms}</div>
            </div>
          ))}
        </div>
        <Code dark={false}>{`<div className="bg-white dark:bg-gray-900
  text-black dark:text-white border
  dark:border-gray-700 …">  // × 2,400`}</Code>
      </Slop>
    ),
    after: (
      <Kit>
        <div className="text-[13px] font-bold">Reload on dark</div>
        <div className="mt-2 flex gap-2">
          {[["0 ms", "page"], ["120 ms", "page"], ["300 ms", "page"]].map(([ms]) => (
            <div key={ms} className="flex-1">
              <div className="grid h-20 place-items-center rounded-lg border border-white/10 bg-neutral-950 text-[11px] font-semibold text-neutral-200">page</div>
              <div className="mt-1 text-center text-[10px] text-muted-foreground">{ms}</div>
            </div>
          ))}
        </div>
        <Code>{`[data-theme="dark"] {
  --surface: #12191a; --ink: #e6efe9; …
}  // one attribute, a dozen tokens`}</Code>
        <div className="mt-2 flex items-center gap-2 text-[11.5px] text-muted-foreground">
          <Tick /> pre-paint script · <Tick /> 350 ms crossfade
        </div>
      </Kit>
    ),
  },
};
