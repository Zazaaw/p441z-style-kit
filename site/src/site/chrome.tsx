"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { EASE } from "@/lib/motion";

import MenuBar from "@/components/mac/menu-bar";
import Spotlight, { useSpotlightHotkey, type SpotlightItem } from "@/components/mac/spotlight";
import Dock from "@/components/mac/dock";
import { useNotify } from "@/components/mac/notification";
import { ThemeToggle, useThemeSwitch } from "@/site/theme";
import { ACCENTS, AccentMenu, setAccent } from "@/site/accent";
import { LangSwitch, homeFor, useLang, useT } from "@/site/i18n";
import { IconBell, IconBook, IconCopy, IconGitHub, IconHome, IconMoon, IconPlay, IconSearch, IconSpark, IconWindow } from "@/site/icons";

export const REPO = "https://github.com/Zazaaw/p441z-style-kit";
export const REGISTRY = "https://style.p441z.my.id/r";
/** One command installs every component, its npm dependencies, and the theme (shadcn registry). */
export const INSTALL = `npx shadcn@latest add ${REGISTRY}/style-kit.json`;
/** Registry item for a kit file path like "motion/mask-reveal.tsx" (the desktop window is "mac-window"). */
export const installFor = (file: string) => `npx shadcn@latest add ${REGISTRY}/${file === "mac/window.tsx" ? "mac-window" : file.replace(/^.*\//, "").replace(/\.tsx?$/, "")}.json`;

// Smooth jump that also works with Lenis (it intercepts anchors; programmatic jumps go through scrollIntoView).
const go = (hash: string) => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });

/** Menu bar + ⌘K Spotlight + Dock: the desktop "chrome" around every section. */
export default function Chrome({ skills }: { skills: { name: string; title: string; file: string }[] }) {
  const [open, setOpen] = useState(false);
  const { dark: isDark, toggle: toggleTheme } = useThemeSwitch();
  const notify = useNotify();
  const t = useT();
  const lang = useLang();
  useSpotlightHotkey(() => setOpen((o) => !o));
  // Auto-hide the dock while a section that has its own stage (keynote, desktop) fills the screen.
  const [hideDock, setHideDock] = useState(false);
  useEffect(() => {
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (es) => {
        // Tall sections (the keynote is 420vh) never reach a high ratio — measure screen coverage instead.
        es.forEach((e) => seen.set(e.target, e.intersectionRect.height > window.innerHeight * 0.6));
        setHideDock([...seen.values()].some(Boolean));
      },
      { threshold: Array.from({ length: 41 }, (_, i) => i / 40) },
    );
    document.querySelectorAll("#keynote, #motion, #desk, #showcase").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  // Other sections open search with: window.dispatchEvent(new Event("p441z:spotlight"))
  useEffect(() => {
    const o = () => setOpen(true);
    window.addEventListener("p441z:spotlight", o);
    return () => window.removeEventListener("p441z:spotlight", o);
  }, []);

  const S = t("Sections", "Bagian");
  const A = t("Actions", "Aksi");
  const items: SpotlightItem[] = [
    { group: S, label: "Keynote", hint: "#keynote", icon: <IconPlay />, onSelect: () => go("#keynote") },
    { group: S, label: t("Inside the kit", "Di dalam kit"), hint: "#kit", icon: <IconWindow />, onSelect: () => go("#kit") },
    { group: S, label: t("Typography — the golden ratio", "Tipografi — golden ratio"), hint: "#type", icon: <IconBook />, keywords: "type font scale leading tipografi huruf", onSelect: () => go("#type") },
    { group: S, label: t("Made with the skills", "Karya nyata"), hint: "#showcase", icon: <IconPlay />, onSelect: () => go("#showcase") },
    { group: S, label: t("Motion components", "Komponen motion"), hint: "#motion", icon: <IconSpark />, onSelect: () => go("#motion") },
    { group: S, label: t("Desktop UI", "UI desktop"), hint: "#desk", icon: <IconWindow />, onSelect: () => go("#desk") },
    { group: S, label: "Skills", hint: "#skills", icon: <IconBook />, onSelect: () => go("#skills") },
    { group: S, label: t("Component docs", "Dokumentasi komponen"), hint: "/components", icon: <IconWindow />, keywords: "docs registry install api props", onSelect: () => (window.location.href = lang === "id" ? "/id/components" : "/components") },
    {
      group: A,
      label: t("Copy install command", "Salin perintah install"),
      icon: <IconCopy />,
      keywords: "npm install shadcn registry salin",
      onSelect: () => navigator.clipboard?.writeText(INSTALL).then(() => notify({ title: t("Copied", "Tersalin"), body: t("Install command is on your clipboard.", "Perintah install siap ditempel."), icon: <IconCopy /> })),
    },
    {
      group: A,
      label: isDark ? t("Switch to light mode", "Ganti ke mode terang") : t("Switch to dark mode", "Ganti ke mode gelap"),
      icon: <IconMoon />,
      keywords: "theme dark light tema gelap terang",
      onSelect: toggleTheme,
    },
    {
      group: A,
      label: lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia",
      icon: <IconHome />,
      keywords: "language bahasa english indonesia",
      onSelect: () => (window.location.href = homeFor(lang === "id" ? "en" : "id") + window.location.hash),
    },
    ...ACCENTS.map((a) => ({
      group: t("Accent", "Aksen"),
      label: `${t("Accent", "Aksen")}: ${t(a.label, a.labelId)}`,
      keywords: "color colour theme primary warna",
      icon: <span className="size-3.5 rounded-full ring-1 ring-black/15" style={{ background: `hsl(${a.hsl})` }} />,
      onSelect: () => setAccent(a.key),
    })),
    {
      group: A,
      label: t("Send a test notification", "Coba kirim notifikasi"),
      icon: <IconBell />,
      onSelect: () => notify({ title: t("Hello from p441z", "Halo dari p441z"), body: t("This banner is <Notification>, part of the kit.", "Banner ini komponen <Notification> dari kit."), icon: <IconBell /> }),
    },
    { group: A, label: t("Faiz's portfolio", "Portofolio Faiz"), icon: <IconHome />, hint: "p441z.my.id", keywords: "portfolio author faiz", onSelect: () => window.open("https://p441z.my.id", "_blank", "noopener") },
    { group: A, label: "Satu Visual", icon: <IconWindow />, hint: "satuvisual.p441z.my.id", keywords: "studio photo video creative", onSelect: () => window.open("https://satuvisual.p441z.my.id", "_blank", "noopener") },
    { group: A, label: t("Open on GitHub", "Buka di GitHub"), icon: <IconGitHub />, hint: "github.com", onSelect: () => window.open(REPO, "_blank", "noopener") },
    ...skills.map((s) => ({ group: "Skills", label: s.title, hint: s.name, keywords: s.file, icon: <IconBook />, onSelect: () => window.open(`${REPO}/blob/main/Skill.md/${s.file}`, "_blank", "noopener") })),
  ];

  return (
    <>
      <MenuBar
        className="fixed inset-x-0 top-0"
        brand={
          <a href="https://p441z.my.id" target="_blank" rel="noreferrer" title={t("Faiz's portfolio — p441z.my.id", "Portofolio Faiz — p441z.my.id")} className="font-display tracking-tight transition-opacity hover:opacity-70">
            p441z
          </a>
        }
        items={[
          { label: "Keynote", href: "#keynote" },
          { label: t("Components", "Komponen"), href: lang === "id" ? "/id/components" : "/components" },
          { label: t("Type", "Tipografi"), href: "#type" },
          { label: "Motion", href: "#motion" },
          { label: "Desktop", href: "#desk" },
          { label: t("Showcase", "Karya"), href: "#showcase" },
          { label: "Skills", href: "#skills" },
        ]}
        right={
          <>
            <button type="button" onClick={() => setOpen(true)} className="hidden items-center gap-1.5 rounded px-1.5 py-0.5 transition-colors duration-150 hover:bg-foreground/10 sm:flex" aria-label={t("Open search", "Buka pencarian")}>
              <span className="size-3.5 [&_svg]:size-3.5">
                <IconSearch />
              </span>
              <kbd className="font-sans text-[12px]">⌘K</kbd>
            </button>
            <LangSwitch />
            <AccentMenu />
            <ThemeToggle />
          </>
        }
      />
      <Spotlight open={open} onOpenChange={setOpen} items={items} placeholder={t("Search sections, skills, actions…", "Cari bagian, skill, aksi…")} />
      <motion.div
        className="fixed bottom-4 left-1/2 z-50 hidden md:block"
        style={{ x: "-50%" }}
        initial={false}
        animate={hideDock ? { y: 110, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE.reveal }}
      >
      <Dock
        items={[
          { label: t("Top", "Ke atas"), icon: <IconHome />, href: "#top" },
          { label: "Keynote", icon: <IconPlay />, href: "#keynote" },
          { label: "Motion", icon: <IconSpark />, href: "#motion" },
          { label: t("Desktop UI", "UI desktop"), icon: <IconWindow />, href: "#desk" },
          { label: "Skills", icon: <IconBook />, href: "#skills" },
          { label: t("Search  ⌘K", "Cari  ⌘K"), icon: <IconSearch />, onClick: () => setOpen(true), divider: true },
          { label: "GitHub", icon: <IconGitHub />, href: REPO },
        ]}
      />
      </motion.div>
    </>
  );
}
