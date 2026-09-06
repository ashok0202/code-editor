"use client";

import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  Check,
  Code2,
  Plus,
  Share2,
  Star,
  Timer,
  TrendingUp,
  Trophy,
  UserIcon,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface ProfileHeaderProps {
  userStats: {
    totalExecutions: number;
    languagesCount: number;
    languages: string[];
    last24Hours: number;
    favoriteLanguage: string;
    languageStats: Record<string, number>;
    mostStarredLanguage: string;
  };
  userData: {
    id: string;
    createdAt: Date;
    proSince?: number | null;
    lemonSqueezyCustomerId?: string | null;
    lemonSqueezyOrderId?: string | null;
    name?: string | null;
    email?: string | null;
    isPro: boolean;
  };
  user: {
    image?: string | null;
  };
  starredSnippets: any[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  javascript: "#f7df1e",
  typescript: "#3178c6",
  python: "#3572A5",
  java: "#b07219",
  cpp: "#f34b7d",
  csharp: "#178600",
  go: "#00ADD8",
  rust: "#dea584",
  html: "#e34c26",
  css: "#563d7c",
};

const profileHeader: React.FC<ProfileHeaderProps> = ({
  userStats,
  userData,
  user,
  starredSnippets,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.add({
        title: "Link Copied!",
        description: "Profile link copied to clipboard.",
        type: "success",
      });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      toast.add({
        title: "Share Failed",
        description: "Could not copy profile link.",
        type: "error",
      });
    }
  };

  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : null;

  // Compute language breakdown percentage if available
  const langEntries = Object.entries(userStats?.languageStats || {});
  const totalLangExecutions = langEntries.reduce(
    (acc, [_, count]) => acc + count,
    0,
  );

  const STATS = [
    {
      label: "Code Executions",
      value: userStats?.totalExecutions ?? 0,
      icon: Activity,
      color: "from-blue-500 to-cyan-500",
      glowColor: "rgba(59, 130, 246, 0.15)",
      description: "Total code runs",
      metric: {
        label: "Last 24h",
        value: `${userStats?.last24Hours ?? 0} runs`,
        icon: Timer,
      },
    },
    {
      label: "Starred Snippets",
      value: starredSnippets?.length ?? 0,
      icon: Star,
      color: "from-amber-500 to-orange-500",
      glowColor: "rgba(245, 158, 11, 0.15)",
      description: "Saved in library",
      metric: {
        label: "Top Starred",
        value: userStats?.mostStarredLanguage || "N/A",
        icon: Trophy,
      },
    },
    {
      label: "Languages Used",
      value: userStats?.languagesCount ?? 0,
      icon: Code2,
      color: "from-purple-500 to-pink-500",
      glowColor: "rgba(168, 85, 247, 0.15)",
      description: "Distinct stacks",
      metric: {
        label: "Most Active",
        value: userStats?.favoriteLanguage || "N/A",
        icon: TrendingUp,
      },
    },
  ];

  return (
    <div className="relative mb-8 rounded-3xl bg-[#101018]/90 border border-gray-800/60 p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />

      {/* Main Header Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-gray-800/60">
        <div className="flex items-center gap-6">
          {/* Avatar with Animated Glow */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <img
              src={user?.image || "/default-avatar.png"}
              alt={userData?.name || "User Avatar"}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#101018] relative z-10 object-cover shadow-xl group-hover:scale-105 transition-transform duration-300"
            />
            {userData?.isPro && (
              <div
                className="absolute top-0 right-0 bg-linear-to-r from-amber-400 to-orange-500 p-2 rounded-full z-20 shadow-lg border-2 border-[#101018]"
                title="Pro Member"
              >
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              </div>
            )}
          </div>

          {/* User Meta */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {userData?.name || "Developer"}
              </h1>
              {userData?.isPro ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 rounded-full text-xs font-semibold shadow-sm">
                  <Zap className="w-3 h-3 text-purple-400 fill-purple-400" />
                  Pro Member
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-800/60 border border-gray-700/50 text-gray-400 rounded-full text-xs font-medium">
                  Free Plan
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-400/80" />
              {userData?.email}
            </p>

            {memberSince && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-0.5">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                Member since {memberSince}
              </p>
            )}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleShareProfile}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/60 text-gray-200 rounded-xl text-sm font-medium transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied Link</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-gray-400" />
                <span>Share Profile</span>
              </>
            )}
          </button>

          <Link
            href="/"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/25 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Snippet</span>
          </Link>
        </div>
      </div>

      {/* Language Breakdown Section (if available) */}
      {langEntries.length > 0 && totalLangExecutions > 0 && (
        <div className="relative z-10 mt-6 pt-2 pb-2">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="font-semibold text-gray-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              Language Distribution
            </span>
            <span>{totalLangExecutions} executions total</span>
          </div>

          {/* Multi-segmented Progress Bar */}
          <div className="h-2.5 w-full rounded-full bg-gray-900 overflow-hidden flex p-0.5 gap-0.5 border border-gray-800">
            {langEntries.map(([lang, count]) => {
              const pct = Math.round((count / totalLangExecutions) * 100);
              if (pct === 0) return null;
              const color = LANGUAGE_COLORS[lang.toLowerCase()] || "#3b82f6";
              return (
                <div
                  key={lang}
                  style={{ width: `${pct}%`, backgroundColor: color }}
                  className="h-full rounded-full transition-all duration-500 hover:opacity-80 relative group"
                  title={`${lang}: ${pct}% (${count} runs)`}
                />
              );
            })}
          </div>

          {/* Legend Pills */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
            {langEntries.slice(0, 5).map(([lang, count]) => {
              const pct = Math.round((count / totalLangExecutions) * 100);
              const color = LANGUAGE_COLORS[lang.toLowerCase()] || "#3b82f6";
              return (
                <div
                  key={lang}
                  className="flex items-center gap-1.5 text-gray-400"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium text-gray-300 capitalize">
                    {lang}
                  </span>
                  <span className="text-gray-500">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 relative z-10">
        {STATS.map((stat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={stat.label}
          >
            <Card className="group relative bg-[#13131f]/80 hover:bg-[#181829] border-gray-800/60 hover:border-gray-700/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl">
              {/* Glow overlay */}
              <div
                className={`absolute inset-0 bg-linear-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <CardContent className="relative p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {stat.description}
                    </span>
                    <h3 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                      {typeof stat.value === "number"
                        ? stat.value.toLocaleString()
                        : stat.value}
                    </h3>
                    <p className="text-xs font-medium text-gray-400 mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-2xl bg-linear-to-br ${stat.color} shadow-lg shadow-black/40`}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Sub-metric footer */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-800/60 text-xs">
                  <stat.metric.icon className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-400">{stat.metric.label}:</span>
                  <span className="font-semibold text-gray-200 capitalize">
                    {stat.metric.value}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default profileHeader;
