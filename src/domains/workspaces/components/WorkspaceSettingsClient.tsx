"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { WorkspaceLeaveDialog } from "@/domains/workspaces/components/WorkspaceLeaveDialog";
import { WorkspaceSettingsCard } from "@/domains/workspaces/components/WorkspaceSettingsCard";
import { WorkspaceDeleteDialog } from "@/domains/workspaces/components/list/WorkspaceDeleteDialog";
import { WorkspaceEditDialog } from "@/domains/workspaces/components/list/WorkspaceEditDialog";
import { useRemoveWorkspaceMember } from "@/domains/workspaces/hooks/useRemoveWorkspaceMember";
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
  const removeMember = useRemoveWorkspaceMember();

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
          isOwner={isOwner}
          currentUserId={currentUser?.userId}
          onEdit={() => setIsEditing(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />
      </section>

      {currentUser && (
        <div className="mx-auto flex w-full max-w-6xl justify-end pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsLeaveOpen(true)}
            className="h-9 gap-1.5 rounded-lg border border-red-400 bg-red-50 text-red-600 hover:border-red-500 hover:bg-red-100 hover:text-red-700"
          >
            <LogOut className="size-4" />
            Leave Workspace
          </Button>
        </div>
      )}

      {isEditing && (
        <WorkspaceEditDialog
          key={workspace.workspaceId}
          workspace={workspace}
          open
          onOpenChange={open => {
            if (!open) setIsEditing(false);
          }}
          onWorkspaceLeft={() => router.push("/workspaces")}
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
        isOwner={isOwner}
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
      />
    </>
  );
}
