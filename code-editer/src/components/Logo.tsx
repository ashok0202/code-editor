import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const svgSizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  return (
    <Link
      href="/"
      className={`group relative inline-flex items-center gap-3 select-none ${className}`}
    >
      {/* Background Radial Glow on Hover */}
      <div className="absolute -inset-3 bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl pointer-events-none" />

      {/* SVG Icon Container */}
      <div
        className={`relative ${iconSizes[size]} flex items-center justify-center rounded-2xl bg-[#0e0e18] border border-white/10 group-hover:border-cyan-500/40 shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300 group-hover:scale-105 overflow-hidden`}
      >
        {/* Subtle grid pattern background in icon */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] bg-size-[8px_8px] opacity-15" />

        {/* Inline SVG Logo */}
        <svg
          width={svgSizes[size]}
          height={svgSizes[size]}
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 transition-transform duration-500 group-hover:rotate-3"
        >
          <defs>
            <linearGradient
              id="logoLeftBracket"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient
              id="logoRightBracket"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="logoSlash" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>

          {/* Left Bracket < */}
          <path
            d="M 190 160 L 110 256 L 190 352"
            stroke="url(#logoLeftBracket)"
            strokeWidth="42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Bracket > */}
          <path
            d="M 322 160 L 402 256 L 322 352"
            stroke="url(#logoRightBracket)"
            strokeWidth="42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Slash / */}
          <path
            d="M 285 140 L 227 372"
            stroke="url(#logoSlash)"
            strokeWidth="36"
            strokeLinecap="round"
          />

          {/* Sparkle Star Dot */}
          <path
            d="M 256 90 L 262 110 L 282 116 L 262 122 L 256 142 L 250 122 L 230 116 L 250 110 Z"
            fill="#38bdf8"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-linear-to-r from-cyan-400 via-blue-300 to-purple-400 text-transparent bg-clip-text group-hover:from-cyan-300 group-hover:to-purple-300 transition-all">
              CodeCraft
            </span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/30 rounded-md">
              PRO
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
            Interactive Code Editor
          </span>
        </div>
      )}
    </Link>
  );
}
