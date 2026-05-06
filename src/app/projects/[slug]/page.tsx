import { Suspense } from "react";

import { ProjectContent } from "@/domains/projects/components/ProjectContent";
import { ProjectSkeleton } from "@/domains/projects/components/ProjectSkeleton";

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
      {({ workspaceSlug }) => (
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectContent
            slug={slug}
            workspaceSlug={workspaceSlug}
          />
        </Suspense>
      )}
    </ProjectPageShell>
  );
}
