"use client";

import { useMemo, useState } from "react";
import { Code2, Star } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDeleteSnippet } from "@/features/snippets/hooks/use-delete-snippet";
import ProfileTabs from "./ProfileTabs";
import SnippetCard, { SnippetItem } from "./SnippetCard";
import ExecutionCard, { ExecutionItem } from "./ExecutionCard";
import EmptyState from "./EmptyState";

interface ProfileContentProps {
  initialMySnippets: SnippetItem[];
  initialStarredSnippets: SnippetItem[];
  executions: ExecutionItem[];
}

export default function ProfileContent({
  initialMySnippets,
  initialStarredSnippets,
  executions,
}: ProfileContentProps) {
  const mySnippets = initialMySnippets;
  const starredSnippets = initialStarredSnippets;
  const deleteSnippetMutation = useDeleteSnippet();

  // Interactive UI state
  const [activeTab, setActiveTab] = useState("my-snippets");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [executionStatus, setExecutionStatus] = useState<
    "all" | "success" | "error"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Extract all unique languages from snippets and executions
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    mySnippets.forEach((s) => langs.add(s.language.toLowerCase()));
    starredSnippets.forEach((s) => langs.add(s.language.toLowerCase()));
    executions.forEach((e) => langs.add(e.language.toLowerCase()));
    return Array.from(langs);
  }, [mySnippets, starredSnippets, executions]);

  const handleDelete = (snippetId: string) => {
    if (confirm("Are you sure you want to delete this snippet?")) {
      deleteSnippetMutation.mutate(snippetId);
    }
  };

  // Filtered lists
  const filteredMySnippets = useMemo(() => {
    return mySnippets.filter((snippet) => {
      const matchesSearch =
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.language.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLang =
        selectedLanguage === "all" ||
        snippet.language.toLowerCase() === selectedLanguage;
      return matchesSearch && matchesLang;
    });
  }, [mySnippets, searchQuery, selectedLanguage]);

  const filteredStarredSnippets = useMemo(() => {
    return starredSnippets.filter((snippet) => {
      const matchesSearch =
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.language.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLang =
        selectedLanguage === "all" ||
        snippet.language.toLowerCase() === selectedLanguage;
      return matchesSearch && matchesLang;
    });
  }, [starredSnippets, searchQuery, selectedLanguage]);

  const filteredExecutions = useMemo(() => {
    return executions.filter((exec) => {
      const matchesSearch =
        exec.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exec.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exec.output &&
          exec.output.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (exec.error &&
          exec.error.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLang =
        selectedLanguage === "all" ||
        exec.language.toLowerCase() === selectedLanguage;
      const matchesStatus =
        executionStatus === "all" ||
        (executionStatus === "success" && !exec.error) ||
        (executionStatus === "error" && Boolean(exec.error));
      return matchesSearch && matchesLang && matchesStatus;
    });
  }, [executions, searchQuery, selectedLanguage, executionStatus]);

  return (
    <div className="mt-8 space-y-6">
      <Tabs
        defaultValue="my-snippets"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        {/* Navigation & Controls Bar Sub-component */}
        <ProfileTabs
          activeTab={activeTab}
          mySnippetsCount={mySnippets.length}
          starredCount={starredSnippets.length}
          executionsCount={executions.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          executionStatus={executionStatus}
          onExecutionStatusChange={setExecutionStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* My Snippets Tab Content */}
        <TabsContent value="my-snippets" className="mt-6">
          {filteredMySnippets.length === 0 ? (
            <EmptyState
              icon={<Code2 className="w-10 h-10" />}
              iconBgColor="bg-blue-500/10 text-blue-400 border-blue-500/20"
              title="No snippets found"
              description={
                searchQuery || selectedLanguage !== "all"
                  ? "No snippets match your current search and language filters. Try clearing your search filters."
                  : "You haven't saved or shared any code snippets yet. Create your first snippet in the code editor!"
              }
              actionText="Create Snippet Now"
              actionHref="/"
            />
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredMySnippets.map((snippet) => (
                <div key={snippet.id}>
                  <SnippetCard
                    snippet={snippet}
                    viewMode={viewMode}
                    isMySnippet
                    onDelete={handleDelete}
                    isDeleting={
                      deleteSnippetMutation.isPending &&
                      deleteSnippetMutation.variables === snippet.id
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Starred Snippets Tab Content */}
        <TabsContent value="starred" className="mt-6">
          {filteredStarredSnippets.length === 0 ? (
            <EmptyState
              icon={<Star className="w-10 h-10" />}
              iconBgColor="bg-amber-500/10 text-amber-400 border-amber-500/20"
              title="No starred snippets"
              description={
                searchQuery || selectedLanguage !== "all"
                  ? "No starred snippets match your search query."
                  : "Explore public snippets shared by the community and give them a star to save them here."
              }
            />
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredStarredSnippets.map((snippet) => (
                <div key={snippet.id}>
                  <SnippetCard snippet={snippet} viewMode={viewMode} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Executions Tab Content */}
        <TabsContent value="executions" className="mt-6">
          {filteredExecutions.length === 0 ? (
            <EmptyState
              icon={<Code2 className="w-10 h-10" />}
              iconBgColor="bg-purple-500/10 text-purple-400 border-purple-500/20"
              title="No code executions found"
              description={
                searchQuery ||
                selectedLanguage !== "all" ||
                executionStatus !== "all"
                  ? "No execution logs match your current search or status filter."
                  : "Run code inside the online editor to generate execution history logs here!"
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredExecutions.map((exec) => (
                <div key={exec.id}>
                  <ExecutionCard exec={exec} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
