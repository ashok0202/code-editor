"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      type="button"
      className={`
        group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
        transition-all duration-200 border active:scale-95 select-none
        ${
          copied
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-white/4 border-white/8 text-slate-400 hover:bg-white/8 hover:border-white/15 hover:text-slate-200"
        }
      `}
      title="Copy code to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-50 duration-200" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export default CopyButton;
