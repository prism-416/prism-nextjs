import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProjects } from "@/domains/projects/api";
import { WorkspaceSprintContent } from "@/domains/sprints/components/WorkspaceSprintContent";
import { WorkspaceSprintSkeleton } from "@/domains/sprints/components/WorkspaceSprintSkeleton";
import { getWorkspaces } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

type WorkspaceSprintPageProps = {
  params: Promise<{
    slug: string;
    sprintId: string;
  }>;
};

export default async function WorkspaceSprintPage({ params }: WorkspaceSprintPageProps) {
  const { slug, sprintId } = await params;
  const [workspaces, projects] = await Promise.all([getWorkspaces(), getProjects(slug).catch(() => [])]);
  const workspace = workspaces.find(item => item.slug === slug);

  if (!workspace) {
    notFound();
  }

  const projectSlugsById = Object.fromEntries(projects.map(project => [project.projectId, project.slug]));

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
      section={{
        name: "Sprints",
        href: `/workspaces/${encodeURIComponent(slug)}/sprints`,
      }}
    >
      <Suspense fallback={<WorkspaceSprintSkeleton />}>
        <WorkspaceSprintContent
          workspaceId={workspace.workspaceId}
          workspaceSlug={slug}
          sprintId={sprintId}
          projectSlugsById={projectSlugsById}
        />
      </Suspense>
    </WorkspaceShell>
  );
}
