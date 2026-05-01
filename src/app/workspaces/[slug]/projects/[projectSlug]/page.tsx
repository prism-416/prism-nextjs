import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ProjectContent } from "@/domains/projects/components/ProjectContent";
import { ProjectSkeleton } from "@/domains/projects/components/ProjectSkeleton";
import { getWorkspaceBySlug } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

type WorkspaceProjectPageProps = {
  params: Promise<{
    slug: string;
    projectSlug: string;
  }>;
};

export default async function WorkspaceProjectPage({ params }: WorkspaceProjectPageProps) {
  const { slug, projectSlug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace) {
    notFound();
  }

  return (
    <WorkspaceShell
      workspace={{ name: workspace.name }}
      workspaceSlug={slug}
    >
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent
          slug={projectSlug}
          workspaceSlug={slug}
        />
      </Suspense>
    </WorkspaceShell>
  );
}
