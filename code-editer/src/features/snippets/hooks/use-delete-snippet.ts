import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSnippet } from "@/services/snippet-service";
import { snippetKeys } from "../query-keys";
import { profileKeys } from "@/features/profile/query-keys";
import { toast } from "@/components/ui/toast";
import { Snippet } from "@/types/snippet";

export function useDeleteSnippet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (snippetId: string) => deleteSnippet(snippetId),
    onMutate: async (snippetId: string) => {
      await queryClient.cancelQueries({ queryKey: snippetKeys.lists() });

      const previousSnippets = queryClient.getQueryData<Snippet[]>(snippetKeys.list());

      queryClient.setQueryData<Snippet[]>(snippetKeys.list(), (old) =>
        old?.filter((s) => s.id !== snippetId)
      );

      return { previousSnippets };
    },
    onError: (error: unknown, _snippetId: string, context?: { previousSnippets?: Snippet[] }) => {
      if (context?.previousSnippets) {
        queryClient.setQueryData(snippetKeys.list(), context.previousSnippets);
      }

      toast.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete snippet.",
        type: "error",
      });
    },
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Snippet deleted successfully.",
        type: "success",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.lists() });
      queryClient.invalidateQueries({ queryKey: snippetKeys.starred() });
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

