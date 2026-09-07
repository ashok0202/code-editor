import { getAuthsession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserStats } from "@/app/actions/codeExecutions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getAuthsession();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch full user data from DB
    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userData) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch user stats
    const userStats = await getUserStats({ userId });

    // Fetch user's own snippets
    const mySnippetsRaw = await prisma.snippet.findMany({
      where: { userId },
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
      where: { userId },
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

    // Fetch code executions (limit 50)
    const executionsRaw = await prisma.codeExecution.findMany({
      where: { userId },
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

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { message: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
