import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInvitationShell } from "@/domains/workspaces/components/invitation/WorkspaceInvitationShell";
import { WorkspaceInvitationSpinner } from "@/domains/workspaces/components/invitation/WorkspaceInvitationSpinner";

type WorkspaceInvitationLoadingSectionProps = {
  action: "load" | "accept" | "decline";
};

export function WorkspaceInvitationLoadingSection({ action }: WorkspaceInvitationLoadingSectionProps) {
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
