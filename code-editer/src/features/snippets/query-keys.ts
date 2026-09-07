export const snippetKeys = {
  all: ["snippets"] as const,

  lists: () => [...snippetKeys.all, "list"] as const,

  list: () => [...snippetKeys.lists()] as const,

  details: () => [...snippetKeys.all, "detail"] as const,

  detail: (snippetId: string) => [...snippetKeys.details(), snippetId] as const,

  comments: (snippetId: string) =>
    [...snippetKeys.detail(snippetId), "comments"] as const,

  star: (snippetId: string) =>
    [...snippetKeys.detail(snippetId), "star"] as const,

  starred: () => [...snippetKeys.all, "starred"] as const,
};
