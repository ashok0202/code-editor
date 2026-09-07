"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CodeBlock from "./CodeBlock";

export interface ExecutionItem {
  id: string;
  language: string;
  code: string;
  output: string | null;
  error: string | null;
  createdAt: Date | string;
}

interface ExecutionCardProps {
  exec: ExecutionItem;
}

export default function ExecutionCard({ exec }: ExecutionCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-[#12121a]/90 border-gray-800/60 hover:border-gray-700/80 rounded-2xl overflow-hidden transition-all shadow-md">
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-md uppercase">
              {exec.language}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              {formatDate(exec.createdAt)}
            </span>
          </div>

          <span
            className={`text-xs px-2.5 py-1 font-semibold rounded-full flex items-center gap-1.5 border ${
              exec.error
                ? "bg-red-500/10 text-red-400 border-red-500/30"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            }`}
          >
            {exec.error ? (
              <>
                <XCircle className="w-3.5 h-3.5" /> Failed
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Success
              </>
            )}
          </span>
        </div>

        {/* Code Execution Preview */}
        <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#0d0d14]">
          <CodeBlock code={exec.code} language={exec.language} />
        </div>

        {/* Output Console Box */}
        {(exec.output || exec.error) && (
          <div className="p-4 bg-[#09090f] border border-gray-800/80 rounded-xl text-xs font-mono max-h-40 overflow-y-auto">
            <div className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              {exec.error
                ? "Execution Error Console"
                : "Execution Output Console"}
            </div>
            {exec.error ? (
              <pre className="text-red-400 whitespace-pre-wrap font-mono">
                {exec.error}
              </pre>
            ) : (
              <pre className="text-gray-300 whitespace-pre-wrap font-mono">
                {exec.output}
              </pre>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
