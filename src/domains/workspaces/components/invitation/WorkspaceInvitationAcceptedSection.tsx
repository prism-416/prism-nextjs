import Link from "next/link";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInvitationShell } from "@/domains/workspaces/components/invitation/WorkspaceInvitationShell";
import { WorkspaceInvitationStatusIcon } from "@/domains/workspaces/components/invitation/WorkspaceInvitationStatusIcon";

type WorkspaceInvitationAcceptedSectionProps = {
  workspaceName: string;
  workspaceSlug: string;
};

export function WorkspaceInvitationAcceptedSection({
  workspaceName,
  workspaceSlug,
}: WorkspaceInvitationAcceptedSectionProps) {
  return (
    <WorkspaceInvitationShell>
      <WorkspaceInvitationStatusIcon variant="success" />
      <Typography
        variant="h3"
        tone="primary"
      >
        Invitation accepted
      </Typography>
      <Typography
        variant="bodySm"
        className="text-muted-foreground"
      >
        You can now open the &quot;{workspaceName}&quot; workspace. If you are not signed in, you will be asked to sign
        in first.
      </Typography>
      <Button
        asChild
        className="mt-2"
      >
        <Link href={`/workspaces/${workspaceSlug}`}>Open workspace</Link>
      </Button>
    </WorkspaceInvitationShell>
  );
}
