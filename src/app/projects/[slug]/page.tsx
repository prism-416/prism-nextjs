import { Suspense } from "react";

import { getProjectBySlug, getProjects } from "@/domains/projects/api";
import { ProjectContent } from "@/domains/projects/components/ProjectContent";
import { ProjectSkeleton } from "@/domains/projects/components/ProjectSkeleton";
import { getWorkspaceById, getWorkspaces } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const [workspace, workspaces] = project
    ? await Promise.all([getWorkspaceById(project.workspaceId).catch(() => undefined), getWorkspaces().catch(() => [])])
    : [undefined, []];
  const projects = workspace?.slug ? await getProjects(workspace.slug).catch(() => []) : [];

  return (
    <WorkspaceShell
      workspace={workspace ? { name: workspace.name } : undefined}
      workspaceSlug={workspace?.slug}
      workspaceOptions={workspaces.map(item => ({
        id: item.workspaceId,
        name: item.name,
        href: `/workspaces/${encodeURIComponent(item.slug)}`,
        isCurrent: item.slug === workspace?.slug,
      }))}
      project={project ? { name: project.name } : undefined}
      projectOptions={projects.map(item => ({
        id: item.projectId,
        name: item.name,
        href: `/projects/${encodeURIComponent(item.slug)}`,
        isCurrent: item.slug === slug,
      }))}
    >
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent
          slug={slug}
          workspaceSlug={workspace?.slug}
        />
      </Suspense>
    </WorkspaceShell>
  );
}
