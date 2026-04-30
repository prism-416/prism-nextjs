import Link from "next/link";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInvitationShell } from "@/domains/workspaces/components/invitation/WorkspaceInvitationShell";
import { WorkspaceInvitationStatusIcon } from "@/domains/workspaces/components/invitation/WorkspaceInvitationStatusIcon";

export function WorkspaceInvitationMissingTokenSection() {
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
        No invitation token provided. Please check your email link.
      </Typography>
      <Button
        asChild
        variant="outline"
        className="mt-2"
      >
        <Link href="/sign-in">Go to sign in</Link>
      </Button>
    </WorkspaceInvitationShell>
  );
}
