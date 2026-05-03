"use client";

import { useMemo, useState } from "react";

import { CreateWorkspaceDialog } from "@/domains/workspaces/components/CreateWorkspaceDialog";
import { WorkspacesSkeleton } from "@/domains/workspaces/components/WorkspacesSkeleton";
import { WorkspaceCardWithPermission } from "@/domains/workspaces/components/list/WorkspaceCardWithPermission";
import { WorkspaceDeleteDialog } from "@/domains/workspaces/components/list/WorkspaceDeleteDialog";
import { WorkspaceEmptyState } from "@/domains/workspaces/components/list/WorkspaceEmptyState";
import { WorkspaceEditDialog } from "@/domains/workspaces/components/list/WorkspaceEditDialog";
import { WorkspaceErrorState } from "@/domains/workspaces/components/list/WorkspaceErrorState";
import { WorkspaceNoResults } from "@/domains/workspaces/components/list/WorkspaceNoResults";
import { WorkspaceRowWithPermission } from "@/domains/workspaces/components/list/WorkspaceRowWithPermission";
import { WorkspaceToolbar } from "@/domains/workspaces/components/list/WorkspaceToolbar";
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
  const [detailsWorkspace, setDetailsWorkspace] = useState<Workspace | null>(null);
  const [deletingWorkspace, setDeletingWorkspace] = useState<Workspace | null>(null);

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
                <WorkspaceCardWithPermission
                  key={workspace.workspaceId}
                  workspace={workspace}
                  onOpenDetails={setDetailsWorkspace}
                  onDelete={setDeletingWorkspace}
                />
              ))}
            </div>
          )}

          {filteredWorkspaces.length > 0 && viewMode === "list" && (
            <div className="flex flex-col gap-2">
              {filteredWorkspaces.map(workspace => (
                <WorkspaceRowWithPermission
                  key={workspace.workspaceId}
                  workspace={workspace}
                  onOpenDetails={setDetailsWorkspace}
                  onDelete={setDeletingWorkspace}
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
      {detailsWorkspace && (
        <WorkspaceEditDialog
          key={detailsWorkspace.workspaceId}
          workspace={detailsWorkspace}
          open
          onOpenChange={open => {
            if (!open) {
              setDetailsWorkspace(null);
            }
          }}
          onWorkspaceLeft={() => setDetailsWorkspace(null)}
        />
      )}
      <WorkspaceDeleteDialog
        workspace={deletingWorkspace}
        open={deletingWorkspace !== null}
        onOpenChange={open => {
          if (!open) {
            setDeletingWorkspace(null);
          }
        }}
      />
    </>
  );
}
