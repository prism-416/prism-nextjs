import { FolderKanban, MoreVertical, Users } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceAvatar } from "@/domains/workspace/components/list/WorkspaceAvatar";
import { WorkspaceMetaItem } from "@/domains/workspace/components/list/WorkspaceMetaItem";
import type { Workspace } from "@/domains/workspace/types";
import { formatWorkspaceCount, formatWorkspaceRelativeDate } from "@/domains/workspace/utils/display";
import { cn } from "@/shared/utils/cn";

type WorkspaceRowProps = {
  workspace: Workspace;
};

export function WorkspaceRow({ workspace }: WorkspaceRowProps) {
  return (
    <article
      className={cn(
        "group flex items-center gap-4 rounded-xl border border-border/80 bg-surface px-4 py-3",
        "transition-colors hover:border-border-strong hover:bg-surface-strong",
      )}
    >
      <WorkspaceAvatar
        workspace={workspace}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <Typography
          variant="title"
          tone="primary"
          className="truncate text-base"
        >
          {workspace.name}
        </Typography>
        <Typography
          variant="bodySm"
          tone="muted"
          className="truncate"
        >
          {workspace.description || `/${workspace.slug}`}
        </Typography>
      </div>
      <div className="hidden shrink-0 items-center gap-3 md:flex">
        <WorkspaceMetaItem
          icon={Users}
          label={formatWorkspaceCount(workspace.memberCount, "member", "members")}
        />
        <WorkspaceMetaItem
          icon={FolderKanban}
          label={formatWorkspaceCount(workspace.projectCount, "project", "projects")}
        />
        <Typography
          variant="caption"
          tone="muted"
          className="ml-1"
        >
          {formatWorkspaceRelativeDate(workspace.createdAt)}
        </Typography>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-prism-muted"
        aria-label={`${workspace.name} options`}
      >
        <MoreVertical className="size-4" />
      </Button>
    </article>
  );
}
