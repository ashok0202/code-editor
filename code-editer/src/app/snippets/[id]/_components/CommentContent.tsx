import CodeBlock from "./CodeBlock";

function renderTextWithInlineCode(text: string, keyPrefix: string) {
  // Split on inline backticks `code`
  const inlineParts = text.split(/(`[^`]+`)/g);

  return inlineParts.map((inlinePart, idx) => {
    if (
      inlinePart.startsWith("`") &&
      inlinePart.endsWith("`") &&
      inlinePart.length > 2
    ) {
      const codeSnippet = inlinePart.slice(1, -1);
      return (
        <code
          key={`${keyPrefix}-inline-${idx}`}
          className="px-1.5 py-0.5 mx-0.5 text-xs font-mono text-cyan-300 bg-white/8 border border-white/10 rounded font-normal"
        >
          {codeSnippet}
        </code>
      );
    }
    return inlinePart;
  });
}

function CommentContent({ content }: { content: string }) {
  // Split on code fences ```lang ... ```
  const parts = content.split(/(```[\w-]*\n[\s\S]*?\n```)/g);

  return (
    <div className="max-w-none text-slate-200 text-sm leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(/```([\w-]*)\n([\s\S]*?)\n```/);

          if (match) {
            const [, language, code] = match;
            return <CodeBlock language={language} code={code} key={index} />;
          }
        }

        return part.split("\n").map((line, lineIdx) => {
          if (!line.trim() && lineIdx !== 0) {
            return <div key={`${index}-${lineIdx}`} className="h-2" />;
          }

          return (
            <p key={`${index}-${lineIdx}`} className="text-slate-300 mb-1.5">
              {renderTextWithInlineCode(line, `${index}-${lineIdx}`)}
            </p>
          );
        });
      })}
    </div>
  );
}

export default CommentContent;
