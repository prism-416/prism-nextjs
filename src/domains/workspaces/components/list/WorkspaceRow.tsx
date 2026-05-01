import Link from "next/link";
import { ArrowUpRight, FolderKanban, Users } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceActionsMenu } from "@/domains/workspaces/components/list/WorkspaceActionsMenu";
import { WorkspaceAvatar } from "@/domains/workspaces/components/list/WorkspaceAvatar";
import { WorkspaceMetaItem } from "@/domains/workspaces/components/list/WorkspaceMetaItem";
import type { Workspace } from "@/domains/workspaces/types";
import { formatWorkspaceCount, formatWorkspaceRelativeDate } from "@/domains/workspaces/utils/display";
import { cn } from "@/shared/utils/cn";

type WorkspaceRowProps = {
  workspace: Workspace;
  onEdit: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void;
};

export function WorkspaceRow({ workspace, onEdit, onDelete }: WorkspaceRowProps) {
  const workspaceHref = `/workspaces/${encodeURIComponent(workspace.slug)}/projects`;

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
        asChild
        variant="outline"
        className="hidden h-9 rounded-lg bg-surface px-3 lg:inline-flex"
      >
        <Link href={workspaceHref}>
          Open
          <ArrowUpRight className="size-4" />
        </Link>
      </Button>
      <WorkspaceActionsMenu
        workspaceName={workspace.name}
        onEdit={() => onEdit(workspace)}
        onDelete={() => onDelete(workspace)}
      />
    </article>
  );
}
