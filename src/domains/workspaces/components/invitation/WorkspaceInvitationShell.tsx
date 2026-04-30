import type { ReactNode } from "react";

export function WorkspaceInvitationShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex max-w-md flex-col items-center gap-3 px-4 text-center">{children}</div>
    </div>
  );
}
