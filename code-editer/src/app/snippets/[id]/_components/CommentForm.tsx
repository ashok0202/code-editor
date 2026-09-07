import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CodeIcon, EyeIcon, Edit3Icon, SendIcon } from "lucide-react";
import CommentContent from "./CommentContent";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";

const commentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .min(2, "Comment must be at least 2 characters long"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentFormProps {
  onSubmit: (comment: string) => Promise<void>;
  isSubmitting: boolean;
}

function CommentForm({ isSubmitting, onSubmit }: CommentFormProps) {
  const [isPreview, setIsPreview] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const commentValue = watch("comment");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const currentVal = commentValue || "";
      const newVal =
        currentVal.substring(0, start) + "  " + currentVal.substring(end);
      setValue("comment", newVal, { shouldValidate: true });
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleFormSubmit = async (data: CommentFormValues) => {
    await onSubmit(data.comment);
    reset();
    setIsPreview(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-8">
      <Field>
        <div className="bg-[#09090e] rounded-xl border border-white/8 transition-all duration-200 overflow-hidden shadow-lg">
          {/* Comment form header with Mode Toggle */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/2 border-b border-white/6">
            <span className="text-xs font-mono text-slate-400 font-medium">
              {isPreview ? "Comment Preview" : "Write Comment"}
            </span>

            <div className="flex items-center gap-1 bg-white/4 p-1 rounded-lg border border-white/6">
              <button
                type="button"
                onClick={() => setIsPreview(false)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all font-medium select-none ${
                  !isPreview
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/4"
                }`}
              >
                <Edit3Icon className="w-3.5 h-3.5" />
                <span>Write</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPreview(true)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all font-medium select-none ${
                  isPreview
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/4"
                }`}
              >
                <EyeIcon className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          {/* Comment form body */}
          {isPreview ? (
            <div className="min-h-30 p-4 text-slate-200 bg-[#07070b]">
              {commentValue?.trim() ? (
                <CommentContent content={commentValue} />
              ) : (
                <p className="text-slate-500 text-sm italic">
                  Nothing to preview yet...
                </p>
              )}
            </div>
          ) : (
            <textarea
              {...register("comment")}
              onKeyDown={handleKeyDown}
              placeholder="Write your thoughts or code snippet here... (Markdown & ```code blocks supported)"
              className="w-full bg-[#07070b] border-0 text-slate-200 outline-none resize-none min-h-30 p-4 font-mono text-sm leading-relaxed"
            />
          )}

          {/* Comment Form Footer */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[#060608] border-t border-white/6">
            <div className="hidden sm:block text-xs text-slate-400 space-y-0.5">
              <div className="flex items-center gap-2">
                <CodeIcon className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono text-slate-300">
                  Format code using ```language
                </span>
              </div>
              <div className="text-slate-400/80 pl-5 text-[11px]">
                Tab key inserts indent • Markdown & code syntax highlighted
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !commentValue?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 ml-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <SendIcon className="w-4 h-4" />
                  <span>Post Comment</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {errors.comment && (
          <FieldError className="mt-1.5 text-xs text-red-400 px-1">
            {errors.comment.message}
          </FieldError>
        )}
      </Field>
    </form>
  );
}

export default CommentForm;
