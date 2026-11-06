"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { MacWindow } from "@/components/mac/window";

/**
 * Terminal — a desktop terminal window whose commands type themselves when it scrolls into view;
 * each command's output fades in after it "runs". A copy button copies every command at once.
 *
 * Ideal for install steps on a landing page: the reader sees the exact commands, and the motion
 * shows the order. Reduced motion: everything is printed immediately.
 *
 * USAGE
 *   <Terminal title="zsh — my-app" lines={[
 *     { cmd: "npx create-next-app@latest my-app" },
 *     { out: "✓ Created my-app" },
 *     { cmd: "npm i framer-motion clsx tailwind-merge" },
 *     { out: "added 10 packages in 2s", dim: true },
 *   ]} />
 */

export type TermLine = { cmd: string } | { out: string; dim?: boolean };

interface TerminalProps {
  lines: TermLine[];
  title?: string;
  /** Prompt shown before each command. */
  prompt?: string;
  /** Characters per second while typing. */
  speed?: number;
  className?: string;
  /** Dark terminal regardless of the page theme (default) — reads as a terminal instantly. */
  alwaysDark?: boolean;
}

export default function Terminal({ lines, title = "zsh", prompt = "~ %", speed = 38, className, alwaysDark = true }: TerminalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [line, setLine] = useState(reduce ? lines.length : 0);
  const [chars, setChars] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!seen || reduce || line >= lines.length) return;
    const l = lines[line];
    if ("out" in l) {
      const t = setTimeout(() => setLine((x) => x + 1), 260);
      return () => clearTimeout(t);
    }
    if (chars < l.cmd.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 1000 / speed + (Math.random() * 30 - 10));
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLine((x) => x + 1);
      setChars(0);
    }, 420);
    return () => clearTimeout(t);
  }, [seen, reduce, line, chars, lines, speed]);

  const copy = async () => {
    const all = lines.flatMap((l) => ("cmd" in l ? [l.cmd] : [])).join("\n");
    try {
      await navigator.clipboard.writeText(all);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };

  return (
    <div ref={ref} className={cn(alwaysDark && "dark", className)}>
      <MacWindow
        title={title}
        className="bg-neutral-950 text-neutral-100"
        toolbar={
          <button type="button" onClick={copy} className="rounded-md px-2 py-0.5 text-[11px] font-medium text-neutral-400 transition-colors duration-200 hover:bg-white/10 hover:text-neutral-100">
            {copied ? "Copied ✓" : "Copy"}
          </button>
        }
        bodyClassName="px-4 py-3.5 font-mono text-[13px] leading-6"
      >
        {lines.slice(0, line + 1).map((l, i) => {
          if ("out" in l) {
            return i < line ? (
              <motion.div key={i} initial={reduce ? false : { opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={cn("whitespace-pre-wrap", l.dim ? "text-neutral-500" : "text-neutral-300")}>
                {l.out}
              </motion.div>
            ) : null;
          }
          const typing = i === line;
          return (
            <div key={i} className="whitespace-pre-wrap break-all">
              <span className="text-neutral-500">{prompt} </span>
              <span>{typing ? l.cmd.slice(0, chars) : l.cmd}</span>
              {typing && <span className="ml-px inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-neutral-300" aria-hidden />}
            </div>
          );
        })}
        {line >= lines.length && (
          <div>
            <span className="text-neutral-500">{prompt} </span>
            <span className="ml-px inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-neutral-300" aria-hidden />
          </div>
        )}
      </MacWindow>
    </div>
  );
}
