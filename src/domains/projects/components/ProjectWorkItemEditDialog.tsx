"use client";

import * as React from "react";
import { PencilLine } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Textarea } from "@/atomics/atoms/Textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/atomics/molecules/Dialog";
import { ProjectWorkItemCode } from "@/domains/projects/components/ProjectWorkItemCode";
import { useUpdateProjectWorkItem } from "@/domains/projects/hooks/useUpdateProjectWorkItem";
import type { ProjectWorkItem } from "@/domains/projects/types";
import { getProjectMutationErrorMessage } from "@/domains/projects/utils/error";

type ProjectWorkItemEditDialogProps = {
  projectId: string;
  workItem: ProjectWorkItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const WORK_ITEM_NAME_MAX_LENGTH = 100;
const WORK_ITEM_DESCRIPTION_MAX_LENGTH = 800;

function getInitialFormState(workItem: ProjectWorkItem) {
  return {
    title: workItem.title,
    description: workItem.description,
  };
}

export function ProjectWorkItemEditDialog({ projectId, workItem, open, onOpenChange }: ProjectWorkItemEditDialogProps) {
  const formId = React.useId();
  const [form, setForm] = React.useState(() => getInitialFormState(workItem));
  const [formError, setFormError] = React.useState<string | null>(null);
  const { mutateAsync: updateWorkItem, isPending } = useUpdateProjectWorkItem();

  const updateForm = React.useCallback(
    <TKey extends keyof ReturnType<typeof getInitialFormState>>(
      key: TKey,
      value: ReturnType<typeof getInitialFormState>[TKey],
    ) => {
      setForm(previous => ({
        ...previous,
        [key]: value,
      }));
      setFormError(null);
    },
    [],
  );

  const trimmedTitle = form.title.trim();
  const trimmedDescription = form.description.trim();
  const hasChanges = trimmedTitle !== workItem.title || trimmedDescription !== workItem.description;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedTitle) {
      setFormError("Work item title is required.");
      return;
    }

    if (!hasChanges) {
      onOpenChange(false);
      return;
    }

    try {
      await updateWorkItem({
        projectId,
        itemId: workItem.itemId,
        payload: {
          title: trimmedTitle,
          description: trimmedDescription,
        },
      });
      onOpenChange(false);
    } catch (error) {
      setFormError(getProjectMutationErrorMessage(error, "Work item could not be updated."));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!isPending) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-xl overflow-hidden p-0">
        <div
          className="border-b border-border/70 px-6 pb-5 pt-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(120,196,212,0.18) 0%, rgba(157,123,255,0.10) 52%, rgba(255,255,255,0) 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-prism-navy text-white shadow-[0_8px_24px_rgba(12,71,103,0.20)]">
              <PencilLine className="size-5" />
            </span>
            <DialogHeader className="gap-0.5">
              <DialogTitle>Edit work item</DialogTitle>
              <DialogDescription>Refine the title and description.</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form
          className="p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <span className="text-xs font-medium text-prism-muted">Code</span>
              <ProjectWorkItemCode code={workItem.code} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-work-item-title`}
                className="text-xs font-medium text-prism-muted"
              >
                Title
              </label>
              <Input
                id={`${formId}-work-item-title`}
                value={form.title}
                onChange={event => updateForm("title", event.target.value)}
                maxLength={WORK_ITEM_NAME_MAX_LENGTH}
                placeholder="Implement onboarding flow"
                disabled={isPending}
                className="h-10 rounded-lg border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label
              htmlFor={`${formId}-work-item-description`}
              className="text-xs font-medium text-prism-muted"
            >
              Description
            </label>
            <Textarea
              id={`${formId}-work-item-description`}
              value={form.description}
              onChange={event => updateForm("description", event.target.value)}
              maxLength={WORK_ITEM_DESCRIPTION_MAX_LENGTH}
              placeholder="Add context or acceptance criteria"
              disabled={isPending}
              className="min-h-20 rounded-lg border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {formError && (
            <div className="mt-3 rounded-xl border border-prism-danger-soft bg-surface px-4 py-3 text-sm text-prism-danger">
              {formError}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="h-10 rounded-lg px-5"
              disabled={isPending || !hasChanges}
            >
              <PencilLine className="size-4" />
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
