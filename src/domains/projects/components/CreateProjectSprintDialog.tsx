"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/atomics/molecules/Dialog";
import { CreateProjectSprintForm } from "@/domains/projects/components/CreateProjectSprintForm";

type CreateProjectSprintDialogProps = {
  open: boolean;
  projectId: string;
  defaultStartsAt: string;
  defaultEndsAt: string;
  onOpenChange: (open: boolean) => void;
};

export function CreateProjectSprintDialog({
  open,
  projectId,
  defaultStartsAt,
  defaultEndsAt,
  onOpenChange,
}: CreateProjectSprintDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create sprint</DialogTitle>
          <DialogDescription>Set the sprint dates, status, and planning notes.</DialogDescription>
        </DialogHeader>
        <CreateProjectSprintForm
          key={open ? "open" : "closed"}
          projectId={projectId}
          defaultStartsAt={defaultStartsAt}
          defaultEndsAt={defaultEndsAt}
          onCreated={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
