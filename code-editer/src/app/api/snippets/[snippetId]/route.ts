
import { getAuthsession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    snippetId: string;
  }>;
};

// ============================================
// GET SNIPPET BY ID
// Convex: getSnippetById
// ============================================

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { snippetId } = await params;

    const snippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
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

    return NextResponse.json(snippet);
  } catch (error) {
    console.error("GET snippet error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch snippet",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================
// DELETE SNIPPET
// Convex: deleteSnippet
// ============================================

export async function DELETE(
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

    if (snippet.userId !== session.user.id) {
      return NextResponse.json(
        {
          message: "Not authorized to delete this snippet",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.snippet.delete({
      where: {
        id: snippetId,
      },
    });

    return NextResponse.json({
      message: "Snippet deleted successfully",
    });
  } catch (error) {
    console.error("DELETE snippet error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete snippet",
      },
      {
        status: 500,
      }
    );
  }
}