export interface Snippet {
  id: string;
  userId: string;
  userName: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface SnippetComment {
  id: string;
  snippetId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface SnippetStarInfo {
  starred: boolean;
  count: number;
}

export interface CreateSnippetPayload {
  title: string;
  language: string;
  code: string;
}
