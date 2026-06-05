import { getCurrentWorkspaceAgentRuns } from "@/domains/projects/api";
import { ProjectAgentClient } from "@/domains/projects/components/ProjectAgentClient";

type ProjectAgentContentProps = {
  projectId: string;
  workspaceId: string;
};

export async function ProjectAgentContent({ projectId, workspaceId }: ProjectAgentContentProps) {
  const initialData = await getCurrentWorkspaceAgentRuns(workspaceId).catch(() => undefined);

  return (
    <ProjectAgentClient
      projectId={projectId}
      workspaceId={workspaceId}
      initialData={initialData}
    />
  );
}
