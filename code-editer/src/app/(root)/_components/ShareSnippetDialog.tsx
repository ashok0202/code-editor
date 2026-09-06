"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCodeEditorStore } from "@/app/store/useCodeEditorStore";
import { toast } from "@/components/ui/toast";
import {
  Code2,
  FileCode,
  Loader2,
  Share2,
  Sparkles,
  Terminal,
} from "lucide-react";

interface ShareSnippetDialogProps {
  open?: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
}

export default function ShareSnippetDialog({
  open,
  onClose,
}: ShareSnippetDialogProps) {
  const { language, getCode } = useCodeEditorStore();
  const currentCode = getCode();
  const lineCount = currentCode ? currentCode.split("\n").length : 0;
  const charCount = currentCode ? currentCode.length : 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
    },
  });

  const handleShare = async (data: FormData) => {
    try {
      const code = getCode();

      if (!code.trim()) {
        toast.add({
          title: "Error",
          description: "Code cannot be empty",
          type: "error",
        });
        return;
      }

      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title.trim(),
          language,
          code,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to share snippet");
      }

      toast.add({
        title: "Snippet Published!",
        description: "Your code snippet has been shared with the community.",
        type: "success",
      });

      reset();
      onClose();
    } catch (error) {
      console.error("Error creating snippet:", error);

      toast.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error creating snippet",
        type: "error",
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#101018]/95 border border-gray-800/80 text-white rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Background Decorative Gradient Blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <DialogHeader className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-linear-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Share Code Snippet
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-400">
                Publish your code snippet to the community library.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Snippet Preview Meta Badge */}
        <div className="relative z-10 my-4 p-3 rounded-xl bg-[#141422]/90 border border-gray-800/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 font-bold uppercase text-[11px] bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-md">
              {language}
            </span>
            <span className="text-gray-400 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-gray-500" />
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
          </div>
          <span className="text-gray-500 text-[11px] font-mono">
            {charCount} chars
          </span>
        </div>

        {/* Code Preview Box */}
        {currentCode && (
          <div className="relative z-10 mb-5 rounded-xl border border-gray-800/80 bg-[#09090f] p-3 text-xs font-mono text-gray-300 max-h-32 overflow-y-auto">
            <pre className="whitespace-pre-wrap opacity-85">
              {currentCode.split("\n").slice(0, 5).join("\n")}
              {lineCount > 5 && "\n..."}
            </pre>
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(handleShare)}
          className="relative z-10 space-y-5"
        >
          <FieldGroup>
            <Field className="space-y-2">
              <Label
                htmlFor="title"
                className="text-xs font-semibold text-gray-300 flex items-center gap-1.5"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                Snippet Title
              </Label>

              <Input
                id="title"
                placeholder="e.g., Fast Binary Search Algorithm"
                className="w-full px-4 py-2.5 bg-[#161625] border border-gray-800 focus:ring-2 focus:ring-blue-500/20 text-white rounded-xl text-sm transition-all outline-none"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />

              {errors.title && (
                <p className="text-xs font-medium text-red-400 flex items-center gap-1 pt-1">
                  {errors.title.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          {/* Footer Actions */}
          <DialogFooter className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800/60">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              className="px-4 py-2 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/60 text-gray-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Snippet</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
