import { getProjectSprints } from "@/domains/projects/api";
import { ProjectSprintsClient } from "@/domains/projects/components/ProjectSprintsClient";

type ProjectSprintsContentProps = {
  projectId: string;
};

export async function ProjectSprintsContent({ projectId }: ProjectSprintsContentProps) {
  const initialData = await getProjectSprints(projectId).catch(() => undefined);

  return (
    <ProjectSprintsClient
      projectId={projectId}
      initialData={initialData}
    />
  );
}
