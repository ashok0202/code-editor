"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import NavigationHeader from "@/components/NavigationHeader";

import { Clock, Code, MessageSquare, User, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { Editor } from "@monaco-editor/react";

import { defineMonacoThemes, LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import SnippetLoadingSkeleton from "./_components/SnippetLoadingSkeleton";
import { toast } from "@/components/ui/toast";
import CopyButton from "./_components/CopyButton";
import Comments from "./_components/Comments";
import StarButton from "@/components/StarButton";

interface Snippet {
  id: string;
  userId: string;
  userName: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  snippetId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

import { useSnippet } from "@/features/snippets/hooks/use-snippet";
import { useSnippetComments } from "@/features/snippets/hooks/use-snippet-comments";

function SnippetDetailPage() {
  const params = useParams();

  const snippetId = params.id as string;

  const { data: snippet, isLoading: isSnippetLoading } = useSnippet(snippetId);
  const { data: comments = [] } = useSnippetComments(snippetId);
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  if (isSnippetLoading) {
    return <SnippetLoadingSkeleton />;
  }

  if (!snippet) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavigationHeader />

        <div className="flex items-center justify-center min-h-[70vh]">
          <p className="text-slate-400 font-mono">Snippet not found</p>
        </div>
      </div>
    );
  }

  const languageConfig = LANGUAGE_CONFIG[snippet.language];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <NavigationHeader />

      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div
            className="
              bg-[#121218]/90
              border border-white/[0.08]
              rounded-2xl
              p-6 sm:p-8
              mb-6
              backdrop-blur-xl
              shadow-xl
            "
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                {/* Language Logo */}
                <div className="flex items-center justify-center size-12 rounded-xl bg-white/[0.06] border border-white/[0.08] p-2.5 shrink-0 shadow-md">
                  <img
                    src={`/${snippet.language}.png`}
                    alt={`${snippet.language} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  {/* Title */}
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mb-2">
                    {snippet.title}
                  </h1>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-400">
                    {/* User */}
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-slate-300">{snippet.userName}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {new Date(snippet.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center gap-1.5 font-mono">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {comments.length}{" "}
                        {comments.length === 1 ? "comment" : "comments"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions: Star/Like button & Language badge */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <StarButton snippetId={snippet.id} />
                <div className="inline-flex items-center px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] text-slate-300 rounded-lg text-xs font-mono font-medium uppercase tracking-wider">
                  {snippet.language}
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor Collapsible */}
          <Collapsible
            open={isEditorOpen}
            onOpenChange={setIsEditorOpen}
            className="mb-8 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#121218]/90 shadow-xl backdrop-blur-xl transition-all"
          >
            {/* Editor Header / Collapsible Trigger */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
              <CollapsibleTrigger className="flex items-center gap-2.5 text-slate-300 font-mono text-xs sm:text-sm font-medium hover:text-white transition-colors cursor-pointer group select-none">
                <Code className="w-4 h-4 text-blue-400" />
                <span>Source Code</span>
                <span className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-200 ml-2 bg-white/[0.04] px-2.5 py-0.5 rounded-md border border-white/[0.06] transition-all">
                  {isEditorOpen ? (
                    <>
                      <span>Collapse</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Expand</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </span>
              </CollapsibleTrigger>

              <CopyButton code={snippet.code} />
            </div>

            {/* Monaco Editor Collapsible Content */}
            <CollapsibleContent>
              <Editor
                height="600px"
                language={languageConfig?.monacoLanguage ?? snippet.language}
                value={snippet.code}
                theme="vs-dark"
                beforeMount={defineMonacoThemes}
                options={{
                  minimap: {
                    enabled: false,
                  },
                  fontSize: 16,
                  readOnly: true,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: {
                    top: 16,
                  },
                  renderWhitespace: "selection",
                  fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                  fontLigatures: true,
                }}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Comments */}
          <Comments snippetId={snippet.id} />
        </div>
      </main>
    </div>
  );
}

export default SnippetDetailPage;
