"use client";

import Link from "next/link";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInvitationShell } from "@/domains/workspaces/components/invitation/WorkspaceInvitationShell";
import { WorkspaceInvitationStatusIcon } from "@/domains/workspaces/components/invitation/WorkspaceInvitationStatusIcon";
import type { InvitationRole } from "@/domains/workspaces/types";
import { formatInvitationRole } from "@/domains/workspaces/utils/invitation";

type WorkspaceInvitationReadySectionProps = {
  workspaceName: string;
  role: InvitationRole;
  signupLink?: string;
  onAccept: () => void;
  onDecline: () => void;
};

export function WorkspaceInvitationReadySection({
  workspaceName,
  role,
  signupLink,
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
        {signupLink ? (
          <Button asChild>
            <Link href={signupLink}>Create account</Link>
          </Button>
        ) : (
          <Button onClick={onAccept}>Accept</Button>
        )}
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
