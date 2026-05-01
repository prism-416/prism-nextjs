import { Suspense } from "react";

import { ProjectContent } from "@/domains/projects/components/ProjectContent";
import { ProjectSkeleton } from "@/domains/projects/components/ProjectSkeleton";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  return (
    <WorkspaceShell>
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent slug={slug} />
      </Suspense>
    </WorkspaceShell>
  );
}
