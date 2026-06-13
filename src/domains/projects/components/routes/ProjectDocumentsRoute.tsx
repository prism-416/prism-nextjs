"use client";

import { ProjectDocumentsClient } from "@/domains/projects/components/ProjectDocumentsClient";
import { useProjectRoute } from "@/domains/projects/components/ProjectRouteShell";
import type { ProjectDocumentSearchResult } from "@/domains/projects/types";

type ProjectDocumentsRouteProps = {
  initialData?: ProjectDocumentSearchResult;
};

export function ProjectDocumentsRoute({ initialData }: ProjectDocumentsRouteProps) {
  const { projectId, workspaceId } = useProjectRoute();

  return (
    <ProjectDocumentsClient
      projectId={projectId}
      workspaceId={workspaceId}
      initialData={initialData}
    />
  );
}
