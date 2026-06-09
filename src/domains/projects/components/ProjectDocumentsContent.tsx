import { getProjectDocuments } from "@/domains/projects/api";
import { ProjectDocumentsClient } from "@/domains/projects/components/ProjectDocumentsClient";

type ProjectDocumentsContentProps = {
  projectId: string;
  workspaceId: string;
};

export async function ProjectDocumentsContent({ projectId, workspaceId }: ProjectDocumentsContentProps) {
  const initialData = await getProjectDocuments(projectId).catch(() => undefined);

  return (
    <ProjectDocumentsClient
      projectId={projectId}
      workspaceId={workspaceId}
      initialData={initialData}
    />
  );
}
