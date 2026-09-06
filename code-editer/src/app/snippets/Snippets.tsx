"use client";

import { Snippet } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Code, Filter, Grid, Layers, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import SnippetCard from "./_components/SnippetCard";

interface SnippetsClientProps {
  initialSnippets: Snippet[];
}

export default function SnippetsClient({
  initialSnippets,
}: SnippetsClientProps) {
  const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  // Extract unique languages with counts
  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    snippets.forEach((s) => {
      if (s.language) {
        const lang = s.language.toLowerCase();
        counts[lang] = (counts[lang] || 0) + 1;
      }
    });
    return counts;
  }, [snippets]);

  const popularLanguages = useMemo(() => {
    return Object.keys(languageStats).slice(0, 10);
  }, [languageStats]);

  // Safe filtering logic
  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      const search = searchQuery.toLowerCase().trim();

      const title = (snippet.title || "").toLowerCase();
      const lang = (snippet.language || "").toLowerCase();
      const author = (snippet.userName || "").toLowerCase();
      const code = (snippet.code || "").toLowerCase();

      const matchesSearch =
        !search ||
        title.includes(search) ||
        lang.includes(search) ||
        author.includes(search) ||
        code.includes(search);

      const matchesLanguage =
        !selectedLanguage || lang === selectedLanguage.toLowerCase();

      return matchesSearch && matchesLanguage;
    });
  }, [snippets, searchQuery, selectedLanguage]);

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-12">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header Section */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 border border-blue-500/30 text-sm font-semibold text-gray-200 mb-6 shadow-md"
        >
          <BookOpen className="w-4 h-4 text-blue-400 fill-amber-400/20" />
          <span>Community Snippets Library</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-white via-gray-200 to-gray-400 text-transparent bg-clip-text mb-3 tracking-tight"
        >
          Discover & Share Code Snippets
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Explore reusable code snippets, algorithms, and developer solutions
          shared by programmers worldwide.
        </motion.p>
      </div>

      {/* Search & Interactive Filter Controls */}
      <div className="relative z-10 max-w-5xl mx-auto mb-12 space-y-6">
        {/* Floating Glowing Search Bar */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/25 via-indigo-500/25 to-purple-500/25 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />

          <div className="relative flex items-center">
            <Search className="absolute left-4.5 w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, programming language, code snippet, or author..."
              className="w-full pl-12 pr-10 py-4 bg-[#12121e]/95 hover:bg-[#161626] text-white rounded-2xl border border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-sm sm:text-base outline-none transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Language Filter Bar & Layout View Switcher */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#101018]/90 p-3.5 rounded-2xl border border-gray-800/80 backdrop-blur-xl shadow-xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#181826] rounded-xl border border-gray-800 text-xs text-gray-400 font-bold uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Languages:</span>
            </div>

            {popularLanguages.map((lang) => {
              const isSelected =
                selectedLanguage?.toLowerCase() === lang.toLowerCase();
              const count = languageStats[lang] || 0;
              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(isSelected ? null : lang)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer capitalize border ${
                    isSelected
                      ? "bg-linear-to-r from-blue-600/30 to-indigo-600/30 border-blue-500/60 text-blue-300 shadow-md shadow-blue-500/15"
                      : "bg-[#181826] hover:bg-[#202033] border-gray-800/80 text-gray-300 hover:text-white"
                  }`}
                >
                  <span className="capitalize">{lang}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-blue-500/30 text-blue-200"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {selectedLanguage && (
              <button
                onClick={() => setSelectedLanguage(null)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs font-medium text-gray-400">
              Showing{" "}
              <strong className="text-gray-200">
                {filteredSnippets.length}
              </strong>{" "}
              of {snippets.length} snippets
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#181826] border border-gray-800 p-1 rounded-xl">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  view === "grid"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  view === "list"
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                title="List View"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Snippets Cards Grid/List */}
      <motion.div
        layout
        className={`relative z-10 grid gap-6 ${
          view === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 max-w-4xl mx-auto"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {filteredSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredSnippets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md mx-auto mt-16 p-8 bg-[#12121c]/90 border border-gray-800/80 rounded-3xl text-center backdrop-blur-xl shadow-2xl"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 shadow-inner">
            <Code className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-extrabold text-white mb-2">
            No snippets found
          </h3>

          <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
            {searchQuery || selectedLanguage
              ? "No snippets matched your current search or language filter. Try resetting your search query."
              : "No community code snippets have been published yet. Share your code from the editor!"}
          </p>

          {(searchQuery || selectedLanguage) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLanguage(null);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 rounded-xl transition-all cursor-pointer active:scale-95 border border-gray-700/60"
            >
              <X className="w-4 h-4" />
              Reset All Filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
