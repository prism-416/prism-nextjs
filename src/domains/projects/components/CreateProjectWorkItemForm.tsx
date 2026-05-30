"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Textarea } from "@/atomics/atoms/Textarea";
import { DatePicker } from "@/atomics/molecules/DatePicker";
import { ProjectWorkItemAssigneeSelector } from "@/domains/projects/components/ProjectWorkItemAssigneeSelector";
import { ProjectWorkItemPrioritySelector } from "@/domains/projects/components/ProjectWorkItemPrioritySelector";
import { ProjectWorkItemStatusSelector } from "@/domains/projects/components/ProjectWorkItemStatusSelector";
import { useCreateProjectWorkItem } from "@/domains/projects/hooks/useCreateProjectWorkItem";
import { useProjectParticipants } from "@/domains/projects/hooks/useProjectParticipants";
import type { ProjectParticipant, ProjectWorkItemPriority, ProjectWorkItemStatus } from "@/domains/projects/types";

type CreateProjectWorkItemFormProps = {
  projectId: string;
  workspaceId?: string;
  initialMembers?: ProjectParticipant[];
  parentId?: string;
  onCreated?: () => void;
};

const WORK_ITEM_NAME_MAX_LENGTH = 100;
const WORK_ITEM_DESCRIPTION_MAX_LENGTH = 800;

function getInitialFormState() {
  return {
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
    priority: "medium" as ProjectWorkItemPriority,
    status: "todo" as ProjectWorkItemStatus,
    assigneeUsernames: [] as string[],
  };
}

export function CreateProjectWorkItemForm({
  projectId,
  workspaceId,
  initialMembers,
  parentId,
  onCreated,
}: CreateProjectWorkItemFormProps) {
  const formId = React.useId();
  const [form, setForm] = React.useState(getInitialFormState);
  const [formError, setFormError] = React.useState<string | null>(null);
  const { mutateAsync: createWorkItem, isPending } = useCreateProjectWorkItem();
  const { data: members = [] } = useProjectParticipants(workspaceId, initialMembers);

  const updateForm = React.useCallback(<TKey extends keyof typeof form>(key: TKey, value: (typeof form)[TKey]) => {
    setForm(previous => ({
      ...previous,
      [key]: value,
    }));
    setFormError(null);
  }, []);

  const resetForm = React.useCallback(() => {
    setForm(getInitialFormState());
    setFormError(null);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = form.title.trim();

    if (!trimmedTitle) {
      setFormError("Work item title is required.");
      return;
    }

    if (form.startDate && form.dueDate && form.startDate > form.dueDate) {
      setFormError("Due date must be on or after start date.");
      return;
    }

    try {
      await createWorkItem({
        projectId,
        payload: {
          parentId,
          title: trimmedTitle,
          description: form.description.trim(),
          startDate: form.startDate || null,
          dueDate: form.dueDate || null,
          priority: form.priority,
          status: form.status,
          assigneeUsernames: form.assigneeUsernames,
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
      <div className="grid gap-4">
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor={`${formId}-work-item-status`}
            className="text-xs font-medium text-prism-muted"
          >
            Status
          </label>
          <ProjectWorkItemStatusSelector
            id={`${formId}-work-item-status`}
            value={form.status}
            disabled={isPending}
            onChange={status => updateForm("status", status)}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${formId}-work-item-priority`}
            className="text-xs font-medium text-prism-muted"
          >
            Priority
          </label>
          <ProjectWorkItemPrioritySelector
            id={`${formId}-work-item-priority`}
            value={form.priority}
            disabled={isPending}
            onChange={priority => updateForm("priority", priority)}
          />
        </div>
      </div>

      {workspaceId && (
        <div className="mt-4 space-y-2">
          <label
            htmlFor={`${formId}-work-item-assignees`}
            className="text-xs font-medium text-prism-muted"
          >
            Assignees
          </label>
          <ProjectWorkItemAssigneeSelector
            id={`${formId}-work-item-assignees`}
            members={members}
            selectedUsernames={form.assigneeUsernames}
            disabled={isPending}
            onChange={usernames => updateForm("assigneeUsernames", usernames)}
          />
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor={`${formId}-work-item-start-date`}
            className="text-xs font-medium text-prism-muted"
          >
            Start date
          </label>
          <DatePicker
            id={`${formId}-work-item-start-date`}
            value={form.startDate}
            onChange={value => updateForm("startDate", value)}
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${formId}-work-item-due-date`}
            className="text-xs font-medium text-prism-muted"
          >
            Due date
          </label>
          <DatePicker
            id={`${formId}-work-item-due-date`}
            value={form.dueDate}
            onChange={value => updateForm("dueDate", value)}
            min={form.startDate || undefined}
            disabled={isPending}
          />
        </div>
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
