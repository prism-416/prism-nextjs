"use client";

import { WorkspaceSprintClient } from "@/domains/sprints/components/WorkspaceSprintClient";
import type { Sprint, SprintWorkItemSearchResult } from "@/domains/sprints/types";
import { useWorkspaceRoute } from "@/domains/workspaces/components/WorkspaceRouteShell";

type WorkspaceSprintRouteProps = {
  sprintId: string;
  initialSprint?: Sprint;
  initialWorkItems?: SprintWorkItemSearchResult;
};

export function WorkspaceSprintRoute({ sprintId, initialSprint, initialWorkItems }: WorkspaceSprintRouteProps) {
  const { workspace, workspaceSlug, projectNamesById, projectSlugsById } = useWorkspaceRoute();

  return (
    <WorkspaceSprintClient
      workspaceId={workspace.workspaceId}
      workspaceSlug={workspaceSlug}
      workspaceOwnerId={workspace.ownerId}
      sprintId={sprintId}
      projectSlugsById={projectSlugsById}
      projectNamesById={projectNamesById}
      initialSprint={initialSprint}
      initialWorkItems={initialWorkItems}
    />
  );
}
