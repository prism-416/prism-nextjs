"use client";

import { Button } from "@/atomics/atoms/Button";
import { WorkspaceSprintPanel } from "@/domains/sprints/components/WorkspaceSprintPanel";
import { WorkspaceSprintSkeleton } from "@/domains/sprints/components/WorkspaceSprintSkeleton";
import { useWorkspaceSprint } from "@/domains/sprints/hooks/useWorkspaceSprint";
import { useWorkspaceSprintWorkItems } from "@/domains/sprints/hooks/useWorkspaceSprintWorkItems";
import type { Sprint, SprintWorkItemSearchResult } from "@/domains/sprints/types";

type WorkspaceSprintClientProps = {
  workspaceId: string;
  workspaceSlug: string;
  sprintId: string;
  projectSlugsById: Record<string, string>;
  projectNamesById: Record<string, string>;
  initialSprint?: Sprint;
  initialWorkItems?: SprintWorkItemSearchResult;
};

export function WorkspaceSprintClient({
  workspaceId,
  workspaceSlug,
  sprintId,
  projectSlugsById,
  projectNamesById,
  initialSprint,
  initialWorkItems,
}: WorkspaceSprintClientProps) {
  const { data: sprint, isPending, isError, refetch } = useWorkspaceSprint(workspaceId, sprintId, initialSprint);
  const {
    data: workItems,
    isError: isWorkItemsError,
    refetch: refetchWorkItems,
  } = useWorkspaceSprintWorkItems(workspaceId, sprintId, undefined, initialWorkItems);

  if (isPending && !sprint) {
    return <WorkspaceSprintSkeleton />;
  }

  if (isError || !sprint) {
    return (
      <div className="mx-auto w-full max-w-6xl rounded-xl border border-prism-danger-soft bg-surface p-5 text-sm text-prism-danger">
        <p>Sprint could not be loaded.</p>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => void refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <WorkspaceSprintPanel
      workspaceSlug={workspaceSlug}
      sprint={sprint}
      workItems={workItems ?? { items: [], total: 0, limit: 50, offset: 0 }}
      projectSlugsById={projectSlugsById}
      projectNamesById={projectNamesById}
      isWorkItemsError={isWorkItemsError}
      onRetryWorkItems={() => void refetchWorkItems()}
    />
  );
}
