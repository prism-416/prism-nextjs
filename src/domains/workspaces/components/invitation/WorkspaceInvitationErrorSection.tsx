"use client";

import Link from "next/link";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInvitationShell } from "@/domains/workspaces/components/invitation/WorkspaceInvitationShell";
import { WorkspaceInvitationStatusIcon } from "@/domains/workspaces/components/invitation/WorkspaceInvitationStatusIcon";

type WorkspaceInvitationErrorSectionProps = {
  errorMessage: string;
  onRetry: () => void;
};

export function WorkspaceInvitationErrorSection({ errorMessage, onRetry }: WorkspaceInvitationErrorSectionProps) {
  return (
    <WorkspaceInvitationShell>
      <WorkspaceInvitationStatusIcon variant="error" />
      <Typography
        variant="h3"
        tone="primary"
      >
        Invitation failed
      </Typography>
      <Typography
        variant="bodySm"
        className="text-muted-foreground"
      >
        {errorMessage}
      </Typography>
      <div className="mt-2 flex gap-2">
        <Button
          variant="outline"
          onClick={onRetry}
        >
          Try again
        </Button>
        <Button
          asChild
          variant="ghost"
        >
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    </WorkspaceInvitationShell>
  );
}
