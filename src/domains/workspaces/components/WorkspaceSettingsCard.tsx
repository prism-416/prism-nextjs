"use client";

import { useMemo } from "react";
import { CalendarDays, FolderKanban, Users } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceMemberRow } from "@/domains/workspaces/components/WorkspaceMemberRow";
import { WorkspaceActionsMenu } from "@/domains/workspaces/components/list/WorkspaceActionsMenu";
import { WorkspaceMetaItem } from "@/domains/workspaces/components/list/WorkspaceMetaItem";
import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import type { Workspace } from "@/domains/workspaces/types";
import { formatWorkspaceCount } from "@/domains/workspaces/utils/display";
import { getWorkspaceMemberSortRank } from "@/domains/workspaces/utils/member";

type WorkspaceSettingsCardProps = {
  workspace: Workspace;
  canManage: boolean;
  isOwner: boolean;
  currentUserId?: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function WorkspaceSettingsCard({
  workspace,
  canManage,
  isOwner,
  currentUserId,
  onEdit,
  onDelete,
}: WorkspaceSettingsCardProps) {
  const { data: members = [] } = useWorkspaceMembers(workspace.workspaceId);
  const sortedMembers = useMemo(
    () =>
      [...members].sort(
        (a, b) => getWorkspaceMemberSortRank(a, workspace.ownerId) - getWorkspaceMemberSortRank(b, workspace.ownerId),
      ),
    [members, workspace.ownerId],
  );

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
          <WorkspaceActionsMenu
            workspaceName={workspace.name}
            onEdit={onEdit}
            onDelete={isOwner ? onDelete : undefined}
          />
        )}
      </div>

      {sortedMembers.length > 0 && (
        <div className="mt-5 border-t border-border/60 pt-4">
          <Typography
            variant="bodySm"
            tone="default"
            weight="medium"
            className="mb-2.5"
          >
            Members
          </Typography>
          <div className="overflow-hidden rounded-lg border border-border/70">
            {sortedMembers.map(member => (
              <WorkspaceMemberRow
                key={member.userId}
                member={member}
                ownerId={workspace.ownerId}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
