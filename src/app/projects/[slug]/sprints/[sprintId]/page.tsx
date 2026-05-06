import { Suspense } from "react";

import { ProjectSprintContent } from "@/domains/projects/components/ProjectSprintContent";
import { ProjectSprintSkeleton } from "@/domains/projects/components/ProjectSprintSkeleton";

import { ProjectPageShell } from "../../_components/ProjectPageShell";

type ProjectSprintPageProps = {
  params: Promise<{
    slug: string;
    sprintId: string;
  }>;
};

export default async function ProjectSprintPage({ params }: ProjectSprintPageProps) {
  const { slug, sprintId } = await params;
  const sprintsHref = `/projects/${encodeURIComponent(slug)}/sprints`;

  return (
    <ProjectPageShell
      slug={slug}
      section={{
        name: "Sprints",
        href: sprintsHref,
      }}
    >
      {({ projectId, projectSlug }) => (
        <Suspense fallback={<ProjectSprintSkeleton />}>
          <ProjectSprintContent
            projectId={projectId}
            projectSlug={projectSlug}
            sprintId={sprintId}
          />
        </Suspense>
      )}
    </ProjectPageShell>
  );
}
