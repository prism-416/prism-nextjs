import { getWorkspaceJobs, getWorkspaceMembers } from "@/domains/workspaces/api";
import { WorkspaceMembersClient } from "@/domains/workspaces/components/WorkspaceMembersClient";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceMembersContentProps = {
  workspace: Workspace;
};

export async function WorkspaceMembersContent({ workspace }: WorkspaceMembersContentProps) {
  const [initialData, initialJobs] = await Promise.all([
    getWorkspaceMembers(workspace.workspaceId),
    getWorkspaceJobs(workspace.workspaceId),
  ]);

  return (
    <WorkspaceMembersClient
      workspace={workspace}
      initialData={initialData}
      initialJobs={initialJobs}
    />
  );
}
