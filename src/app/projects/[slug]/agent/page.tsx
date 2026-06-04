import { Suspense } from "react";

import { ProjectAgentContent } from "@/domains/projects/components/ProjectAgentContent";
import { ProjectAgentSkeleton } from "@/domains/projects/components/ProjectAgentSkeleton";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectAgentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectAgentPage({ params }: ProjectAgentPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell
      slug={slug}
      section={{ name: "Agent" }}
    >
      {({ projectId, workspaceId }) => (
        <Suspense fallback={<ProjectAgentSkeleton />}>
          <ProjectAgentContent
            projectId={projectId}
            workspaceId={workspaceId}
          />
        </Suspense>
      )}
    </ProjectPageShell>
  );
}
