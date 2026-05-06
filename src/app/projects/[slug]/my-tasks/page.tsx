import { Suspense } from "react";

import { ProjectMyTasksContent } from "@/domains/projects/components/ProjectMyTasksContent";
import { ProjectMyTasksSkeleton } from "@/domains/projects/components/ProjectMyTasksSkeleton";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectMyTasksPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectMyTasksPage({ params }: ProjectMyTasksPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell
      slug={slug}
      section={{ name: "My tasks" }}
    >
      {({ projectId }) => (
        <Suspense fallback={<ProjectMyTasksSkeleton />}>
          <ProjectMyTasksContent projectId={projectId} />
        </Suspense>
      )}
    </ProjectPageShell>
  );
}
