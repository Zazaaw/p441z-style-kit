import { cn } from "@/lib/utils";

/**
 * Aurora — slow, soft light behind a hero: three blurred blobs drifting out of phase.
 * Tinted with the theme primary via `color-mix()` (neutral in the plain kit, your accent after a
 * rebrand; works with triplet and full-color tokens). CSS only.
 *
 * Keep it behind ONE section. Two auroras on a page read as a theme, not a moment.
 * Reduced motion: the light stays still.
 *
 * USAGE
 *   <section className="relative overflow-hidden">
 *     <Aurora />
 *     …
 *   </section>
 */

interface AuroraProps {
  className?: string;
  /** Overall opacity (0–1). 0.35–0.6 reads as atmosphere, not decoration. */
  intensity?: number;
}

export default function Aurora({ className, intensity = 0.5 }: AuroraProps) {
  const blob = "absolute rounded-full blur-[90px] will-change-transform motion-reduce:!animate-none";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} style={{ opacity: intensity }}>
      <style>{`
        @keyframes p441z-aurora-a { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(8%,6%) scale(1.15) } }
        @keyframes p441z-aurora-b { 0%,100% { transform: translate(0,0) scale(1.1) } 50% { transform: translate(-10%,4%) scale(0.95) } }
        @keyframes p441z-aurora-c { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(4%,-8%) scale(1.2) } }
      `}</style>
      <div className={blob} style={{ left: "8%", top: "-10%", width: "46%", height: "60%", background: "color-mix(in oklab, var(--color-primary) 55%, transparent)", animation: "p441z-aurora-a 18s ease-in-out infinite" }} />
      <div className={blob} style={{ right: "4%", top: "6%", width: "40%", height: "55%", background: "color-mix(in oklab, var(--color-primary) 32%, transparent)", animation: "p441z-aurora-b 22s ease-in-out infinite" }} />
      <div className={blob} style={{ left: "30%", bottom: "-20%", width: "50%", height: "50%", background: "color-mix(in oklab, var(--color-foreground) 8%, transparent)", animation: "p441z-aurora-c 26s ease-in-out infinite" }} />
    </div>
  );
}
