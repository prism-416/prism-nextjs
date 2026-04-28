import type { ReactNode } from "react";
import { Check, Loader2, Mail, X } from "lucide-react";

import { cn } from "@/shared/utils/cn";

export function WorkspaceInvitationShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex max-w-md flex-col items-center gap-3 px-4 text-center">{children}</div>
    </div>
  );
}

export function WorkspaceInvitationSpinner() {
  return (
    <Loader2
      aria-hidden="true"
      className="size-10 animate-spin text-primary"
    />
  );
}

export function WorkspaceInvitationStatusIcon({ variant }: { variant: "invite" | "success" | "error" }) {
  const Icon = variant === "invite" ? Mail : variant === "success" ? Check : X;

  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-full",
        variant === "error" ? "bg-prism-danger-soft text-prism-danger" : "bg-secondary text-primary",
      )}
    >
      <Icon
        aria-hidden="true"
        className="size-6"
      />
    </div>
  );
}
