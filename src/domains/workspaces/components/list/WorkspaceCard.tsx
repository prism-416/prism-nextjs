import Link from "next/link";
import { FolderKanban, Users } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceAvatar } from "@/domains/workspaces/components/list/WorkspaceAvatar";
import { WorkspaceMetaItem } from "@/domains/workspaces/components/list/WorkspaceMetaItem";
import type { Workspace } from "@/domains/workspaces/types";
import {
  formatWorkspaceCount,
  formatWorkspaceRelativeDate,
  getWorkspaceGradient,
} from "@/domains/workspaces/utils/display";
import { cn } from "@/shared/utils/cn";

type WorkspaceCardProps = {
  workspace: Workspace;
};

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const workspaceHref = `/workspaces/${encodeURIComponent(workspace.slug)}`;

  return (
    <Link
      href={workspaceHref}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface p-5",
        "shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_14px_40px_rgba(12,71,103,0.10)]",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundImage: getWorkspaceGradient(workspace) }}
      />

      <div className="relative flex items-start gap-3">
        <WorkspaceAvatar workspace={workspace} />
        <div className="min-w-0">
          <Typography
            variant="title"
            tone="primary"
            className="truncate"
          >
            {workspace.name}
          </Typography>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-0.5 truncate font-mono text-xs"
          >
            /{workspace.slug}
          </Typography>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <WorkspaceMetaItem
          icon={Users}
          label={formatWorkspaceCount(workspace.memberCount, "member", "members")}
        />
        <WorkspaceMetaItem
          icon={FolderKanban}
          label={formatWorkspaceCount(workspace.projectCount, "project", "projects")}
        />
      </div>

      <Typography
        variant="bodySm"
        tone="muted"
        className={cn("relative mt-4 flex-1 line-clamp-2 min-h-10", !workspace.description && "italic opacity-60")}
      >
        {workspace.description || "No description yet."}
      </Typography>

      <div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <div className="inline-flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-prism-teal-500/40" />
            <span className="relative inline-flex size-2 rounded-full bg-prism-teal-500" />
          </span>
          <Typography
            variant="caption"
            tone="muted"
          >
            Active
          </Typography>
        </div>
        <Typography
          variant="caption"
          tone="muted"
        >
          Created {formatWorkspaceRelativeDate(workspace.createdAt)}
        </Typography>
      </div>
    </Link>
  );
}
