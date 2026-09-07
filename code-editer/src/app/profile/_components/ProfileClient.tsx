"use client";

import { useProfile } from "@/features/profile/hooks/use-profile";
import { UserProfileResponse } from "@/types/profile";
import ProfileHeader from "./profileHeader";
import ProfileContent from "./ProfileContent";
import NavigationHeader from "@/components/NavigationHeader";

export default function ProfileClient({
  initialProfile,
}: {
  initialProfile: UserProfileResponse;
}) {
  const { data = initialProfile } = useProfile(initialProfile);

  return (
    <>
      <NavigationHeader />
      <div className="min-h-screen bg-[#09090b] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <ProfileHeader
            userStats={data.userStats}
            userData={{
              id: data.userData.id,
              createdAt: new Date(data.userData.createdAt),
              proSince: data.userData.proSince,
              name: data.userData.name,
              email: data.userData.email,
              isPro: data.userData.isPro,
            }}
            user={{
              image: data.userData.image,
            }}
            starredSnippets={data.starredSnippets}
          />

          <ProfileContent
            initialMySnippets={data.mySnippets}
            initialStarredSnippets={data.starredSnippets}
            executions={data.executions}
          />
        </div>
      </div>
    </>
  );
}
