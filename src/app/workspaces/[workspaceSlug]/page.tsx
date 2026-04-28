import { ProjectsContent } from "@/domains/projects/components/ProjectsContent";
import { ProjectsSkeleton } from "@/domains/projects/components/ProjectsSkeleton";
import { getWorkspaces } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";
import { Suspense } from "react";

type WorkspacePageProps = {
  params: Promise<{
    workspaceSlug: string;
  }>;
};

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceSlug } = await params;
  const workspaces = await getWorkspaces();
  const workspace = workspaces.find(item => item.slug === workspaceSlug);

  return (
    <WorkspaceShell workspace={{ name: workspace?.name ?? workspaceSlug }}>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContent
          slug={workspaceSlug}
          workspaceId={workspace?.workspaceId}
        />
      </Suspense>
    </WorkspaceShell>
  );
}
