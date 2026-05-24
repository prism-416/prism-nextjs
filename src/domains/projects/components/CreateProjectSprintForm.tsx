"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Textarea } from "@/atomics/atoms/Textarea";
import { useCreateProjectSprint } from "@/domains/projects/hooks/useCreateProjectSprint";
import type { ProjectSprintStatus } from "@/domains/projects/types";
import { getProjectSprintStatusLabel, PROJECT_SPRINT_STATUSES } from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type CreateProjectSprintFormProps = {
  projectId: string;
  defaultStartsAt: string;
  defaultEndsAt: string;
  onCreated?: () => void;
};

const SPRINT_NAME_MAX_LENGTH = 120;
const SPRINT_DESCRIPTION_MAX_LENGTH = 500;

function toStartOfDayIsoDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function getInitialFormState(defaultStartsAt: string, defaultEndsAt: string) {
  return {
    name: "",
    description: "",
    startsAt: defaultStartsAt,
    endsAt: defaultEndsAt,
    status: "backlog" as ProjectSprintStatus,
  };
}

export function CreateProjectSprintForm({
  projectId,
  defaultStartsAt,
  defaultEndsAt,
  onCreated,
}: CreateProjectSprintFormProps) {
  const formId = React.useId();
  const [form, setForm] = React.useState(() => getInitialFormState(defaultStartsAt, defaultEndsAt));
  const [formError, setFormError] = React.useState<string | null>(null);
  const { mutateAsync: createSprint, isPending } = useCreateProjectSprint();

  const updateForm = React.useCallback(<TKey extends keyof typeof form>(key: TKey, value: (typeof form)[TKey]) => {
    setForm(previous => ({
      ...previous,
      [key]: value,
    }));
    setFormError(null);
  }, []);

  const resetForm = React.useCallback(() => {
    setForm(getInitialFormState(defaultStartsAt, defaultEndsAt));
    setFormError(null);
  }, [defaultEndsAt, defaultStartsAt]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setFormError("Sprint name is required.");
      return;
    }

    if (!form.startsAt || !form.endsAt) {
      setFormError("Start and end dates are required.");
      return;
    }

    if (form.endsAt < form.startsAt) {
      setFormError("End date must be on or after the start date.");
      return;
    }

    try {
      await createSprint({
        projectId,
        payload: {
          name,
          description: description || undefined,
          startsAt: toStartOfDayIsoDate(form.startsAt),
          endsAt: toStartOfDayIsoDate(form.endsAt),
          status: form.status,
        },
      });
      resetForm();
      onCreated?.();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Sprint could not be created.");
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
            htmlFor={`${formId}-project-sprint-name`}
            className="text-xs font-medium text-prism-muted"
          >
            Name
          </label>
          <Input
            id={`${formId}-project-sprint-name`}
            value={form.name}
            onChange={event => updateForm("name", event.target.value)}
            maxLength={SPRINT_NAME_MAX_LENGTH}
            placeholder="Sprint 1"
            disabled={isPending}
            className="h-10 rounded-lg border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${formId}-project-sprint-starts-at`}
            className="text-xs font-medium text-prism-muted"
          >
            Start
          </label>
          <Input
            id={`${formId}-project-sprint-starts-at`}
            type="date"
            value={form.startsAt}
            onChange={event => updateForm("startsAt", event.target.value)}
            disabled={isPending}
            className="h-10 rounded-lg border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${formId}-project-sprint-ends-at`}
            className="text-xs font-medium text-prism-muted"
          >
            End
          </label>
          <Input
            id={`${formId}-project-sprint-ends-at`}
            type="date"
            value={form.endsAt}
            onChange={event => updateForm("endsAt", event.target.value)}
            disabled={isPending}
            className="h-10 rounded-lg border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor={`${formId}-project-sprint-status`}
            className="text-xs font-medium text-prism-muted"
          >
            Status
          </label>
          <select
            id={`${formId}-project-sprint-status`}
            value={form.status}
            onChange={event => updateForm("status", event.target.value as ProjectSprintStatus)}
            disabled={isPending}
            className={cn(
              "h-10 w-full rounded-lg border border-border bg-surface-field px-3 text-sm text-prism-body",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {PROJECT_SPRINT_STATUSES.map(status => (
              <option
                key={status}
                value={status}
              >
                {getProjectSprintStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label
          htmlFor={`${formId}-project-sprint-description`}
          className="text-xs font-medium text-prism-muted"
        >
          Description
        </label>
        <Textarea
          id={`${formId}-project-sprint-description`}
          value={form.description}
          onChange={event => updateForm("description", event.target.value)}
          maxLength={SPRINT_DESCRIPTION_MAX_LENGTH}
          placeholder="Add sprint goal or notes"
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
          {isPending ? "Creating..." : "Create sprint"}
        </Button>
      </div>
    </form>
  );
}
