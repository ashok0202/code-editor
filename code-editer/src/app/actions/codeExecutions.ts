"use server";

import { prisma } from "@/lib/prisma";
import { getAuthsession } from "@/lib/auth";

export async function saveExecution({
  language,
  code,
  output,
  error,
}: {
  language: string;
  code: string;
  output?: string;
  error?: string;
}) {
  const session = await getAuthsession();
  if (!session || !session.user) throw new Error("Not authenticated");

  // check pro status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) throw new Error("User not found");

  if (!user.isPro && language !== "javascript") {
    throw new Error("Pro subscription required to use this language");
  }

  await prisma.codeExecution.create({
    data: {
      language,
      code,
      output,
      error,
      userId: session.user.id,
    },
  });
}

export async function getUserExecutions({
  userId,
  page = 1,
  limit = 10,
}: {
  userId: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;
  const executions = await prisma.codeExecution.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  const total = await prisma.codeExecution.count({
    where: { userId },
  });

  return {
    page: executions,
    isDone: skip + executions.length >= total,
  };
}

export async function getUserStats({ userId }: { userId: string }) {
  const executions = await prisma.codeExecution.findMany({
    where: { userId },
  });

  // Get starred snippets
  const starredSnippets = await prisma.star.findMany({
    where: { userId },
    include: {
      snippet: true,
    },
  });

  // Calculate most starred language
  const starredLanguages = starredSnippets.reduce(
    (acc, curr) => {
      const language = curr.snippet?.language;
      if (language) {
        acc[language] = (acc[language] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const mostStarredLanguage =
    Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A";

  // Calculate execution stats
  const last24Hours = executions.filter(
    (e) => e.createdAt.getTime() > Date.now() - 24 * 60 * 60 * 1000
  ).length;

  const languageStats = executions.reduce(
    (acc, curr) => {
      acc[curr.language] = (acc[curr.language] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const languages = Object.keys(languageStats);
  const favoriteLanguage = languages.length
    ? languages.reduce((a, b) => (languageStats[a] > languageStats[b] ? a : b))
    : "N/A";

  return {
    totalExecutions: executions.length,
    languagesCount: languages.length,
    languages: languages,
    last24Hours,
    favoriteLanguage,
    languageStats,
    mostStarredLanguage,
  };
}
