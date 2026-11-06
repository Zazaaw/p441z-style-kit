import { DotPattern } from "@/components/effects/dot-pattern";
import { GridPattern } from "@/components/effects/grid-pattern";
import Chrome from "@/site/chrome";
import Hero from "@/site/hero";
import Keynote from "@/site/keynote";
import MotionGallery from "@/site/motion-gallery";
import Desk from "@/site/desk";
import Skills from "@/site/skills";
import Outro from "@/site/outro";
import { loadSkills } from "@/site/skills-data";

export default function Home() {
  const skills = loadSkills();
  const lines = skills.reduce((a, s) => a + s.lines, 0);
  return (
    <>
      {/* Ambient background — the kit recipe: two layers masked toward opposite corners. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <DotPattern width={20} height={20} cx={1} cy={1} cr={1} className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]" />
      </div>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <GridPattern width={50} height={50} duration={15} repeatDelay={1} maxOpacity={0.1} x={-1} y={-1} className="[mask-image:linear-gradient(to_top_left,white,transparent,transparent)]" />
      </div>
      <Chrome skills={skills.map(({ name, title, file }) => ({ name, title, file }))} />
      <main className="relative z-20">
        <Hero skillCount={skills.length} skillLines={lines} />
        <Keynote />
        <MotionGallery />
        <Desk />
        <Skills skills={skills} />
        <Outro />
      </main>
    </>
  );
}
