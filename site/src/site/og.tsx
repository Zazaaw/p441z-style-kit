import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { kitComponents } from "@/site/kit-stats";
import { loadSkills } from "@/site/skills-data";
import type { Lang } from "@/site/i18n";

// The social preview (Open Graph / X card) for "/" and "/id": the hero line, live counts, and a
// small stack of skill files — drawn with next/og at build time. Fonts are static TTFs (OFL) in
// site/assets/fonts, because the image renderer can't use the variable web fonts.

export const OG_SIZE = { width: 1200, height: 630 };

const COPY = {
  en: { size: 84, a: "Interfaces that", word: "move", b: "like a keynote.", sub: "Design system for React + Tailwind · skills for AI agents", comps: "components", skills: "skills", lines: "lines of guidance" },
  id: { size: 74, a: "Antarmuka yang", word: "hidup", b: "seperti keynote.", sub: "Design system React + Tailwind · skill untuk agen AI", comps: "komponen", skills: "skill", lines: "baris panduan" },
} as const;

const font = (f: string) => readFile(join(process.cwd(), "assets", "fonts", f));

export async function renderOg(lang: Lang) {
  const c = COPY[lang];
  const skills = loadSkills(lang);
  const lines = skills.reduce((a, s) => a + s.lines, 0);
  const comps = kitComponents().length;
  const num = (n: number) => n.toLocaleString(lang === "id" ? "id-ID" : "en-US");
  const files = ["skill-typography", "skill-darkmode", "skill-dashboard"];
  const [extraBold, medium, serif] = await Promise.all([font("PlusJakartaSans-ExtraBold.ttf"), font("PlusJakartaSans-Medium.ttf"), font("InstrumentSerif-Italic.ttf")]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0a0a0a", color: "#fafafa", fontFamily: "Jakarta" }}>
        {/* light */}
        <div style={{ position: "absolute", right: -160, bottom: -220, width: 760, height: 620, borderRadius: 9999, background: "radial-gradient(circle, rgba(10,132,255,0.5) 0%, rgba(10,132,255,0.18) 40%, rgba(10,132,255,0) 70%)" }} />
        <div style={{ position: "absolute", left: -200, top: -260, width: 640, height: 520, borderRadius: 9999, background: "radial-gradient(circle, rgba(10,132,255,0.2) 0%, rgba(10,132,255,0) 70%)" }} />
        {/* dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.10) 1.2px, transparent 1.4px)", backgroundSize: "26px 26px" }} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 500, color: "rgba(250,250,250,0.72)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "#0a84ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 26, fontWeight: 800 }}>p</div>
            p441z Style Kit
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: c.size, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.0, whiteSpace: "nowrap" }}>
            <span>{c.a}</span>
            <span style={{ fontFamily: "Serif", fontWeight: 400, fontSize: c.size + 12, color: "#4aa3ff", letterSpacing: "-0.01em", lineHeight: 1.05 }}>{c.word}</span>
            <span>{c.b}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 24, fontWeight: 500, color: "rgba(250,250,250,0.62)", whiteSpace: "nowrap" }}>{c.sub}</div>
            <div style={{ display: "flex", gap: 28, fontSize: 24, fontWeight: 500, color: "rgba(250,250,250,0.62)" }}>
              <span style={{ display: "flex", gap: 8 }}><b style={{ color: "#fff", fontWeight: 800 }}>{num(comps)}</b> {c.comps}</span>
              <span style={{ display: "flex", gap: 8 }}><b style={{ color: "#fff", fontWeight: 800 }}>{num(skills.length)}</b> {c.skills}</span>
              <span style={{ display: "flex", gap: 8 }}><b style={{ color: "#fff", fontWeight: 800 }}>{num(lines)}</b> {c.lines}</span>
            </div>
          </div>
        </div>

        {/* a stack of skill files */}
        <div style={{ position: "absolute", right: 70, top: 130, width: 360, height: 360, display: "flex" }}>
          {files.map((f, i) => (
            <div
              key={f}
              style={{
                position: "absolute",
                left: i * 18,
                top: i * 48,
                width: 320,
                height: 210,
                borderRadius: 22,
                display: "flex",
                flexDirection: "column",
                padding: "20px 22px",
                background: i === 2 ? "rgba(255,255,255,0.96)" : `rgba(255,255,255,${0.1 + i * 0.12})`,
                border: "1px solid rgba(255,255,255,0.28)",
                boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
                transform: `rotate(${(i - 1) * 4}deg)`,
                color: i === 2 ? "#0a0a0a" : "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800 }}>
                <span>{f}.md</span>
                <span style={{ fontSize: 15, fontWeight: 500, opacity: 0.55 }}>SKILL</span>
              </div>
              {[86, 92, 64, 88, 42].map((w, k) => (
                <div key={k} style={{ marginTop: k === 0 ? 22 : 10, height: k === 0 ? 10 : 6, width: `${w}%`, borderRadius: 4, background: i === 2 ? (k === 0 ? "#0a84ff" : "rgba(10,10,10,0.12)") : "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Jakarta", data: extraBold, weight: 800, style: "normal" },
        { name: "Jakarta", data: medium, weight: 500, style: "normal" },
        { name: "Serif", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}
