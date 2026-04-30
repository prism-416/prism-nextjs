import { Loader2 } from "lucide-react";

export function WorkspaceInvitationSpinner() {
  return (
    <Loader2
      aria-hidden="true"
      className="size-10 animate-spin text-primary"
    />
  );
}
