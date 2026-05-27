"use client";

import { TriangleAlert } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/atomics/molecules/Dialog";
import { useDeleteProjectWorkItem } from "@/domains/projects/hooks/useDeleteProjectWorkItem";
import type { ProjectWorkItem } from "@/domains/projects/types";
import { getProjectMutationErrorMessage } from "@/domains/projects/utils/error";

type ProjectWorkItemDeleteDialogProps = {
  projectId: string;
  workItem: ProjectWorkItem;
  childCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export function ProjectWorkItemDeleteDialog({
  projectId,
  workItem,
  childCount,
  open,
  onOpenChange,
  onDeleted,
}: ProjectWorkItemDeleteDialogProps) {
  const { mutateAsync: deleteWorkItem, isPending, error } = useDeleteProjectWorkItem();

  const handleDelete = async () => {
    try {
      await deleteWorkItem({ projectId, itemId: workItem.itemId });
      onOpenChange(false);
      onDeleted();
    } catch {
      // Mutation error is rendered below.
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!isPending) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="border-b border-prism-danger-soft bg-prism-danger-soft/15 px-6 pb-5 pt-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-prism-danger-soft/60 text-prism-danger">
              <TriangleAlert className="size-5" />
            </span>
            <DialogHeader className="gap-0.5">
              <DialogTitle>Delete work item</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-xl border border-border/80 bg-surface px-4 py-3">
            <Typography
              variant="caption"
              tone="muted"
              className="uppercase tracking-[0.16em]"
            >
              Work item
            </Typography>
            <Typography
              variant="bodySm"
              tone="primary"
              weight="semibold"
              className="mt-1 line-clamp-2"
            >
              {workItem.title}
            </Typography>
          </div>

          <div className="rounded-xl border border-prism-danger-soft bg-prism-danger-soft/15 px-4 py-3">
            <Typography
              variant="bodySm"
              tone="primary"
              weight="medium"
            >
              Permanently delete this work item?
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="mt-1 block"
            >
              {childCount > 0
                ? `${childCount} child work item${childCount === 1 ? "" : "s"} will also be deleted.`
                : "It will disappear from this project and cannot be restored."}
            </Typography>
          </div>

          {error != null && (
            <div className="rounded-xl border border-prism-danger-soft bg-prism-danger-soft/15 px-3 py-2 text-sm text-prism-danger">
              {getProjectMutationErrorMessage(error, "Failed to delete work item.")}
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-10 rounded-lg px-4"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleDelete()}
              disabled={isPending}
              className="h-10 rounded-lg bg-prism-danger px-5 text-white hover:bg-prism-danger/90"
            >
              {isPending ? "Deleting..." : "Delete work item"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
