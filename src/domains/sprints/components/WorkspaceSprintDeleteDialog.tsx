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
import { useDeleteWorkspaceSprint } from "@/domains/sprints/hooks/useDeleteWorkspaceSprint";
import type { Sprint } from "@/domains/sprints/types";

type WorkspaceSprintDeleteDialogProps = {
  sprint: Sprint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export function WorkspaceSprintDeleteDialog({
  sprint,
  open,
  onOpenChange,
  onDeleted,
}: WorkspaceSprintDeleteDialogProps) {
  const { mutateAsync, isPending, error } = useDeleteWorkspaceSprint();

  async function handleDelete() {
    try {
      await mutateAsync({ workspaceId: sprint.workspaceId, sprintId: sprint.sprintId });
      onOpenChange(false);
      onDeleted();
    } catch {
      // error rendered below
    }
  }

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
              <DialogTitle>Delete sprint</DialogTitle>
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
              Sprint
            </Typography>
            <Typography
              variant="bodySm"
              tone="primary"
              weight="semibold"
              className="mt-1"
            >
              {sprint.name}
            </Typography>
            {sprint.goal && (
              <Typography
                variant="caption"
                tone="muted"
                className="mt-0.5 line-clamp-2"
              >
                {sprint.goal}
              </Typography>
            )}
          </div>

          <div className="rounded-xl border border-prism-danger-soft bg-prism-danger-soft/15 px-4 py-3">
            <Typography
              variant="bodySm"
              tone="primary"
              weight="medium"
            >
              Permanently delete this sprint?
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="mt-1 block"
            >
              Work items will not be deleted, but they will be removed from this sprint.
            </Typography>
          </div>

          {error && (
            <div className="rounded-xl border border-prism-danger-soft bg-surface px-3 py-2 text-sm text-prism-danger">
              Sprint could not be deleted.
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-10 rounded-lg px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleDelete()}
              disabled={isPending}
              className="h-10 rounded-lg bg-prism-danger px-5 text-white hover:bg-prism-danger/90"
            >
              {isPending ? "Deleting..." : "Delete sprint"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
