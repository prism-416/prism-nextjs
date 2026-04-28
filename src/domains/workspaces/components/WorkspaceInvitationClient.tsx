"use client";

import {
  WorkspaceInvitationAcceptedSection,
  WorkspaceInvitationDeclinedSection,
  WorkspaceInvitationErrorSection,
  WorkspaceInvitationExpiredSection,
  WorkspaceInvitationLoadingSection,
  WorkspaceInvitationMissingTokenSection,
  WorkspaceInvitationReadySection,
} from "@/domains/workspaces/components/invitation/WorkspaceInvitationSections";
import { useWorkspaceInvitationAcceptance } from "@/domains/workspaces/hooks/useWorkspaceInvitationAcceptance";
import type { WorkspaceInvitationPreview } from "@/domains/workspaces/types";

type WorkspaceInvitationClientProps = {
  token?: string;
  initialData?: WorkspaceInvitationPreview;
  initialErrorMessage?: string;
};

type WorkspaceInvitationDecisionProps = {
  token: string;
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

function WorkspaceInvitationDecision({ token, initialData, initialErrorMessage }: WorkspaceInvitationDecisionProps) {
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
