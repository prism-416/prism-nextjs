import { getAgentRunStepsByRunId, getCurrentWorkspaceAgentRuns } from "@/domains/projects/api";
import { ProjectAgentClient } from "@/domains/projects/components/ProjectAgentClient";

type ProjectAgentContentProps = {
  projectId: string;
  workspaceId: string;
};

export async function ProjectAgentContent({ projectId, workspaceId }: ProjectAgentContentProps) {
  const initialData = await getCurrentWorkspaceAgentRuns(workspaceId).catch(() => undefined);
  const initialStepsByRunId = initialData
    ? await getAgentRunStepsByRunId(workspaceId, initialData.items).catch(() => ({}))
    : {};

  return (
    <ProjectAgentClient
      projectId={projectId}
      workspaceId={workspaceId}
      initialData={initialData}
      initialStepsByRunId={initialStepsByRunId}
    />
  );
}
