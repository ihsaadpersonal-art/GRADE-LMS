"use client";

import { useState } from "react";
import { Clipboard } from "lucide-react";

export function ReportCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyReport() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="grid gap-3">
      <pre className="overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-background p-4 text-sm leading-6">
        {text}
      </pre>
      <button
        type="button"
        onClick={copyReport}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[#164d3a]"
      >
        <Clipboard className="size-4" aria-hidden="true" />
        {copied ? "Copied" : "Copy WhatsApp report"}
      </button>
    </div>
  );
}
