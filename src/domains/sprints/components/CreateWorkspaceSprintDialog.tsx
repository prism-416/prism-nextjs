"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/atomics/molecules/Dialog";
import { CreateWorkspaceSprintForm } from "@/domains/sprints/components/CreateWorkspaceSprintForm";

type CreateWorkspaceSprintDialogProps = {
  open: boolean;
  workspaceId: string;
  defaultStartsAt: string;
  defaultEndsAt: string;
  onOpenChange: (open: boolean) => void;
};

export function CreateWorkspaceSprintDialog({
  open,
  workspaceId,
  defaultStartsAt,
  defaultEndsAt,
  onOpenChange,
}: CreateWorkspaceSprintDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create sprint</DialogTitle>
          <DialogDescription>Plan an iteration for work across this workspace.</DialogDescription>
        </DialogHeader>
        <CreateWorkspaceSprintForm
          key={open ? "open" : "closed"}
          workspaceId={workspaceId}
          defaultStartsAt={defaultStartsAt}
          defaultEndsAt={defaultEndsAt}
          onCreated={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
