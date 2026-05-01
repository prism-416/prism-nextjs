import { Suspense } from "react";
import { redirect } from "next/navigation";

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

  if (workspace) {
    redirect(`/workspaces/${encodeURIComponent(workspace.slug)}/projects/${encodeURIComponent(slug)}`);
  }

  return (
    <WorkspaceShell>
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent slug={slug} />
      </Suspense>
    </WorkspaceShell>
  );
}
