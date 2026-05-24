"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/atomics/molecules/Dialog";
import { CreateProjectWorkItemForm } from "@/domains/projects/components/CreateProjectWorkItemForm";
import type { ProjectWorkItemType } from "@/domains/projects/types";

type CreateProjectWorkItemDialogProps = {
  open: boolean;
  projectId: string;
  parentId?: string;
  title?: string;
  description?: string;
  defaultType?: ProjectWorkItemType;
  onOpenChange: (open: boolean) => void;
};

export function CreateProjectWorkItemDialog({
  open,
  projectId,
  parentId,
  title = "Create work item",
  description = "Set the work item type, priority, and planning details.",
  defaultType,
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
          defaultType={defaultType}
          onCreated={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
