import { notFound } from "next/navigation";

import { getWorkspaceSprint, getWorkspaceSprintWorkItems } from "@/domains/sprints/api";
import { WorkspaceSprintClient } from "@/domains/sprints/components/WorkspaceSprintClient";

type WorkspaceSprintContentProps = {
  workspaceId: string;
  workspaceSlug: string;
  workspaceOwnerId: string;
  sprintId: string;
  projectSlugsById: Record<string, string>;
  projectNamesById: Record<string, string>;
};

export async function WorkspaceSprintContent({
  workspaceId,
  workspaceSlug,
  workspaceOwnerId,
  sprintId,
  projectSlugsById,
  projectNamesById,
}: WorkspaceSprintContentProps) {
  const initialSprint = await getWorkspaceSprint(workspaceId, sprintId);

  if (!initialSprint) {
    notFound();
  }

  const initialWorkItems = await getWorkspaceSprintWorkItems(workspaceId, sprintId).catch(() => undefined);

  return (
    <WorkspaceSprintClient
      workspaceId={workspaceId}
      workspaceSlug={workspaceSlug}
      workspaceOwnerId={workspaceOwnerId}
      sprintId={sprintId}
      projectSlugsById={projectSlugsById}
      projectNamesById={projectNamesById}
      initialSprint={initialSprint}
      initialWorkItems={initialWorkItems}
    />
  );
}
