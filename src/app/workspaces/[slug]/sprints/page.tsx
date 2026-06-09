import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProjects } from "@/domains/projects/api";
import { WorkspaceSprintsContent } from "@/domains/sprints/components/WorkspaceSprintsContent";
import { WorkspaceSprintsSkeleton } from "@/domains/sprints/components/WorkspaceSprintsSkeleton";
import { getWorkspaces } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

type WorkspaceSprintsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceSprintsPage({ params }: WorkspaceSprintsPageProps) {
  const { slug } = await params;
  const [workspaces, projects] = await Promise.all([getWorkspaces(), getProjects(slug).catch(() => [])]);
  const workspace = workspaces.find(item => item.slug === slug);

  if (!workspace) {
    notFound();
  }

  return (
    <WorkspaceShell
      workspaceId={workspace.workspaceId}
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
      section={{ name: "Sprints" }}
    >
      <Suspense fallback={<WorkspaceSprintsSkeleton />}>
        <WorkspaceSprintsContent
          workspaceId={workspace.workspaceId}
          workspaceSlug={slug}
          workspaceOwnerId={workspace.ownerId}
        />
      </Suspense>
    </WorkspaceShell>
  );
}
