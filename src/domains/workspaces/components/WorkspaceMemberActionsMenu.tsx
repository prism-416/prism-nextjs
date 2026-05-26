"use client";

import type { ComponentType } from "react";
import { Crown, Eye, LogOut, MoreVertical, Shield, Trash2, UserRound } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import { WORKSPACE_INVITATION_ROLE_OPTIONS } from "@/domains/workspaces/constants/invitation";
import type { InvitationRole, WorkspaceMember } from "@/domains/workspaces/types";

type WorkspaceMemberActionsMenuProps = {
  member: WorkspaceMember;
  disabled?: boolean;
  canManage?: boolean;
  canTransferOwner?: boolean;
  isSelf?: boolean;
  onRoleChange: (role: InvitationRole) => void;
  onRemove: () => void;
  onTransferOwner: () => void;
};

const ROLE_ACTION_ICONS = {
  admin: Shield,
  member: UserRound,
  viewer: Eye,
} satisfies Record<InvitationRole, ComponentType<{ className?: string }>>;

export function WorkspaceMemberActionsMenu({
  member,
  disabled = false,
  canManage = false,
  canTransferOwner = false,
  isSelf = false,
  onRoleChange,
  onRemove,
  onTransferOwner,
}: WorkspaceMemberActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-prism-muted"
          aria-label={`${member.fullName || member.username} options`}
          disabled={disabled}
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-48">
        {canManage
          ? WORKSPACE_INVITATION_ROLE_OPTIONS.map(option => {
              const Icon = ROLE_ACTION_ICONS[option.value];

              return (
                <DropdownMenuItem
                  key={option.value}
                  disabled={member.role === option.value || disabled}
                  onSelect={() => onRoleChange(option.value)}
                  className="gap-2.5 whitespace-nowrap"
                >
                  <Icon className="size-4 text-prism-muted" />
                  Make {option.label.toLowerCase()}
                </DropdownMenuItem>
              );
            })
          : null}

        {canTransferOwner && !isSelf ? (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={disabled}
              onSelect={() => onTransferOwner()}
              className="gap-2.5 whitespace-nowrap"
            >
              <Crown className="size-4 text-prism-muted" />
              Transfer owner
            </DropdownMenuItem>
          </>
        ) : null}

        {canManage ? <DropdownMenuSeparator /> : null}

        <DropdownMenuItem
          disabled={disabled}
          onSelect={() => onRemove()}
          className="gap-2.5 whitespace-nowrap text-prism-danger data-[highlighted]:bg-prism-danger-soft/25 data-[highlighted]:text-prism-danger"
        >
          {isSelf ? <LogOut className="size-4" /> : <Trash2 className="size-4" />}
          {isSelf ? "Leave workspace" : "Remove member"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
