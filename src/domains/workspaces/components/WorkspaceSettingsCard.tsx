"use client";

import { CalendarDays, FolderKanban, MoreVertical, Users } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceMetaItem } from "@/domains/workspaces/components/list/WorkspaceMetaItem";
import type { Workspace } from "@/domains/workspaces/types";
import { formatWorkspaceCount } from "@/domains/workspaces/utils/display";

type WorkspaceSettingsCardProps = {
  workspace: Workspace;
  canManage: boolean;
  onEdit: () => void;
};

export function WorkspaceSettingsCard({ workspace, canManage, onEdit }: WorkspaceSettingsCardProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Typography
            variant="caption"
            tone="muted"
            className="uppercase tracking-[0.2em]"
          >
            Workspace
          </Typography>
          <Typography
            variant="h2"
            tone="primary"
            className="mt-2"
          >
            {workspace.name}
          </Typography>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1 font-mono"
          >
            /{workspace.slug}
          </Typography>
          <Typography
            variant="body"
            tone="muted"
            className="mt-4 max-w-3xl"
          >
            {workspace.description || "No description yet."}
          </Typography>

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

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2 shrink-0">
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
            <div className="flex items-center gap-2 text-prism-muted">
              <CalendarDays className="size-3.5 shrink-0" />
              <Typography
                variant="caption"
                tone="muted"
              >
                Created at{" "}
                {new Date(workspace.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </div>
          </div>
        </div>

        {canManage && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-prism-muted"
            aria-label={`Edit ${workspace.name}`}
            onClick={onEdit}
          >
            <MoreVertical className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
