"use client";

import * as React from "react";
import { Check, Plus } from "lucide-react";

import { UserAvatar } from "@/atomics/atoms/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import type { ProjectParticipant } from "@/domains/projects/types";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemAssigneeSelectorProps = {
  id?: string;
  members: ProjectParticipant[];
  selectedUsernames: string[];
  disabled?: boolean;
  maxVisible?: number;
  onChange: (usernames: string[]) => void;
};

export function ProjectWorkItemAssigneeSelector({
  id,
  members,
  selectedUsernames,
  disabled = false,
  maxVisible = 4,
  onChange,
}: ProjectWorkItemAssigneeSelectorProps) {
  const selectedSet = React.useMemo(
    () => new Set(selectedUsernames.map(username => username.toLowerCase())),
    [selectedUsernames],
  );
  const selectedMembers = members.filter(member => selectedSet.has(member.username.toLowerCase()));
  const visibleMembers = selectedMembers.slice(0, maxVisible);
  const overflowCount = selectedMembers.length - visibleMembers.length;

  const toggle = (username: string) => {
    const key = username.toLowerCase();
    if (selectedSet.has(key)) {
      onChange(selectedUsernames.filter(current => current.toLowerCase() !== key));
    } else {
      onChange([...selectedUsernames, username]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-label="Edit assignees"
          className={cn(
            "flex items-center rounded-full transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {visibleMembers.length > 0 && (
            <span className="flex items-center">
              {visibleMembers.map((member, index) => (
                <UserAvatar
                  key={member.userId}
                  name={member.fullName}
                  seed={member.userId}
                  title={`${member.fullName} (@${member.username})`}
                  className={cn("ring-2 ring-surface", index > 0 && "-ml-2")}
                />
              ))}
              {overflowCount > 0 && (
                <span className="-ml-2 grid size-7 shrink-0 place-items-center rounded-full bg-surface-strong text-[11px] font-semibold text-prism-muted ring-2 ring-surface">
                  +{overflowCount}
                </span>
              )}
            </span>
          )}
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full border border-dashed border-border text-prism-muted",
              "transition-colors hover:border-border-strong hover:text-prism-body",
              selectedMembers.length > 0 ? "ml-1.5" : "",
            )}
          >
            <Plus className="size-3.5" />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-60 max-h-64 overflow-y-auto py-1"
      >
        {members.length === 0 ? (
          <div className="px-3 py-2 text-xs text-prism-muted">No members available</div>
        ) : (
          members.map(member => {
            const isSelected = selectedSet.has(member.username.toLowerCase());
            return (
              <DropdownMenuItem
                key={member.userId}
                className="justify-between gap-2 px-2 py-1.5"
                onSelect={event => {
                  event.preventDefault();
                  toggle(member.username);
                }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <UserAvatar
                    name={member.fullName}
                    seed={member.userId}
                    className="size-6 text-[10px]"
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm text-prism-body">{member.fullName}</span>
                    <span className="truncate text-xs text-prism-muted">@{member.username}</span>
                  </span>
                </span>
                {isSelected && <Check className="size-3.5 shrink-0 text-prism-muted" />}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
