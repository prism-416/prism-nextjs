import { getProjectSprints } from "@/domains/projects/api";
import { ProjectSprintsClient } from "@/domains/projects/components/ProjectSprintsClient";
import { getDefaultProjectSprintDates } from "@/domains/projects/utils/work-item-display";

type ProjectSprintsContentProps = {
  projectId: string;
  projectSlug: string;
};

export async function ProjectSprintsContent({ projectId, projectSlug }: ProjectSprintsContentProps) {
  const initialData = await getProjectSprints(projectId).catch(() => undefined);
  const { defaultStartsAt, defaultEndsAt } = getDefaultProjectSprintDates();

  return (
    <ProjectSprintsClient
      projectId={projectId}
      projectSlug={projectSlug}
      initialData={initialData}
      defaultSprintStartsAt={defaultStartsAt}
      defaultSprintEndsAt={defaultEndsAt}
    />
  );
}
