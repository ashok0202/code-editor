"use client";

import { Clock, Code2, Grid, List, Search, Star, X } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileTabsProps {
  activeTab: string;
  mySnippetsCount: number;
  starredCount: number;
  executionsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  availableLanguages: string[];
  executionStatus: "all" | "success" | "error";
  onExecutionStatusChange: (status: "all" | "success" | "error") => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function ProfileTabs({
  activeTab,
  mySnippetsCount,
  starredCount,
  executionsCount,
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  availableLanguages,
  executionStatus,
  onExecutionStatusChange,
  viewMode,
  onViewModeChange,
}: ProfileTabsProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 bg-[#101018]/90 p-4 sm:p-5 rounded-2xl border border-gray-800/80 backdrop-blur-xl shadow-2xl">
      {/* Tab Triggers List with Roomy Padding */}
      <TabsList className="bg-[#141420]/90 border border-gray-800/80 p-2 rounded-2xl flex flex-wrap sm:flex-nowrap w-full lg:w-auto h-auto gap-2 shadow-inner">
        <TabsTrigger
          value="my-snippets"
          className={`flex-1 lg:flex-none px-6 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group ${
            activeTab === "my-snippets"
              ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 border border-blue-400/40"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent"
          }`}
        >
          <Code2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          <span>My Snippets</span>
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-colors ${
              activeTab === "my-snippets"
                ? "bg-white/20 text-white"
                : "bg-gray-800/80 text-gray-400 border border-gray-700/50"
            }`}
          >
            {mySnippetsCount}
          </span>
        </TabsTrigger>

        <TabsTrigger
          value="starred"
          className={`flex-1 lg:flex-none px-6 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group ${
            activeTab === "starred"
              ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/25 border border-amber-400/40"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent"
          }`}
        >
          <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          <span>Starred</span>
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-colors ${
              activeTab === "starred"
                ? "bg-white/20 text-white"
                : "bg-gray-800/80 text-gray-400 border border-gray-700/50"
            }`}
          >
            {starredCount}
          </span>
        </TabsTrigger>

        <TabsTrigger
          value="executions"
          className={`flex-1 lg:flex-none px-6 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group ${
            activeTab === "executions"
              ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/25 border border-purple-400/40"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent"
          }`}
        >
          <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          <span>Executions</span>
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition-colors ${
              activeTab === "executions"
                ? "bg-white/20 text-white"
                : "bg-gray-800/80 text-gray-400 border border-gray-700/50"
            }`}
          >
            {executionsCount}
          </span>
        </TabsTrigger>
      </TabsList>

      {/* Search, Filter & Layout Switcher Controls */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search snippets or code..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-[#141420] border border-gray-800/80 rounded-xl text-xs sm:text-sm text-gray-200 outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Language Select Filter */}
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-4 py-2.5 bg-[#141420] border border-gray-800/80 rounded-xl text-xs sm:text-sm text-gray-300 capitalize cursor-pointer outline-none transition-all"
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
              onChange={(e) =>
                onExecutionStatusChange(
                  e.target.value as "all" | "success" | "error",
                )
              }
              className="px-4 py-2.5 bg-[#141420] border border-gray-800/80 rounded-xl text-xs sm:text-sm text-gray-300 cursor-pointer outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="success">Passed Only</option>
              <option value="error">Failed Only</option>
            </select>
          </div>
        )}

        {/* View Mode Toggle (Grid/List) for Snippets */}
        {activeTab !== "executions" && (
          <div className="flex items-center bg-[#141420] border border-gray-800/80 p-1 rounded-xl">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
