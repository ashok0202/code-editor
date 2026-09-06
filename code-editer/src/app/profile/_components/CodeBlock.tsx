"use client";

import React, { useState } from "react";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { toast } from "@/components/ui/toast";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const lines = code.split("\n");
  const hasMoreThanSixLines = lines.length > 6;

  const collapsedCode = hasMoreThanSixLines ? lines.slice(0, 6).join("\n") : code;
  const expandedCode = hasMoreThanSixLines ? lines.slice(6).join("\n") : "";

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setHasCopied(true);
      toast.add({
        title: "Copied!",
        description: "Code copied to clipboard.",
        type: "success",
      });
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      toast.add({
        title: "Failed to copy",
        description: "Could not copy code to clipboard.",
        type: "error",
      });
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-800/60 bg-[#0a0a0f]">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#12121a] border-b border-gray-800/60 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80" />
          <span className="font-mono uppercase font-semibold text-gray-300">{language}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-500">{lines.length} {lines.length === 1 ? "line" : "lines"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 transition-colors text-xs font-medium cursor-pointer active:scale-95"
          title="Copy code"
        >
          {hasCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="relative">
        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={atomOneDark}
          customStyle={{
            padding: "1rem",
            borderRadius: 0,
            background: "transparent",
            margin: 0,
            fontSize: "0.85rem",
          }}
        >
          {collapsedCode}
        </SyntaxHighlighter>

        {hasMoreThanSixLines && (
          <CollapsibleContent>
            <SyntaxHighlighter
              language={language.toLowerCase()}
              style={atomOneDark}
              customStyle={{
                padding: "0 1rem 1rem 1rem",
                borderRadius: 0,
                background: "transparent",
                margin: 0,
                fontSize: "0.85rem",
              }}
            >
              {expandedCode}
            </SyntaxHighlighter>
          </CollapsibleContent>
        )}

        {hasMoreThanSixLines && (
          <CollapsibleTrigger
            className="w-full py-2 px-4 bg-linear-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent text-blue-400 text-xs font-medium flex items-center justify-center gap-1 hover:text-blue-300 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Show More ({lines.length - 6} more lines) <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </CollapsibleTrigger>
        )}
      </Collapsible>
    </div>
  );
};

export default CodeBlock;

