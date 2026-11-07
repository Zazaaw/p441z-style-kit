import { DotPattern } from "@/components/effects/dot-pattern";
import { GridPattern } from "@/components/effects/grid-pattern";
import Marquee from "@/components/effects/marquee";
import Chrome from "@/site/chrome";
import SmoothScroll from "@/site/smooth";
import Hero from "@/site/hero";
import Keynote from "@/site/keynote";
import Bento from "@/site/bento";
import Typography from "@/site/typography";
import MotionGallery from "@/site/motion-gallery";
import Desk from "@/site/desk";
import Showcase from "@/site/showcase";
import Skills from "@/site/skills";
import Outro from "@/site/outro";
import { loadSkills } from "@/site/skills-data";
import { kitComponents } from "@/site/kit-stats";
import { LangProvider, type Lang } from "@/site/i18n";

/** The whole landing page, in one language. "/" renders it in English, "/id" in Indonesian. */
export default function Home({ lang }: { lang: Lang }) {
  const skills = loadSkills(lang);
  const lines = skills.reduce((a, s) => a + s.lines, 0);
  const comps = kitComponents();
  return (
    <LangProvider lang={lang}>
      <div className="grain">
        <SmoothScroll />
        {/* Ambient background — the kit recipe: two layers masked toward opposite corners. */}
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <DotPattern width={20} height={20} cx={1} cy={1} cr={1} className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]" />
        </div>
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <GridPattern width={50} height={50} duration={15} repeatDelay={1} maxOpacity={0.1} x={-1} y={-1} className="[mask-image:linear-gradient(to_top_left,white,transparent,transparent)]" />
        </div>
        <Chrome skills={skills.map(({ name, title, file }) => ({ name, title, file }))} />
        <main className="relative z-20">
          <Hero skillCount={skills.length} skillLines={lines} componentCount={comps.length} skills={skills} />
          <div className="border-y border-border bg-background/60 py-5 backdrop-blur">
            <Marquee duration="60s" gap="2.75rem">
              {comps.map((c) => (
                <span key={`${c.group}-${c.name}`} className="flex items-center gap-2.5 whitespace-nowrap font-display text-[15px] font-semibold text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {c.name}
                </span>
              ))}
            </Marquee>
          </div>
          <Keynote />
          <Bento componentCount={comps.length} skillCount={skills.length} />
          <Typography skillLines={skills.find((s) => s.file === "skill-typography.md")?.lines ?? 0} />
          <MotionGallery />
          <Desk />
          <Showcase />
          <Skills skills={skills} />
          <Outro />
        </main>
      </div>
    </LangProvider>
  );
}
