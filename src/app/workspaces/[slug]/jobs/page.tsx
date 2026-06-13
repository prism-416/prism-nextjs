import { notFound } from "next/navigation";

import { getWorkspaceJobs } from "@/domains/workspaces/api";
import { getWorkspaceBySlugCached } from "@/domains/workspaces/api/server";
import { WorkspaceJobsRoute } from "@/domains/workspaces/components/routes/WorkspaceJobsRoute";

type WorkspaceJobsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceJobsPage({ params }: WorkspaceJobsPageProps) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlugCached(slug);

  if (!workspace) {
    notFound();
  }

  const initialData = await getWorkspaceJobs(workspace.workspaceId).catch(() => undefined);

  return <WorkspaceJobsRoute initialData={initialData} />;
}
