"use client";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInvitationShell } from "@/domains/workspaces/components/invitation/WorkspaceInvitationShell";
import { WorkspaceInvitationStatusIcon } from "@/domains/workspaces/components/invitation/WorkspaceInvitationStatusIcon";
import type { InvitationRole } from "@/domains/workspaces/types";
import { formatInvitationRole } from "@/domains/workspaces/utils/invitation";

type WorkspaceInvitationReadySectionProps = {
  workspaceName: string;
  role: InvitationRole;
  onAccept: () => void;
  onDecline: () => void;
};

export function WorkspaceInvitationReadySection({
  workspaceName,
  role,
  onAccept,
  onDecline,
}: WorkspaceInvitationReadySectionProps) {
  return (
    <WorkspaceInvitationShell>
      <WorkspaceInvitationStatusIcon variant="invite" />
      <Typography
        variant="h3"
        tone="primary"
      >
        You&apos;re invited to the &quot;{workspaceName}&quot; workspace
      </Typography>
      <Typography
        variant="bodySm"
        className="text-muted-foreground"
      >
        This invitation grants you the {formatInvitationRole(role)} role.
      </Typography>
      <div className="mt-2 flex gap-2">
        <Button onClick={onAccept}>Accept</Button>
        <Button
          variant="outline"
          onClick={onDecline}
        >
          Decline
        </Button>
      </div>
    </WorkspaceInvitationShell>
  );
}
