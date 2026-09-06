import NavigationHeader from "@/components/NavigationHeader";
import { Skeleton } from "@/components/ui/skeleton";

function SnippetLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <main className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-300 mx-auto">
          {/* Skeleton Header */}
          <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 sm:p-8 mb-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-xl bg-gray-800/80" />
                <div>
                  <Skeleton className="h-8 w-48 bg-gray-800/80 rounded-lg mb-2" />
                  <div className="flex gap-4">
                    <Skeleton className="h-5 w-24 bg-gray-800/80 rounded" />
                    <Skeleton className="h-5 w-24 bg-gray-800/80 rounded" />
                  </div>
                </div>
              </div>
            </div>
            {/* Skeleton Code Editor */}
            <Skeleton className="h-[400px] w-full bg-gray-800/80 rounded-xl" />
          </div>

          {/* Skeleton Comments Section */}
          <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
            <Skeleton className="h-6 w-32 bg-gray-800/80 rounded mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-800/80" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 bg-gray-800/80 rounded" />
                    <Skeleton className="h-16 w-full bg-gray-800/80 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SnippetLoadingSkeleton;
