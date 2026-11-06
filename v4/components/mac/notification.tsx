"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * Notifications — desktop-style banners that slide in at the top-right, stack, and leave on their
 * own after a few seconds (hovering pauses nothing on purpose — keep messages short).
 *
 * Wrap the app once in <NotificationProvider>, then call `notify()` from anywhere.
 * Announced politely to screen readers (`aria-live`).
 *
 * USAGE
 *   // layout.tsx
 *   <NotificationProvider>{children}</NotificationProvider>
 *
 *   // any client component
 *   const notify = useNotify();
 *   notify({ title: "Request approved", body: "Leave · 3 days · signed", icon: <CheckIcon /> });
 */

export type Note = { title: string; body?: string; icon?: React.ReactNode; app?: string; duration?: number };
type Live = Note & { id: number; at: Date };

const Ctx = React.createContext<((n: Note) => void) | null>(null);

export function useNotify() {
  const n = React.useContext(Ctx);
  if (!n) throw new Error("useNotify must be used inside <NotificationProvider>");
  return n;
}

export function NotificationProvider({ children, max = 3 }: { children: React.ReactNode; max?: number }) {
  const [list, setList] = React.useState<Live[]>([]);
  const seq = React.useRef(0);

  const notify = React.useCallback(
    (n: Note) => {
      const id = ++seq.current;
      setList((l) => [{ ...n, id, at: new Date() }, ...l].slice(0, max));
      setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), (n.duration ?? 5) * 1000);
    },
    [max],
  );

  return (
    <Ctx.Provider value={notify}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 top-12 z-[90] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        <AnimatePresence initial={false}>
          {list.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ x: 380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 380, opacity: 0, transition: { duration: 0.35, ease: EASE.toggle } }}
              transition={{ duration: 0.5, ease: EASE.reveal }}
              className={cn("pointer-events-auto flex gap-3 rounded-2xl border border-black/10 bg-background/70 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10")}
              onClick={() => setList((l) => l.filter((x) => x.id !== n.id))}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-foreground text-background [&_svg]:size-5">{n.icon ?? "●"}</span>
              <span className="min-w-0 flex-1 leading-snug">
                <span className="flex items-baseline gap-2">
                  <span className="flex-1 truncate text-[13px] font-semibold">{n.title}</span>
                  <span className="text-[11px] text-muted-foreground">now</span>
                </span>
                {n.body && <span className="block text-[13px] text-muted-foreground">{n.body}</span>}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
