"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Textarea } from "@/atomics/atoms/Textarea";
import { useCreateProjectWorkItem } from "@/domains/projects/hooks/useCreateProjectWorkItem";
import type { ProjectWorkItemPriority, ProjectWorkItemType } from "@/domains/projects/types";
import {
  getProjectWorkItemPriorityLabel,
  PROJECT_WORK_ITEM_PRIORITIES,
} from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type CreateProjectWorkItemFormProps = {
  projectId: string;
  parentId?: string;
  defaultType?: ProjectWorkItemType;
  onCreated?: () => void;
};

const WORK_ITEM_TYPES: ProjectWorkItemType[] = ["epic", "story", "task"];
const WORK_ITEM_NAME_MAX_LENGTH = 140;
const WORK_ITEM_DESCRIPTION_MAX_LENGTH = 800;

const WORK_ITEM_TYPE_LABELS: Record<ProjectWorkItemType, string> = {
  epic: "Epic",
  story: "Story",
  task: "Task",
};

function getInitialFormState(defaultType: ProjectWorkItemType) {
  return {
    title: "",
    description: "",
    type: defaultType,
    priority: "medium" as ProjectWorkItemPriority,
  };
}

export function CreateProjectWorkItemForm({
  projectId,
  parentId,
  defaultType = "task",
  onCreated,
}: CreateProjectWorkItemFormProps) {
  const formId = React.useId();
  const [form, setForm] = React.useState(() => getInitialFormState(defaultType));
  const [formError, setFormError] = React.useState<string | null>(null);
  const { mutateAsync: createWorkItem, isPending } = useCreateProjectWorkItem();

  const updateForm = React.useCallback(<TKey extends keyof typeof form>(key: TKey, value: (typeof form)[TKey]) => {
    setForm(previous => ({
      ...previous,
      [key]: value,
    }));
    setFormError(null);
  }, []);

  const resetForm = React.useCallback(() => {
    setForm(getInitialFormState(defaultType));
    setFormError(null);
  }, [defaultType]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = form.title.trim();

    if (!trimmedTitle) {
      setFormError("Work item title is required.");
      return;
    }

    try {
      await createWorkItem({
        projectId,
        payload: {
          parentId,
          title: trimmedTitle,
          description: form.description.trim(),
          type: form.type,
          priority: form.priority,
        },
      });
      resetForm();
      onCreated?.();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Work item could not be created.");
    }
  };

  return (
    <form
      className="mt-5"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
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

        <div className="space-y-2">
          <label
            htmlFor={`${formId}-work-item-type`}
            className="text-xs font-medium text-prism-muted"
          >
            Type
          </label>
          <select
            id={`${formId}-work-item-type`}
            value={form.type}
            onChange={event => updateForm("type", event.target.value as ProjectWorkItemType)}
            disabled={isPending}
            className={cn(
              "h-10 w-full rounded-lg border border-border bg-surface-field px-3 text-sm text-prism-body",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {WORK_ITEM_TYPES.map(type => (
              <option
                key={type}
                value={type}
              >
                {WORK_ITEM_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${formId}-work-item-priority`}
            className="text-xs font-medium text-prism-muted"
          >
            Priority
          </label>
          <select
            id={`${formId}-work-item-priority`}
            value={form.priority}
            onChange={event => updateForm("priority", event.target.value as ProjectWorkItemPriority)}
            disabled={isPending}
            className={cn(
              "h-10 w-full rounded-lg border border-border bg-surface-field px-3 text-sm text-prism-body",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {PROJECT_WORK_ITEM_PRIORITIES.map(priority => (
              <option
                key={priority}
                value={priority}
              >
                {getProjectWorkItemPriorityLabel(priority)}
              </option>
            ))}
          </select>
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
          disabled={isPending}
        >
          <Plus className="size-4" />
          {isPending ? "Creating..." : "Create work item"}
        </Button>
      </div>
    </form>
  );
}
