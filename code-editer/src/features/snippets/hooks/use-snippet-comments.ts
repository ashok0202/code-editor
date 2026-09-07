import { useQuery } from "@tanstack/react-query";
import { snippetKeys } from "../query-keys";
import { getComments } from "@/services/snippet-service";

export function useSnippetComments(snippetId: string) {
  return useQuery({
    queryKey: snippetKeys.comments(snippetId),
    queryFn: () => getComments(snippetId),
    enabled: Boolean(snippetId),
  });
}
