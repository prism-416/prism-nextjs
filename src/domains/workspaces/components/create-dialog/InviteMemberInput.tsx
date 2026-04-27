"use client";

import { Search } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import type { InvitationRole, WorkspaceInvitationRoleOption } from "@/domains/workspaces/types";
import { cn } from "@/shared/utils/cn";

type InviteMemberInputProps = {
  value: string;
  role: InvitationRole;
  roleOptions: WorkspaceInvitationRoleOption[];
  errorMessage?: string | null;
  inputDisabled?: boolean;
  actionDisabled?: boolean;
  roleOptionsDisabled?: boolean;
  isResolvingMember?: boolean;
  onValueChange: (value: string) => void;
  onRoleChange: (role: InvitationRole) => void;
  onSubmit: () => void;
};

export function InviteMemberInput({
  value,
  role,
  roleOptions,
  errorMessage,
  inputDisabled = false,
  actionDisabled = false,
  roleOptionsDisabled = false,
  isResolvingMember = false,
  onValueChange,
  onRoleChange,
  onSubmit,
}: InviteMemberInputProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-prism-muted" />
        <Input
          id="workspace-members"
          name="memberSearch"
          maxLength={320}
          placeholder="Search by name, username, or email"
          value={value}
          disabled={inputDisabled}
          onChange={event => onValueChange(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit();
            }
          }}
          className={cn(
            "h-11 rounded-xl border-border bg-surface-field pl-9 focus-visible:ring-2 focus-visible:ring-ring",
            errorMessage && "border-red-300 focus-visible:ring-red-300/60",
          )}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? "workspace-member-search-error" : undefined}
        />
      </div>
      <select
        id="workspace-invite-role"
        value={role}
        onChange={event => onRoleChange(event.target.value as InvitationRole)}
        className={cn(
          "h-11 w-[112px] shrink-0 rounded-xl border border-border bg-surface-field px-2 text-sm text-prism-body",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        aria-label="Invite role"
        disabled={inputDisabled || roleOptionsDisabled}
      >
        {roleOptions.map(option => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      <Button
        type="button"
        variant="outline"
        onClick={onSubmit}
        disabled={actionDisabled || value.trim().length === 0}
        className="h-11 rounded-xl px-4"
      >
        {isResolvingMember ? "Checking..." : "Add"}
      </Button>
    </div>
  );
}
