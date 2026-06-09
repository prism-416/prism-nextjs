import { getWorkspaceJobs } from "@/domains/workspaces/api";
import { WorkspaceJobsClient } from "@/domains/workspaces/components/WorkspaceJobsClient";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceJobsContentProps = {
  workspace: Workspace;
  initialCanManageJobs: boolean;
};

export async function WorkspaceJobsContent({ workspace, initialCanManageJobs }: WorkspaceJobsContentProps) {
  const initialData = await getWorkspaceJobs(workspace.workspaceId);

  return (
    <WorkspaceJobsClient
      key={workspace.workspaceId}
      workspace={workspace}
      initialData={initialData}
      initialCanManageJobs={initialCanManageJobs}
    />
  );
}
