"use client";

import { useCodeEditorStore } from "@/app/store/useCodeEditorStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { FileCode, Loader2, Share2, Sparkles, Terminal, LogIn } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useCreateSnippet } from "@/features/snippets/hooks/use-create-snippet";

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
  const { data: session } = useSession();
  const router = useRouter();
  const { language, getCode } = useCodeEditorStore();
  const currentCode = getCode();
  const lineCount = currentCode ? currentCode.split("\n").length : 0;
  const charCount = currentCode ? currentCode.length : 0;

  const createSnippetMutation = useCreateSnippet();

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

  const isPending = isSubmitting || createSnippetMutation.isPending;

  const handleShare = async (data: FormData) => {
    if (!session?.user) {
      toast.add({
        title: "Sign in required",
        description: "Please sign in to share snippets.",
        type: "error",
      });
      router.push("/sign-in");
      return;
    }

    const code = getCode();

    if (!code.trim()) {
      toast.add({
        title: "Error",
        description: "Code cannot be empty",
        type: "error",
      });
      return;
    }

    createSnippetMutation.mutate(
      {
        title: data.title.trim(),
        language,
        code,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
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
          <ScrollArea className="relative z-10 mb-5 rounded-xl border border-gray-800/80 bg-[#09090f] p-3 text-xs font-mono text-gray-300 h-32">
            <pre className="whitespace-pre-wrap opacity-85">
              {currentCode.split("\n").slice(0, 5).join("\n")}
              {lineCount > 5 && "\n..."}
            </pre>
          </ScrollArea>
        )}

        {/* Form Body or Unauthenticated state */}
        {!session?.user ? (
          <div className="relative z-10 p-6 rounded-2xl bg-[#0d0d15] border border-blue-500/20 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Sign In Required</h3>
              <p className="text-xs text-gray-400 mt-1">
                You need to be logged in to share code snippets with the community.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                className="px-4 py-2 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/60 text-gray-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/sign-in");
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In Now</span>
              </Button>
            </div>
          </div>
        ) : (
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
                disabled={isPending}
                className="px-5 py-2 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isPending ? (
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
        )}
      </DialogContent>
    </Dialog>
  );
}

