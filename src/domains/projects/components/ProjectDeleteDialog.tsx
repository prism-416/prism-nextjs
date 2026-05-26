"use client";

import { useState } from "react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Label } from "@/atomics/atoms/Label";
import { Typography } from "@/atomics/atoms/Typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/atomics/molecules/Dialog";
import { useDeleteProject } from "@/domains/projects/hooks/useDeleteProject";
import type { Project } from "@/domains/projects/types";
import { getDeleteProjectErrorMessage } from "@/domains/projects/utils/error";

type ProjectDeleteDialogProps = {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
};

export function ProjectDeleteDialog({ project, open, onOpenChange, onDeleted }: ProjectDeleteDialogProps) {
  const { mutateAsync: mutateDeleteProject, isPending, error } = useDeleteProject();
  const [input, setInput] = useState("");
  const confirmed = input === project?.name;

  if (!project) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await mutateDeleteProject({ projectId: project.projectId, workspaceId: project.workspaceId });
      onOpenChange(false);
      onDeleted?.();
    } catch {
      // Mutation error is surfaced through `error`.
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!isPending) {
          if (!nextOpen) setInput("");
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div className="rounded-xl border border-prism-danger-soft bg-prism-danger-soft/20 px-4 py-3">
            <Typography
              variant="bodySm"
              tone="primary"
            >
              Delete <span className="font-semibold">{project.name}</span> permanently?
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="mt-1 block"
            >
              This will remove the project and all its work items and data.
            </Typography>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="delete-project-confirm"
              className="text-prism-body"
            >
              Type{" "}
              <code className="rounded-md bg-neutral-100 px-[0.4em] py-[0.2em] font-mono text-[85%]">
                {project.name}
              </code>{" "}
              to confirm
            </Label>
            <Input
              id="delete-project-confirm"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={project.name}
              disabled={isPending}
              className="h-11 rounded-xl border-border bg-surface-field"
            />
          </div>

          {error != null && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
              <Typography
                variant="caption"
                tone="inherit"
                className="text-red-700"
              >
                {getDeleteProjectErrorMessage(error)}
              </Typography>
            </div>
          )}
        </div>

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
            disabled={!confirmed || isPending}
            className="h-10 rounded-lg bg-prism-danger px-5 text-white hover:bg-prism-danger/90 disabled:opacity-40"
          >
            {isPending ? "Deleting..." : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
