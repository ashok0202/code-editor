import { useQuery } from "@tanstack/react-query";
import { snippetKeys } from "../query-keys";
import { getSnippetStarInfo } from "@/services/snippet-service";

export function useSnippetStar(snippetId: string) {
  return useQuery({
    queryKey: snippetKeys.star(snippetId),
    queryFn: () => getSnippetStarInfo(snippetId),
    enabled: Boolean(snippetId),
  });
}
