import { getWorkspaceInvitation } from "@/domains/workspaces/api";
import { WORKSPACE_INVITATION_ERROR_MESSAGES } from "@/domains/workspaces/constants/invitation";
import { WorkspaceInvitationClient } from "@/domains/workspaces/components/WorkspaceInvitationClient";
import type { WorkspaceInvitationPreview } from "@/domains/workspaces/types";

type WorkspaceInvitationContentProps = {
  token?: string;
};

export async function WorkspaceInvitationContent({ token }: WorkspaceInvitationContentProps) {
  if (!token) {
    return <WorkspaceInvitationClient />;
  }

  let initialData: WorkspaceInvitationPreview | undefined;
  let initialErrorMessage: string | undefined;

  try {
    initialData = await getWorkspaceInvitation({ token });
    initialErrorMessage = initialData ? undefined : WORKSPACE_INVITATION_ERROR_MESSAGES.load;
  } catch {
    initialErrorMessage = WORKSPACE_INVITATION_ERROR_MESSAGES.load;
  }

  return (
    <WorkspaceInvitationClient
      token={token}
      initialData={initialData ?? undefined}
      initialErrorMessage={initialErrorMessage}
    />
  );
}
