"use client";
import useMounted from "@/app/hooks/useMounted";
import { useCodeEditorStore } from "@/app/store/useCodeEditorStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, Lock, Sparkles } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { LANGUAGE_CONFIG } from "../_constants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";


const LanguageSelector: React.FC<{ hasAccess: boolean }> = ({ hasAccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useMounted();

  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguageObj = LANGUAGE_CONFIG[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langId: string) => {
    if (!hasAccess && langId !== "javascript") return;

    setLanguage(langId);
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        title={`Language: ${currentLanguageObj.label}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-2 sm:py-2.5 bg-[#1e1e2e]/80 
      rounded-lg transition-all 
       duration-200 border border-gray-800/50 hover:border-gray-700
       ${!hasAccess && language !== "javascript" ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {/* Decoration */}
        <div
          className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/5 
        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />

        <div className="size-5 sm:size-6 rounded-md bg-gray-800/50 p-0.5 group-hover:scale-110 transition-transform shrink-0">
          <Image
            src={currentLanguageObj.logoPath}
            alt="programming language logo"
            width={24}
            height={24}
            className="w-full h-full object-contain relative z-10"
          />
        </div>

        <span className="text-gray-200 min-w-16 text-left group-hover:text-white transition-colors text-xs sm:text-sm hidden sm:inline-block">
          {currentLanguageObj.label}
        </span>

        <ChevronDownIcon
          className={`size-4 text-gray-400 transition-all duration-300 group-hover:text-gray-300
            ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[#1e1e2e]/95 backdrop-blur-xl
           rounded-xl border border-[#313244] shadow-2xl py-2 z-50"
          >
            <div className="px-3 pb-2 mb-2 border-b border-gray-800/50">
              <p className="text-xs font-medium text-gray-400">
                Select Language
              </p>
            </div>

            <ScrollArea className="h-70 pr-1">
              {Object.values(LANGUAGE_CONFIG).map((lang, index) => {
                const isLocked = !hasAccess && lang.id !== "javascript";

                return (
                  <motion.div
                    key={lang.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group px-2"
                  >
                    <Button
                      variant="link"
                      className={`
                      relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${language === lang.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"}
                      ${isLocked ? "opacity-50" : "hover:bg-[#262637]"}
                    `}
                      onClick={() => handleLanguageSelect(lang.id)}
                      disabled={isLocked}
                    >
                      {/* decorator */}
                      <div
                        className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-purple-500/5 rounded-lg 
                        opacity-0 group-hover:opacity-100 transition-opacity"
                      />

                      {/* icon */}
                      <div
                        className={`
                        relative sm:w-8 sm:h-8 w-6 h-6 rounded-lg p-1.5 flex items-center justify-center
                        ${language === lang.id ? "bg-blue-500/10" : "bg-gray-800/50"}
                        group-hover:scale-110 transition-transform duration-200
                      `}
                      >
                        <Image
                          src={lang.logoPath}
                          alt={`${lang.label} logo`}
                          width={24}
                          height={24}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <span className="flex-1 text-left font-medium sm:text-sm text-xs tracking-wide">
                        {lang.label}
                      </span>

                      {/* active state indicator */}
                      {language === lang.id && (
                        <motion.div
                          layoutId="activeLanguage"
                          className="absolute inset-0 border-2 border-blue-500/30 rounded-lg"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}

                      {isLocked ? (
                        <Lock className="w-4 h-4 text-gray-500" />
                      ) : (
                        language === lang.id && (
                          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                        )
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
