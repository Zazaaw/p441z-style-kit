import { cn } from "@/lib/utils";

type Link = { href: string; title: string };

/** Previous / next cards at the foot of a doc page. They squish when pressed, lean a degree toward
 *  where they lead, and the arrow springs ahead on hover. CSS only — fine in a server component. */
export function DocPager({ label, prev, next, prevLabel, nextLabel }: { label: string; prev?: Link; next?: Link; prevLabel: string; nextLabel: string }) {
  const card = "group block rounded-2xl border border-border p-5 transition-[border-color,scale,rotate,translate] duration-500 ease-spring hover:-translate-y-0.5 hover:border-foreground/30 active:scale-[.98] active:duration-100 motion-reduce:transition-colors";
  return (
    <nav aria-label={label} className="mx-auto grid max-w-6xl gap-4 border-t border-border px-6 py-12 sm:grid-cols-2">
      {prev ? (
        <a href={prev.href} className={cn(card, "hover:-rotate-[0.6deg]")}>
          <div className="text-[12px] text-muted-foreground">
            <span aria-hidden className="inline-block transition-transform duration-500 ease-spring group-hover:-translate-x-1.5">←</span> {prevLabel}
          </div>
          <div className="mt-1 font-display text-lg font-bold">{prev.title}</div>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a href={next.href} className={cn(card, "text-right hover:rotate-[0.6deg]")}>
          <div className="text-[12px] text-muted-foreground">
            {nextLabel} <span aria-hidden className="inline-block transition-transform duration-500 ease-spring group-hover:translate-x-1.5">→</span>
          </div>
          <div className="mt-1 font-display text-lg font-bold">{next.title}</div>
        </a>
      )}
    </nav>
  );
}
