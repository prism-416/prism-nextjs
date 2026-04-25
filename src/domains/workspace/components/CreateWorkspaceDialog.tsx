"use client";

import { Dialog, DialogContent } from "@/atomics/atoms/Dialog";
import { CreateWorkspaceDialogForm } from "@/domains/workspace/components/create-workspace-dialog/CreateWorkspaceDialogForm";
import type { Workspace } from "@/domains/workspace/types";

type CreateWorkspaceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (workspace: Workspace) => void;
};

export function CreateWorkspaceDialog({ open, onOpenChange, onCreated }: CreateWorkspaceDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="overflow-hidden p-0">
        <CreateWorkspaceDialogForm
          key={open ? "open" : "closed"}
          onOpenChange={onOpenChange}
          onCreated={onCreated}
        />
      </DialogContent>
    </Dialog>
  );
}
