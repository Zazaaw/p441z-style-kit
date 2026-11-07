"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";

/**
 * PillTabs — the rounded segmented filter used for status filters, view
 * switchers, and category toggles. The white pill is one element that springs
 * to the tab you pick (it overshoots a hair and settles), and each tab squishes
 * under the finger.
 *
 *   const [filter, setFilter] = useState("All");
 *
 *   <PillTabs
 *     tabs={["All", "Upcoming", "Pending", "Completed"]}
 *     value={filter}
 *     onChange={setFilter}
 *   />
 *
 * TWO DETAILS THAT MAKE IT WORK ON MOBILE
 *   1. `w-full md:w-fit` — stretches full-width on phones, hugs content on
 *      desktop. Without this it looks stranded on a narrow screen.
 *   2. The scrollbar-hiding triple:
 *        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
 *      Lets the row scroll horizontally when the tabs overflow, without an
 *      ugly scrollbar cutting through the pill.
 *
 * The pill uses a shared-layout id from `useId()`, so any number of PillTabs
 * can sit on one page without their pills jumping between each other.
 */

type PillTabsProps = {
  tabs: readonly string[];
  value: string;
  onChange: (tab: string) => void;
  className?: string;
};

export default function PillTabs({
  tabs,
  value,
  onChange,
  className,
}: PillTabsProps) {
  const id = React.useId();
  const reduce = useReducedMotion();
  return (
    <div
      role="tablist"
      className={cn(
        "flex w-full items-center overflow-x-auto rounded-full border border-neutral-200 bg-white p-1 shadow-sm md:w-fit dark:border-neutral-800 dark:bg-neutral-900",
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        className
      )}
    >
      {tabs.map((tab) => {
        const on = value === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(tab)}
            className={cn(
              "relative whitespace-nowrap rounded-full px-5 py-1.5 text-sm font-medium transition-[color,scale] duration-300 ease-spring active:scale-[.93] active:duration-100 motion-reduce:active:scale-100",
              on
                ? "text-neutral-900 dark:text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            {on && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-neutral-100 shadow-sm dark:bg-neutral-800"
                transition={reduce ? { duration: 0 } : SPRING.slide}
              />
            )}
            <span className="relative">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
