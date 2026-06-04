"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  workspaceSlug?: string;
  isOwner: boolean;
  isOnlyMemberOwner?: boolean;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onDeleteInstead?: () => void;
};

export function WorkspaceLeaveDialog({
  workspaceName,
  workspaceSlug,
  isOwner,
  isOnlyMemberOwner = false,
  open,
  isPending,
  onOpenChange,
  onConfirm,
  onDeleteInstead,
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
            {isOnlyMemberOwner
              ? "You are the only member of this workspace."
              : isOwner
                ? "You are the owner of this workspace."
                : "You will lose access to this workspace and all its projects."}
          </DialogDescription>
        </DialogHeader>

        {isOnlyMemberOwner ? (
          <div className="mt-2 rounded-xl border border-prism-danger-soft bg-prism-danger-soft/20 px-4 py-3">
            <Typography
              variant="bodySm"
              tone="primary"
              className="font-medium"
            >
              Delete workspace instead
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="mt-1 block"
            >
              Since there are no other members, leaving this workspace means deleting it.
            </Typography>
            <Button
              type="button"
              size="sm"
              className="mt-2 h-8 gap-1.5 rounded-lg bg-prism-danger px-2.5 text-xs text-white hover:bg-prism-danger/90"
              onClick={onDeleteInstead}
            >
              Go to delete workspace
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        ) : isOwner ? (
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
              As the owner, you must transfer ownership to another member before leaving.
            </Typography>
            {workspaceSlug && (
              <Button
                asChild
                size="sm"
                className="mt-2 h-8 gap-1.5 rounded-lg bg-prism-navy px-2.5 text-xs text-white hover:bg-prism-navy/90"
                onClick={() => onOpenChange(false)}
              >
                <Link href={`/workspaces/${encodeURIComponent(workspaceSlug)}/members`}>
                  Go to Members
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )}
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

        {!isOwner && (
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
              onClick={onConfirm}
              disabled={isPending}
              className="h-10 rounded-lg bg-prism-danger px-5 text-white hover:bg-prism-danger/90"
            >
              {isPending ? "Leaving..." : "Leave workspace"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
