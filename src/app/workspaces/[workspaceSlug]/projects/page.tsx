import { ProjectsContent } from "@/domains/projects/components/ProjectsContent";
import { ProjectsSkeleton } from "@/domains/projects/components/ProjectsSkeleton";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";
import { Suspense } from "react";

type ProjectsPageProps = {
  params: Promise<{
    workspaceSlug: string;
  }>;
};

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { workspaceSlug } = await params;

  return (
    <WorkspaceShell workspace={{ name: workspaceSlug }}>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContent slug={workspaceSlug} />
      </Suspense>
    </WorkspaceShell>
  );
}
