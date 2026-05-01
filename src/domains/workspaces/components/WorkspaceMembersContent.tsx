import { getWorkspaceMembers } from "@/domains/workspaces/api";
import { WorkspaceMembersClient } from "@/domains/workspaces/components/WorkspaceMembersClient";

type WorkspaceMembersContentProps = {
  workspaceId: string;
};

export async function WorkspaceMembersContent({ workspaceId }: WorkspaceMembersContentProps) {
  const initialData = await getWorkspaceMembers(workspaceId);

  return (
    <WorkspaceMembersClient
      workspaceId={workspaceId}
      initialData={initialData}
    />
  );
}
