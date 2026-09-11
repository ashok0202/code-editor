import { requireAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserStats } from "@/app/actions/codeExecutions";
import ProfileClient from "./_components/ProfileClient";
import { UserProfileResponse } from "@/types/profile";

export default async function ProfilePage() {
  const session = await requireAuthSession();


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

  // Fetch executions (limit 50)
  const executionsRaw = await prisma.codeExecution.findMany({
    where: { userId: session.user.id },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const mySnippets = mySnippetsRaw.map((snippet) => ({
    id: snippet.id,
    userId: snippet.userId,
    title: snippet.title,
    language: snippet.language,
    code: snippet.code,
    userName: snippet.userName,
    createdAt: snippet.createdAt.toISOString(),
    updatedAt: snippet.updatedAt.toISOString(),
    comments: snippet.comments,
    stars: snippet.stars,
  }));

  const starredSnippets = starredSnippetsRaw
    .map((star) => star.snippet)
    .filter(Boolean)
    .map((snippet) => ({
      id: snippet.id,
      userId: snippet.userId,
      title: snippet.title,
      language: snippet.language,
      code: snippet.code,
      userName: snippet.userName,
      createdAt: snippet.createdAt.toISOString(),
      updatedAt: snippet.updatedAt.toISOString(),
      comments: snippet.comments,
      stars: snippet.stars,
    }));

  const executions = executionsRaw.map((exec) => ({
    id: exec.id,
    userId: exec.userId,
    language: exec.language,
    code: exec.code,
    output: exec.output,
    error: exec.error,
    createdAt: exec.createdAt.toISOString(),
  }));

  const initialProfile: UserProfileResponse = {
    userData: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: session.user.image || null,
      isPro: userData.isPro,
      proSince: userData.proSince,
      createdAt: userData.createdAt.toISOString(),
    },
    userStats,
    mySnippets,
    starredSnippets,
    executions,
  };

  return <ProfileClient initialProfile={initialProfile} />;
}
