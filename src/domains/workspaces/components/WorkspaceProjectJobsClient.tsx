"use client";

import { useMemo, useState } from "react";
import { Check, Plus, RotateCcw, Save, X } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Label } from "@/atomics/atoms/Label";
import { Textarea } from "@/atomics/atoms/Textarea";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceProjectJobsSkeleton } from "@/domains/workspaces/components/WorkspaceProjectJobsSkeleton";
import { useSaveWorkspaceProjectJobs } from "@/domains/workspaces/hooks/useSaveWorkspaceProjectJobs";
import { useWorkspaceProjectJobs } from "@/domains/workspaces/hooks/useWorkspaceProjectJobs";
import type {
  CreateWorkspaceProjectJobPayload,
  UpdateWorkspaceProjectJobPayload,
  Workspace,
  WorkspaceProjectJob,
} from "@/domains/workspaces/types";
import { cn } from "@/shared/utils/cn";

type WorkspaceProjectJobsClientProps = {
  workspace: Workspace;
  initialData?: WorkspaceProjectJob[];
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

const EMPTY_JOBS: WorkspaceProjectJob[] = [];
const JOB_NAME_MAX_LENGTH = 20;
const JOB_DESCRIPTION_MAX_LENGTH = 1000;

function createDraftId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toDraft(job: WorkspaceProjectJob): JobDraft {
  return {
    draftId: job.jobId,
    jobId: job.jobId,
    name: job.name,
    description: job.description,
    originalName: job.name,
    originalDescription: job.description,
  };
}

function toDrafts(jobs: WorkspaceProjectJob[]) {
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

    if (!description) {
      errors[draft.draftId] = {
        ...errors[draft.draftId],
        description: "Description is required.",
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
  const createJobs: CreateWorkspaceProjectJobPayload[] = [];
  const updateJobs: UpdateWorkspaceProjectJobPayload[] = [];

  for (const draft of drafts) {
    const name = draft.name.trim();
    const description = draft.description.trim();

    if (!draft.jobId) {
      if (name || description) {
        createJobs.push({ name, description });
      }
      continue;
    }

    if (isChangedDraft(draft)) {
      updateJobs.push({
        jobId: draft.jobId,
        name,
        description,
      });
    }
  }

  return {
    createJobs,
    updateJobs,
  };
}

export function WorkspaceProjectJobsClient({ workspace, initialData, canManageJobs }: WorkspaceProjectJobsClientProps) {
  const { data, isPending, isError, refetch } = useWorkspaceProjectJobs(workspace.workspaceId, initialData);
  const saveProjectJobs = useSaveWorkspaceProjectJobs();
  const jobs = data ?? EMPTY_JOBS;
  const [drafts, setDrafts] = useState<JobDraft[]>(() => toDrafts(initialData ?? EMPTY_JOBS));
  const [draftErrors, setDraftErrors] = useState<DraftErrors>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const savePayload = useMemo(() => getSavePayload(drafts), [drafts]);
  const hasChanges = savePayload.createJobs.length > 0 || savePayload.updateJobs.length > 0;
  const canSubmit = canManageJobs && hasChanges && !hasErrors(draftErrors) && !saveProjectJobs.isPending;

  function updateDraft(draftId: string, field: "name" | "description", value: string) {
    setDrafts(current => current.map(draft => (draft.draftId === draftId ? { ...draft, [field]: value } : draft)));
    setDraftErrors(current => ({
      ...current,
      [draftId]: {
        ...current[draftId],
        [field]: undefined,
      },
    }));
    setActionMessage(null);
    setIsDirty(true);
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
    setActionMessage(null);
    setIsDirty(true);
  }

  function handleRemoveDraft(draftId: string) {
    setDrafts(current => current.filter(draft => draft.draftId !== draftId));
    setDraftErrors(current => {
      const next = { ...current };
      delete next[draftId];
      return next;
    });
    setActionMessage(null);
    setIsDirty(true);
  }

  function handleResetChanges() {
    setDrafts(toDrafts(jobs));
    setDraftErrors({});
    setActionMessage(null);
    setIsDirty(false);
  }

  async function handleSave() {
    const nextErrors = validateDrafts(drafts);
    setDraftErrors(nextErrors);
    setActionMessage(null);

    if (hasErrors(nextErrors)) {
      return;
    }

    const payload = getSavePayload(drafts);

    if (payload.createJobs.length === 0 && payload.updateJobs.length === 0) {
      setIsDirty(false);
      return;
    }

    try {
      const result = await saveProjectJobs.mutateAsync({
        workspaceId: workspace.workspaceId,
        ...payload,
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
      setActionMessage("Project jobs saved.");
      setIsDirty(false);
    } catch {
      setActionMessage("Project jobs could not be saved.");
    }
  }

  if (isPending && drafts.length === 0) {
    return <WorkspaceProjectJobsSkeleton />;
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-prism-heading">Project jobs</h1>
          <p className="mt-1 text-sm text-prism-muted">Define reusable jobs for projects in this workspace.</p>
        </div>
        {canManageJobs ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-1.5 rounded-lg px-4"
              onClick={handleAddJob}
              disabled={saveProjectJobs.isPending}
            >
              <Plus className="size-4" />
              Add job
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 gap-1.5 rounded-lg px-4"
              onClick={handleResetChanges}
              disabled={!isDirty || saveProjectJobs.isPending}
            >
              <RotateCcw className="size-4" />
              Reset
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
              {saveProjectJobs.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : null}
      </div>

      {actionMessage ? (
        <p
          role="status"
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-3 text-sm",
            actionMessage.includes("could not")
              ? "border-prism-danger-soft bg-prism-danger-soft/20 text-prism-danger"
              : "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy",
          )}
        >
          {actionMessage.includes("could not") ? <X className="size-4" /> : <Check className="size-4" />}
          {actionMessage}
        </p>
      ) : null}

      {!canManageJobs ? (
        <p className="rounded-lg border border-border/80 bg-surface px-4 py-3 text-sm text-prism-muted">
          Workspace admins can edit project jobs.
        </p>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          <p>Project jobs could not be loaded.</p>
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

      {!isError && drafts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong/60 bg-surface px-6 py-10 text-center">
          <h2 className="text-base font-semibold text-prism-heading">No project jobs yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-prism-muted">
            Jobs created here become available when assigning members to projects.
          </p>
          {canManageJobs ? (
            <Button
              type="button"
              className="mt-5 h-10 gap-1.5 rounded-lg px-5"
              onClick={handleAddJob}
            >
              <Plus className="size-4" />
              Add job
            </Button>
          ) : null}
        </div>
      ) : null}

      {!isError && drafts.length > 0 ? (
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
                      disabled={!canManageJobs || saveProjectJobs.isPending}
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
                      disabled={!canManageJobs || saveProjectJobs.isPending}
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
                          disabled={saveProjectJobs.isPending}
                          aria-label="Remove unsaved job"
                        >
                          <X className="size-4" />
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
        </div>
      ) : null}
    </section>
  );
}
