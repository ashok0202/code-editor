"use client";
import React, { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import useMounted from "@/app/hooks/useMounted";
import { useCodeEditorStore } from "@/app/store/useCodeEditorStore";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Editor } from "@monaco-editor/react";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import ShareSnippetDialog from "./ShareSnippetDialog";

const EditorPanel: React.FC = () => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } =
    useCodeEditorStore();

  const mounted = useMounted();

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(Number.parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  if (!mounted) return null;
  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/5 p-3 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5 shrink-0">
              <Image
                src={"/" + language + ".png"}
                alt="Logo"
                width={24}
                height={24}
                className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
              />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-white">
                Code Editor
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                Write and execute your code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Font Size Slider */}
            <div
              title="Font Size"
              className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5"
            >
              <TypeIcon className="size-3.5 sm:size-4 text-gray-400 shrink-0" />
              <div className="flex items-center gap-1.5 sm:gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(Number.parseInt(e.target.value))
                  }
                  className="w-12 sm:w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-medium text-gray-400 min-w-5 sm:min-w-8 text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
              title="Reset code"
            >
              <RotateCcwIcon className="size-3.5 sm:size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpen(true)}
              title="Share Snippet"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg overflow-hidden bg-linear-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-3.5 sm:size-4 text-white" />
              <span className="text-xs sm:text-sm font-medium text-white hidden sm:inline">
                Share
              </span>
            </motion.button>
          </div>
        </div>

        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/5 h-112.5 sm:h-150">
          {true && (
            <Editor
              height="100%"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
          )}

          {false && <EditorPanelSkeleton />}
        </div>
      </div>
      {isShareDialogOpen && (
        <ShareSnippetDialog
          open={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default EditorPanel;
