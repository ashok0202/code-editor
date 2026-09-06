import { Suspense } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { prisma } from "@/lib/prisma";
import { Snippet } from "@/types";
import Snippets from "./Snippets";
import SnippetsPageSkeleton from "./_components/SnippetsPageSkeleton";

export const revalidate = 0;

export default async function SnippetsPage() {
  const snippetsRaw = await prisma.snippet.findMany({
    include: {
      comments: true,
      stars: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const snippets: Snippet[] = snippetsRaw.map((snippet) => ({
    id: snippet.id,
    title: snippet.title,
    language: snippet.language,
    code: snippet.code,
    userId: snippet.userId,
    userName: snippet.userName,
    createdAt: snippet.createdAt.toISOString(),
    updatedAt: snippet.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <NavigationHeader />
      <Suspense fallback={<SnippetsPageSkeleton />}>
        <Snippets initialSnippets={snippets} />
      </Suspense>
    </div>
  );
}
