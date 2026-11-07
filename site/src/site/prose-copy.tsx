"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import CopyButton from "@/components/ui/copy-button";
import { useT } from "@/site/i18n";

/** Puts a CopyButton in the corner of every code block inside `.skill-prose` (server-rendered
 *  Markdown), so a command can be copied without selecting it. The text is read when clicked. */
export function ProseCopy() {
  const t = useT();
  const [blocks, setBlocks] = useState<HTMLPreElement[]>([]);
  useEffect(() => {
    const id = requestAnimationFrame(() => setBlocks(Array.from(document.querySelectorAll<HTMLPreElement>(".skill-prose pre"))));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <>
      {blocks.map((pre, i) =>
        createPortal(
          <CopyButton
            value={pre.querySelector("code")?.textContent?.trimEnd() ?? ""}
            label={t("Copy", "Salin")}
            copiedLabel={t("Copied", "Tersalin")}
            className="prose-copy absolute right-2 top-2 h-7 rounded-md border border-white/10 bg-white/[0.07] px-2 text-[12px] text-white/70 hover:bg-white/[0.12] hover:text-white"
          />,
          pre,
          `copy-${i}`,
        ),
      )}
    </>
  );
}
