import { useQuery } from "@tanstack/react-query";
import { snippetKeys } from "../query-keys";
import { getSnippets } from "@/services/snippet-service";
import { Snippet } from "@/types/snippet";

export function useSnippets(initialData?: Snippet[]) {
  return useQuery({
    queryKey: snippetKeys.list(),
    queryFn: getSnippets,
    initialData,
  });
}
