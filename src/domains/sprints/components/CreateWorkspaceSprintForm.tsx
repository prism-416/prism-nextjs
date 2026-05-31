"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Textarea } from "@/atomics/atoms/Textarea";
import { DatePicker } from "@/atomics/molecules/DatePicker";
import { useCreateWorkspaceSprint } from "@/domains/sprints/hooks/useCreateWorkspaceSprint";

type CreateWorkspaceSprintFormProps = {
  workspaceId: string;
  defaultStartsAt: string;
  defaultEndsAt: string;
  nextSprintNumber: number;
  onCreated: () => void;
};

function toStartOfDayIsoDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function getInitialFormState(defaultStartsAt: string, defaultEndsAt: string) {
  return {
    goal: "",
    startsAt: defaultStartsAt,
    endsAt: defaultEndsAt,
  };
}

export function CreateWorkspaceSprintForm({
  workspaceId,
  defaultStartsAt,
  defaultEndsAt,
  nextSprintNumber,
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

    if (!form.startsAt || !form.endsAt) {
      setError("Start date and end date are required.");
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
          goal: form.goal.trim() || undefined,
          startsAt: toStartOfDayIsoDate(form.startsAt),
          endsAt: toStartOfDayIsoDate(form.endsAt),
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
          <label className="text-xs font-medium text-prism-muted">Name</label>
          <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-sm text-prism-muted/60 select-none">
            Sprint #{nextSprintNumber}
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${formId}-start`}
            className="text-xs font-medium text-prism-muted"
          >
            Start
          </label>
          <DatePicker
            id={`${formId}-start`}
            value={form.startsAt}
            onChange={value => updateForm("startsAt", value)}
            placeholder="Pick start date"
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
          <DatePicker
            id={`${formId}-end`}
            value={form.endsAt}
            min={form.startsAt}
            onChange={value => updateForm("endsAt", value)}
            placeholder="Pick end date"
            disabled={isPending}
          />
        </div>
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
          className="min-h-20 bg-surface-field"
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
