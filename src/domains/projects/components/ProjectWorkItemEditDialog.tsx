"use client";

import { useState, type FormEvent } from "react";
import { PencilLine } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Label } from "@/atomics/atoms/Label";
import { Textarea } from "@/atomics/atoms/Textarea";
import { Typography } from "@/atomics/atoms/Typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/atomics/molecules/Dialog";
import { useUpdateProjectWorkItem } from "@/domains/projects/hooks/useUpdateProjectWorkItem";
import type { ProjectWorkItem, ProjectWorkItemPriority, ProjectWorkItemStatus } from "@/domains/projects/types";
import { getProjectMutationErrorMessage } from "@/domains/projects/utils/error";
import {
  getProjectWorkItemPriorityLabel,
  getProjectWorkItemStatusLabel,
  PROJECT_WORK_ITEM_PRIORITIES,
  PROJECT_WORK_ITEM_STATUSES,
} from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemEditDialogProps = {
  projectId: string;
  workItem: ProjectWorkItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 800;

export function ProjectWorkItemEditDialog({ projectId, workItem, open, onOpenChange }: ProjectWorkItemEditDialogProps) {
  const formId = `edit-work-item-${workItem.itemId}`;
  const [title, setTitle] = useState(() => workItem.title);
  const [description, setDescription] = useState(() => workItem.description);
  const [startDate, setStartDate] = useState(() => workItem.startDate ?? "");
  const [dueDate, setDueDate] = useState(() => workItem.dueDate ?? "");
  const [priority, setPriority] = useState<ProjectWorkItemPriority>(() => workItem.priority);
  const [status, setStatus] = useState<ProjectWorkItemStatus>(() => workItem.status);
  const [formError, setFormError] = useState<string | null>(null);
  const { mutateAsync: updateWorkItem, isPending } = useUpdateProjectWorkItem();

  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();
  const hasChanges =
    trimmedTitle !== workItem.title ||
    trimmedDescription !== workItem.description ||
    (startDate || null) !== workItem.startDate ||
    (dueDate || null) !== workItem.dueDate ||
    priority !== workItem.priority ||
    status !== workItem.status;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedTitle) {
      setFormError("Work item title is required.");
      return;
    }

    if (!hasChanges) {
      onOpenChange(false);
      return;
    }

    if (startDate && dueDate && startDate > dueDate) {
      setFormError("Due date must be on or after start date.");
      return;
    }

    setFormError(null);

    try {
      await updateWorkItem({
        projectId,
        itemId: workItem.itemId,
        payload: {
          title: trimmedTitle,
          description: trimmedDescription,
          startDate: startDate || null,
          dueDate: dueDate || null,
          priority,
          status,
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
              <DialogDescription>Refine the details and workflow state.</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
          noValidate
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor={`${formId}-title`}
                className="text-prism-body"
              >
                Title
              </Label>
              <Typography
                variant="caption"
                tone="muted"
              >
                {trimmedTitle.length}/{TITLE_MAX_LENGTH}
              </Typography>
            </div>
            <Input
              id={`${formId}-title`}
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setFormError(null);
              }}
              maxLength={TITLE_MAX_LENGTH}
              autoFocus
              disabled={isPending}
              placeholder="What needs to be done?"
              className={cn(
                "h-11 rounded-xl border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring",
                formError && !trimmedTitle && "border-prism-danger-soft focus-visible:ring-prism-danger-soft",
              )}
            />
            {formError && !trimmedTitle && (
              <Typography
                variant="caption"
                tone="inherit"
                className="text-prism-danger"
              >
                {formError}
              </Typography>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor={`${formId}-description`}
                className="text-prism-body"
              >
                Description
                <span className="ml-1 text-prism-muted/80">(optional)</span>
              </Label>
              <Typography
                variant="caption"
                tone="muted"
              >
                {trimmedDescription.length}/{DESCRIPTION_MAX_LENGTH}
              </Typography>
            </div>
            <Textarea
              id={`${formId}-description`}
              value={description}
              onChange={event => {
                setDescription(event.target.value);
                setFormError(null);
              }}
              maxLength={DESCRIPTION_MAX_LENGTH}
              rows={4}
              placeholder="Add context, scope, or acceptance criteria."
              disabled={isPending}
              className="rounded-xl border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="rounded-xl border border-border/80 bg-surface p-4">
            <Typography
              variant="caption"
              tone="muted"
              className="uppercase tracking-[0.16em]"
            >
              Schedule
            </Typography>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor={`${formId}-start-date`}
                  className="text-prism-body"
                >
                  Start date
                </Label>
                <Input
                  id={`${formId}-start-date`}
                  type="date"
                  value={startDate}
                  onChange={event => {
                    setStartDate(event.target.value);
                    setFormError(null);
                  }}
                  disabled={isPending}
                  className="h-11 rounded-xl border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor={`${formId}-due-date`}
                  className="text-prism-body"
                >
                  Due date
                </Label>
                <Input
                  id={`${formId}-due-date`}
                  type="date"
                  value={dueDate}
                  min={startDate || undefined}
                  onChange={event => {
                    setDueDate(event.target.value);
                    setFormError(null);
                  }}
                  disabled={isPending}
                  className="h-11 rounded-xl border-border bg-surface-field focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-surface p-4">
            <Typography
              variant="caption"
              tone="muted"
              className="uppercase tracking-[0.16em]"
            >
              Workflow
            </Typography>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor={`${formId}-status`}
                  className="text-prism-body"
                >
                  Status
                </Label>
                <select
                  id={`${formId}-status`}
                  value={status}
                  onChange={event => setStatus(event.target.value as ProjectWorkItemStatus)}
                  disabled={isPending}
                  className={cn(
                    "h-11 w-full rounded-xl border border-border bg-surface-field px-3 text-sm text-prism-body",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  {PROJECT_WORK_ITEM_STATUSES.map(option => (
                    <option
                      key={option}
                      value={option}
                    >
                      {getProjectWorkItemStatusLabel(option)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`${formId}-priority`}
                  className="text-prism-body"
                >
                  Priority
                </Label>
                <select
                  id={`${formId}-priority`}
                  value={priority}
                  onChange={event => setPriority(event.target.value as ProjectWorkItemPriority)}
                  disabled={isPending}
                  className={cn(
                    "h-11 w-full rounded-xl border border-border bg-surface-field px-3 text-sm text-prism-body",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  {PROJECT_WORK_ITEM_PRIORITIES.map(option => (
                    <option
                      key={option}
                      value={option}
                    >
                      {getProjectWorkItemPriorityLabel(option)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {formError && trimmedTitle && (
            <div className="rounded-xl border border-prism-danger-soft bg-surface px-4 py-3 text-sm text-prism-danger">
              {formError}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-10 rounded-lg px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !hasChanges}
              className="h-10 rounded-lg bg-prism-navy px-5 text-white hover:bg-prism-navy/90"
            >
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
