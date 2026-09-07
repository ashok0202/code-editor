import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "@/services/snippet-service";
import { snippetKeys } from "../query-keys";
import { toast } from "@/components/ui/toast";
import { SnippetComment } from "@/types/snippet";

export function useAddComment(snippetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => addComment(snippetId, content),
    onSuccess: (createdComment) => {
      queryClient.setQueryData<SnippetComment[]>(
        snippetKeys.comments(snippetId),
        (old) => [createdComment, ...(old ?? [])]
      );

      toast.add({
        title: "Comment added",
        description: "Your comment was posted successfully.",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while adding comment.",
        type: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.comments(snippetId) });
    },
  });
}
