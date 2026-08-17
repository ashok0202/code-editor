"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.split("\n");
  const hasMoreThanSixLines = lines.length > 6;

  // Split code into first 6 lines and the remaining lines
  const collapsedCode = hasMoreThanSixLines ? lines.slice(0, 6).join("\n") : code;
  const expandedCode = hasMoreThanSixLines ? lines.slice(6).join("\n") : "";

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="relative">
      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={atomOneDark}
        customStyle={{
          padding: hasMoreThanSixLines && isExpanded ? "1rem 1rem 0 1rem" : "1rem",
          borderRadius: hasMoreThanSixLines && isExpanded ? "0.5rem 0.5rem 0 0" : "0.5rem",
          background: "rgba(0, 0, 0, 0.4)",
          margin: 0,
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
              borderRadius: "0 0 0.5rem 0.5rem",
              background: "rgba(0, 0, 0, 0.4)",
              margin: 0,
              borderTop: "none",
            }}
          >
            {expandedCode}
          </SyntaxHighlighter>
        </CollapsibleContent>
      )}

      {hasMoreThanSixLines && (
        <CollapsibleTrigger
          className="absolute bottom-2 right-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs flex items-center 
          gap-1 hover:bg-blue-500/30 transition-colors cursor-pointer z-10"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="w-3 h-3" />
            </>
          )}
        </CollapsibleTrigger>
      )}
    </Collapsible>
  );
};

export default CodeBlock;
