"use client";

import * as React from "react";
import { PencilLine } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Textarea } from "@/atomics/atoms/Textarea";
import { DatePicker } from "@/atomics/molecules/DatePicker";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/atomics/molecules/Dialog";
import { useUpdateWorkspaceSprint } from "@/domains/sprints/hooks/useUpdateWorkspaceSprint";
import type { Sprint } from "@/domains/sprints/types";

type WorkspaceSprintEditDialogProps = {
  sprint: Sprint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function toDateInputValue(iso: string) {
  return iso.slice(0, 10);
}

function toStartOfDayIsoDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function getInitialFormState(sprint: Sprint) {
  return {
    goal: sprint.goal ?? "",
    startsAt: toDateInputValue(sprint.startsAt),
    endsAt: toDateInputValue(sprint.endsAt),
  };
}

export function WorkspaceSprintEditDialog({ sprint, open, onOpenChange }: WorkspaceSprintEditDialogProps) {
  const formId = React.useId();
  const [form, setForm] = React.useState(() => getInitialFormState(sprint));
  const [error, setError] = React.useState<string | null>(null);
  const { mutateAsync, isPending } = useUpdateWorkspaceSprint();

  React.useEffect(() => {
    if (open) setForm(getInitialFormState(sprint));
  }, [open, sprint]);

  function updateForm<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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
        workspaceId: sprint.workspaceId,
        sprintId: sprint.sprintId,
        payload: {
          goal: form.goal.trim() || undefined,
          startsAt: toStartOfDayIsoDate(form.startsAt),
          endsAt: toStartOfDayIsoDate(form.endsAt),
        },
      });
      onOpenChange(false);
    } catch {
      setError("Sprint could not be updated.");
    }
  }

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
              <DialogTitle>Edit sprint</DialogTitle>
              <DialogDescription>Update the sprint goal or dates.</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form
          className="p-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-medium text-prism-muted">Name</label>
              <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-sm text-prism-muted/60 select-none">
                {sprint.name}
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
              onChange={e => updateForm("goal", e.target.value)}
              placeholder="Sprint goal"
              maxLength={1000}
              disabled={isPending}
              className="min-h-20 bg-surface-field"
            />
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-prism-danger-soft bg-surface px-4 py-3 text-sm text-prism-danger">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="h-10 rounded-lg px-5"
              disabled={isPending}
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
