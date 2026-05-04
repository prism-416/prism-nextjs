import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProjects } from "@/domains/projects/api";
import { getWorkspaceMembers, getWorkspaces } from "@/domains/workspaces/api";
import { WorkspaceProjectJobsContent } from "@/domains/workspaces/components/WorkspaceProjectJobsContent";
import { WorkspaceProjectJobsSkeleton } from "@/domains/workspaces/components/WorkspaceProjectJobsSkeleton";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";
import { getCurrentUser } from "@/shared/api/auth";

type WorkspaceProjectJobsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceProjectJobsPage({ params }: WorkspaceProjectJobsPageProps) {
  const { slug } = await params;
  const [workspaces, projects] = await Promise.all([getWorkspaces(), getProjects(slug).catch(() => [])]);
  const workspace = workspaces.find(item => item.slug === slug);

  if (!workspace) {
    notFound();
  }

  const [currentUser, members] = await Promise.all([
    getCurrentUser().catch(() => undefined),
    getWorkspaceMembers(workspace.workspaceId).catch(() => []),
  ]);
  const currentMember = members.find(member => member.userId === currentUser?.userId);
  const canManageJobs = currentUser?.userId === workspace.ownerId || currentMember?.role === "admin";

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
      section={{ name: "Project jobs" }}
    >
      <Suspense fallback={<WorkspaceProjectJobsSkeleton />}>
        <WorkspaceProjectJobsContent
          workspace={workspace}
          canManageJobs={canManageJobs}
        />
      </Suspense>
    </WorkspaceShell>
  );
}
