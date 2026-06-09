"use client";

import { useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, ChevronDown, Plus, Save, X } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Checkbox } from "@/atomics/atoms/Checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/atomics/atoms/Popover";
import { useUpdateWorkspaceMemberJobs } from "@/domains/workspaces/hooks/useUpdateWorkspaceMemberJobs";
import type { Workspace, WorkspaceJob, WorkspaceMember } from "@/domains/workspaces/types";
import { getWorkspaceMutationErrorMessage } from "@/domains/workspaces/utils/error";
import { cn } from "@/shared/utils/cn";

type WorkspaceMemberJobsEditorProps = {
  workspace: Workspace;
  member: WorkspaceMember;
  jobs: WorkspaceJob[];
  canManage: boolean;
};

const VISIBLE_JOB_LIMIT = 3;

type AssignedJobsSummaryProps = {
  jobNames: string[];
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

function AssignedJobsSummary({ jobNames, isExpanded, onExpandedChange }: AssignedJobsSummaryProps) {
  const visibleJobNames = isExpanded ? jobNames : jobNames.slice(0, VISIBLE_JOB_LIMIT);
  const remainingCount = jobNames.length - visibleJobNames.length;
  const canCollapse = isExpanded && jobNames.length > VISIBLE_JOB_LIMIT;

  return (
    <>
      {visibleJobNames.map(jobName => (
        <span
          key={jobName}
          className="inline-flex h-5 items-center rounded-full border border-border bg-surface-strong px-2 text-[11px] font-medium text-prism-muted"
        >
          {jobName}
        </span>
      ))}
      {remainingCount > 0 ? (
        <button
          type="button"
          className="rounded-full px-1 text-[11px] font-medium text-prism-muted transition-colors hover:text-prism-body"
          onClick={() => onExpandedChange(true)}
          aria-expanded={false}
          aria-label={`Show ${remainingCount} more assigned jobs`}
        >
          +{remainingCount}
        </button>
      ) : canCollapse ? (
        <button
          type="button"
          className="rounded-full px-1 text-[11px] font-medium text-prism-muted transition-colors hover:text-prism-body"
          onClick={() => onExpandedChange(false)}
          aria-expanded={true}
        >
          Show less
        </button>
      ) : null}
    </>
  );
}

export function WorkspaceMemberJobsEditor({ workspace, member, jobs, canManage }: WorkspaceMemberJobsEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [areAssignedJobsExpanded, setAreAssignedJobsExpanded] = useState(false);
  const [selectedJobIds, setSelectedJobIds] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: updateJobs, isPending } = useUpdateWorkspaceMemberJobs();
  const availableJobIds = new Set(jobs.map(job => job.jobId));
  const assignedAvailableJobIds = member.jobIds.filter(jobId => availableJobIds.has(jobId));
  const activeSelectedJobIds = selectedJobIds ?? assignedAvailableJobIds;
  const selectedAvailableJobIds = activeSelectedJobIds.filter(jobId => availableJobIds.has(jobId));
  const isDirty =
    selectedAvailableJobIds.length !== assignedAvailableJobIds.length ||
    selectedAvailableJobIds.some(jobId => !assignedAvailableJobIds.includes(jobId));

  function handleOpenChange(open: boolean) {
    if (open) {
      setSelectedJobIds(assignedAvailableJobIds);
      setError(null);
    } else {
      setSelectedJobIds(null);
    }

    setIsOpen(open);
  }

  function toggleJob(jobId: string, checked: boolean) {
    setSelectedJobIds(previous => {
      const current = previous ?? assignedAvailableJobIds;

      return checked ? Array.from(new Set([...current, jobId])) : current.filter(value => value !== jobId);
    });
    setError(null);
  }

  async function handleSave() {
    setError(null);

    try {
      await updateJobs({
        workspaceId: workspace.workspaceId,
        userId: member.userId,
        jobIds: selectedAvailableJobIds,
      });
      setSelectedJobIds(null);
      setIsOpen(false);
    } catch (caughtError) {
      setError(getWorkspaceMutationErrorMessage(caughtError, "Member jobs could not be updated."));
    }
  }

  if (!canManage && member.jobNames.length === 0) {
    return null;
  }

  return (
    <div className="mt-1.5 min-w-0">
      <div className="flex min-w-0 items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <BriefcaseBusiness className="size-3.5 shrink-0 text-prism-muted" />
          {member.jobNames.length > 0 ? (
            <AssignedJobsSummary
              jobNames={member.jobNames}
              isExpanded={areAssignedJobsExpanded}
              onExpandedChange={setAreAssignedJobsExpanded}
            />
          ) : jobs.length === 0 ? (
            <span className="text-xs text-prism-muted">No jobs available</span>
          ) : (
            <span className="text-xs text-prism-muted">No jobs assigned</span>
          )}
        </div>

        {canManage && jobs.length === 0 ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-6 shrink-0 gap-1 rounded-full px-2 text-xs text-prism-muted hover:text-prism-body"
          >
            <Link href={`/workspaces/${encodeURIComponent(workspace.slug)}/jobs`}>
              <Plus className="size-3" />
              Add job
            </Link>
          </Button>
        ) : null}

        {canManage && jobs.length > 0 ? (
          <Popover
            open={isOpen}
            onOpenChange={handleOpenChange}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 shrink-0 rounded-full px-2 text-xs text-prism-muted hover:text-prism-body"
                aria-expanded={isOpen}
              >
                {member.jobNames.length > 0 ? "Edit" : "Assign"}
                <ChevronDown className={cn("size-3 transition-transform", isOpen && "rotate-180")} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64"
              align="end"
            >
              <div className="flex flex-wrap gap-2">
                {jobs.map(job => {
                  const checked = selectedAvailableJobIds.includes(job.jobId);

                  return (
                    <label
                      key={job.jobId}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors",
                        checked
                          ? "border-prism-teal-500/30 bg-prism-teal-500/10 text-prism-navy"
                          : "border-border bg-surface text-prism-body",
                        isPending && "cursor-not-allowed opacity-60",
                      )}
                      title={job.description ?? undefined}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={isPending}
                        onCheckedChange={value => toggleJob(job.jobId, value === true)}
                        aria-label={`Assign ${job.name}`}
                      />
                      {job.name}
                    </label>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  className="h-8 flex-1 rounded-lg px-3"
                  onClick={() => handleOpenChange(false)}
                >
                  <X className="size-3.5" />
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!isDirty || isPending}
                  className="h-8 flex-1 rounded-lg px-3"
                  onClick={() => void handleSave()}
                >
                  <Save className="size-3.5" />
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>

              {error ? <p className="mt-2 text-xs text-prism-danger">{error}</p> : null}
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    </div>
  );
}
