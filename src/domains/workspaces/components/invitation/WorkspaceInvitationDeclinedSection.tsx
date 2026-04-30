import Link from "next/link";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInvitationShell } from "@/domains/workspaces/components/invitation/WorkspaceInvitationShell";
import { WorkspaceInvitationStatusIcon } from "@/domains/workspaces/components/invitation/WorkspaceInvitationStatusIcon";

type WorkspaceInvitationDeclinedSectionProps = {
  workspaceName: string;
};

export function WorkspaceInvitationDeclinedSection({ workspaceName }: WorkspaceInvitationDeclinedSectionProps) {
  return (
    <WorkspaceInvitationShell>
      <WorkspaceInvitationStatusIcon variant="error" />
      <Typography
        variant="h3"
        tone="primary"
      >
        Invitation declined
      </Typography>
      <Typography
        variant="bodySm"
        className="text-muted-foreground"
      >
        You declined the invitation to join the &quot;{workspaceName}&quot; workspace.
      </Typography>
      <Button
        asChild
        variant="outline"
        className="mt-2"
      >
        <Link href="/">Go to homepage</Link>
      </Button>
    </WorkspaceInvitationShell>
  );
}
