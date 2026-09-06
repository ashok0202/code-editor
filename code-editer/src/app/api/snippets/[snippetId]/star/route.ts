
import { getAuthsession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    snippetId: string;
  }>;
};

// ============================================
// GET STAR INFORMATION
//
// Replaces:
// isSnippetStarred
// getSnippetStarCount
// ============================================

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { snippetId } = await params;
    const session = await getAuthsession();

    const starCount = await prisma.star.count({
      where: {
        snippetId,
      },
    });

    if (!session?.user?.id) {
      return NextResponse.json({
        starred: false,
        count: starCount,
      });
    }

    const existingStar = await prisma.star.findUnique({
      where: {
        userId_snippetId: {
          userId: session.user.id,
          snippetId,
        },
      },
    });

    return NextResponse.json({
      starred: Boolean(existingStar),
      count: starCount,
    });
  } catch (error) {
    console.error("GET star status error:", error);

    return NextResponse.json(
      {
        message: "Failed to get star information",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================
// TOGGLE STAR
// Convex: starSnippet
// ============================================

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getAuthsession();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const { snippetId } = await params;

    const snippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
      },
      select: {
        id: true,
      },
    });

    if (!snippet) {
      return NextResponse.json(
        {
          message: "Snippet not found",
        },
        {
          status: 404,
        }
      );
    }

    const existingStar = await prisma.star.findUnique({
      where: {
        userId_snippetId: {
          userId: session.user.id,
          snippetId,
        },
      },
    });

    if (existingStar) {
      await prisma.star.delete({
        where: {
          id: existingStar.id,
        },
      });

      return NextResponse.json({
        starred: false,
      });
    }

    await prisma.star.create({
      data: {
        userId: session.user.id,
        snippetId,
      },
    });

    return NextResponse.json({
      starred: true,
    });
  } catch (error) {
    console.error("TOGGLE star error:", error);

    return NextResponse.json(
      {
        message: "Failed to update star",
      },
      {
        status: 500,
      }
    );
  }
}