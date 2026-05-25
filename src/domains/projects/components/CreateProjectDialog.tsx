"use client";

import { Dialog, DialogContent } from "@/atomics/molecules/Dialog";
import { CreateProjectDialogForm } from "@/domains/projects/components/create-dialog/CreateProjectDialogForm";
import type { Project } from "@/domains/projects/types";

type CreateProjectDialogProps = {
  open: boolean;
  workspaceSlug: string;
  onOpenChange: (open: boolean) => void;
  onCreated?: (project: Project) => void;
};

export function CreateProjectDialog({ open, workspaceSlug, onOpenChange, onCreated }: CreateProjectDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl overflow-hidden p-0">
        <CreateProjectDialogForm
          key={open ? "open" : "closed"}
          workspaceSlug={workspaceSlug}
          onOpenChange={onOpenChange}
          onCreated={onCreated}
        />
      </DialogContent>
    </Dialog>
  );
}
