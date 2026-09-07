import { useQuery } from "@tanstack/react-query";
import { snippetKeys } from "../query-keys";
import { getSnippetById } from "@/services/snippet-service";

export function useSnippet(snippetId: string) {
  return useQuery({
    queryKey: snippetKeys.detail(snippetId),
    queryFn: () => getSnippetById(snippetId),
    enabled: Boolean(snippetId),
  });
}
