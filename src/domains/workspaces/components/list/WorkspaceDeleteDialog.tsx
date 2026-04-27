"use client";

import { Button } from "@/atomics/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/atomics/molecules/Dialog";
import { Typography } from "@/atomics/atoms/Typography";
import { useDeleteWorkspace } from "@/domains/workspaces/hooks/useDeleteWorkspace";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceDeleteDialogProps = {
  workspace: Workspace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type WorkspaceDeleteError = {
  message?: unknown;
  status?: unknown;
  data?: { message?: unknown } | null;
  response?: {
    status?: unknown;
    data?: { message?: unknown } | null;
  };
};

function getDeleteWorkspaceErrorMessage(error: unknown) {
  const candidate = error as WorkspaceDeleteError | null;
  const status = candidate?.response?.status ?? candidate?.status;

  if (status === 403) {
    return "Only the workspace owner can delete this workspace.";
  }

  const message = candidate?.response?.data?.message ?? candidate?.data?.message ?? candidate?.message;

  return typeof message === "string" && message.trim().length > 0 ? message : "Failed to delete workspace.";
}

export function WorkspaceDeleteDialog({ workspace, open, onOpenChange }: WorkspaceDeleteDialogProps) {
  const { mutateAsync: mutateDeleteWorkspace, isPending, error } = useDeleteWorkspace();

  if (!workspace) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await mutateDeleteWorkspace(workspace.workspaceId);
      onOpenChange(false);
    } catch {
      // Mutation error is surfaced through `error`.
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!isPending) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete workspace</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div className="mt-5 rounded-xl border border-prism-danger-soft bg-prism-danger-soft/20 px-4 py-3">
          <Typography
            variant="bodySm"
            tone="primary"
          >
            Delete <span className="font-semibold">{workspace.name}</span> permanently?
          </Typography>
          <Typography
            variant="caption"
            tone="muted"
            className="mt-1 block"
          >
            This will remove the workspace from your list and revoke access for its members.
          </Typography>
        </div>

        {error != null && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
            <Typography
              variant="caption"
              tone="inherit"
              className="text-red-700"
            >
              {getDeleteWorkspaceErrorMessage(error)}
            </Typography>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="h-10 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleDelete()}
            disabled={isPending}
            className="h-10 rounded-lg bg-prism-danger px-5 text-white hover:bg-prism-danger/90"
          >
            {isPending ? "Deleting..." : "Delete workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
