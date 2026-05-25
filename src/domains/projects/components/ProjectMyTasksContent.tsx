import { getProjectWorkItems } from "@/domains/projects/api";
import { ProjectMyTasksClient } from "@/domains/projects/components/ProjectMyTasksClient";
import { getCurrentUser } from "@/shared/api/auth";

type ProjectMyTasksContentProps = {
  projectId: string;
};

export async function ProjectMyTasksContent({ projectId }: ProjectMyTasksContentProps) {
  const currentUser = await getCurrentUser().catch(() => undefined);
  const initialData = currentUser?.username
    ? await getProjectWorkItems(projectId, {
        assigneeUsername: currentUser.username,
      }).catch(() => undefined)
    : undefined;

  return (
    <ProjectMyTasksClient
      projectId={projectId}
      assigneeUsername={currentUser?.username}
      initialData={initialData}
    />
  );
}
