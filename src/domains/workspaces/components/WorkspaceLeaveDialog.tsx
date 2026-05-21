"use client";

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

type WorkspaceLeaveDialogProps = {
  workspaceName: string;
  isOwner: boolean;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function WorkspaceLeaveDialog({
  workspaceName,
  isOwner,
  open,
  isPending,
  onOpenChange,
  onConfirm,
}: WorkspaceLeaveDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!isPending) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Leave workspace</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "You are the owner of this workspace."
              : "You will lose access to this workspace and all its projects."}
          </DialogDescription>
        </DialogHeader>

        {isOwner ? (
          <div className="mt-2 rounded-xl border border-border/80 bg-surface-strong px-4 py-3">
            <Typography
              variant="bodySm"
              tone="primary"
              className="font-medium"
            >
              Transfer ownership first
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="mt-1 block"
            >
              As the owner, you must transfer ownership to another member before leaving. You can do this via the Edit
              workspace dialog.
            </Typography>
          </div>
        ) : (
          <div className="mt-2 rounded-xl border border-prism-danger-soft bg-prism-danger-soft/20 px-4 py-3">
            <Typography
              variant="bodySm"
              tone="primary"
            >
              Leave <span className="font-semibold">{workspaceName}</span>?
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="mt-1 block"
            >
              You will need a new invitation to rejoin.
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
            {isOwner ? "Close" : "Cancel"}
          </Button>
          {!isOwner && (
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="h-10 rounded-lg bg-prism-danger px-5 text-white hover:bg-prism-danger/90"
            >
              {isPending ? "Leaving..." : "Leave workspace"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
