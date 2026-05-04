import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProjects } from "@/domains/projects/api";
import { getWorkspaces } from "@/domains/workspaces/api";
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
  const [workspaces, projects] = await Promise.all([getWorkspaces(), getProjects(slug).catch(() => [])]);
  const workspace = workspaces.find(item => item.slug === slug);

  if (!workspace) {
    notFound();
  }

  return (
    <WorkspaceShell
      workspace={{ name: workspace.name }}
      workspaceSlug={slug}
      workspaceOptions={workspaces.map(item => ({
        id: item.workspaceId,
        name: item.name,
        href: `/workspaces/${encodeURIComponent(item.slug)}`,
        isCurrent: item.slug === slug,
      }))}
      project={{ name: "Projects" }}
      projectOptions={projects.map(project => ({
        id: project.projectId,
        name: project.name,
        href: `/projects/${encodeURIComponent(project.slug)}`,
      }))}
      section={{ name: "Members" }}
    >
      <Suspense fallback={<WorkspaceMembersSkeleton />}>
        <WorkspaceMembersContent workspace={workspace} />
      </Suspense>
    </WorkspaceShell>
  );
}
