import { Trash2Icon, UserIcon } from "lucide-react";
import CommentContent from "./CommentContent";

interface CommentProps {
  comment: {
    id: string;
    createdAt: string;
    userId: string;
    userName: string;
    snippetId: string;
    content: string;
  };
  onDelete: (commentId: string) => void;
  isDeleting: boolean;
  currentUserId?: string;
}

function Comment({
  comment,
  currentUserId,
  isDeleting,
  onDelete,
}: CommentProps) {
  const userInitial = comment.userName
    ? comment.userName.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="group transition-all duration-200">
      <div className="bg-[#0b0b10] rounded-xl p-5 sm:p-6 border border-white/[0.07] hover:border-white/[0.14] transition-all duration-200 shadow-sm">
        <div className="flex items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/4">
          <div className="flex items-center gap-3">
            {/* User Avatar Circle */}
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-blue-400 font-mono">
                {userInitial}
              </span>
            </div>

            <div className="min-w-0">
              <span className="block text-slate-100 font-medium text-sm truncate">
                {comment.userName}
              </span>

              <span className="block text-xs text-slate-400 font-mono">
                {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {comment.userId === currentUserId && (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              disabled={isDeleting}
              className={`
                p-2 rounded-lg transition-all duration-200 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 active:scale-95
                ${
                  isDeleting
                    ? "opacity-60 cursor-wait bg-red-500/10"
                    : "opacity-80 sm:opacity-0 group-hover:opacity-100"
                }
              `}
              title="Delete comment"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              ) : (
                <Trash2Icon className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        <CommentContent content={comment.content} />
      </div>
    </div>
  );
}

export default Comment;
