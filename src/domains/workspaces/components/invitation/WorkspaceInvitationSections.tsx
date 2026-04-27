import Link from "next/link";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import {
  WorkspaceInvitationShell,
  WorkspaceInvitationSpinner,
  WorkspaceInvitationStatusIcon,
} from "@/domains/workspaces/components/invitation/WorkspaceInvitationLayout";
import type { InvitationRole } from "@/domains/workspaces/types";

type WorkspaceInvitationActionButtonsProps = {
  onAccept: () => void;
  onDecline: () => void;
};

function formatRole(role: InvitationRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function WorkspaceInvitationLoadingSection({ action }: { action: "load" | "accept" | "decline" }) {
  const title =
    action === "load" ? "Loading invitation" : action === "accept" ? "Accepting invitation" : "Declining invitation";

  return (
    <WorkspaceInvitationShell>
      <WorkspaceInvitationSpinner />
      <Typography
        variant="h3"
        tone="primary"
      >
        {title}
      </Typography>
      <Typography
        variant="bodySm"
        className="text-muted-foreground"
      >
        Please wait a moment.
      </Typography>
    </WorkspaceInvitationShell>
  );
}

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

export function WorkspaceInvitationReadySection({
  workspaceName,
  role,
  onAccept,
  onDecline,
}: WorkspaceInvitationActionButtonsProps & { workspaceName: string; role: InvitationRole }) {
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
        This invitation grants you the {formatRole(role)} role.
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

export function WorkspaceInvitationAcceptedSection({
  workspaceName,
  workspaceSlug,
}: {
  workspaceName: string;
  workspaceSlug: string;
}) {
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

export function WorkspaceInvitationDeclinedSection({ workspaceName }: { workspaceName: string }) {
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

export function WorkspaceInvitationExpiredSection({ workspaceName }: { workspaceName: string }) {
  return (
    <WorkspaceInvitationShell>
      <WorkspaceInvitationStatusIcon variant="error" />
      <Typography
        variant="h3"
        tone="primary"
      >
        Invitation expired
      </Typography>
      <Typography
        variant="bodySm"
        className="text-muted-foreground"
      >
        The invitation to join the &quot;{workspaceName}&quot; workspace has expired.
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

export function WorkspaceInvitationErrorSection({
  errorMessage,
  onRetry,
}: {
  errorMessage: string;
  onRetry: () => void;
}) {
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
