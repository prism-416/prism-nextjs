import { Suspense } from "react";

import { ProjectDocumentsContent } from "@/domains/projects/components/ProjectDocumentsContent";
import { ProjectDocumentsSkeleton } from "@/domains/projects/components/ProjectDocumentsSkeleton";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectDocumentsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDocumentsPage({ params }: ProjectDocumentsPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell
      slug={slug}
      section={{ name: "Documents" }}
    >
      {({ projectId, workspaceId }) => (
        <Suspense fallback={<ProjectDocumentsSkeleton />}>
          <ProjectDocumentsContent
            projectId={projectId}
            workspaceId={workspaceId}
          />
        </Suspense>
      )}
    </ProjectPageShell>
  );
}
