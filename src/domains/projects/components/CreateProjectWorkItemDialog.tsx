"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/atomics/molecules/Dialog";
import { CreateProjectWorkItemForm } from "@/domains/projects/components/CreateProjectWorkItemForm";
import type { ProjectParticipant, ProjectWorkItemStatus } from "@/domains/projects/types";

type CreateProjectWorkItemDialogProps = {
  open: boolean;
  projectId: string;
  workspaceId?: string;
  initialMembers?: ProjectParticipant[];
  parentId?: string;
  initialStatus?: ProjectWorkItemStatus;
  title?: string;
  description?: string;
  onOpenChange: (open: boolean) => void;
};

export function CreateProjectWorkItemDialog({
  open,
  projectId,
  workspaceId,
  initialMembers,
  parentId,
  initialStatus,
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
          key={`${open ? "open" : "closed"}-${initialStatus ?? "todo"}`}
          projectId={projectId}
          workspaceId={workspaceId}
          initialMembers={initialMembers}
          parentId={parentId}
          initialStatus={initialStatus}
          onCreated={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
