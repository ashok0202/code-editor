"use client";

import { Snippet } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Clock, Copy, ExternalLink, Trash2, User } from "lucide-react";
import StarButton from "@/components/StarButton";
import { toast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getLanguageLogo = (lang: string) => {
  if (!lang) return "/javascript.png";
  const lower = lang.toLowerCase().trim();
  if (lower === "c++" || lower === "cpp") return "/cpp.png";
  if (lower === "c#" || lower === "csharp") return "/csharp.png";
  if (lower === "js" || lower === "javascript") return "/javascript.png";
  if (lower === "ts" || lower === "typescript") return "/typescript.png";
  return `/${lower}.png`;
};

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const lineCount = snippet.code ? snippet.code.split("\n").length : 0;

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(snippet.code);
      setHasCopied(true);
      toast.add({
        title: "Copied!",
        description: "Snippet code copied to clipboard.",
        type: "success",
      });
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      toast.add({
        title: "Error",
        description: "Could not copy code.",
        type: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/snippets/${snippet.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete snippet");
      }

      toast.add({
        title: "Success",
        description: "Snippet deleted successfully",
        type: "success",
      });

      // Refresh page to sync list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting snippet:", error);

      toast.add({
        title: "Error",
        description: "Failed to delete snippet",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      className="group relative h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/snippets/${snippet.id}`} className="h-full block">
        <Card className="h-full bg-[#12121e]/90 hover:bg-[#161626] border-gray-800/70 hover:border-blue-500/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col justify-between">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded-xl bg-linear-to-br from-blue-500/15 to-purple-500/15 border border-blue-500/20 shadow-inner">
                  <img
                    src={getLanguageLogo(snippet.language)}
                    alt={`${snippet.language} logo`}
                    className="w-6 h-6 object-contain relative z-10"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/javascript.png";
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-md text-xs font-bold uppercase tracking-wider">
                      {snippet.language}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {lineCount} {lineCount === 1 ? "line" : "lines"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>
                      {new Date(snippet.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div
                className="flex items-center gap-1.5 z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {/* 1-Click Copy Code Button */}
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700/80 text-gray-300 transition-colors cursor-pointer active:scale-95 border border-gray-700/50"
                  title="Copy Code"
                >
                  {hasCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>

                {/* Star Button */}
                <StarButton snippetId={snippet.id} />

                {/* Delete Button (Owner Only) */}
                {session?.user?.id === snippet.userId && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete();
                    }}
                    disabled={isDeleting}
                    className="rounded-lg cursor-pointer"
                    title="Delete Snippet"
                  >
                    {isDeleting ? (
                      <div className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <CardTitle className="text-lg font-extrabold text-white leading-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {snippet.title}
                </CardTitle>
                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors shrink-0" />
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="p-1 rounded-md bg-gray-800/60 text-gray-400">
                  <User className="w-3 h-3 text-blue-400" />
                </div>
                <span className="truncate max-w-40 font-medium text-gray-300">
                  {snippet.userName || "Anonymous"}
                </span>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative rounded-xl overflow-hidden border border-gray-800/80 bg-[#090910] p-3.5 text-xs font-mono text-gray-300 group-hover:border-gray-700/80 transition-colors">
              <pre className="line-clamp-3 whitespace-pre-wrap opacity-85 leading-relaxed">
                {snippet.code}
              </pre>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default SnippetCard;

