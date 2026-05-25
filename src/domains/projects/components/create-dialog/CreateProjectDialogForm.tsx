"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { DialogFooter } from "@/atomics/molecules/Dialog";
import { CreateProjectDetailsSection } from "@/domains/projects/components/create-dialog/CreateProjectDetailsSection";
import { CreateProjectDialogHero } from "@/domains/projects/components/create-dialog/CreateProjectDialogHero";
import { useCreateProject } from "@/domains/projects/hooks/useCreateProject";
import type { Project } from "@/domains/projects/types";

type CreateProjectDialogFormProps = {
  workspaceSlug: string;
  onOpenChange: (open: boolean) => void;
  onCreated?: (project: Project) => void;
};

const NAME_MAX = 50;
const DESCRIPTION_MAX = 1000;

export function CreateProjectDialogForm({ workspaceSlug, onOpenChange, onCreated }: CreateProjectDialogFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { mutateAsync, isPending, error } = useCreateProject({ workspaceSlug });
  const trimmedName = name.trim();
  const isNameValid = trimmedName.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isNameValid) {
      setFieldError("Project name is required.");
      return;
    }

    setFieldError(null);

    try {
      const project = await mutateAsync({
        workspaceSlug,
        name: trimmedName,
        description: description.trim() || undefined,
      });

      onCreated?.(project);
      onOpenChange(false);
    } catch {
      // The mutation error is rendered below the form fields.
    }
  }

  return (
    <>
      <CreateProjectDialogHero />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 px-6 pb-6 pt-5"
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
            setFieldError(null);
          }}
          onDescriptionChange={setDescription}
        />

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-prism-danger-soft bg-prism-danger-soft/20 px-3 py-2"
          >
            <Typography
              variant="caption"
              tone="inherit"
              className="text-prism-danger"
            >
              {error.message || "Something went wrong. Please try again."}
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
            disabled={!isNameValid || isPending}
            className="h-10 rounded-lg px-5"
          >
            {isPending ? "Creating..." : "Create project"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
