import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSnippet } from "@/services/snippet-service";
import { snippetKeys } from "../query-keys";
import { toast } from "@/components/ui/toast";
import { CreateSnippetPayload } from "@/types/snippet";

export function useCreateSnippet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSnippetPayload) => createSnippet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: snippetKeys.lists(),
      });

      toast.add({
        title: "Snippet Published!",
        description: "Your code snippet has been shared with the community.",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to publish snippet.",
        type: "error",
      });
    },
  });
}
