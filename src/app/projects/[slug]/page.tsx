import { Suspense } from "react";

import { getProjectBySlug } from "@/domains/projects/api";
import { ProjectContent } from "@/domains/projects/components/ProjectContent";
import { ProjectSkeleton } from "@/domains/projects/components/ProjectSkeleton";
import { getWorkspaceById } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const workspace = project ? await getWorkspaceById(project.workspaceId).catch(() => undefined) : undefined;

  return (
    <WorkspaceShell
      workspace={workspace ? { name: workspace.name } : undefined}
      workspaceSlug={workspace?.slug}
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
