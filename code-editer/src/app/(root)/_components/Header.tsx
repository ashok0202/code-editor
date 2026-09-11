import { Code2, Sparkles } from "lucide-react";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import ThemeSelector from "./ThemeSelector";
import { getAuthsession } from "@/lib/auth";
import HeaderProfileBtn from "@/components/HeaderProfileBtn";
import Logo from "@/components/Logo";

const Header = async () => {
  const session = await getAuthsession();

  return (
    <div className="relative z-10 mb-4">
      <div className="bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Brand Logo & Navigation Links */}
        <div className="flex items-center justify-between lg:justify-start gap-4 sm:gap-6">
          <Logo size="sm" className="scale-95 sm:scale-100" />

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1">
            <Link
              href="/snippets"
              title="Snippets"
              className="relative group flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-slate-300 bg-white/5 
                hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/40 transition-all duration-300 shadow-sm overflow-hidden"
            >
              <Code2 className="w-4 h-4 text-blue-400 relative z-10 group-hover:rotate-3 transition-transform" />
              <span className="hidden sm:inline text-xs sm:text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                Snippets
              </span>
            </Link>
          </nav>
        </div>

        {/* Action Controls & User Profile */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3.5 pt-2.5 lg:pt-0 border-t border-white/5 lg:border-t-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSelector />
            <LanguageSelector hasAccess={false} />
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/pricing"
              title="Pro Plan"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all text-xs font-semibold text-amber-400"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pro</span>
            </Link>

            <RunButton />

            <div className="pl-2 border-l border-white/10">
              <HeaderProfileBtn session={session} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

