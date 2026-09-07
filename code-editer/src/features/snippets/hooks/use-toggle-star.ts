import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSnippetStar } from "@/services/snippet-service";
import { snippetKeys } from "../query-keys";
import { profileKeys } from "@/features/profile/query-keys";
import { toast } from "@/components/ui/toast";
import { SnippetStarInfo } from "@/types/snippet";

export function useToggleSnippetStar(snippetId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleSnippetStar(snippetId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: snippetKeys.star(snippetId),
      });

      const previousStar = queryClient.getQueryData<SnippetStarInfo>(
        snippetKeys.star(snippetId)
      );

      if (previousStar) {
        queryClient.setQueryData<SnippetStarInfo>(
          snippetKeys.star(snippetId),
          {
            starred: !previousStar.starred,
            count: previousStar.starred
              ? Math.max(previousStar.count - 1, 0)
              : previousStar.count + 1,
          }
        );
      }

      return { previousStar };
    },
    onError: (error: unknown, _variables: void, context?: { previousStar?: SnippetStarInfo }) => {
      if (context?.previousStar) {
        queryClient.setQueryData(
          snippetKeys.star(snippetId),
          context.previousStar
        );
      }

      toast.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update star",
        type: "error",
      });
    },
    onSuccess: (serverStarInfo: SnippetStarInfo) => {
      if (serverStarInfo) {
        queryClient.setQueryData(
          snippetKeys.star(snippetId),
          serverStarInfo
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: snippetKeys.star(snippetId),
      });
      queryClient.invalidateQueries({
        queryKey: snippetKeys.starred(),
      });
      queryClient.invalidateQueries({
        queryKey: profileKeys.all,
      });
    },
  });
}

