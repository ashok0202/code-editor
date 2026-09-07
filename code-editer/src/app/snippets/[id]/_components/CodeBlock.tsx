import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CopyButton from "./CopyButton";

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const trimmedCode = code
    .split("\n") // split into lines
    .map((line) => line.trimEnd()) // remove trailing spaces from each line
    .join("\n"); // join back into a single string

  return (
    <div className="my-4 bg-[#0d0d12] rounded-xl overflow-hidden border border-white/8 shadow-lg">
      {/* header bar showing language and copy button */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/3 border-b border-white/6">
        {/* language indicator with icon */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center rounded bg-white/6 p-0.5">
            <img
              src={`/${language || "javascript"}.png`}
              alt={language || "code"}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback hiding broken img if language icon doesn't exist
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            {language || "code"}
          </span>
        </div>
        {/* button to copy code to clipboard */}
        <CopyButton code={trimmedCode} />
      </div>

      {/* code block with syntax highlighting */}
      <div className="relative overflow-x-auto text-xs sm:text-sm font-mono">
        <SyntaxHighlighter
          language={language || "plaintext"}
          style={atomOneDark}
          customStyle={{
            padding: "1.25rem 1rem",
            background: "transparent",
            margin: 0,
            fontSize: "0.875rem",
            lineHeight: "1.6",
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {trimmedCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
