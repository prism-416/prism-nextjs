import { ProjectsContent } from "@/domains/projects/components/ProjectsContent";
import { ProjectsSkeleton } from "@/domains/projects/components/ProjectsSkeleton";
import { getWorkspaces } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";
import { Suspense } from "react";

type WorkspacePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { slug } = await params;
  const workspaces = await getWorkspaces();
  const workspace = workspaces.find(item => item.slug === slug);

  return (
    <WorkspaceShell workspace={{ name: workspace?.name ?? "" }}>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContent
          slug={slug}
          workspaceId={workspace?.workspaceId}
        />
      </Suspense>
    </WorkspaceShell>
  );
}
