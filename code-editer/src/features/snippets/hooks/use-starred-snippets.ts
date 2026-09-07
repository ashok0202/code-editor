import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { snippetKeys } from "../query-keys";
import { getStarredSnippets } from "@/services/snippet-service";

export function useStarredSnippets() {
  const { status } = useSession();

  return useQuery({
    queryKey: snippetKeys.starred(),
    queryFn: getStarredSnippets,
    enabled: status === "authenticated",
  });
}
