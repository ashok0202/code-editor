
import { getAuthsession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    snippetId: string;
    commentId: string;
  }>;
};

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

    const { snippetId, commentId } = await params;

    const comment = await prisma.snippetComment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return NextResponse.json(
        {
          message: "Comment not found",
        },
        {
          status: 404,
        }
      );
    }

    if (comment.snippetId !== snippetId) {
      return NextResponse.json(
        {
          message: "Comment does not belong to this snippet",
        },
        {
          status: 400,
        }
      );
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        {
          message: "Not authorized to delete this comment",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.snippetComment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE comment error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete comment",
      },
      {
        status: 500,
      }
    );
  }
}