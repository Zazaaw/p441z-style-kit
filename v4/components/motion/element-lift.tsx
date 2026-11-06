"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * ElementLift — the "wow" moment of a keynote: a card rises out of the page to the center,
 * floats, flips in 3D to show its back, then flies home to the exact spot it came from.
 *
 * Built on shared layout (`layoutId`): the in-place card and the lifted card are the same element
 * as far as the animation is concerned, so the flight path is always correct even if the page
 * scrolled. The page behind blurs and dims while something is lifted. Esc or a click outside
 * puts it back.
 *
 * USAGE
 *   const [up, setUp] = useState(false);
 *   <ElementLift id="id-card" lifted={up} onLower={() => setUp(false)}
 *     front={<IdCard />} back={<IdCardBack />} liftedWidth={560} />
 *   <button onClick={() => setUp(true)}>Show card</button>
 *
 * Without `back` it lifts and floats but does not flip.
 */

interface ElementLiftProps {
  id: string;
  front: React.ReactNode;
  back?: React.ReactNode;
  lifted: boolean;
  /** Called on Esc / outside click. */
  onLower?: () => void;
  /** Width of the card while lifted (px). */
  liftedWidth?: number;
  /** Show the back face while lifted. Defaults to true when `back` is given. */
  flipped?: boolean;
  className?: string;
}

function Faces({ front, back, flipped }: { front: React.ReactNode; back?: React.ReactNode; flipped: boolean }) {
  return (
    <motion.div className="relative h-full w-full [transform-style:preserve-3d]" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.85, ease: EASE.camera }}>
      <div className="h-full w-full [backface-visibility:hidden]">{front}</div>
      {back && <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>}
    </motion.div>
  );
}

/** The lifted copy. Mounted once per lift, so "has it arrived yet?" starts false every time. */
function Lifted({ id, front, back, flipped, width, onLower }: { id: string; front: React.ReactNode; back?: React.ReactNode; flipped: boolean; width: number; onLower?: () => void }) {
  const reduce = useReducedMotion();
  const [arrived, setArrived] = React.useState(false);

  // Flip only after the card has landed — flipping mid-flight looks like a glitch.
  React.useEffect(() => {
    const t = setTimeout(() => setArrived(true), reduce ? 0 : 950);
    return () => clearTimeout(t);
  }, [reduce]);

  React.useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onLower?.();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onLower]);

  return (
    <motion.div className="fixed inset-0 z-[70] grid place-items-center p-6" onClick={onLower} role="dialog" aria-modal>
      <motion.div className="absolute inset-0 bg-background/45 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
      <motion.div
        layoutId={`lift-${id}`}
        transition={reduce ? { duration: 0 } : { duration: 0.85, ease: EASE.camera }}
        className="relative"
        style={{ width: `min(${width}px, 92vw)`, perspective: 1400 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gentle float while lifted. */}
        <motion.div animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} className="drop-shadow-[0_50px_60px_rgba(0,0,0,0.35)]">
          <Faces front={front} back={back} flipped={!!back && flipped && arrived} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function ElementLift({ id, front, back, lifted, onLower, liftedWidth = 520, flipped = true, className }: ElementLiftProps) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const t = reduce ? { duration: 0 } : { duration: 0.85, ease: EASE.camera };

  return (
    <>
      <div className={cn("relative", className)}>
        {lifted ? (
          // Invisible stand-in keeps the layout while the card is away.
          <div aria-hidden className="invisible">
            {front}
          </div>
        ) : (
          <motion.div layoutId={`lift-${id}`} transition={t} style={{ perspective: 1400 }}>
            <Faces front={front} back={back} flipped={false} />
          </motion.div>
        )}
      </div>
      {hydrated &&
        createPortal(
          <AnimatePresence>{lifted && <Lifted key={id} id={id} front={front} back={back} flipped={flipped} width={liftedWidth} onLower={onLower} />}</AnimatePresence>,
          document.body,
        )}
    </>
  );
}
