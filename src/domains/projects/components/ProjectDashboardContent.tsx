import { getProject, getProjectParticipants, getProjectWorkItems } from "@/domains/projects/api";
import { ProjectDashboardClient } from "@/domains/projects/components/ProjectDashboardClient";
import { PROJECT_DASHBOARD_WORK_ITEM_FILTERS } from "@/domains/projects/constants/dashboard";

type ProjectDashboardContentProps = {
  projectId: string;
  projectSlug: string;
};

export async function ProjectDashboardContent({ projectId, projectSlug }: ProjectDashboardContentProps) {
  const [initialData, project] = await Promise.all([
    getProjectWorkItems(projectId, PROJECT_DASHBOARD_WORK_ITEM_FILTERS).catch(() => undefined),
    getProject(projectId).catch(() => undefined),
  ]);
  const initialMembers = project?.workspaceId
    ? await getProjectParticipants(project.workspaceId).catch(() => undefined)
    : undefined;

  return (
    <ProjectDashboardClient
      projectId={projectId}
      projectSlug={projectSlug}
      workspaceId={project?.workspaceId}
      initialMembers={initialMembers}
      initialData={initialData}
    />
  );
}
