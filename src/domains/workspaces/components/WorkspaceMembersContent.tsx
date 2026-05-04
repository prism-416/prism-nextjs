import { getWorkspaceMembers } from "@/domains/workspaces/api";
import { WorkspaceMembersClient } from "@/domains/workspaces/components/WorkspaceMembersClient";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceMembersContentProps = {
  workspace: Workspace;
};

export async function WorkspaceMembersContent({ workspace }: WorkspaceMembersContentProps) {
  const initialData = await getWorkspaceMembers(workspace.workspaceId);

  return (
    <WorkspaceMembersClient
      workspace={workspace}
      initialData={initialData}
    />
  );
}
