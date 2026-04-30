import { Check, Mail, X } from "lucide-react";

import { cn } from "@/shared/utils/cn";

type WorkspaceInvitationStatusIconProps = {
  variant: "invite" | "success" | "error";
};

export function WorkspaceInvitationStatusIcon({ variant }: WorkspaceInvitationStatusIconProps) {
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
