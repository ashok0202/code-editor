"use client";

import Link from "next/link";
import { Clock, ExternalLink, MessageSquare, Star, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CodeBlock from "./CodeBlock";

export interface SnippetItem {
  id: string;
  userId: string;
  title: string;
  language: string;
  code: string;
  userName: string;
  createdAt: Date | string;
  comments?: any[];
  stars?: any[];
}

interface SnippetCardProps {
  snippet: SnippetItem;
  viewMode: "grid" | "list";
  isMySnippet?: boolean;
  onDelete?: (snippetId: string) => void;
  isDeleting?: boolean;
}

export default function SnippetCard({
  snippet,
  viewMode,
  isMySnippet = false,
  onDelete,
  isDeleting = false,
}: SnippetCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (viewMode === "grid") {
    return (
      <Card className="bg-[#12121a]/90 hover:bg-[#151522] border-gray-800/60 hover:border-gray-700/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-md uppercase">
                  {snippet.language}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  {formatDate(snippet.createdAt)}
                </span>
                {!isMySnippet && snippet.userName && (
                  <span className="text-xs text-gray-400">
                    by <strong className="text-gray-200">{snippet.userName}</strong>
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">
                {snippet.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/snippets/${snippet.id}`}
                className="p-2 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 rounded-lg transition-colors cursor-pointer"
                title="Open Snippet"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              {isMySnippet && onDelete && (
                <button
                  onClick={() => onDelete(snippet.id)}
                  disabled={isDeleting}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete Snippet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mb-4">
            <CodeBlock code={snippet.code} language={snippet.language} />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-800/60 pt-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-amber-400">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                {snippet.stars?.length || 0} stars
              </span>
              <span className="flex items-center gap-1.5 font-medium text-blue-400">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                {snippet.comments?.length || 0} comments
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List View Mode
  return (
    <Card className="bg-[#12121a]/90 hover:bg-[#151522] border-gray-800/60 hover:border-gray-700/80 rounded-xl overflow-hidden transition-all duration-200">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-md uppercase">
            {snippet.language}
          </span>
          <div>
            <h4 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
              <Link href={`/snippets/${snippet.id}`}>{snippet.title}</Link>
            </h4>
            <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
              {!isMySnippet && snippet.userName && (
                <>
                  <span>by {snippet.userName}</span>
                  <span>•</span>
                </>
              )}
              <span>{formatDate(snippet.createdAt)}</span>
              <span>•</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400/30" />
                {snippet.stars?.length || 0}
              </span>
              {snippet.comments && (
                <>
                  <span>•</span>
                  <span className="text-blue-400 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {snippet.comments.length}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Link
            href={`/snippets/${snippet.id}`}
            className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 text-xs text-gray-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View
          </Link>
          {isMySnippet && onDelete && (
            <button
              onClick={() => onDelete(snippet.id)}
              disabled={isDeleting}
              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
