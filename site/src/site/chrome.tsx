"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

import { EASE } from "@/lib/motion";

import MenuBar from "@/components/mac/menu-bar";
import Spotlight, { useSpotlightHotkey, type SpotlightItem } from "@/components/mac/spotlight";
import Dock from "@/components/mac/dock";
import { useNotify } from "@/components/mac/notification";
import { ThemeToggle } from "@/site/theme";
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
  const { resolvedTheme, setTheme } = useTheme();
  const notify = useNotify();
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

  const items: SpotlightItem[] = [
    { group: "Sections", label: "Keynote", hint: "#keynote", icon: <IconPlay />, onSelect: () => go("#keynote") },
    { group: "Sections", label: "Inside the kit", hint: "#kit", icon: <IconWindow />, onSelect: () => go("#kit") },
    { group: "Sections", label: "Typography — the golden ratio", hint: "#type", icon: <IconBook />, keywords: "type font scale leading", onSelect: () => go("#type") },
    { group: "Sections", label: "Made with the skills", hint: "#showcase", icon: <IconPlay />, onSelect: () => go("#showcase") },
    { group: "Sections", label: "Motion components", hint: "#motion", icon: <IconSpark />, onSelect: () => go("#motion") },
    { group: "Sections", label: "Desktop UI", hint: "#desk", icon: <IconWindow />, onSelect: () => go("#desk") },
    { group: "Sections", label: "Skills", hint: "#skills", icon: <IconBook />, onSelect: () => go("#skills") },
    {
      group: "Actions",
      label: "Copy install command",
      icon: <IconCopy />,
      keywords: "npm install shadcn registry",
      onSelect: () => navigator.clipboard?.writeText(INSTALL).then(() => notify({ title: "Copied", body: "Install command is on your clipboard.", icon: <IconCopy /> })),
    },
    { group: "Actions", label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`, icon: <IconMoon />, keywords: "theme dark light", onSelect: () => setTheme(resolvedTheme === "dark" ? "light" : "dark") },
    { group: "Actions", label: "Send a test notification", icon: <IconBell />, onSelect: () => notify({ title: "Hello from p441z", body: "This banner is <Notification>, part of the kit.", icon: <IconBell /> }) },
    { group: "Actions", label: "Open on GitHub", icon: <IconGitHub />, hint: "github.com", onSelect: () => window.open(REPO, "_blank", "noopener") },
    ...skills.map((s) => ({ group: "Skills", label: s.title, hint: s.name, keywords: s.file, icon: <IconBook />, onSelect: () => window.open(`${REPO}/blob/main/Skill.md/${s.file}`, "_blank", "noopener") })),
  ];

  return (
    <>
      <MenuBar
        className="fixed inset-x-0 top-0"
        brand={<span className="font-display tracking-tight">p441z</span>}
        items={[
          { label: "Keynote", href: "#keynote" },
          { label: "Type", href: "#type" },
          { label: "Motion", href: "#motion" },
          { label: "Desktop", href: "#desk" },
          { label: "Showcase", href: "#showcase" },
          { label: "Skills", href: "#skills" },
        ]}
        right={
          <>
            <button type="button" onClick={() => setOpen(true)} className="hidden items-center gap-1.5 rounded px-1.5 py-0.5 transition-colors duration-150 hover:bg-foreground/10 sm:flex" aria-label="Open search">
              <span className="size-3.5 [&_svg]:size-3.5">
                <IconSearch />
              </span>
              <kbd className="font-sans text-[12px]">⌘K</kbd>
            </button>
            <ThemeToggle />
          </>
        }
      />
      <Spotlight open={open} onOpenChange={setOpen} items={items} placeholder="Search sections, skills, actions…" />
      <motion.div
        className="fixed bottom-4 left-1/2 z-50 hidden md:block"
        style={{ x: "-50%" }}
        initial={false}
        animate={hideDock ? { y: 110, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE.reveal }}
      >
      <Dock
        items={[
          { label: "Top", icon: <IconHome />, href: "#top" },
          { label: "Keynote", icon: <IconPlay />, href: "#keynote" },
          { label: "Motion", icon: <IconSpark />, href: "#motion" },
          { label: "Desktop UI", icon: <IconWindow />, href: "#desk" },
          { label: "Skills", icon: <IconBook />, href: "#skills" },
          { label: "Search  ⌘K", icon: <IconSearch />, onClick: () => setOpen(true), divider: true },
          { label: "GitHub", icon: <IconGitHub />, href: REPO },
        ]}
      />
      </motion.div>
    </>
  );
}
