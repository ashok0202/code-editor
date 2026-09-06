import { getAuthsession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    snippetId: string;
  }>;
};

// ============================================
// GET COMMENTS
// Convex: getComments
// ============================================

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { snippetId } = await params;

    const comments = await prisma.snippetComment.findMany({
      where: {
        snippetId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET comments error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch comments",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================
// ADD COMMENT
// Convex: addComment
// ============================================

export async function POST(
  request: NextRequest,
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

    const body = await request.json();

    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        {
          message: "Comment cannot be empty",
        },
        {
          status: 400,
        }
      );
    }

    const [user, snippet] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      }),

      prisma.snippet.findUnique({
        where: {
          id: snippetId,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

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

    const comment = await prisma.snippetComment.create({
      data: {
        snippetId,
        userId: user.id,
        userName: user.name ?? "Anonymous",
        content: content.trim(),
      },
    });

    return NextResponse.json(
      comment,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE comment error:", error);

    return NextResponse.json(
      {
        message: "Failed to create comment",
      },
      {
        status: 500,
      }
    );
  }
}