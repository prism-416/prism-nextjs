import { notFound } from "next/navigation";

import { getWorkspaceAgentRunHistory } from "@/domains/projects/api";
import { getWorkspaceBySlugCached } from "@/domains/workspaces/api/server";
import { WorkspaceAgentRoute } from "@/domains/workspaces/components/routes/WorkspaceAgentRoute";

type WorkspaceAgentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceAgentPage({ params }: WorkspaceAgentPageProps) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlugCached(slug);

  if (!workspace) {
    notFound();
  }

  const initialData = await getWorkspaceAgentRunHistory(workspace.workspaceId).catch(() => undefined);

  return <WorkspaceAgentRoute initialData={initialData} />;
}
