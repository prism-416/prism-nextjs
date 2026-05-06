import { getProjectSprints } from "@/domains/projects/api";
import { ProjectSprintsClient } from "@/domains/projects/components/ProjectSprintsClient";

type ProjectSprintsContentProps = {
  projectId: string;
  projectSlug: string;
};

export async function ProjectSprintsContent({ projectId, projectSlug }: ProjectSprintsContentProps) {
  const initialData = await getProjectSprints(projectId).catch(() => undefined);

  return (
    <ProjectSprintsClient
      projectId={projectId}
      projectSlug={projectSlug}
      initialData={initialData}
    />
  );
}
