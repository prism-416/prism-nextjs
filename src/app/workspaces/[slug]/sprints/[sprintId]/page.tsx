import { notFound } from "next/navigation";

import { getWorkspaceSprint, getWorkspaceSprintWorkItems } from "@/domains/sprints/api";
import { getWorkspaceBySlugCached } from "@/domains/workspaces/api/server";
import { WorkspaceSprintRoute } from "@/domains/workspaces/components/routes/WorkspaceSprintRoute";

type WorkspaceSprintPageProps = {
  params: Promise<{
    slug: string;
    sprintId: string;
  }>;
};

export default async function WorkspaceSprintPage({ params }: WorkspaceSprintPageProps) {
  const { slug, sprintId } = await params;
  const workspace = await getWorkspaceBySlugCached(slug);

  if (!workspace) {
    notFound();
  }

  const [initialSprint, initialWorkItems] = await Promise.all([
    getWorkspaceSprint(workspace.workspaceId, sprintId).catch(() => undefined),
    getWorkspaceSprintWorkItems(workspace.workspaceId, sprintId).catch(() => undefined),
  ]);

  return (
    <WorkspaceSprintRoute
      sprintId={sprintId}
      initialSprint={initialSprint}
      initialWorkItems={initialWorkItems}
    />
  );
}
