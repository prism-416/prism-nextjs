import type { ReactNode } from "react";
import { CircleCheck, Crown } from "lucide-react";

import { UserAvatar } from "@/atomics/atoms/Avatar";
import { Badge } from "@/atomics/atoms/Badge";
import { Typography } from "@/atomics/atoms/Typography";
import type { WorkspaceMember } from "@/domains/workspaces/types";
import { getWorkspaceMemberDisplayName, getWorkspaceMemberRoleBadgeClassName } from "@/domains/workspaces/utils/member";
import { cn } from "@/shared/utils/cn";

type WorkspaceMemberRowProps = {
  member: WorkspaceMember;
  ownerId: string;
  currentUserId?: string;
  children?: ReactNode;
};

export function WorkspaceMemberRow({ member, ownerId, currentUserId, children }: WorkspaceMemberRowProps) {
  const isOwner = member.userId === ownerId;
  const isSelf = member.userId === currentUserId;

  return (
    <div className="flex items-center gap-2 border-b border-border/60 px-2.5 py-2 last:border-b-0">
      <UserAvatar
        name={getWorkspaceMemberDisplayName(member)}
        seed={member.userId}
        className="text-primary-foreground"
      />
      <div className="min-w-0 flex-1">
        <Typography
          variant="bodySm"
          tone="primary"
          fontSize="base"
          weight="medium"
          className="truncate"
        >
          {getWorkspaceMemberDisplayName(member)}
        </Typography>
        <Typography
          variant="caption"
          tone="muted"
          fontSize="xs"
          lineHeight="none"
          className="mt-0.5 block truncate"
        >
          @{member.username}
        </Typography>
      </div>
      {isSelf ? (
        <Badge
          icon={CircleCheck}
          size="sm"
        >
          You
        </Badge>
      ) : null}
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] font-medium capitalize leading-none",
          getWorkspaceMemberRoleBadgeClassName(member, ownerId),
        )}
      >
        {isOwner ? <Crown className="size-3" /> : null}
        {isOwner ? "owner" : member.role}
      </span>
      {children}
    </div>
  );
}
