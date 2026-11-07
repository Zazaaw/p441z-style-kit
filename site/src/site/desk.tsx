"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import MaskReveal from "@/components/motion/mask-reveal";
import { MacWindow } from "@/components/mac/window";
import Terminal from "@/components/mac/terminal";
import Dock from "@/components/mac/dock";
import { useNotify } from "@/components/mac/notification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { IconBell, IconCheck, IconTerminal, IconWindow, IconBook } from "@/site/icons";
import { useT } from "@/site/i18n";

type Win = "code" | "term" | "preview";

const CODE = `:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --muted: 0 0% 96.1%;
  --border: 0 0% 89.8%;
  --radius: 0.5rem;
}
.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
}`;

export default function Desk() {
  const t = useT();
  const openSpotlight = () => window.dispatchEvent(new Event("p441z:spotlight"));
  const desk = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const notify = useNotify();
  const [open, setOpen] = useState<Record<Win, boolean>>({ code: true, term: true, preview: true });
  const [order, setOrder] = useState<Win[]>(["code", "term", "preview"]);
  const front = (w: Win) => setOrder((o) => [...o.filter((x) => x !== w), w]);
  const close = (w: Win) => setOpen((o) => ({ ...o, [w]: false }));
  const show = (w: Win) => {
    setOpen((o) => ({ ...o, [w]: true }));
    front(w);
  };

  const frame = (w: Win, className: string, node: React.ReactNode) => (
    <AnimatePresence>
      {open[w] && (
        <motion.div
          key={w}
          drag={!reduce}
          dragConstraints={desk}
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 120, transition: { duration: 0.35, ease: EASE.camera } }}
          transition={{ duration: 0.45, ease: EASE.reveal }}
          onPointerDown={() => front(w)}
          className={cn("absolute cursor-grab active:cursor-grabbing", className)}
          style={{ zIndex: 10 + order.indexOf(w) }}
        >
          {node}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section id="desk" className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-28">
      <div className="max-w-2xl">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">components/mac</div>
        <MaskReveal as="h2" text={t("Feels like your desktop.", "Serasa di desktop sendiri.")} className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
        <p className="mt-4 text-lg text-muted-foreground">{t("Windows with traffic lights, a terminal that types, a magnifying dock, ⌘K search, and frosted notifications. Drag the windows around — close one and bring it back from the dock.", "Jendela lengkap dengan traffic lights, terminal yang mengetik sendiri, dock yang membesar saat disorot, pencarian ⌘K, dan notifikasi bening. Seret jendelanya ke mana saja — tutup satu, panggil lagi dari dock.")}</p>
      </div>

      <div ref={desk} className="relative mt-12 h-[640px] overflow-hidden rounded-3xl border border-border bg-[radial-gradient(120%_90%_at_20%_0%,hsl(var(--muted))_0%,hsl(var(--background))_55%)] shadow-inner">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]" />

        {frame(
          "code",
          "left-[4%] top-[7%] w-[min(440px,88%)]",
          <MacWindow title="globals.css" onClose={() => close("code")} toolbar={<Badge variant="secondary" className="text-[11px]">CSS</Badge>} bodyClassName="p-4">
            <pre className="overflow-x-auto font-mono text-[12.5px] leading-6 text-foreground/85">{CODE}</pre>
          </MacWindow>,
        )}
        {frame(
          "term",
          "left-[28%] top-[44%] hidden w-[min(500px,90%)] sm:block",
          <div onPointerDownCapture={() => front("term")}>
            <Terminal title="zsh — p441z" lines={[{ cmd: "npx shadcn@latest add style.p441z.my.id/r/dock.json" }, { out: "✔ Created components/mac/dock.tsx", dim: true }, { cmd: "npx shadcn@latest add style.p441z.my.id/r/element-lift.json" }, { out: "✔ Created components/motion/element-lift.tsx", dim: true }]} />
          </div>,
        )}
        {frame(
          "preview",
          "right-[4%] top-[12%] w-[min(340px,80%)]",
          <MacWindow title={t("Preview", "Pratinjau")} glass onClose={() => close("preview")} bodyClassName="p-5">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-[13px] text-muted-foreground">{t("Leave balance", "Sisa cuti")}</div>
              <div className="mt-1 font-display text-3xl font-extrabold tracking-tight">
                9 <span className="text-base font-semibold text-muted-foreground">{t("/ 12 days", "/ 12 hari")}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => notify({ title: t("Request sent", "Pengajuan terkirim"), body: t("Waiting for Maya to approve.", "Tinggal menunggu persetujuan Maya."), icon: <IconCheck /> })}>
                  {t("Request leave", "Ajukan cuti")}
                </Button>
                <Button size="sm" variant="outline" onClick={openSpotlight}>
                  ⌘K
                </Button>
              </div>
            </div>
          </MacWindow>,
        )}

        <Dock
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          size={40}
          magnified={60}
          items={[
            { label: "globals.css", icon: <IconWindow />, onClick: () => show("code"), active: open.code },
            { label: "Terminal", icon: <IconTerminal />, onClick: () => show("term"), active: open.term },
            { label: t("Preview", "Pratinjau"), icon: <IconBook />, onClick: () => show("preview"), active: open.preview },
            { label: t("Notify me", "Kirim notifikasi"), icon: <IconBell />, divider: true, onClick: () => notify({ title: t("Hello from the dock", "Halo dari dock"), body: t("Notifications stack and leave on their own.", "Notifikasi menumpuk, lalu hilang sendiri."), icon: <IconBell /> }) },
          ]}
        />
      </div>
    </section>
  );
}
