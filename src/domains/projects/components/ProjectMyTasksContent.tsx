import { getProjectParticipants, getProjectWorkItems } from "@/domains/projects/api";
import { ProjectMyTasksClient } from "@/domains/projects/components/ProjectMyTasksClient";
import { getCurrentUser } from "@/shared/api/auth";

type ProjectMyTasksContentProps = {
  projectId: string;
  projectSlug: string;
  workspaceId: string;
};

export async function ProjectMyTasksContent({ projectId, projectSlug, workspaceId }: ProjectMyTasksContentProps) {
  const currentUser = await getCurrentUser().catch(() => undefined);
  const [initialData, initialMembers] = await Promise.all([
    currentUser?.username
      ? getProjectWorkItems(projectId, { assigneeUsername: currentUser.username }).catch(() => undefined)
      : undefined,
    getProjectParticipants(workspaceId).catch(() => undefined),
  ]);

  return (
    <ProjectMyTasksClient
      projectId={projectId}
      projectSlug={projectSlug}
      assigneeUsername={currentUser?.username}
      initialData={initialData}
      initialMembers={initialMembers}
    />
  );
}
