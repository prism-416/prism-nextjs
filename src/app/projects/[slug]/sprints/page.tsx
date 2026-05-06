import { Suspense } from "react";

import { ProjectSprintsContent } from "@/domains/projects/components/ProjectSprintsContent";
import { ProjectSprintsSkeleton } from "@/domains/projects/components/ProjectSprintsSkeleton";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectSprintsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectSprintsPage({ params }: ProjectSprintsPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell
      slug={slug}
      section={{ name: "Sprints" }}
    >
      {({ projectId }) => (
        <Suspense fallback={<ProjectSprintsSkeleton />}>
          <ProjectSprintsContent projectId={projectId} />
        </Suspense>
      )}
    </ProjectPageShell>
  );
}
