"use client";

import { WorkspaceInvitationAcceptedSection } from "@/domains/workspaces/components/invitation/WorkspaceInvitationAcceptedSection";
import { WorkspaceInvitationDeclinedSection } from "@/domains/workspaces/components/invitation/WorkspaceInvitationDeclinedSection";
import { WorkspaceInvitationErrorSection } from "@/domains/workspaces/components/invitation/WorkspaceInvitationErrorSection";
import { WorkspaceInvitationExpiredSection } from "@/domains/workspaces/components/invitation/WorkspaceInvitationExpiredSection";
import { WorkspaceInvitationLoadingSection } from "@/domains/workspaces/components/invitation/WorkspaceInvitationLoadingSection";
import { WorkspaceInvitationReadySection } from "@/domains/workspaces/components/invitation/WorkspaceInvitationReadySection";
import { useWorkspaceInvitationAcceptance } from "@/domains/workspaces/hooks/useWorkspaceInvitationAcceptance";
import type { WorkspaceInvitationPreview } from "@/domains/workspaces/types";

type WorkspaceInvitationDecisionProps = {
  token: string;
  initialData?: WorkspaceInvitationPreview;
  initialErrorMessage?: string;
};

export function WorkspaceInvitationDecision({
  token,
  initialData,
  initialErrorMessage,
}: WorkspaceInvitationDecisionProps) {
  const { accept, decline, errorMessage, invitation, retry, status, workspace } = useWorkspaceInvitationAcceptance({
    token,
    initialData,
    initialErrorMessage,
  });

  const workspaceName = workspace?.name ?? invitation?.workspaceName;
  const workspaceSlug = workspace?.slug ?? invitation?.workspaceSlug;

  if (status === "loading") {
    return <WorkspaceInvitationLoadingSection action="load" />;
  }

  if (status === "accepting") {
    return <WorkspaceInvitationLoadingSection action="accept" />;
  }

  if (status === "declining") {
    return <WorkspaceInvitationLoadingSection action="decline" />;
  }

  if (status === "ready" && invitation) {
    return (
      <WorkspaceInvitationReadySection
        workspaceName={invitation.workspaceName}
        role={invitation.role}
        onAccept={accept}
        onDecline={decline}
      />
    );
  }

  if (status === "accepted" && workspaceName && workspaceSlug) {
    return (
      <WorkspaceInvitationAcceptedSection
        workspaceName={workspaceName}
        workspaceSlug={workspaceSlug}
      />
    );
  }

  if (status === "declined" && workspaceName) {
    return <WorkspaceInvitationDeclinedSection workspaceName={workspaceName} />;
  }

  if (status === "expired" && workspaceName) {
    return <WorkspaceInvitationExpiredSection workspaceName={workspaceName} />;
  }

  return (
    <WorkspaceInvitationErrorSection
      errorMessage={errorMessage}
      onRetry={retry}
    />
  );
}
