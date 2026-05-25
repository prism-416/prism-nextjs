import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProjects } from "@/domains/projects/api";
import { ProjectsContent } from "@/domains/projects/components/ProjectsContent";
import { ProjectsSkeleton } from "@/domains/projects/components/ProjectsSkeleton";
import { getWorkspaceMembers, getWorkspaces } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";
import { getCurrentUser } from "@/shared/api/auth";

type WorkspacePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspacePage({ params }: WorkspacePageProps) {
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
  const canCreateProject = currentUser?.userId === workspace.ownerId || currentMember?.role === "admin";

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
    >
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContent
          slug={slug}
          canCreateProject={canCreateProject}
        />
      </Suspense>
    </WorkspaceShell>
  );
}
