"use client";

import { useMemo, useState } from "react";

import MainLayout from "@/atomics/templates/MainLayout";
import { AppHeader } from "@/domains/workspace/components/AppHeader";
import { AppSidebar } from "@/domains/workspace/components/AppSidebar";
import { CreateWorkspaceDialog } from "@/domains/workspace/components/CreateWorkspaceDialog";
import { WorkspaceSkeleton } from "@/domains/workspace/components/WorkspaceSkeleton";
import { WorkspaceCard } from "@/domains/workspace/components/list/WorkspaceCard";
import { WorkspaceEmptyState } from "@/domains/workspace/components/list/WorkspaceEmptyState";
import { WorkspaceErrorState } from "@/domains/workspace/components/list/WorkspaceErrorState";
import { WorkspaceNoResults } from "@/domains/workspace/components/list/WorkspaceNoResults";
import { WorkspaceRow } from "@/domains/workspace/components/list/WorkspaceRow";
import { WorkspaceToolbar } from "@/domains/workspace/components/list/WorkspaceToolbar";
import { useWorkspaceList } from "@/domains/workspace/hooks/useWorkspaceList";
import type { Workspace } from "@/domains/workspace/types";
import { filterWorkspaces } from "@/domains/workspace/utils/display";

type WorkspaceClientProps = {
  initialData?: Workspace[];
};

type ViewMode = "grid" | "list";

const EMPTY_WORKSPACES: Workspace[] = [];

export function WorkspaceClient({ initialData }: WorkspaceClientProps) {
  const { data, isPending, isError, refetch } = useWorkspaceList({ initialData });
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const workspaces = data ?? EMPTY_WORKSPACES;
  const filteredWorkspaces = useMemo(() => filterWorkspaces(workspaces, query), [query, workspaces]);
  const showEmpty = !isPending && !isError && workspaces.length === 0;
  const showNoResults = !isPending && !isError && workspaces.length > 0 && filteredWorkspaces.length === 0;

  if (isPending && workspaces.length === 0) {
    return <WorkspaceSkeleton />;
  }

  return (
    <MainLayout
      header={<AppHeader workspace={{ name: "Workspace" }} />}
      sidebar={<AppSidebar />}
      contentClassName="bg-background"
    >
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4">
          <WorkspaceToolbar
            query={query}
            viewMode={viewMode}
            onCreate={() => setIsCreateOpen(true)}
            onQueryChange={setQuery}
            onViewModeChange={setViewMode}
          />

          {isError && <WorkspaceErrorState onRetry={() => refetch()} />}
          {showEmpty && <WorkspaceEmptyState onCreate={() => setIsCreateOpen(true)} />}
          {showNoResults && <WorkspaceNoResults />}

          {filteredWorkspaces.length > 0 && viewMode === "grid" && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredWorkspaces.map(workspace => (
                <WorkspaceCard
                  key={workspace.workspaceId}
                  workspace={workspace}
                />
              ))}
            </div>
          )}

          {filteredWorkspaces.length > 0 && viewMode === "list" && (
            <div className="flex flex-col gap-2">
              {filteredWorkspaces.map(workspace => (
                <WorkspaceRow
                  key={workspace.workspaceId}
                  workspace={workspace}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CreateWorkspaceDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </MainLayout>
  );
}
