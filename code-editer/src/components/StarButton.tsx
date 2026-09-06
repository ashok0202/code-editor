"use client";

import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "./ui/toast";

interface StarButtonProps {
  snippetId: string;
}

function StarButton({ snippetId }: StarButtonProps) {
  const { data: session } = useSession();

  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchStarInfo = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/snippets/${snippetId}/star`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch star information");
      }

      setIsStarred(result.starred);
      setStarCount(result.count);
    } catch (error) {
      console.error("Error fetching star info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStarInfo();
  }, [snippetId]);

  const handleStar = async (event: React.MouseEvent<HTMLButtonElement>) => {
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

    try {
      setIsUpdating(true);

      const response = await fetch(`/api/snippets/${snippetId}/star`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update star");
      }

      setIsStarred(result.starred);

      setStarCount((prev) =>
        result.starred ? prev + 1 : Math.max(prev - 1, 0),
      );
    } catch (error) {
      console.error("Error updating star:", error);
      toast.add({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update star",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading || isUpdating}
      onClick={handleStar}
      className={`
        group
        flex items-center gap-1.5
        px-3 py-1.5
        rounded-lg
        transition-all duration-200

        ${
          isStarred
            ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
            : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
        }

        ${isUpdating ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <Star
        className={`
          w-4 h-4
          transition-all
          ${
            isStarred
              ? "fill-yellow-500 text-yellow-500"
              : "fill-none group-hover:fill-gray-400"
          }
        `}
      />

      <span
        className={`text-xs font-medium ${
          isStarred ? "text-yellow-500" : "text-gray-400"
        }`}
      >
        {isLoading ? "..." : starCount}
      </span>
    </button>
  );
}

export default StarButton;
