import { notFound } from "next/navigation";

import { getWorkspaceJobs, getWorkspaceMembers } from "@/domains/workspaces/api";
import { getWorkspaceBySlugCached } from "@/domains/workspaces/api/server";
import { WorkspaceMembersRoute } from "@/domains/workspaces/components/routes/WorkspaceMembersRoute";

type WorkspaceMembersPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceMembersPage({ params }: WorkspaceMembersPageProps) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlugCached(slug);

  if (!workspace) {
    notFound();
  }

  const [initialData, initialJobs] = await Promise.all([
    getWorkspaceMembers(workspace.workspaceId).catch(() => undefined),
    getWorkspaceJobs(workspace.workspaceId).catch(() => undefined),
  ]);

  return (
    <WorkspaceMembersRoute
      initialData={initialData}
      initialJobs={initialJobs}
    />
  );
}
