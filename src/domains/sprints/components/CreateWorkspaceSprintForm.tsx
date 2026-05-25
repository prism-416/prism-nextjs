"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Textarea } from "@/atomics/atoms/Textarea";
import { useCreateWorkspaceSprint } from "@/domains/sprints/hooks/useCreateWorkspaceSprint";
import type { SprintStatus } from "@/domains/sprints/types";
import { getSprintStatusLabel, SPRINT_STATUSES } from "@/domains/sprints/utils/sprint";
import { cn } from "@/shared/utils/cn";

type CreateWorkspaceSprintFormProps = {
  workspaceId: string;
  defaultStartsAt: string;
  defaultEndsAt: string;
  onCreated: () => void;
};

function toStartOfDayIsoDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function getInitialFormState(defaultStartsAt: string, defaultEndsAt: string) {
  return {
    name: "",
    goal: "",
    startsAt: defaultStartsAt,
    endsAt: defaultEndsAt,
    status: "planned" as SprintStatus,
  };
}

export function CreateWorkspaceSprintForm({
  workspaceId,
  defaultStartsAt,
  defaultEndsAt,
  onCreated,
}: CreateWorkspaceSprintFormProps) {
  const formId = React.useId();
  const [form, setForm] = React.useState(() => getInitialFormState(defaultStartsAt, defaultEndsAt));
  const [error, setError] = React.useState<string | null>(null);
  const { mutateAsync, isPending } = useCreateWorkspaceSprint();

  function updateForm<TKey extends keyof typeof form>(key: TKey, value: (typeof form)[TKey]) {
    setForm(previous => ({ ...previous, [key]: value }));
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();

    if (!name || !form.startsAt || !form.endsAt) {
      setError("Name, start date, and end date are required.");
      return;
    }

    if (form.endsAt <= form.startsAt) {
      setError("End date must be after the start date.");
      return;
    }

    try {
      await mutateAsync({
        workspaceId,
        payload: {
          name,
          goal: form.goal.trim() || undefined,
          startsAt: toStartOfDayIsoDate(form.startsAt),
          endsAt: toStartOfDayIsoDate(form.endsAt),
          status: form.status,
        },
      });
      onCreated();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Sprint could not be created.");
    }
  }

  return (
    <form
      className="mt-5"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor={`${formId}-name`}
            className="text-xs font-medium text-prism-muted"
          >
            Name
          </label>
          <Input
            id={`${formId}-name`}
            value={form.name}
            onChange={event => updateForm("name", event.target.value)}
            maxLength={50}
            placeholder="Sprint 1"
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${formId}-start`}
            className="text-xs font-medium text-prism-muted"
          >
            Start
          </label>
          <Input
            id={`${formId}-start`}
            type="date"
            value={form.startsAt}
            onChange={event => updateForm("startsAt", event.target.value)}
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${formId}-end`}
            className="text-xs font-medium text-prism-muted"
          >
            End
          </label>
          <Input
            id={`${formId}-end`}
            type="date"
            value={form.endsAt}
            onChange={event => updateForm("endsAt", event.target.value)}
            disabled={isPending}
          />
        </div>
        <select
          value={form.status}
          onChange={event => updateForm("status", event.target.value as SprintStatus)}
          disabled={isPending}
          className={cn(
            "h-10 rounded-lg border border-border bg-surface-field px-3 text-sm text-prism-body sm:col-span-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          {SPRINT_STATUSES.map(status => (
            <option
              key={status}
              value={status}
            >
              {getSprintStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 space-y-2">
        <label
          htmlFor={`${formId}-goal`}
          className="text-xs font-medium text-prism-muted"
        >
          Goal
        </label>
        <Textarea
          id={`${formId}-goal`}
          value={form.goal}
          onChange={event => updateForm("goal", event.target.value)}
          placeholder="Sprint goal"
          maxLength={1000}
          disabled={isPending}
          className="min-h-20"
        />
      </div>
      {error && <p className="mt-3 text-sm text-prism-danger">{error}</p>}
      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 rounded-lg px-5"
        >
          <Plus className="size-4" />
          {isPending ? "Creating..." : "Create sprint"}
        </Button>
      </div>
    </form>
  );
}
