"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import NavigationHeader from "@/components/NavigationHeader";

import { Clock, Code, MessageSquare, User } from "lucide-react";

import { Editor } from "@monaco-editor/react";

import { defineMonacoThemes, LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import SnippetLoadingSkeleton from "./_components/SnippetLoadingSkeleton";
import { toast } from "@/components/ui/toast";
import CopyButton from "./_components/CopyButton";
import Comments from "./_components/Comments";

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

function SnippetDetailPage() {
  const params = useParams();

  const snippetId = params.id as string;

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!snippetId) return;

    const controller = new AbortController();

    const fetchSnippetDetails = async () => {
      try {
        setIsLoading(true);

        // Both APIs execute at the same time
        const [snippetResponse, commentsResponse] = await Promise.all([
          fetch(`/api/snippets/${snippetId}`, {
            signal: controller.signal,
            cache: "no-store",
          }),

          fetch(`/api/snippets/${snippetId}/comments`, {
            signal: controller.signal,
            cache: "no-store",
          }),
        ]);

        const [snippetResult, commentsResult] = await Promise.all([
          snippetResponse.json(),
          commentsResponse.json(),
        ]);

        if (!snippetResponse.ok) {
          throw new Error(snippetResult.message || "Failed to fetch snippet");
        }

        if (!commentsResponse.ok) {
          throw new Error(commentsResult.message || "Failed to fetch comments");
        }

        setSnippet(snippetResult);
        setComments(commentsResult);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Error fetching snippet details:", error);

        toast.add({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to fetch snippet",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippetDetails();

    return () => {
      controller.abort();
    };
  }, [snippetId]);

  if (isLoading) {
    return <SnippetLoadingSkeleton />;
  }

  if (!snippet) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavigationHeader />

        <div className="flex items-center justify-center min-h-[70vh]">
          <p className="text-gray-400">Snippet not found</p>
        </div>
      </div>
    );
  }

  const languageConfig = LANGUAGE_CONFIG[snippet.language];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />

      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div
            className="
              bg-[#121218]
              border border-[#ffffff0a]
              rounded-2xl
              p-6 sm:p-8
              mb-6
              backdrop-blur-xl
            "
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Language Logo */}
                <div className="flex items-center justify-center size-12 rounded-xl bg-[#ffffff08] p-2.5">
                  <img
                    src={`/${snippet.language}.png`}
                    alt={`${snippet.language} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  {/* Title */}
                  <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                    {snippet.title}
                  </h1>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    {/* User */}
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                      <User className="w-4 h-4" />
                      <span>{snippet.userName}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                      <Clock className="w-4 h-4" />

                      <span>
                        {new Date(snippet.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center gap-2 text-[#8b8b8d]">
                      <MessageSquare className="w-4 h-4" />

                      <span>
                        {comments.length}{" "}
                        {comments.length === 1 ? "comment" : "comments"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language Badge */}
              <div className="inline-flex items-center px-3 py-1.5 bg-[#ffffff08] text-[#808086] rounded-lg text-sm font-medium">
                {snippet.language}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="mb-8 rounded-2xl overflow-hidden border border-[#ffffff0a] bg-[#121218]">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#ffffff0a]">
              <div className="flex items-center gap-2 text-[#808086]">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Source Code</span>
              </div>

              <CopyButton code={snippet.code} />
            </div>

            {/* Monaco Editor */}
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
          </div>

          {/* Comments */}
          <Comments snippetId={snippet.id} />
        </div>
      </main>
    </div>
  );
}

export default SnippetDetailPage;
