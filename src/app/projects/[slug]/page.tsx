import { Suspense } from "react";

import { ProjectDashboardContent } from "@/domains/projects/components/ProjectDashboardContent";
import { ProjectDashboardSkeleton } from "@/domains/projects/components/ProjectDashboardSkeleton";

import { ProjectPageShell } from "./_components/ProjectPageShell";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell slug={slug}>
      {({ projectId, projectSlug }) => (
        <Suspense fallback={<ProjectDashboardSkeleton />}>
          <ProjectDashboardContent
            projectId={projectId}
            projectSlug={projectSlug}
          />
        </Suspense>
      )}
    </ProjectPageShell>
  );
}
