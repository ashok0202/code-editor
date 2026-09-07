import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { profileKeys } from "../query-keys";
import { getProfileData } from "@/services/profile-service";
import { UserProfileResponse } from "@/types/profile";

export function useProfile(initialData?: UserProfileResponse) {
  const { status } = useSession();

  return useQuery({
    queryKey: profileKeys.all,
    queryFn: getProfileData,
    initialData,
    enabled: status === "authenticated",
  });
}
