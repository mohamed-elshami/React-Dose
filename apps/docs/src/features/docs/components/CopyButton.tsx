"use client";

import { useState } from "react";

type CopyButtonProps = {
  code: string;
};

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 rounded-md border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
      aria-label="Copy code to clipboard"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
