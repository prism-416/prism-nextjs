import { getProjectWorkItems } from "@/domains/projects/api";
import { ProjectWorkItemsClient } from "@/domains/projects/components/ProjectWorkItemsClient";

type ProjectWorkItemsContentProps = {
  projectId: string;
  projectSlug: string;
};

export async function ProjectWorkItemsContent({ projectId, projectSlug }: ProjectWorkItemsContentProps) {
  const initialData = await getProjectWorkItems(projectId).catch(() => undefined);

  return (
    <ProjectWorkItemsClient
      projectId={projectId}
      projectSlug={projectSlug}
      initialData={initialData}
    />
  );
}
