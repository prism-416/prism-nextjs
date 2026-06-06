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

function areUsernamesEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((username, index) => username === b[index]);
}

type ProjectWorkItemAssigneeSelectorProps = {
  id?: string;
  members: ProjectParticipant[];
  selectedUsernames: string[];
  disabled?: boolean;
  maxVisible?: number;
  showAddButtonWhenSelected?: boolean;
  onChange: (usernames: string[]) => void;
};

export function ProjectWorkItemAssigneeSelector({
  id,
  members,
  selectedUsernames,
  disabled = false,
  maxVisible = 4,
  showAddButtonWhenSelected = true,
  onChange,
}: ProjectWorkItemAssigneeSelectorProps) {
  const [localUsernames, setLocalUsernames] = React.useState(selectedUsernames);

  // Keep refs always pointing at the latest values for use in effects/cleanup
  const onChangeRef = React.useRef(onChange);
  const localUsernamesRef = React.useRef(localUsernames);
  const selectedUsernamesRef = React.useRef(selectedUsernames);
  React.useEffect(() => {
    onChangeRef.current = onChange;
    localUsernamesRef.current = localUsernames;
    selectedUsernamesRef.current = selectedUsernames;
  });

  // Sync from parent when selectedUsernames changes externally (e.g. API rollback)
  React.useEffect(() => {
    setLocalUsernames(selectedUsernames);
  }, [selectedUsernames]);

  // If the editor unmounts while the dropdown is still open (user clicked outside
  // the card), commit whatever selections were in progress — but only if they
  // actually changed, so unmounting (e.g. after the item is deleted) never fires
  // a spurious update against a now-missing item.
  React.useEffect(() => {
    return () => {
      if (!areUsernamesEqual(localUsernamesRef.current, selectedUsernamesRef.current)) {
        onChangeRef.current(localUsernamesRef.current);
      }
    };
  }, []);

  const selectedSet = React.useMemo(
    () => new Set(localUsernames.map(username => username.toLowerCase())),
    [localUsernames],
  );
  const memberByUsername = React.useMemo(
    () => new Map(members.map(member => [member.username.toLowerCase(), member])),
    [members],
  );
  const selectedMembers = localUsernames
    .map(username => memberByUsername.get(username.toLowerCase()))
    .filter((m): m is ProjectParticipant => m !== undefined);
  const visibleMembers = selectedMembers.slice(0, maxVisible);
  const overflowCount = selectedMembers.length - visibleMembers.length;
  const showAddButton = showAddButtonWhenSelected || selectedMembers.length === 0;

  const toggle = (username: string) => {
    const key = username.toLowerCase();
    const nextUsernames = selectedSet.has(key)
      ? localUsernames.filter(current => current.toLowerCase() !== key)
      : [...localUsernames, username];
    setLocalUsernames(nextUsernames);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !areUsernamesEqual(localUsernamesRef.current, selectedUsernamesRef.current)) {
      onChange(localUsernamesRef.current);
    }
  };

  return (
    <DropdownMenu
      modal={false}
      onOpenChange={handleOpenChange}
    >
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
          {showAddButton &&
            (selectedMembers.length > 0 ? (
              <span
                className={cn(
                  "ml-1.5 grid size-7 shrink-0 place-items-center rounded-full border border-dashed border-border text-prism-muted",
                  "transition-colors hover:border-border-strong hover:text-prism-body",
                )}
              >
                <Plus className="size-3.5" />
              </span>
            ) : (
              <span
                className={cn(
                  "inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-dashed border-border px-2.5 text-xs text-prism-muted",
                  "transition-colors hover:border-border-strong hover:text-prism-body",
                )}
              >
                <Plus className="size-3" />
                <span>Assignee</span>
              </span>
            ))}
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
