import { Suspense } from "react";

import { WorkspaceInvitationAcceptance } from "@/domains/workspaces/components/WorkspaceInvitationAcceptance";

export default function AcceptWorkspaceInvitationPage() {
  return (
    <Suspense>
      <WorkspaceInvitationAcceptance />
    </Suspense>
  );
}
