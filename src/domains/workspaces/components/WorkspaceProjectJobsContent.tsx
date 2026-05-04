import { getWorkspaceProjectJobs } from "@/domains/workspaces/api";
import { WorkspaceProjectJobsClient } from "@/domains/workspaces/components/WorkspaceProjectJobsClient";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceProjectJobsContentProps = {
  workspace: Workspace;
  canManageJobs: boolean;
};

export async function WorkspaceProjectJobsContent({ workspace, canManageJobs }: WorkspaceProjectJobsContentProps) {
  const initialData = await getWorkspaceProjectJobs(workspace.workspaceId);

  return (
    <WorkspaceProjectJobsClient
      workspace={workspace}
      initialData={initialData}
      canManageJobs={canManageJobs}
    />
  );
}
