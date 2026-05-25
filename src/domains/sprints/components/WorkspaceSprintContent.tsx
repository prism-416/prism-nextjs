import { notFound } from "next/navigation";

import { getWorkspaceSprint, getWorkspaceSprintWorkItems } from "@/domains/sprints/api";
import { WorkspaceSprintClient } from "@/domains/sprints/components/WorkspaceSprintClient";

type WorkspaceSprintContentProps = {
  workspaceId: string;
  workspaceSlug: string;
  sprintId: string;
  projectSlugsById: Record<string, string>;
};

export async function WorkspaceSprintContent({
  workspaceId,
  workspaceSlug,
  sprintId,
  projectSlugsById,
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
      sprintId={sprintId}
      projectSlugsById={projectSlugsById}
      initialSprint={initialSprint}
      initialWorkItems={initialWorkItems}
    />
  );
}
