import { notFound } from "next/navigation";

import { getProjectSprint, getProjectSprintWorkItems } from "@/domains/projects/api";
import { ProjectSprintClient } from "@/domains/projects/components/ProjectSprintClient";

type ProjectSprintContentProps = {
  projectId: string;
  projectSlug: string;
  sprintId: string;
};

export async function ProjectSprintContent({ projectId, projectSlug, sprintId }: ProjectSprintContentProps) {
  const initialSprint = await getProjectSprint(projectId, sprintId);

  if (!initialSprint) {
    notFound();
  }

  const initialWorkItems = await getProjectSprintWorkItems(projectId, sprintId).catch(() => undefined);

  return (
    <ProjectSprintClient
      projectId={projectId}
      projectSlug={projectSlug}
      sprintId={sprintId}
      initialSprint={initialSprint}
      initialWorkItems={initialWorkItems}
    />
  );
}
