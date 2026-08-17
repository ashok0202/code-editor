"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Code2, MessageSquare, Star, Trash2 } from "lucide-react";
import CodeBlock from "./CodeBlock";
import { deleteSnippet } from "@/app/actions/snippets";
import { toast } from "@/components/ui/toast";

interface SnippetItem {
  id: string;
  userId: string;
  title: string;
  language: string;
  code: string;
  userName: string;
  createdAt: Date;
  comments: any[];
  stars: any[];
}

interface ExecutionItem {
  id: string;
  language: string;
  code: string;
  output: string | null;
  error: string | null;
  createdAt: Date;
}

interface ProfileContentProps {
  initialMySnippets: SnippetItem[];
  initialStarredSnippets: SnippetItem[];
  executions: ExecutionItem[];
}

export default function ProfileContent({
  initialMySnippets,
  initialStarredSnippets,
  executions,
}: ProfileContentProps) {
  const [mySnippets, setMySnippets] = useState<SnippetItem[]>(initialMySnippets);
  const [starredSnippets, setStarredSnippets] = useState<SnippetItem[]>(initialStarredSnippets);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (snippetId: string) => {
    if (confirm("Are you sure you want to delete this snippet?")) {
      try {
        setIsDeleting(snippetId);
        await deleteSnippet({ snippetId });
        setMySnippets((prev) => prev.filter((s) => s.id !== snippetId));
        setStarredSnippets((prev) => prev.filter((s) => s.id !== snippetId));
        toast.add({
          title: "Success",
          description: "Snippet deleted successfully",
          type: "success",
        });
      } catch (error: any) {
        console.error("Error deleting snippet:", error);
        toast.add({
          title: "Error",
          description: error.message || "Failed to delete snippet",
          type: "error",
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mt-8">
      <Tabs defaultValue="my-snippets" className="w-full">
        <TabsList className="bg-[#181825]/60 border border-gray-800/50 p-1 mb-6 rounded-xl flex w-full max-w-md">
          <TabsTrigger value="my-snippets" className="flex-1 py-2 text-sm font-medium">
            My Snippets ({mySnippets.length})
          </TabsTrigger>
          <TabsTrigger value="starred" className="flex-1 py-2 text-sm font-medium">
            Starred ({starredSnippets.length})
          </TabsTrigger>
          <TabsTrigger value="executions" className="flex-1 py-2 text-sm font-medium">
            Executions ({executions.length})
          </TabsTrigger>
        </TabsList>

        {/* My Snippets Tab */}
        <TabsContent value="my-snippets">
          {mySnippets.length === 0 ? (
            <Card className="bg-[#181825]/40 border-gray-800/50 p-8 text-center rounded-2xl">
              <CardContent className="flex flex-col items-center gap-3">
                <Code2 className="w-12 h-12 text-gray-600" />
                <p className="text-gray-400 font-medium">No snippets shared yet</p>
                <p className="text-xs text-gray-500">Share your first snippet from the editor to see it here!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {mySnippets.map((snippet) => (
                <Card
                  key={snippet.id}
                  className="bg-[#12121a]/80 border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700/50 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 rounded-md uppercase">
                            {snippet.language}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(snippet.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight">{snippet.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDelete(snippet.id)}
                        disabled={isDeleting === snippet.id}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Snippet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <CodeBlock code={snippet.code} language={snippet.language} />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-gray-800/50 pt-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500/80 fill-yellow-500/10" />
                        {snippet.stars.length} stars
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-blue-500/80" />
                        {snippet.comments.length} comments
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Starred Snippets Tab */}
        <TabsContent value="starred">
          {starredSnippets.length === 0 ? (
            <Card className="bg-[#181825]/40 border-gray-800/50 p-8 text-center rounded-2xl">
              <CardContent className="flex flex-col items-center gap-3">
                <Star className="w-12 h-12 text-gray-600" />
                <p className="text-gray-400 font-medium">No starred snippets</p>
                <p className="text-xs text-gray-500">Go explore snippets shared by others and give them a star!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {starredSnippets.map((snippet) => (
                <Card
                  key={snippet.id}
                  className="bg-[#12121a]/80 border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700/50 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 rounded-md uppercase">
                            {snippet.language}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(snippet.createdAt)}
                          </span>
                          <span className="text-xs text-gray-500">by {snippet.userName}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight">{snippet.title}</h3>
                      </div>
                    </div>

                    <div className="mb-4">
                      <CodeBlock code={snippet.code} language={snippet.language} />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 border-t border-gray-800/50 pt-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500/80 fill-yellow-500/10" />
                        {snippet.stars.length} stars
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-blue-500/80" />
                        {snippet.comments.length} comments
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Executions Tab */}
        <TabsContent value="executions">
          {executions.length === 0 ? (
            <Card className="bg-[#181825]/40 border-gray-800/50 p-8 text-center rounded-2xl">
              <CardContent className="flex flex-col items-center gap-3">
                <Code2 className="w-12 h-12 text-gray-600" />
                <p className="text-gray-400 font-medium">No executions yet</p>
                <p className="text-xs text-gray-500">Run some code in the editor to see your execution log here!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {executions.map((exec) => (
                <Card
                  key={exec.id}
                  className="bg-[#12121a]/80 border-gray-800/50 rounded-2xl overflow-hidden hover:border-gray-700/50 transition-colors"
                >
                  <CardContent className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 rounded-md uppercase">
                          {exec.language}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(exec.createdAt)}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 font-medium rounded ${
                          exec.error
                            ? "bg-red-500/10 text-red-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >
                        {exec.error ? "Failed" : "Success"}
                      </span>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-gray-800 bg-[#0d0d12]">
                      <CodeBlock code={exec.code} language={exec.language} />
                    </div>

                    {(exec.output || exec.error) && (
                      <div className="p-3 bg-[#0d0d12]/50 border border-gray-800/50 rounded-lg text-xs font-mono max-h-32 overflow-y-auto">
                        {exec.error ? (
                          <span className="text-red-400">{exec.error}</span>
                        ) : (
                          <span className="text-gray-300">{exec.output}</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
