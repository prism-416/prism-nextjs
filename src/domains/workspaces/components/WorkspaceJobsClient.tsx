"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Save, Trash2, X } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Label } from "@/atomics/atoms/Label";
import { ConfirmDialog } from "@/atomics/organisms/ConfirmDialog";
import { Textarea } from "@/atomics/atoms/Textarea";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceJobsSkeleton } from "@/domains/workspaces/components/WorkspaceJobsSkeleton";
import { useDeleteWorkspaceJob } from "@/domains/workspaces/hooks/useDeleteWorkspaceJob";
import { useSaveWorkspaceJobs } from "@/domains/workspaces/hooks/useSaveWorkspaceJobs";
import { useWorkspaceJobs } from "@/domains/workspaces/hooks/useWorkspaceJobs";
import type {
  CreateWorkspaceJobPayload,
  UpdateWorkspaceJobPayload,
  Workspace,
  WorkspaceJob,
} from "@/domains/workspaces/types";
import { getWorkspaceMutationErrorMessage } from "@/domains/workspaces/utils/error";
import { cn } from "@/shared/utils/cn";

type WorkspaceJobsClientProps = {
  workspace: Workspace;
  initialData?: WorkspaceJob[];
  canManageJobs: boolean;
};

type JobDraft = {
  draftId: string;
  jobId?: string;
  name: string;
  description: string;
  originalName?: string;
  originalDescription?: string;
};

type DraftErrors = Record<string, Partial<Record<"name" | "description", string>>>;

type ActionFeedback = {
  message: string;
  tone: "error" | "success";
};

const EMPTY_JOBS: WorkspaceJob[] = [];
const JOB_NAME_MAX_LENGTH = 50;
const JOB_DESCRIPTION_MAX_LENGTH = 1000;

function createDraftId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toDraft(job: WorkspaceJob): JobDraft {
  const description = job.description ?? "";

  return {
    draftId: job.jobId,
    jobId: job.jobId,
    name: job.name,
    description,
    originalName: job.name,
    originalDescription: description,
  };
}

function toDrafts(jobs: WorkspaceJob[]) {
  return jobs.map(toDraft);
}

function isChangedDraft(draft: JobDraft) {
  if (!draft.jobId) {
    return draft.name.trim().length > 0 || draft.description.trim().length > 0;
  }

  return draft.name.trim() !== draft.originalName || draft.description.trim() !== draft.originalDescription;
}

function isBlankNewDraft(draft: JobDraft) {
  return !draft.jobId && draft.name.trim().length === 0 && draft.description.trim().length === 0;
}

function validateDrafts(drafts: JobDraft[]) {
  const errors: DraftErrors = {};
  const normalizedNames = new Map<string, string>();

  for (const draft of drafts) {
    if (isBlankNewDraft(draft)) {
      continue;
    }

    const name = draft.name.trim();
    const description = draft.description.trim();

    if (!name) {
      errors[draft.draftId] = {
        ...errors[draft.draftId],
        name: "Name is required.",
      };
    }

    if (name.length > JOB_NAME_MAX_LENGTH) {
      errors[draft.draftId] = {
        ...errors[draft.draftId],
        name: `Name must be ${JOB_NAME_MAX_LENGTH} characters or less.`,
      };
    }

    if (description.length > JOB_DESCRIPTION_MAX_LENGTH) {
      errors[draft.draftId] = {
        ...errors[draft.draftId],
        description: `Description must be ${JOB_DESCRIPTION_MAX_LENGTH} characters or less.`,
      };
    }

    if (name) {
      const normalizedName = name.toLowerCase();
      const existingDraftId = normalizedNames.get(normalizedName);

      if (existingDraftId) {
        errors[draft.draftId] = {
          ...errors[draft.draftId],
          name: "Job names must be unique.",
        };
        errors[existingDraftId] = {
          ...errors[existingDraftId],
          name: "Job names must be unique.",
        };
      } else {
        normalizedNames.set(normalizedName, draft.draftId);
      }
    }
  }

  return errors;
}

function hasErrors(errors: DraftErrors) {
  return Object.values(errors).some(fieldErrors => Boolean(fieldErrors.name || fieldErrors.description));
}

function getSavePayload(drafts: JobDraft[]) {
  const createJobs: CreateWorkspaceJobPayload[] = [];
  const updateJobs: UpdateWorkspaceJobPayload[] = [];

  for (const draft of drafts) {
    const name = draft.name.trim();
    const description = draft.description.trim();

    if (!draft.jobId) {
      if (name || description) {
        createJobs.push({ name, description: description || null });
      }
      continue;
    }

    if (isChangedDraft(draft)) {
      updateJobs.push({
        jobId: draft.jobId,
        name,
        description: description || null,
      });
    }
  }

  return {
    createJobs,
    updateJobs,
  };
}

export function WorkspaceJobsClient({ workspace, initialData, canManageJobs }: WorkspaceJobsClientProps) {
  const { data, isPending, isError, refetch } = useWorkspaceJobs(workspace.workspaceId, initialData);
  const saveJobs = useSaveWorkspaceJobs();
  const deleteJob = useDeleteWorkspaceJob();
  const jobs = data ?? EMPTY_JOBS;
  const [drafts, setDrafts] = useState<JobDraft[]>(() => toDrafts(initialData ?? EMPTY_JOBS));
  const [draftErrors, setDraftErrors] = useState<DraftErrors>({});
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
  const [pendingDeleteDraft, setPendingDeleteDraft] = useState<JobDraft | null>(null);
  const savePayload = useMemo(() => getSavePayload(drafts), [drafts]);
  const hasChanges = savePayload.createJobs.length > 0 || savePayload.updateJobs.length > 0;
  const hasDraftChanges = drafts.length !== jobs.length || drafts.some(isChangedDraft);
  const isMutating = saveJobs.isPending || deleteJob.isPending;
  const canSubmit = canManageJobs && hasChanges && !hasErrors(draftErrors) && !isMutating;

  function updateDraft(draftId: string, field: "name" | "description", value: string) {
    setDrafts(current => current.map(draft => (draft.draftId === draftId ? { ...draft, [field]: value } : draft)));
    setDraftErrors(current => ({
      ...current,
      [draftId]: {
        ...current[draftId],
        [field]: undefined,
      },
    }));
    setActionFeedback(null);
  }

  function handleAddJob() {
    setDrafts(current => [
      ...current,
      {
        draftId: createDraftId(),
        name: "",
        description: "",
      },
    ]);
    setActionFeedback(null);
  }

  function handleRemoveDraft(draftId: string) {
    setDrafts(current => current.filter(draft => draft.draftId !== draftId));
    setDraftErrors(current => {
      const next = { ...current };
      delete next[draftId];
      return next;
    });
    setActionFeedback(null);
  }

  function handleCancelChanges() {
    setDrafts(toDrafts(jobs));
    setDraftErrors({});
    setActionFeedback(null);
  }

  async function handleDeleteJob() {
    if (!pendingDeleteDraft?.jobId) {
      return;
    }

    try {
      const jobId = pendingDeleteDraft.jobId;

      await deleteJob.mutateAsync({
        workspaceId: workspace.workspaceId,
        jobId,
      });
      setDrafts(current => current.filter(draft => draft.jobId !== jobId));
      setDraftErrors(current => {
        const next = { ...current };
        delete next[pendingDeleteDraft.draftId];
        return next;
      });
      setPendingDeleteDraft(null);
      setActionFeedback({ message: "Workspace job deleted.", tone: "success" });
    } catch (caughtError) {
      setActionFeedback({
        message: getWorkspaceMutationErrorMessage(caughtError, "Workspace job could not be deleted."),
        tone: "error",
      });
      setPendingDeleteDraft(null);
    }
  }

  async function handleSave() {
    const nextErrors = validateDrafts(drafts);
    setDraftErrors(nextErrors);
    setActionFeedback(null);

    if (hasErrors(nextErrors)) {
      return;
    }

    if (!hasChanges) {
      return;
    }

    try {
      const result = await saveJobs.mutateAsync({
        workspaceId: workspace.workspaceId,
        ...savePayload,
      });
      const nextJobsById = new Map(jobs.map(job => [job.jobId, job]));

      for (const job of result.updatedJobs) {
        nextJobsById.set(job.jobId, job);
      }

      for (const job of result.createdJobs) {
        nextJobsById.set(job.jobId, job);
      }

      setDrafts(toDrafts(Array.from(nextJobsById.values())));
      setDraftErrors({});
      setActionFeedback({ message: "Workspace jobs saved.", tone: "success" });
    } catch (caughtError) {
      setActionFeedback({
        message: getWorkspaceMutationErrorMessage(caughtError, "Workspace jobs could not be saved."),
        tone: "error",
      });
    }
  }

  if (isPending && drafts.length === 0) {
    return <WorkspaceJobsSkeleton />;
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-prism-heading">Jobs</h1>
        <p className="mt-1 text-sm text-prism-muted">Define reusable jobs for members in this workspace.</p>
      </div>

      {actionFeedback ? (
        <p
          role={actionFeedback.tone === "error" ? "alert" : "status"}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-3 text-sm",
            actionFeedback.tone === "error"
              ? "border-prism-danger-soft bg-prism-danger-soft/20 text-prism-danger"
              : "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy",
          )}
        >
          {actionFeedback.tone === "error" ? <X className="size-4" /> : <Check className="size-4" />}
          {actionFeedback.message}
        </p>
      ) : null}

      {!canManageJobs ? (
        <p className="rounded-lg border border-border/80 bg-surface px-4 py-3 text-sm text-prism-muted">
          Workspace admins can edit jobs assigned to workspace members.
        </p>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          <p>Workspace jobs could not be loaded.</p>
          <Button
            className="mt-3 h-9 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
            onClick={() => {
              void refetch();
            }}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      ) : null}

      {!isError && drafts.length === 0 && !canManageJobs ? (
        <div className="rounded-lg border border-dashed border-border-strong/60 bg-surface px-6 py-10 text-center">
          <h2 className="text-base font-semibold text-prism-heading">No jobs yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-prism-muted">
            Jobs created here become available when assigning responsibilities to workspace members.
          </p>
        </div>
      ) : null}

      {!isError && (drafts.length > 0 || canManageJobs) ? (
        <div className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-lg border border-border/80 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]">
            <div className="hidden h-9 grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)_6.5rem] items-center gap-3 border-b border-border/70 bg-surface-strong px-3 text-xs font-medium uppercase tracking-[0.08em] text-prism-muted md:grid">
              <span>Name</span>
              <span>Description</span>
              <span>Status</span>
            </div>

            {drafts.map(draft => {
              const errors = draftErrors[draft.draftId] ?? {};
              const isNewDraft = !draft.jobId;
              const isChanged = isChangedDraft(draft);
              const nameErrorId = `${draft.draftId}-name-error`;
              const descriptionErrorId = `${draft.draftId}-description-error`;

              return (
                <div
                  key={draft.draftId}
                  className={cn(
                    "border-b border-border/70 px-3 py-2.5 last:border-b-0",
                    isChanged && "bg-prism-glow-sky/5",
                  )}
                >
                  <div className="grid gap-2 md:grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)_6.5rem] md:items-center md:gap-3">
                    <div className="min-w-0 space-y-1.5 md:space-y-0">
                      <div className="flex items-center justify-between gap-3 md:hidden">
                        <Label
                          htmlFor={`${draft.draftId}-name`}
                          className="text-prism-body"
                        >
                          Name
                        </Label>
                      </div>
                      <Input
                        id={`${draft.draftId}-name`}
                        value={draft.name}
                        maxLength={JOB_NAME_MAX_LENGTH}
                        disabled={!canManageJobs || isMutating}
                        onChange={event => updateDraft(draft.draftId, "name", event.target.value)}
                        className={cn(
                          "h-10 rounded-md border-border bg-surface-field text-sm focus-visible:ring-2 focus-visible:ring-ring",
                          errors.name && "border-red-300 focus-visible:ring-red-300/60",
                        )}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? nameErrorId : undefined}
                      />
                    </div>

                    <div className="min-w-0 space-y-1.5 md:space-y-0">
                      <div className="flex items-center justify-between gap-3 md:hidden">
                        <Label
                          htmlFor={`${draft.draftId}-description`}
                          className="text-prism-body"
                        >
                          Description
                        </Label>
                      </div>
                      <Textarea
                        id={`${draft.draftId}-description`}
                        value={draft.description}
                        maxLength={JOB_DESCRIPTION_MAX_LENGTH}
                        rows={1}
                        disabled={!canManageJobs || isMutating}
                        onChange={event => updateDraft(draft.draftId, "description", event.target.value)}
                        className={cn(
                          "h-10 min-h-10 resize-y overflow-y-auto rounded-md border-border bg-surface-field py-2 text-sm leading-6 focus-visible:ring-2 focus-visible:ring-ring",
                          errors.description && "border-red-300 focus-visible:ring-red-300/60",
                        )}
                        aria-invalid={Boolean(errors.description)}
                        aria-describedby={errors.description ? descriptionErrorId : undefined}
                      />
                    </div>

                    <div className="flex h-10 items-center justify-between gap-2 md:justify-start">
                      <Label className="text-prism-body md:hidden">Status</Label>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium",
                            isNewDraft
                              ? "border-prism-glow-sky/35 bg-prism-glow-sky/10 text-prism-navy"
                              : isChanged
                                ? "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy"
                                : "border-border bg-surface-strong text-prism-muted",
                          )}
                        >
                          {isNewDraft ? "New" : isChanged ? "Edited" : "Saved"}
                        </span>
                        {isNewDraft && canManageJobs ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-prism-muted hover:text-prism-body"
                            onClick={() => handleRemoveDraft(draft.draftId)}
                            disabled={isMutating}
                            aria-label="Remove unsaved job"
                          >
                            <X className="size-4" />
                          </Button>
                        ) : canManageJobs ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-prism-muted hover:bg-prism-danger-soft/30 hover:text-prism-danger"
                            onClick={() => setPendingDeleteDraft(draft)}
                            disabled={isMutating}
                            aria-label={`Delete ${draft.name}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {errors.name || errors.description ? (
                    <div className="mt-1.5 grid gap-1 md:grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)_6.5rem] md:gap-3">
                      {errors.name ? (
                        <Typography
                          id={nameErrorId}
                          variant="caption"
                          tone="inherit"
                          className="text-red-600"
                        >
                          {errors.name}
                        </Typography>
                      ) : (
                        <span className="hidden md:block" />
                      )}
                      {errors.description ? (
                        <Typography
                          id={descriptionErrorId}
                          variant="caption"
                          tone="inherit"
                          className="text-red-600"
                        >
                          {errors.description}
                        </Typography>
                      ) : (
                        <span className="hidden md:block" />
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
            {drafts.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-prism-muted">
                No jobs yet. Add a job to make it available for member assignment.
              </div>
            ) : null}
          </div>
          {canManageJobs ? (
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-1.5 rounded-lg border-border bg-surface px-4 text-prism-body"
                onClick={handleAddJob}
                disabled={isMutating}
              >
                <Plus className="size-4" />
                Add job
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-lg px-4"
                onClick={handleCancelChanges}
                disabled={!hasDraftChanges || isMutating}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-10 gap-1.5 rounded-lg px-4"
                onClick={() => {
                  void handleSave();
                }}
                disabled={!canSubmit}
              >
                <Save className="size-4" />
                {saveJobs.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <ConfirmDialog
        open={pendingDeleteDraft != null}
        title="Delete job"
        description={`Delete "${pendingDeleteDraft?.name ?? ""}"? It will no longer be available for workspace members.`}
        confirmLabel="Delete job"
        tone="danger"
        isPending={deleteJob.isPending}
        onOpenChange={open => {
          if (!open) {
            setPendingDeleteDraft(null);
          }
        }}
        onConfirm={() => void handleDeleteJob()}
      />
    </section>
  );
}
