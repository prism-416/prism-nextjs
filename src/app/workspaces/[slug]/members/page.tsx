import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getWorkspaceBySlug } from "@/domains/workspaces/api";
import { WorkspaceMembersContent } from "@/domains/workspaces/components/WorkspaceMembersContent";
import { WorkspaceMembersSkeleton } from "@/domains/workspaces/components/WorkspaceMembersSkeleton";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

type WorkspaceMembersPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceMembersPage({ params }: WorkspaceMembersPageProps) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace) {
    notFound();
  }

  return (
    <WorkspaceShell
      workspace={{ name: workspace.name }}
      workspaceSlug={slug}
    >
      <Suspense fallback={<WorkspaceMembersSkeleton />}>
        <WorkspaceMembersContent workspaceId={workspace.workspaceId} />
      </Suspense>
    </WorkspaceShell>
  );
}
