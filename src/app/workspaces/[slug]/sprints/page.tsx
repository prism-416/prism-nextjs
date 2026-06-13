import { notFound } from "next/navigation";

import { getWorkspaceSprints } from "@/domains/sprints/api";
import { getWorkspaceBySlugCached } from "@/domains/workspaces/api/server";
import { WorkspaceSprintsRoute } from "@/domains/workspaces/components/routes/WorkspaceSprintsRoute";

type WorkspaceSprintsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceSprintsPage({ params }: WorkspaceSprintsPageProps) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlugCached(slug);

  if (!workspace) {
    notFound();
  }

  const initialData = await getWorkspaceSprints(workspace.workspaceId).catch(() => undefined);

  return <WorkspaceSprintsRoute initialData={initialData} />;
}
