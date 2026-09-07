# TanStack Query Snippet Migration - Walkthrough

Migrated the community snippet features to a production-grade **TanStack Query** architecture backed by Next.js App Router API routes, Prisma, NextAuth, and Shadcn UI.

## Summary of Changes

### 1. Global Infrastructure & Provider Setup
- **`src/lib/query-client.ts`**: Created `makeQueryClient()` and singleton `getQueryClient()` factory (`staleTime: 60s`, `gcTime: 30m`, `refetchOnWindowFocus: false`, `refetchOnReconnect: true`, `retry: 1` for queries, `retry: 0` for mutations).
- **`src/components/providers/query-provider.tsx`**: Client component wrapping `QueryClientProvider` and rendering `ReactQueryDevtools` in development mode.
- **`src/app/layout.tsx`**: Wrapped `RootLayout` with `<QueryProvider>` and removed unused Clerk imports.

### 2. Service Layer & Shared Types
- **`src/types/snippet.ts`**: Defined `Snippet`, `SnippetComment`, `SnippetStarInfo`, and `CreateSnippetPayload` with standard Prisma `id` and `createdAt` types (removed legacy Convex types).
- **`src/services/snippet-service.ts`**: Created typed API service with unified `apiFetch<T>` helper to normalize response errors across `getSnippets`, `getSnippetById`, `createSnippet`, `deleteSnippet`, `getSnippetStarInfo`, `toggleSnippetStar`, `getComments`, `addComment`, `deleteComment`, `getStarredSnippets`.

### 3. Query Key Factory & Custom Hooks
- **`src/features/snippets/query-keys.ts`**: Centralized `snippetKeys` object factory (`all`, `lists`, `list`, `details`, `detail`, `comments`, `star`, `starred`).
- **`src/features/snippets/hooks/`**:
  - `useSnippets()`
  - `useSnippet(snippetId)`
  - `useSnippetComments(snippetId)`
  - `useSnippetStar(snippetId)`
  - `useStarredSnippets()`
  - `useCreateSnippet()` (invalidates `snippetKeys.lists()`)
  - `useDeleteSnippet()` (optimistic list item removal)
  - `useAddComment(snippetId)` (prepends created comment to cache)
  - `useDeleteComment(snippetId)` (optimistic comment removal)
  - `useToggleSnippetStar(snippetId)` (optimistic star status & counter toggle)

### 4. Backend API Route Updates
- **`src/app/api/snippets/[snippetId]/star/route.ts`**: Updated `POST` toggle response to compute and return authoritative `{ starred: boolean, count: number }`.
- **`src/app/api/snippets/starred/route.ts`**: Created GET route to return snippets starred by the logged-in NextAuth user.

### 5. Component Migrations
- **`Snippets.tsx`**: Migrated from manual state loop to `useSnippets()`.
- **`SnippetCard.tsx`**: Migrated delete action to `useDeleteSnippet()` (eliminated `window.location.reload()`).
- **`StarButton.tsx`**: Migrated star state management to `useSnippetStar()` and `useToggleSnippetStar()`.
- **`SnippetDetailPage` (`page.tsx`)**: Migrated to `useSnippet()` and `useSnippetComments()`.
- **`Comments.tsx`**: Migrated comment list, addition, and deletion to `useSnippetComments`, `useAddComment`, and `useDeleteComment`.
- **`ShareSnippetDialog.tsx`**: Migrated snippet publishing to `useCreateSnippet()`.

## Verification Results

- **TypeScript Compilation**: `npx tsc --noEmit` executed with 0 errors.
- **Zero Page Reloads**: Removed `window.location.reload()` calls.
- **Auth & Session Safety**: All mutations rely on NextAuth server-side session checks (`getAuthsession()`).
