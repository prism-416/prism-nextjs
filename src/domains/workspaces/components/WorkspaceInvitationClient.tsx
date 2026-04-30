"use client";

import { WorkspaceInvitationDecision } from "@/domains/workspaces/components/WorkspaceInvitationDecision";
import { WorkspaceInvitationMissingTokenSection } from "@/domains/workspaces/components/invitation/WorkspaceInvitationMissingTokenSection";
import type { WorkspaceInvitationPreview } from "@/domains/workspaces/types";

type WorkspaceInvitationClientProps = {
  token?: string;
  initialData?: WorkspaceInvitationPreview;
  initialErrorMessage?: string;
};

export function WorkspaceInvitationClient({ token, initialData, initialErrorMessage }: WorkspaceInvitationClientProps) {
  if (!token) {
    return <WorkspaceInvitationMissingTokenSection />;
  }

  return (
    <WorkspaceInvitationDecision
      token={token}
      initialData={initialData}
      initialErrorMessage={initialErrorMessage}
    />
  );
}
