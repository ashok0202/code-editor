import {
  Snippet,
  SnippetComment,
  SnippetStarInfo,
  CreateSnippetPayload,
} from "@/types/snippet";

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data as T;
}

export async function getSnippets(): Promise<Snippet[]> {
  return apiFetch<Snippet[]>("/api/snippets", { cache: "no-store" });
}

export async function getSnippetById(snippetId: string): Promise<Snippet> {
  return apiFetch<Snippet>(`/api/snippets/${snippetId}`, { cache: "no-store" });
}

export async function createSnippet(
  payload: CreateSnippetPayload
): Promise<Snippet> {
  return apiFetch<Snippet>("/api/snippets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteSnippet(
  snippetId: string
): Promise<{ message?: string }> {
  return apiFetch<{ message?: string }>(`/api/snippets/${snippetId}`, {
    method: "DELETE",
  });
}

export async function getSnippetStarInfo(
  snippetId: string
): Promise<SnippetStarInfo> {
  return apiFetch<SnippetStarInfo>(`/api/snippets/${snippetId}/star`, {
    cache: "no-store",
  });
}

export async function toggleSnippetStar(
  snippetId: string
): Promise<SnippetStarInfo> {
  return apiFetch<SnippetStarInfo>(`/api/snippets/${snippetId}/star`, {
    method: "POST",
  });
}

export async function getComments(
  snippetId: string
): Promise<SnippetComment[]> {
  return apiFetch<SnippetComment[]>(`/api/snippets/${snippetId}/comments`, {
    cache: "no-store",
  });
}

export async function addComment(
  snippetId: string,
  content: string
): Promise<SnippetComment> {
  return apiFetch<SnippetComment>(`/api/snippets/${snippetId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(
  snippetId: string,
  commentId: string
): Promise<{ message?: string }> {
  return apiFetch<{ message?: string }>(
    `/api/snippets/${snippetId}/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );
}

export async function getStarredSnippets(): Promise<Snippet[]> {
  return apiFetch<Snippet[]>("/api/snippets/starred", {
    cache: "no-store",
  });
}
