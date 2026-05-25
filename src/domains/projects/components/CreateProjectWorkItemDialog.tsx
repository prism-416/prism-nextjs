"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/atomics/molecules/Dialog";
import { CreateProjectWorkItemForm } from "@/domains/projects/components/CreateProjectWorkItemForm";

type CreateProjectWorkItemDialogProps = {
  open: boolean;
  projectId: string;
  parentId?: string;
  title?: string;
  description?: string;
  onOpenChange: (open: boolean) => void;
};

export function CreateProjectWorkItemDialog({
  open,
  projectId,
  parentId,
  title = "Create work item",
  description = "Set the priority and planning details.",
  onOpenChange,
}: CreateProjectWorkItemDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <CreateProjectWorkItemForm
          key={open ? "open" : "closed"}
          projectId={projectId}
          parentId={parentId}
          onCreated={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
