"use client";

import { useCodeEditorStore } from "@/app/store/useCodeEditorStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import React, { useState } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";

const OutputPanel: React.FC = () => {
  const { output, error, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);

  const hasContent = Boolean(error || output);

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b0b12] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-xl flex flex-col h-112.5 sm:h-165">
      {/* Terminal Header */}
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-white/5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="p-1 sm:p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-200">
            Terminal Output
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isRunning && (
            <span className="px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full animate-pulse">
              Running...
            </span>
          )}

          {hasContent && (
            <Button
              size="sm"
              onClick={handleCopy}
              title={isCopied ? "Copied to clipboard" : "Copy output"}
              className={`h-7 px-2.5 sm:px-3 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 border cursor-pointer ${
                isCopied
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 bg-[#050509] rounded-xl border border-white/5 overflow-hidden">
        <ScrollArea className="h-full w-full p-4 font-mono text-sm">
          {isRunning ? (
            <RunningCodeSkeleton />
          ) : error ? (
            <div className="space-y-2 text-red-400">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Execution Error</span>
              </div>
              <pre className="whitespace-pre-wrap text-rose-300/90 font-mono text-xs leading-relaxed p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                {error}
              </pre>
            </div>
          ) : output ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Success</span>
              </div>
              <pre className="whitespace-pre-wrap text-slate-200 font-mono text-xs sm:text-sm leading-relaxed">
                {output}
              </pre>
            </div>
          ) : (
            <div className="h-full min-h-120 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <div className="p-3 rounded-2xl bg-white/2 border border-white/5 text-slate-600">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-xs text-center font-sans max-w-xs text-slate-500">
                Run your code to view console logs and execution output here.
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default OutputPanel;
