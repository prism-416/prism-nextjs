import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ProjectsContent } from "@/domains/projects/components/ProjectsContent";
import { ProjectsSkeleton } from "@/domains/projects/components/ProjectsSkeleton";
import { getWorkspaceBySlug } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

type WorkspaceProjectsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceProjectsPage({ params }: WorkspaceProjectsPageProps) {
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
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContent
          slug={slug}
          workspaceId={workspace.workspaceId}
        />
      </Suspense>
    </WorkspaceShell>
  );
}
