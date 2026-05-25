import { getWorkspaceJobs } from "@/domains/workspaces/api";
import { WorkspaceJobsClient } from "@/domains/workspaces/components/WorkspaceJobsClient";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceJobsContentProps = {
  workspace: Workspace;
  canManageJobs: boolean;
};

export async function WorkspaceJobsContent({ workspace, canManageJobs }: WorkspaceJobsContentProps) {
  const initialData = await getWorkspaceJobs(workspace.workspaceId);

  return (
    <WorkspaceJobsClient
      workspace={workspace}
      initialData={initialData}
      canManageJobs={canManageJobs}
    />
  );
}
