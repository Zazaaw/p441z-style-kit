"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import MaskReveal from "@/components/motion/mask-reveal";
import { MacWindow } from "@/components/mac/window";
import BorderBeam from "@/components/effects/border-beam";
import SpotlightCard from "@/components/effects/spotlight-card";
import { SHOWCASE, type ShowcaseItem } from "@/site/showcase-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Plays muted while on screen (like a product page), with native controls for sound and seeking. */
function AutoVideo({ item }: { item: ShowcaseItem }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => undefined) : v.pause()), { threshold: 0.5 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  if (missing) {
    return <div className="grid aspect-video place-items-center bg-muted/40 text-[14px] text-muted-foreground">Rendering — the video lands here soon.</div>;
  }
  return <video ref={ref} src={item.video} poster={item.poster} muted loop playsInline controls preload="metadata" onError={() => setMissing(true)} className="block aspect-video w-full bg-black" />;
}

export default function Showcase() {
  const root = useRef<HTMLElement>(null);
  const featured = SHOWCASE.find((s) => s.featured);
  const rest = SHOWCASE.filter((s) => s !== featured);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The window grows from a slight tilt into place as it scrolls in — a product-shot entrance.
        gsap.fromTo(".show-window", { rotateX: 14, scale: 0.9, y: 80, opacity: 0.4 }, { rotateX: 0, scale: 1, y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".show-window", start: "top 95%", end: "top 35%", scrub: 0.8 } });
      });
    },
    { scope: root },
  );
  return (
    <section id="showcase" ref={root} className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Made with the skills</div>
        <MaskReveal as="h2" text="See what it produces." className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em]" />
        <p className="mt-4 text-lg text-muted-foreground">Not mock-ups — real output. The video below was produced end to end with <code className="text-[0.9em]">skill-motion-video</code>.</p>
      </div>
      {featured && (
        <div className="mt-14 [perspective:1600px]">
          <div className="show-window relative mx-auto max-w-5xl rounded-xl">
            <MacWindow title={featured.title} className="relative shadow-[0_60px_120px_-50px_hsl(var(--primary)/0.55)]" toolbar={<span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">{featured.madeWith}</span>}>
              <AutoVideo item={featured} />
            </MacWindow>
            <BorderBeam duration={10} />
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-center text-[14px] text-muted-foreground">{featured.note}</p>
        </div>
      )}
      {rest.length > 0 && (
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {rest.map((s) => (
            <SpotlightCard key={s.title} className="p-0">
              {s.video && <AutoVideo item={s} />}
              <a href={s.href ?? s.video} target={s.href ? "_blank" : undefined} rel="noreferrer" className="block p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-display text-xl font-extrabold tracking-tight">{s.title}</div>
                  <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-[12px] text-muted-foreground">{s.madeWith}</span>
                </div>
                <p className="mt-1.5 text-[14px] text-muted-foreground">{s.note}</p>
                {s.href && <div className="mt-3 text-[13px] font-semibold text-primary">Visit →</div>}
              </a>
            </SpotlightCard>
          ))}
        </div>
      )}
    </section>
  );
}
