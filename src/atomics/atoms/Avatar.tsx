"use client";

import * as React from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/atomics/atoms/Tooltip";
import { cn } from "@/shared/utils/cn";

// Shared avatar palette + helpers so initials avatars look identical everywhere
// (assignees, comment authors, etc). The color is keyed off a stable seed
// (use the user id) so the same person always gets the same color across the app.
// Colors are intentionally distinct from status/priority colors and are inlined
// so they render regardless of the Tailwind token set.
export const AVATAR_PALETTE = ["#475569", "#b45309", "#be123c", "#0e7490", "#6d28d9", "#a21caf"];

export function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

type UserAvatarProps = {
  /** Display name used to derive the initials. */
  name: string;
  /** Stable seed for the color (use the user id). Falls back to `name`. */
  seed?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export const UserAvatar = React.forwardRef<HTMLSpanElement, UserAvatarProps>(
  ({ name, seed, title, className, ...rest }, ref) => (
    <span
      ref={ref}
      title={title}
      style={{ backgroundColor: getAvatarColor(seed ?? name) }}
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white",
        className,
      )}
      {...rest}
    >
      {getInitials(name)}
    </span>
  ),
);
UserAvatar.displayName = "UserAvatar";

export type AvatarStackUser = {
  /** Stable id used as the color seed (use the user id). */
  id: string;
  /** Display name used for initials + tooltip. */
  name: string;
};

type UserAvatarStackProps = {
  users: AvatarStackUser[];
  /** Max avatars shown before collapsing into a "+N" chip. */
  max?: number;
  /** Extra classes applied to each avatar (e.g. sizing). */
  avatarClassName?: string;
};

export function UserAvatarStack({ users, max = 4, avatarClassName }: UserAvatarStackProps) {
  if (users.length === 0) return null;
  const visible = users.slice(0, max);
  const overflowCount = users.length - visible.length;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex cursor-default items-center">
            {visible.map((user, index) => (
              <UserAvatar
                key={user.id}
                name={user.name}
                seed={user.id}
                className={cn("ring-2 ring-surface", index > 0 && "-ml-2", avatarClassName)}
              />
            ))}
            {overflowCount > 0 && (
              <span className="-ml-2 grid size-7 shrink-0 place-items-center rounded-full bg-surface-strong text-[11px] font-semibold text-prism-muted ring-2 ring-surface">
                +{overflowCount}
              </span>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border-border/75 px-3 py-2"
        >
          <div className="flex flex-col gap-1.5">
            {users.map(user => (
              <div
                key={user.id}
                className="flex items-center gap-2"
              >
                <UserAvatar
                  name={user.name}
                  seed={user.id}
                  className="size-5 text-[9px]"
                />
                <span className="text-xs">{user.name}</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
