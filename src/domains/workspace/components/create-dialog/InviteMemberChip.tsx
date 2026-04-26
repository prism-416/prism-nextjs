"use client";

import { X } from "lucide-react";

import type { InviteMember, WorkspaceInvitationRoleOption } from "@/domains/workspace/types";
import { getInviteDisplayName, getRoleOptionLabel } from "@/domains/workspace/utils/invite-member";
import { cn } from "@/shared/utils/cn";

type InviteMemberChipProps = {
  invite: InviteMember;
  roleOptions: WorkspaceInvitationRoleOption[];
  onRemove: (email: string) => void;
};

export function InviteMemberChip({ invite, roleOptions, onRemove }: InviteMemberChipProps) {
  const displayName = getInviteDisplayName(invite);

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-prism-body">
      <span className="font-medium">{displayName}</span>
      {displayName !== invite.email && <span className="text-prism-muted">{invite.email}</span>}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
          invite.kind === "existing" ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800",
        )}
      >
        {invite.kind === "existing" ? "Existing" : "External"}
      </span>
      <span className="rounded-full bg-prism-navy/6 px-1.5 py-0.5 text-[10px] font-medium text-prism-body">
        {getRoleOptionLabel(roleOptions, invite.role)}
      </span>
      <button
        type="button"
        onClick={() => onRemove(invite.email)}
        className="rounded-full p-0.5 text-prism-muted transition-colors hover:bg-prism-navy/5 hover:text-prism-body"
        aria-label={`Remove ${invite.email}`}
      >
        <X className="size-3" />
      </button>
    </div>
  );
}
