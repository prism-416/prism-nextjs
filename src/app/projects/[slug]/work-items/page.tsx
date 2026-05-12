import { Suspense } from "react";

import { ProjectWorkItemsContent } from "@/domains/projects/components/ProjectWorkItemsContent";
import { ProjectWorkItemsSkeleton } from "@/domains/projects/components/ProjectWorkItemsSkeleton";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectWorkItemsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectWorkItemsPage({ params }: ProjectWorkItemsPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell
      slug={slug}
      section={{ name: "Work items" }}
    >
      {({ projectId, projectSlug }) => (
        <Suspense fallback={<ProjectWorkItemsSkeleton />}>
          <ProjectWorkItemsContent
            projectId={projectId}
            projectSlug={projectSlug}
          />
        </Suspense>
      )}
    </ProjectPageShell>
  );
}
