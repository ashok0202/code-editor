import { getAuthsession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getAuthsession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const stars = await prisma.star.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        snippet: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const starredSnippets = stars.map((star) => ({
      id: star.snippet.id,
      title: star.snippet.title,
      language: star.snippet.language,
      code: star.snippet.code,
      userId: star.snippet.userId,
      userName: star.snippet.userName,
      createdAt: star.snippet.createdAt.toISOString(),
      updatedAt: star.snippet.updatedAt.toISOString(),
    }));

    return NextResponse.json(starredSnippets);
  } catch (error) {
    console.error("GET starred snippets error:", error);
    return NextResponse.json(
      { message: "Failed to fetch starred snippets" },
      { status: 500 }
    );
  }
}
