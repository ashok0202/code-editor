"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle2,
  Terminal,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CODE_EXAMPLES: Record<
  string,
  {
    language: string;
    filename: string;
    lines: { text: string; color?: string }[];
    output: string[];
    executionTime: string;
  }
> = {
  javascript: {
    language: "JavaScript",
    filename: "two_sum.js",
    lines: [
      { text: "// Two Sum Algorithm (O(N) Hash Map)", color: "text-slate-500 italic" },
      { text: "function twoSum(nums, target) {", color: "text-purple-400 font-semibold" },
      { text: "  const seen = new Map();", color: "text-blue-300" },
      { text: "  for (let i = 0; i < nums.length; i++) {", color: "text-slate-200" },
      { text: "    const diff = target - nums[i];", color: "text-slate-300" },
      { text: "    if (seen.has(diff)) return [seen.get(diff), i];", color: "text-cyan-300 font-medium" },
      { text: "    seen.set(nums[i], i);", color: "text-slate-300" },
      { text: "  }", color: "text-purple-400" },
      { text: "}", color: "text-purple-400" },
      { text: "console.log(twoSum([2, 7, 11, 15], 9));", color: "text-amber-300" },
    ],
    output: ["[0, 1]", "Target 9 matched (2 + 7 = 9)"],
    executionTime: "0.05s",
  },
  python: {
    language: "Python",
    filename: "reverse.py",
    lines: [
      { text: "# String Reversal Utility", color: "text-slate-500 italic" },
      { text: "def reverse_string(s: str) -> str:", color: "text-blue-400 font-semibold" },
      { text: "    chars = list(s)", color: "text-slate-200" },
      { text: "    left, right = 0, len(chars) - 1", color: "text-purple-300" },
      { text: "    while left < right:", color: "text-purple-400" },
      { text: "        chars[left], chars[right] = chars[right], chars[left]", color: "text-slate-300" },
      { text: "        left, right = left + 1, right - 1", color: "text-slate-300" },
      { text: "    return ''.join(chars)", color: "text-cyan-300 font-medium" },
      { text: "print(reverse_string('codecraft'))", color: "text-amber-300" },
    ],
    output: ['"tfarcedoc"', "Reversed string successfully"],
    executionTime: "0.03s",
  },
  cpp: {
    language: "C++",
    filename: "pow.cpp",
    lines: [
      { text: "// Fast Exponentiation (O(log N))", color: "text-slate-500 italic" },
      { text: "#include <iostream>", color: "text-pink-400" },
      { text: "using namespace std;", color: "text-slate-300" },
      { text: "long long fastPow(long long b, int e) {", color: "text-purple-400 font-semibold" },
      { text: "    long long res = 1;", color: "text-slate-200" },
      { text: "    while (e > 0) {", color: "text-purple-400" },
      { text: "        if (e & 1) res *= b;", color: "text-cyan-300" },
      { text: "        b *= b; e >>= 1;", color: "text-slate-300" },
      { text: "    }", color: "text-purple-400" },
      { text: "    return res;", color: "text-cyan-300" },
      { text: "}", color: "text-purple-400" },
      { text: "int main() { cout << fastPow(2, 10); }", color: "text-amber-300" },
    ],
    output: ["1024", "2^10 calculated in 0.01s"],
    executionTime: "0.01s",
  },
  java: {
    language: "Java",
    filename: "Palindrome.java",
    lines: [
      { text: "// Palindrome String Checker", color: "text-slate-500 italic" },
      { text: "public class Palindrome {", color: "text-purple-400 font-semibold" },
      { text: "    public static boolean check(String s) {", color: "text-blue-400" },
      { text: "        int l = 0, r = s.length() - 1;", color: "text-slate-200" },
      { text: "        while (l < r) {", color: "text-purple-400" },
      { text: "            if (s.charAt(l++) != s.charAt(r--)) return false;", color: "text-cyan-300" },
      { text: "        }", color: "text-purple-400" },
      { text: "        return true;", color: "text-cyan-300" },
      { text: "    }", color: "text-purple-400" },
      { text: "    public static void main(String[] a) {", color: "text-blue-400" },
      { text: "        System.out.println(check(\"racecar\"));", color: "text-amber-300" },
      { text: "    }", color: "text-purple-400" },
      { text: "}", color: "text-purple-400" },
    ],
    output: ["true", "String 'racecar' is a valid palindrome"],
    executionTime: "0.09s",
  },
};

export default function AnimatedHeroCode() {
  const [selectedLang, setSelectedLang] = useState<string>("javascript");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeLine, setActiveLine] = useState<number>(-1);
  const [showConsole, setShowConsole] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const activeExample = CODE_EXAMPLES[selectedLang];

  // Handle run code animation simulation
  const handleRunCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveLine(0);
    setShowConsole(false);

    // Line highlight progression animation
    const interval = setInterval(() => {
      setActiveLine((prev) => {
        if (prev < activeExample.lines.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsRunning(false);
            setActiveLine(-1);
            setShowConsole(true);
          }, 300);
          return prev;
        }
      });
    }, 120);
  };

  const handleCopyCode = () => {
    const rawCode = activeExample.lines.map((l) => l.text).join("\n");
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-3xl bg-[#090912]/95 border border-white/10 p-3 sm:p-6 backdrop-blur-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] overflow-hidden group">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 border-b border-white/10 mb-4 pb-3">
        {/* Window dots */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
          <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline-block">
            {activeExample.filename}
          </span>
        </div>

        {/* Language Tabs Selector */}
        <div className="flex items-center gap-1 bg-[#131320] p-1 rounded-xl border border-white/5">
          {Object.keys(CODE_EXAMPLES).map((langKey) => {
            const isActive = selectedLang === langKey;
            return (
              <button
                key={langKey}
                onClick={() => {
                  setSelectedLang(langKey);
                  setShowConsole(true);
                }}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive ? "text-white font-semibold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-linear-to-r from-blue-600/80 to-purple-600/80 rounded-lg shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 capitalize">
                  {CODE_EXAMPLES[langKey].language}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleCopyCode}
            className={`h-8 px-3 text-xs font-medium rounded-xl transition-all duration-300 flex items-center gap-1.5 border cursor-pointer ${
              copied
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-xs shadow-emerald-500/20"
                : "bg-[#141424] hover:bg-[#1c1c32] border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 hover:shadow-md hover:shadow-cyan-500/10 active:scale-95 group/copy"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 transition-transform group-hover/copy:scale-110 group-hover/copy:rotate-3" />
                <span>Copy</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handleRunCode}
            disabled={isRunning}
            className="h-8 px-4 text-xs font-semibold bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            {isRunning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </motion.div>
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Code</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code Editor & Console Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 font-mono text-xs sm:text-sm">
        {/* Animated Code Container */}
        <div className="lg:col-span-7 bg-[#05050a] rounded-2xl p-4 border border-white/5 relative overflow-x-auto min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLang}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-1"
            >
              {activeExample.lines.map((line, index) => {
                const isCurrentLine = activeLine === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    className={`flex items-center px-2 py-0.5 rounded transition-colors ${
                      isCurrentLine
                        ? "bg-blue-500/20 border-l-2 border-cyan-400 font-bold"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="w-7 text-slate-600 select-none text-right pr-3 font-mono text-[11px]">
                      {index + 1}
                    </span>

                    <span className={`whitespace-pre ${line.color || "text-slate-200"}`}>
                      {line.text}
                    </span>

                    {isCurrentLine && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-cyan-400 ml-1 rounded-xs"
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Console Terminal Output Container */}
        <div className="lg:col-span-5 bg-[#05050a] rounded-2xl p-4 border border-white/5 flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Execution Console</span>
              </div>

              <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">
                ⚡ Sandboxed
              </span>
            </div>

            {isRunning ? (
              <div className="space-y-3 pt-6 text-center">
                <div className="inline-flex p-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 animate-spin">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-400 animate-pulse font-sans">
                  Compiling & running {activeExample.language} kernel...
                </p>
              </div>
            ) : showConsole ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Executed Successfully ({activeExample.executionTime})</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 font-mono text-xs">
                  {activeExample.output.map((outLine, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-cyan-300">
                      <span className="text-slate-500 select-none">&gt;</span>
                      <span>{outLine}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="text-center pt-8 text-xs text-slate-500 font-sans">
                Click &quot;Run Code&quot; to execute this snippet...
              </div>
            )}
          </div>

          {/* Console Footer */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> CodeCraft v2.4
            </span>
            <span className="text-emerald-400">Exit Code: 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
