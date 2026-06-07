"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { WorkspaceLeaveDialog } from "@/domains/workspaces/components/WorkspaceLeaveDialog";
import { WorkspaceRepositoriesCard } from "@/domains/workspaces/components/WorkspaceRepositoriesCard";
import { WorkspaceSettingsCard } from "@/domains/workspaces/components/WorkspaceSettingsCard";
import { WorkspaceDeleteDialog } from "@/domains/workspaces/components/list/WorkspaceDeleteDialog";
import { WorkspaceEditDialog } from "@/domains/workspaces/components/list/WorkspaceEditDialog";
import { useRemoveWorkspaceMember } from "@/domains/workspaces/hooks/useRemoveWorkspaceMember";
import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import { useWorkspacePermissions } from "@/domains/workspaces/hooks/useWorkspacePermissions";
import type { Workspace } from "@/domains/workspaces/types";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";

type WorkspaceSettingsClientProps = {
  workspace: Workspace;
};

export function WorkspaceSettingsClient({ workspace }: WorkspaceSettingsClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const { canManage, isOwner } = useWorkspacePermissions(workspace);
  const { data: currentUser } = useCurrentUser();
  const { data: members } = useWorkspaceMembers(workspace.workspaceId);
  const removeMember = useRemoveWorkspaceMember();
  const knownMemberCount = members?.length ?? workspace.memberCount;
  const isOnlyMemberOwner = isOwner && knownMemberCount === 1;

  return (
    <>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <div>
          <h1 className="text-xl font-semibold text-prism-heading">Settings</h1>
          <p className="mt-1 text-sm text-prism-muted">Manage this workspace profile.</p>
        </div>

        <WorkspaceSettingsCard
          workspace={workspace}
          canManage={canManage}
          onEdit={() => setIsEditing(true)}
        />

        <WorkspaceRepositoriesCard
          workspaceId={workspace.workspaceId}
          canManage={canManage}
        />
      </section>

      {(currentUser || isOwner) && (
        <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)] mt-8">
          <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3">
            <TriangleAlert className="size-3.5 text-prism-danger" />
            <h2 className="text-sm font-semibold text-prism-danger">Danger Zone</h2>
          </div>

          <div className="divide-y divide-border/60">
            {currentUser && (
              <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-prism-heading">Leave workspace</p>
                  <p className="mt-0.5 text-xs text-prism-muted">
                    Remove yourself from this workspace. You&apos;ll need a new invitation to rejoin.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsLeaveOpen(true)}
                  className="h-9 shrink-0 rounded-lg border-[#DC2626]/30 bg-transparent px-4 text-sm text-prism-danger hover:border-[#DC2626]/50 hover:bg-[#DC2626]/5 hover:text-prism-danger"
                >
                  Leave workspace
                </Button>
              </div>
            )}

            {isOwner && (
              <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-prism-heading">Delete workspace</p>
                  <p className="mt-0.5 text-xs text-prism-muted">
                    Permanently delete this workspace and all its data. This action cannot be undone.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteOpen(true)}
                  className="h-9 shrink-0 rounded-lg border-[#DC2626]/30 bg-transparent px-4 text-sm text-prism-danger hover:border-[#DC2626]/50 hover:bg-[#DC2626]/5 hover:text-prism-danger"
                >
                  Delete workspace
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {isEditing && (
        <WorkspaceEditDialog
          key={workspace.workspaceId}
          workspace={workspace}
          open
          onOpenChange={open => {
            if (!open) setIsEditing(false);
          }}
        />
      )}

      <WorkspaceDeleteDialog
        workspace={workspace}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleted={() => router.push("/workspaces")}
      />

      <WorkspaceLeaveDialog
        workspaceName={workspace.name}
        workspaceSlug={workspace.slug}
        isOwner={isOwner}
        isOnlyMemberOwner={isOnlyMemberOwner}
        open={isLeaveOpen}
        isPending={removeMember.isPending}
        onOpenChange={setIsLeaveOpen}
        onConfirm={async () => {
          if (!currentUser) return;
          await removeMember.mutateAsync({
            workspaceId: workspace.workspaceId,
            userId: currentUser.userId,
            removeWorkspaceFromList: true,
          });
          router.push("/workspaces");
        }}
        onDeleteInstead={() => {
          setIsLeaveOpen(false);
          setIsDeleteOpen(true);
        }}
      />
    </>
  );
}
