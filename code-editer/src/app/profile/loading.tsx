import ProfileHeaderSkeleton from "./_components/ProfileHeaderSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <ProfileHeaderSkeleton />
      </div>
    </div>
  );
}
