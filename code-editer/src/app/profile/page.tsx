
import { getAuthsession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserStats } from "@/app/actions/codeExecutions";
import ProfileHeader from "./_components/profileHeader";
import ProfileContent from "./_components/ProfileContent";

export default async function ProfilePage() {
  const session = await getAuthsession();
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  // Fetch full user data from DB
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!userData) {
    redirect("/sign-in");
  }

  // Fetch stats using existing helper action
  const userStats = await getUserStats({ userId: session.user.id });

  // Fetch user's own snippets
  const mySnippetsRaw = await prisma.snippet.findMany({
    where: { userId: session.user.id },
    include: {
      comments: true,
      stars: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch user's starred snippets
  const starredSnippetsRaw = await prisma.star.findMany({
    where: { userId: session.user.id },
    include: {
      snippet: {
        include: {
          comments: true,
          stars: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch executions (limit to last 50 for display)
  const executions = await prisma.codeExecution.findMany({
    where: { userId: session.user.id },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  // Format snippet items to fit the component interfaces
  const initialMySnippets = mySnippetsRaw.map((snippet) => ({
    id: snippet.id,
    userId: snippet.userId,
    title: snippet.title,
    language: snippet.language,
    code: snippet.code,
    userName: snippet.userName,
    createdAt: snippet.createdAt,
    comments: snippet.comments,
    stars: snippet.stars,
  }));

  const initialStarredSnippets = starredSnippetsRaw
    .map((star) => star.snippet)
    .filter(Boolean)
    .map((snippet) => ({
      id: snippet.id,
      userId: snippet.userId,
      title: snippet.title,
      language: snippet.language,
      code: snippet.code,
      userName: snippet.userName,
      createdAt: snippet.createdAt,
      comments: snippet.comments,
      stars: snippet.stars,
    }));

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <ProfileHeader
          userStats={userStats}
          userData={{
            id: userData.id,
            createdAt: userData.createdAt,
            proSince: userData.proSince,
            name: userData.name,
            email: userData.email,
            isPro: userData.isPro,
          }}
          user={{
            image: session.user.image,
          }}
          starredSnippets={initialStarredSnippets}
        />

        <ProfileContent
          initialMySnippets={initialMySnippets}
          initialStarredSnippets={initialStarredSnippets}
          executions={executions}
        />
      </div>
    </div>
  );
}
