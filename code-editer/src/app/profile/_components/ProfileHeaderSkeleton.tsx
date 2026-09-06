import { Skeleton } from "@/components/ui/skeleton";

const ProfileHeaderSkeleton = () => {
  return (
    <div className="relative mb-8 rounded-3xl bg-[#101018]/90 border border-gray-800/60 p-6 sm:p-8 overflow-hidden shadow-2xl">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-gray-800/60">
        <div className="flex items-center gap-6">
          {/* Avatar Skeleton */}
          <div className="relative">
            <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-800/80 border-4 border-gray-800/50" />
          </div>

          {/* User Meta Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-48 bg-gray-800/80 rounded-lg" />
            <Skeleton className="h-4 w-36 bg-gray-800/60 rounded" />
            <Skeleton className="h-3 w-28 bg-gray-800/40 rounded" />
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-32 bg-gray-800/80 rounded-xl flex-1 md:flex-none" />
          <Skeleton className="h-10 w-32 bg-blue-900/40 rounded-xl flex-1 md:flex-none" />
        </div>
      </div>

      {/* Language Bar Skeleton */}
      <div className="mt-6 space-y-2">
        <Skeleton className="h-3 w-36 bg-gray-800/60 rounded" />
        <Skeleton className="h-2.5 w-full bg-gray-800/80 rounded-full" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#13131f]/80 border border-gray-800/60 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 bg-gray-800/80 rounded" />
                <Skeleton className="h-8 w-16 bg-gray-800/80 rounded" />
              </div>
              <Skeleton className="w-11 h-11 rounded-2xl bg-gray-800/80" />
            </div>
            <div className="pt-3 border-t border-gray-800/60">
              <Skeleton className="h-4 w-32 bg-gray-800/40 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
