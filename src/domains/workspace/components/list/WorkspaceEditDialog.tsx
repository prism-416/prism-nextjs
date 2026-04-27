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
import { CreateWorkspaceDetailsSection } from "@/domains/workspace/components/create-dialog/CreateWorkspaceDetailsSection";
import { useUpdateWorkspace } from "@/domains/workspace/hooks/useUpdateWorkspace";
import type { Workspace } from "@/domains/workspace/types";

type WorkspaceEditDialogProps = {
  workspace: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const NAME_MAX = 48;
const DESCRIPTION_MAX = 180;

export function WorkspaceEditDialog({ workspace, open, onOpenChange }: WorkspaceEditDialogProps) {
  const [name, setName] = useState(() => workspace.name);
  const [description, setDescription] = useState(() => workspace.description ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { mutateAsync: updateWorkspace, isPending, error } = useUpdateWorkspace();

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
      await updateWorkspace({
        workspaceId: workspace.workspaceId,
        payload: {
          name: trimmedName,
          description: trimmedDescription || undefined,
        },
      });

      onOpenChange(false);
    } catch {
      // Mutation error is surfaced through error.
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

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2"
            >
              <Typography
                variant="caption"
                tone="inherit"
                className="text-red-700"
              >
                {error.message || "Failed to update workspace."}
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
