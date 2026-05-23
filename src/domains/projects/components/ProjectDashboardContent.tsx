import { getProjectWorkItems } from "@/domains/projects/api";
import { ProjectDashboardClient } from "@/domains/projects/components/ProjectDashboardClient";

type ProjectDashboardContentProps = {
  projectId: string;
  projectSlug: string;
};

export async function ProjectDashboardContent({ projectId, projectSlug }: ProjectDashboardContentProps) {
  const initialData = await getProjectWorkItems(projectId).catch(() => undefined);

  return (
    <ProjectDashboardClient
      projectId={projectId}
      projectSlug={projectSlug}
      initialData={initialData}
    />
  );
}
