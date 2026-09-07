import { UserProfileResponse } from "@/types/profile";

export async function getProfileData(): Promise<UserProfileResponse> {
  const response = await fetch("/api/profile", { cache: "no-store" });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch profile data");
  }

  return data as UserProfileResponse;
}
