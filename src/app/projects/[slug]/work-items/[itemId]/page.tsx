import { Suspense } from "react";

import { ProjectWorkItemContent } from "@/domains/projects/components/ProjectWorkItemContent";
import { ProjectWorkItemSkeleton } from "@/domains/projects/components/ProjectWorkItemSkeleton";

import { ProjectPageShell } from "../../_components/ProjectPageShell";

type ProjectWorkItemPageProps = {
  params: Promise<{
    slug: string;
    itemId: string;
  }>;
};

export default async function ProjectWorkItemPage({ params }: ProjectWorkItemPageProps) {
  const { slug, itemId } = await params;
  const workItemsHref = `/projects/${encodeURIComponent(slug)}/work-items`;

  return (
    <ProjectPageShell
      slug={slug}
      section={{
        name: "Work items",
        href: workItemsHref,
      }}
    >
      {({ projectId, projectSlug }) => (
        <Suspense fallback={<ProjectWorkItemSkeleton />}>
          <ProjectWorkItemContent
            projectId={projectId}
            projectSlug={projectSlug}
            itemId={itemId}
          />
        </Suspense>
      )}
    </ProjectPageShell>
  );
}
