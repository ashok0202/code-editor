
import { getAuthsession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET ALL SNIPPETS
// Convex: getSnippets
// ============================================

export async function GET() {
  try {
    const snippets = await prisma.snippet.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(snippets);
  } catch (error) {
    console.error("GET snippets error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch snippets",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================
// CREATE SNIPPET
// Convex: createSnippet
// ============================================

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const { title, language, code } = body;

    if (!title || !language || !code) {
      return NextResponse.json(
        {
          message: "Title, language and code are required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

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

    const snippet = await prisma.snippet.create({
      data: {
        userId: user.id,
        userName: user.name ?? "Anonymous",
        title,
        language,
        code,
      },
    });

    return NextResponse.json(
      snippet,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE snippet error:", error);

    return NextResponse.json(
      {
        message: "Failed to create snippet",
      },
      {
        status: 500,
      }
    );
  }
}