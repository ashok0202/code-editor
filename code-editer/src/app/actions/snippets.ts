"use server";

import { prisma } from "@/lib/prisma";
import { getAuthsession } from "@/lib/auth";

export async function createSnippet({
  title,
  language,
  code,
}: {
  title: string;
  language: string;
  code: string;
}) {
  const session = await getAuthsession();
  if (!session || !session.user) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) throw new Error("User not found");

  const snippet = await prisma.snippet.create({
    data: {
      userId: session.user.id,
      userName: user.name || "Anonymous",
      title,
      language,
      code,
    },
  });

  return snippet.id;
}

export async function deleteSnippet({ snippetId }: { snippetId: string }) {
  const session = await getAuthsession();
  if (!session || !session.user) throw new Error("Not authenticated");

  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
  });
  if (!snippet) throw new Error("Snippet not found");

  if (snippet.userId !== session.user.id) {
    throw new Error("Not authorized to delete this snippet");
  }

  // Because cascade delete is set on the relations, deleting the snippet
  // will automatically delete all related stars and snippetComments.
  await prisma.snippet.delete({
    where: { id: snippetId },
  });
}

export async function starSnippet({ snippetId }: { snippetId: string }) {
  const session = await getAuthsession();
  if (!session || !session.user) throw new Error("Not authenticated");

  const existing = await prisma.star.findUnique({
    where: {
      userId_snippetId: {
        userId: session.user.id,
        snippetId,
      },
    },
  });

  if (existing) {
    await prisma.star.delete({
      where: {
        id: existing.id,
      },
    });
  } else {
    await prisma.star.create({
      data: {
        userId: session.user.id,
        snippetId,
      },
    });
  }
}

export async function addComment({
  snippetId,
  content,
}: {
  snippetId: string;
  content: string;
}) {
  const session = await getAuthsession();
  if (!session || !session.user) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) throw new Error("User not found");

  return await prisma.snippetComment.create({
    data: {
      snippetId,
      userId: session.user.id,
      userName: user.name || "Anonymous",
      content,
    },
  });
}

export async function deleteComment({ commentId }: { commentId: string }) {
  const session = await getAuthsession();
  if (!session || !session.user) throw new Error("Not authenticated");

  const comment = await prisma.snippetComment.findUnique({
    where: { id: commentId },
  });
  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== session.user.id) {
    throw new Error("Not authorized to delete this comment");
  }

  await prisma.snippetComment.delete({
    where: { id: commentId },
  });
}

export async function getSnippets() {
  return await prisma.snippet.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSnippetById({ snippetId }: { snippetId: string }) {
  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
  });
  if (!snippet) throw new Error("Snippet not found");

  return snippet;
}

export async function getComments({ snippetId }: { snippetId: string }) {
  return await prisma.snippetComment.findMany({
    where: { snippetId },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function isSnippetStarred({ snippetId }: { snippetId: string }) {
  const session = await getAuthsession();
  if (!session || !session.user) return false;

  const star = await prisma.star.findUnique({
    where: {
      userId_snippetId: {
        userId: session.user.id,
        snippetId,
      },
    },
  });

  return !!star;
}

export async function getSnippetStarCount({ snippetId }: { snippetId: string }) {
  return await prisma.star.count({
    where: { snippetId },
  });
}

export async function getStarredSnippets() {
  const session = await getAuthsession();
  if (!session || !session.user) return [];

  const stars = await prisma.star.findMany({
    where: { userId: session.user.id },
    include: {
      snippet: true,
    },
  });

  return stars.map((star) => star.snippet);
}
