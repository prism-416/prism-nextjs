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
  const dashboardHref = `/projects/${encodeURIComponent(slug)}`;

  return (
    <ProjectPageShell
      slug={slug}
      section={{
        name: "Dashboard",
        href: dashboardHref,
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
