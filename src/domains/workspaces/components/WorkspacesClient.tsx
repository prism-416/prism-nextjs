"use client";

import { useMemo, useState } from "react";

import { CreateWorkspaceDialog } from "@/domains/workspaces/components/CreateWorkspaceDialog";
import { WorkspacesSkeleton } from "@/domains/workspaces/components/WorkspacesSkeleton";
import { WorkspaceCard } from "@/domains/workspaces/components/list/WorkspaceCard";
import { WorkspaceEmptyState } from "@/domains/workspaces/components/list/WorkspaceEmptyState";
import { WorkspaceErrorState } from "@/domains/workspaces/components/list/WorkspaceErrorState";
import { WorkspaceNoResults } from "@/domains/workspaces/components/list/WorkspaceNoResults";
import { WorkspaceRow } from "@/domains/workspaces/components/list/WorkspaceRow";
import { WorkspaceToolbar, WorkspaceToolbarActions } from "@/domains/workspaces/components/list/WorkspaceToolbar";
import { useWorkspaces } from "@/domains/workspaces/hooks/useWorkspaces";
import type { Workspace } from "@/domains/workspaces/types";
import { filterWorkspaces } from "@/domains/workspaces/utils/display";

type WorkspacesClientProps = {
  initialData?: Workspace[];
};

type ViewMode = "grid" | "list";

const EMPTY_WORKSPACES: Workspace[] = [];

export function WorkspacesClient({ initialData }: WorkspacesClientProps) {
  const { data, isPending, isError, refetch } = useWorkspaces({ initialData });
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const workspaces = data ?? EMPTY_WORKSPACES;
  const filteredWorkspaces = useMemo(() => filterWorkspaces(workspaces, query), [query, workspaces]);
  const showEmpty = !isPending && !isError && workspaces.length === 0;
  const showNoResults = !isPending && !isError && workspaces.length > 0 && filteredWorkspaces.length === 0;

  if (isPending && workspaces.length === 0) {
    return <WorkspacesSkeleton />;
  }

  return (
    <>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-prism-heading">Workspaces</h1>
              <p className="mt-1 text-sm text-prism-muted">
                Create, organize, and switch between the workspaces your teams use.
              </p>
            </div>
            <WorkspaceToolbarActions
              viewMode={viewMode}
              onCreate={() => setIsCreateOpen(true)}
              onViewModeChange={setViewMode}
            />
          </div>

          <WorkspaceToolbar
            query={query}
            onQueryChange={setQuery}
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
    </>
  );
}
