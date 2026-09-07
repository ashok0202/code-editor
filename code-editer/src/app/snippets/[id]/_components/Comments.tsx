"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { useSnippetComments } from "@/features/snippets/hooks/use-snippet-comments";
import { useAddComment } from "@/features/snippets/hooks/use-add-comment";
import { useDeleteComment } from "@/features/snippets/hooks/use-delete-comment";

function Comments({ snippetId }: { snippetId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: comments = [], isLoading } = useSnippetComments(snippetId);
  const addCommentMutation = useAddComment(snippetId);
  const deleteCommentMutation = useDeleteComment(snippetId);

  const handleSubmitComment = async (content: string) => {
    if (!session?.user?.id) {
      toast.add({
        title: "Sign in required",
        description: "Please sign in to join the discussion.",
        type: "error",
      });
      return;
    }

    addCommentMutation.mutate(content);
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  return (
    <div className="bg-[#121218]/90 border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl">
      <div className="px-6 sm:px-8 py-5 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span>Discussion</span>
        </h2>

        <span className="inline-flex items-center px-3 py-1 bg-white/[0.05] border border-white/[0.08] text-slate-300 rounded-full text-xs font-mono font-medium">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      <div className="p-6 sm:p-8">
        {status === "loading" ? (
          <div className="mb-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-3 text-sm text-slate-400 animate-pulse">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span>Checking authentication...</span>
          </div>
        ) : session?.user ? (
          <CommentForm
            onSubmit={handleSubmitComment}
            isSubmitting={addCommentMutation.isPending}
          />
        ) : (
          <div className="bg-[#09090e] rounded-xl p-6 sm:p-8 text-center mb-8 border border-white/[0.08] shadow-inner">
            <p className="text-slate-300 font-medium mb-1">
              Join the conversation
            </p>
            <p className="text-slate-500 text-xs sm:text-sm mb-5">
              Sign in to share your thoughts, ask questions, or provide feedback on this snippet.
            </p>

            <Button
              type="button"
              onClick={() => router.push("/sign-in")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              Sign In to Comment
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-white/[0.02] border border-white/[0.05] rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 px-4 bg-white/[0.01] rounded-xl border border-dashed border-white/[0.08]">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-slate-400 mb-1">
                No comments yet
              </p>
              <p className="text-xs text-slate-500">
                Be the first to share a thought or suggest an improvement!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onDelete={handleDeleteComment}
                isDeleting={
                  deleteCommentMutation.isPending &&
                  deleteCommentMutation.variables === comment.id
                }
                currentUserId={session?.user?.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Comments;
