import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/services/snippet-service";
import { snippetKeys } from "../query-keys";
import { toast } from "@/components/ui/toast";
import { SnippetComment } from "@/types/snippet";

export function useDeleteComment(snippetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(snippetId, commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: snippetKeys.comments(snippetId),
      });

      const previousComments = queryClient.getQueryData<SnippetComment[]>(
        snippetKeys.comments(snippetId)
      );

      queryClient.setQueryData<SnippetComment[]>(
        snippetKeys.comments(snippetId),
        (old) => old?.filter((comment) => comment.id !== commentId)
      );

      return { previousComments };
    },
    onError: (error, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          snippetKeys.comments(snippetId),
          context.previousComments
        );
      }

      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while deleting comment.",
        type: "error",
      });
    },
    onSuccess: () => {
      toast.add({
        title: "Comment deleted",
        description: "Your comment was removed successfully.",
        type: "success",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: snippetKeys.comments(snippetId),
      });
    },
  });
}
