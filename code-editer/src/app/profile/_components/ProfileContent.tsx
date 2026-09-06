"use client";

import { deleteSnippet } from "@/app/actions/snippets";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Code2,
  ExternalLink,
  Grid,
  List,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import CodeBlock from "./CodeBlock";

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
  const [mySnippets, setMySnippets] =
    useState<SnippetItem[]>(initialMySnippets);
  const [starredSnippets, setStarredSnippets] = useState<SnippetItem[]>(
    initialStarredSnippets,
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Interactive UI state
  const [activeTab, setActiveTab] = useState("my-snippets");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [executionStatus, setExecutionStatus] = useState<
    "all" | "success" | "error"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Extract all unique languages from snippets and executions
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    mySnippets.forEach((s) => langs.add(s.language.toLowerCase()));
    starredSnippets.forEach((s) => langs.add(s.language.toLowerCase()));
    executions.forEach((e) => langs.add(e.language.toLowerCase()));
    return Array.from(langs);
  }, [mySnippets, starredSnippets, executions]);

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

  // Filtered lists
  const filteredMySnippets = useMemo(() => {
    return mySnippets.filter((snippet) => {
      const matchesSearch =
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.language.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLang =
        selectedLanguage === "all" ||
        snippet.language.toLowerCase() === selectedLanguage;
      return matchesSearch && matchesLang;
    });
  }, [mySnippets, searchQuery, selectedLanguage]);

  const filteredStarredSnippets = useMemo(() => {
    return starredSnippets.filter((snippet) => {
      const matchesSearch =
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.language.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLang =
        selectedLanguage === "all" ||
        snippet.language.toLowerCase() === selectedLanguage;
      return matchesSearch && matchesLang;
    });
  }, [starredSnippets, searchQuery, selectedLanguage]);

  const filteredExecutions = useMemo(() => {
    return executions.filter((exec) => {
      const matchesSearch =
        exec.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exec.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exec.output &&
          exec.output.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (exec.error &&
          exec.error.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLang =
        selectedLanguage === "all" ||
        exec.language.toLowerCase() === selectedLanguage;
      const matchesStatus =
        executionStatus === "all" ||
        (executionStatus === "success" && !exec.error) ||
        (executionStatus === "error" && Boolean(exec.error));
      return matchesSearch && matchesLang && matchesStatus;
    });
  }, [executions, searchQuery, selectedLanguage, executionStatus]);

  return (
    <div className="mt-8 space-y-6">
      <Tabs
        defaultValue="my-snippets"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        {/* Navigation & View Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#101018]/80 p-3 rounded-2xl border border-gray-800/60 backdrop-blur-md shadow-lg">
          <TabsList className="bg-[#181826] border border-gray-800/80 p-1 rounded-xl flex w-full lg:w-auto">
            <TabsTrigger
              value="my-snippets"
              className="flex-1 lg:flex-none px-4 py-2 text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg"
            >
              My Snippets ({mySnippets.length})
            </TabsTrigger>
            <TabsTrigger
              value="starred"
              className="flex-1 lg:flex-none px-4 py-2 text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-lg"
            >
              Starred ({starredSnippets.length})
            </TabsTrigger>
            <TabsTrigger
              value="executions"
              className="flex-1 lg:flex-none px-4 py-2 text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg"
            >
              Executions ({executions.length})
            </TabsTrigger>
          </TabsList>

          {/* Search, Filter & Layout Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search snippets or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-[#181826] border border-gray-800 rounded-xl text-xs sm:text-sm text-gray-200 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Language Select Filter */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 bg-[#181826] border border-gray-800 rounded-xl text-xs sm:text-sm text-gray-300 capitalize cursor-pointer outline-none"
              >
                <option value="all">All Languages</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter (Executions Tab) */}
            {activeTab === "executions" && (
              <div className="relative">
                <select
                  value={executionStatus}
                  onChange={(e) => setExecutionStatus(e.target.value as any)}
                  className="px-3 py-2 bg-[#181826] border border-gray-800 rounded-xl text-xs sm:text-sm text-gray-300 cursor-pointer outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="success">Passed Only</option>
                  <option value="error">Failed Only</option>
                </select>
              </div>
            )}

            {/* View Mode Toggle (Grid/List) for Snippets */}
            {activeTab !== "executions" && (
              <div className="flex items-center bg-[#181826] border border-gray-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* My Snippets Tab */}
        <TabsContent value="my-snippets" className="mt-6">
          {filteredMySnippets.length === 0 ? (
            <Card className="bg-[#12121c]/60 border-gray-800/60 p-12 text-center rounded-3xl">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Code2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    No snippets found
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
                    {searchQuery || selectedLanguage !== "all"
                      ? "No snippets match your current search and language filters. Try clearing your search filters."
                      : "You haven't saved or shared any code snippets yet. Create your first snippet in the code editor!"}
                  </p>
                </div>
                <Link
                  href="/"
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Snippet Now
                </Link>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              layout
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              <AnimatePresence>
                {filteredMySnippets.map((snippet) => (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {viewMode === "grid" ? (
                      <Card className="bg-[#12121a]/90 hover:bg-[#151522] border-gray-800/60 hover:border-gray-700/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2.5 mb-2">
                                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-md uppercase">
                                  {snippet.language}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                                  {formatDate(snippet.createdAt)}
                                </span>
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
                              <button
                                onClick={() => handleDelete(snippet.id)}
                                disabled={isDeleting === snippet.id}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                title="Delete Snippet"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="mb-4">
                            <CodeBlock
                              code={snippet.code}
                              language={snippet.language}
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-800/60 pt-4">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1.5 font-medium text-amber-400">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                                {snippet.stars.length} stars
                              </span>
                              <span className="flex items-center gap-1.5 font-medium text-blue-400">
                                <MessageSquare className="w-4 h-4 text-blue-400" />
                                {snippet.comments.length} comments
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      /* List View Mode */
                      <Card className="bg-[#12121a]/90 hover:bg-[#151522] border-gray-800/60 hover:border-gray-700/80 rounded-xl overflow-hidden transition-all duration-200">
                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-md uppercase">
                              {snippet.language}
                            </span>
                            <div>
                              <h4 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                                <Link href={`/snippets/${snippet.id}`}>
                                  {snippet.title}
                                </Link>
                              </h4>
                              <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                <span>{formatDate(snippet.createdAt)}</span>
                                <span>•</span>
                                <span className="text-amber-400 flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400/30" />
                                  {snippet.stars.length}
                                </span>
                                <span>•</span>
                                <span className="text-blue-400 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  {snippet.comments.length}
                                </span>
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
                            <button
                              onClick={() => handleDelete(snippet.id)}
                              disabled={isDeleting === snippet.id}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </TabsContent>

        {/* Starred Snippets Tab */}
        <TabsContent value="starred" className="mt-6">
          {filteredStarredSnippets.length === 0 ? (
            <Card className="bg-[#12121c]/60 border-gray-800/60 p-12 text-center rounded-3xl">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Star className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    No starred snippets
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
                    {searchQuery || selectedLanguage !== "all"
                      ? "No starred snippets match your search query."
                      : "Explore public snippets shared by the community and give them a star to save them here."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              layout
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              <AnimatePresence>
                {filteredStarredSnippets.map((snippet) => (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {viewMode === "grid" ? (
                      <Card className="bg-[#12121a]/90 hover:bg-[#151522] border-gray-800/60 hover:border-gray-700/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-md uppercase">
                                  {snippet.language}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                                  {formatDate(snippet.createdAt)}
                                </span>
                                <span className="text-xs text-gray-400">
                                  by{" "}
                                  <strong className="text-gray-200">
                                    {snippet.userName}
                                  </strong>
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-white leading-tight">
                                {snippet.title}
                              </h3>
                            </div>

                            <Link
                              href={`/snippets/${snippet.id}`}
                              className="p-2 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 rounded-lg transition-colors cursor-pointer"
                              title="Open Snippet"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>

                          <div className="mb-4">
                            <CodeBlock
                              code={snippet.code}
                              language={snippet.language}
                            />
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-800/60 pt-4">
                            <span className="flex items-center gap-1.5 font-medium text-amber-400">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              {snippet.stars.length} stars
                            </span>
                            <span className="flex items-center gap-1.5 font-medium text-blue-400">
                              <MessageSquare className="w-4 h-4 text-blue-400" />
                              {snippet.comments.length} comments
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      /* List View Mode */
                      <Card className="bg-[#12121a]/90 hover:bg-[#151522] border-gray-800/60 hover:border-gray-700/80 rounded-xl overflow-hidden transition-all duration-200">
                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-md uppercase">
                              {snippet.language}
                            </span>
                            <div>
                              <h4 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                                <Link href={`/snippets/${snippet.id}`}>
                                  {snippet.title}
                                </Link>
                              </h4>
                              <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                <span>by {snippet.userName}</span>
                                <span>•</span>
                                <span>{formatDate(snippet.createdAt)}</span>
                                <span>•</span>
                                <span className="text-amber-400 flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400/30" />
                                  {snippet.stars.length}
                                </span>
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/snippets/${snippet.id}`}
                            className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 text-xs text-gray-200 rounded-lg transition-colors flex items-center gap-1.5 self-end sm:self-center"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View
                          </Link>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </TabsContent>

        {/* Executions Tab */}
        <TabsContent value="executions" className="mt-6">
          {filteredExecutions.length === 0 ? (
            <Card className="bg-[#12121c]/60 border-gray-800/60 p-12 text-center rounded-3xl">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Code2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    No code executions found
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
                    {searchQuery ||
                    selectedLanguage !== "all" ||
                    executionStatus !== "all"
                      ? "No execution logs match your current search or status filter."
                      : "Run code inside the online editor to generate execution history logs here!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {filteredExecutions.map((exec) => (
                  <motion.div
                    key={exec.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
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
                          <CodeBlock
                            code={exec.code}
                            language={exec.language}
                          />
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
