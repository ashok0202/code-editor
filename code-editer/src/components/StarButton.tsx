"use client";

import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { toast } from "./ui/toast";
import { useSnippetStar } from "@/features/snippets/hooks/use-snippet-star";
import { useToggleSnippetStar } from "@/features/snippets/hooks/use-toggle-star";

interface StarButtonProps {
  snippetId: string;
}

function StarButton({ snippetId }: StarButtonProps) {
  const { data: session } = useSession();
  const { data: starInfo, isLoading } = useSnippetStar(snippetId);
  const toggleStarMutation = useToggleSnippetStar(snippetId);

  const isStarred = starInfo?.starred ?? false;
  const starCount = starInfo?.count ?? 0;
  const isUpdating = toggleStarMutation.isPending;

  const handleStar = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!session?.user?.id) {
      toast.add({
        title: "Error",
        description: "You need to be logged in to star snippets",
        type: "error",
      });
      return;
    }

    if (isUpdating) return;

    toggleStarMutation.mutate();
  };

  return (
    <button
      type="button"
      disabled={isLoading || isUpdating}
      onClick={handleStar}
      className={`
        group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200 ease-out select-none
        border shadow-sm active:scale-95
        ${
          isStarred
            ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40 shadow-amber-500/5"
            : "bg-white/4 border-white/8 text-slate-400 hover:bg-white/8 hover:border-white/15 hover:text-slate-200"
        }
        ${isUpdating ? "opacity-70 cursor-wait" : "cursor-pointer"}
      `}
    >
      <Star
        className={`
          w-4 h-4 transition-transform duration-300 ease-spring
          ${
            isStarred
              ? "fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              : "fill-none text-slate-400 group-hover:text-amber-400 group-hover:scale-110"
          }
          ${isUpdating ? "animate-pulse" : ""}
        `}
      />

      <span className="font-mono text-xs font-semibold tracking-wide">
        {isLoading ? (
          <span className="inline-block w-4 h-3 bg-white/10 animate-pulse rounded" />
        ) : (
          starCount
        )}
      </span>
    </button>
  );
}

export default StarButton;
