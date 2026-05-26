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
} from "@/atomics/molecules/Dialog";
import { CreateProjectDetailsSection } from "@/domains/projects/components/create-dialog/CreateProjectDetailsSection";
import { useUpdateProject } from "@/domains/projects/hooks/useUpdateProject";
import type { Project } from "@/domains/projects/types";
import { getProjectMutationErrorMessage } from "@/domains/projects/utils/error";

type ProjectEditDialogProps = {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const NAME_MAX = 50;
const DESCRIPTION_MAX = 1000;

export function ProjectEditDialog({ project, open, onOpenChange }: ProjectEditDialogProps) {
  const [name, setName] = useState(() => project.name);
  const [description, setDescription] = useState(() => project.description ?? "");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { mutateAsync: mutateUpdateProject, isPending } = useUpdateProject();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (trimmedName.length < 2) {
      setFieldError("Project name must be at least 2 characters.");
      return;
    }

    setFieldError(null);

    try {
      await mutateUpdateProject({
        projectId: project.projectId,
        projectSlug: project.slug,
        payload: {
          name: trimmedName,
          description: trimmedDescription || undefined,
        },
      });

      onOpenChange(false);
    } catch (error) {
      setFieldError(getProjectMutationErrorMessage(error, "Failed to update project."));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!isPending) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>Update the project name and description.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-5"
          noValidate
        >
          <CreateProjectDetailsSection
            name={name}
            description={description}
            fieldError={fieldError}
            nameMax={NAME_MAX}
            descriptionMax={DESCRIPTION_MAX}
            onNameChange={value => {
              setName(value);
              if (fieldError) setFieldError(null);
            }}
            onDescriptionChange={setDescription}
          />

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
