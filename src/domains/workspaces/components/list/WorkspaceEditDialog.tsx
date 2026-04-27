"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/atomics/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/atomics/atoms/Dialog";
import { Typography } from "@/atomics/atoms/Typography";
import { CreateWorkspaceDetailsSection } from "@/domains/workspaces/components/create-dialog/CreateWorkspaceDetailsSection";
import { useUpdateWorkspace } from "@/domains/workspaces/hooks/useUpdateWorkspace";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceEditDialogProps = {
  workspace: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type WorkspaceMutationError = {
  message?: unknown;
  data?: { message?: unknown } | null;
  response?: {
    data?: { message?: unknown } | null;
  };
};

const NAME_MAX = 20;
const DESCRIPTION_MAX = 1000;

function getWorkspaceMutationErrorMessage(error: unknown, fallback: string) {
  const candidate = error as WorkspaceMutationError | null;
  const message = candidate?.response?.data?.message ?? candidate?.data?.message ?? candidate?.message;

  return typeof message === "string" && message.trim().length > 0 ? message : fallback;
}

export function WorkspaceEditDialog({ workspace, open, onOpenChange }: WorkspaceEditDialogProps) {
  const [name, setName] = useState(() => workspace.name);
  const [description, setDescription] = useState(() => workspace.description ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { mutateAsync: mutateUpdateWorkspace, isPending, error } = useUpdateWorkspace();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (trimmedName.length < 2) {
      setFieldError("Workspace name must be at least 2 characters.");
      return;
    }

    setFieldError(null);

    try {
      await mutateUpdateWorkspace({
        workspaceId: workspace.workspaceId,
        payload: {
          name: trimmedName,
          description: trimmedDescription || undefined,
        },
      });

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
          <DialogTitle>Edit workspace</DialogTitle>
          <DialogDescription>Update the workspace details shown to your team.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-5"
          noValidate
        >
          <CreateWorkspaceDetailsSection
            name={name}
            description={description}
            fieldError={fieldError}
            nameMax={NAME_MAX}
            descriptionMax={DESCRIPTION_MAX}
            onNameChange={value => {
              setName(value);
              if (fieldError) {
                setFieldError(null);
              }
            }}
            onDescriptionChange={setDescription}
          />

          {error != null && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
              <Typography
                variant="caption"
                tone="inherit"
                className="text-red-700"
              >
                {getWorkspaceMutationErrorMessage(error, "Failed to update workspace.")}
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
              type="submit"
              disabled={isPending}
              className="h-10 rounded-lg px-5"
            >
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
