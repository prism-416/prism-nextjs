"use client";

import { Dialog, DialogContent } from "@/atomics/molecules/Dialog";
import { WorkspaceInviteMembersDialogContent } from "@/domains/workspaces/components/WorkspaceInviteMembersDialogContent";

type WorkspaceInviteMembersDialogProps = {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WorkspaceInviteMembersDialog({ workspaceId, open, onOpenChange }: WorkspaceInviteMembersDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl">
        {open ? (
          <WorkspaceInviteMembersDialogContent
            workspaceId={workspaceId}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
