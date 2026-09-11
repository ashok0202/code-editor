import React from "react";
import Link from "next/link";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import AnimatedHeroCode from "./_components/AnimatedHeroCode";
import {
  Code2,
  Sparkles,
  Zap,
  Play,
  CheckCircle2,
  ArrowRight,
  Shield,
  Cpu,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "CodeCraft | Learn, Write & Master Data Structures & Algorithms",
  description:
    "The ultimate interactive code editor, multi-language compiler, and community snippet platform.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07070d] text-white flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Header */}
      <NavigationHeader />

      {/* Hero Section Container */}
      <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Decorative Background Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-tr from-blue-600/20 via-indigo-500/15 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Pill Announcement Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-md shadow-lg hover:border-blue-500/40 transition-all cursor-pointer group">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-semibold tracking-wide bg-linear-to-r from-blue-300 via-indigo-200 to-purple-300 text-transparent bg-clip-text">
                The Ultimate Code Execution & Snippet Platform
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Main Hero Header */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Master Coding & Prepare for{" "}
              <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text drop-shadow-[0_0_35px_rgba(56,189,248,0.3)]">
                Top Tech Interviews
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-400 font-normal leading-relaxed max-w-3xl mx-auto">
              Write, execute, and analyze Data Structures, Algorithms, and code
              snippets in{" "}
              <span className="text-slate-200 font-semibold">
                JavaScript, Python, C++, Java, Go, Rust & TypeScript
              </span>{" "}
              with instant cloud compilation.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/">
                <Button className="w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 border border-blue-400/30">
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Coding Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/snippets" className="w-full sm:w-auto">
                <div className="relative group p-px rounded-2xl bg-linear-to-r from-gray-800 via-blue-500/20 to-purple-500/20 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 transition-all duration-500 shadow-lg hover:shadow-cyan-500/20 active:scale-95">
                  <Button
                    variant="ghost"
                    className="w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-[15px] bg-[#0c0c18]/90 hover:bg-[#111122]/90 backdrop-blur-xl text-slate-200 group-hover:text-white transition-all flex items-center justify-center gap-3 border-0"
                  >
                    <Code2 className="w-5 h-5 text-cyan-400 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform  group-hover:text-white">
                      Explore Snippets
                    </span>
                  </Button>
                </div>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400 pt-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free &
                Open Access
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Sub-second Compiler
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" /> Isolated Sandboxed
                Engine
              </span>
            </div>
          </div>

          {/* Interactive Animated Code Component (Animate-UI / Striver Style) */}
          <div className="mt-14 max-w-5xl mx-auto">
            <AnimatedHeroCode />
          </div>

          {/* Stats Bar Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#0e0e1a]/80 border border-white/5 backdrop-blur-xl text-center space-y-1 hover:border-blue-500/30 transition-colors">
              <div className="text-3xl font-extrabold text-white flex items-center justify-center gap-1">
                <span>10</span>
                <span className="text-blue-400">+</span>
              </div>
              <p className="text-xs font-medium text-slate-400">
                Supported Languages
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0e1a]/80 border border-white/5 backdrop-blur-xl text-center space-y-1 hover:border-cyan-500/30 transition-colors">
              <div className="text-3xl font-extrabold text-white flex items-center justify-center gap-1">
                <span>0.1</span>
                <span className="text-cyan-400">s</span>
              </div>
              <p className="text-xs font-medium text-slate-400">
                Instant Execution Speed
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0e1a]/80 border border-white/5 backdrop-blur-xl text-center space-y-1 hover:border-purple-500/30 transition-colors">
              <div className="text-3xl font-extrabold text-white flex items-center justify-center gap-1">
                <span>50K</span>
                <span className="text-purple-400">+</span>
              </div>
              <p className="text-xs font-medium text-slate-400">
                Code Executions Run
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0e1a]/80 border border-white/5 backdrop-blur-xl text-center space-y-1 hover:border-emerald-500/30 transition-colors">
              <div className="text-3xl font-extrabold text-white flex items-center justify-center gap-1">
                <span>100</span>
                <span className="text-emerald-400">%</span>
              </div>
              <p className="text-xs font-medium text-slate-400">
                Cloud Sandboxed Uptime
              </p>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-20 max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Everything You Need to{" "}
                <span className="text-blue-400">Level Up Your Code</span>
              </h2>
              <p className="text-sm text-slate-400">
                Designed for developers, interview preparation, and snippet
                collection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[#0d0d17] border border-white/5 hover:border-blue-500/30 transition-all space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Multi-Language Execution
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Run JavaScript, Python, C++, Java, Go, Rust, and TypeScript
                  with zero setup required.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0d0d17] border border-white/5 hover:border-purple-500/30 transition-all space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Share & Discover Snippets
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Publish your code snippets, star favorite algorithms, and
                  explore solutions created by the community.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0d0d17] border border-white/5 hover:border-cyan-500/30 transition-all space-y-3 group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Profile & Execution History
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track your stats, view execution logs, manage your saved
                  snippets, and customize your developer workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
