"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface CommentType {
  id: string;
  snippetId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

function Comments({ snippetId }: { snippetId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );

  const fetchComments = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/snippets/${snippetId}/comments`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch comments");
      }

      setComments(result);
    } catch (error) {
      console.error("Error fetching comments:", error);

      toast.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load comments",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!snippetId) return;

    fetchComments();
  }, [snippetId]);

  const handleSubmitComment = async (content: string) => {
    if (!session?.user?.id) {
      toast.add({
        title: "Sign in required",
        description: "Please sign in to join the discussion.",
        type: "error",
      });

      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/snippets/${snippetId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add comment");
      }

      setComments((prev) => [result, ...prev]);

      toast.add({
        title: "Comment added",
        description: "Your comment was posted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding comment:", error);

      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while adding the comment.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeletingCommentId(commentId);

      const response = await fetch(
        `/api/snippets/${snippetId}/comments/${commentId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));

      toast.add({
        title: "Comment deleted",
        description: "Your comment was removed successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);

      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while deleting the comment.",
        type: "error",
      });
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discussion ({comments.length})
        </h2>
      </div>

      <div className="p-6 sm:p-8">
        {status === "loading" ? (
          <div className="mb-8 text-sm text-gray-500">
            Checking authentication...
          </div>
        ) : session?.user ? (
          <CommentForm
            onSubmit={handleSubmitComment}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="bg-[#0a0a0f] rounded-xl p-6 text-center mb-8 border border-[#ffffff0a]">
            <p className="text-[#808086] mb-4">
              Sign in to join the discussion
            </p>

            <Button
              type="button"
              onClick={() => router.push("/sign-in")}
              className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
            >
              Sign In
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500">
              No comments yet. Be the first to start the discussion.
            </p>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onDelete={handleDeleteComment}
                isDeleting={deletingCommentId === comment.id}
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
