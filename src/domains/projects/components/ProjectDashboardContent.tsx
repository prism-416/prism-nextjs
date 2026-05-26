import { getProjectWorkItems } from "@/domains/projects/api";
import { ProjectDashboardClient } from "@/domains/projects/components/ProjectDashboardClient";
import { PROJECT_DASHBOARD_WORK_ITEM_FILTERS } from "@/domains/projects/constants/dashboard";

type ProjectDashboardContentProps = {
  projectId: string;
  projectSlug: string;
};

export async function ProjectDashboardContent({ projectId, projectSlug }: ProjectDashboardContentProps) {
  const initialData = await getProjectWorkItems(projectId, PROJECT_DASHBOARD_WORK_ITEM_FILTERS).catch(() => undefined);

  return (
    <ProjectDashboardClient
      projectId={projectId}
      projectSlug={projectSlug}
      initialData={initialData}
    />
  );
}
