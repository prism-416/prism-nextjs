"use client";

import { useState } from "react";
import { Check, Save, X } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import type { Workspace, WorkspaceJob, WorkspaceMember } from "@/domains/workspaces/types";
import { useUpdateWorkspaceMemberJobs } from "@/domains/workspaces/hooks/useUpdateWorkspaceMemberJobs";
import { cn } from "@/shared/utils/cn";

type WorkspaceMemberJobsEditorProps = {
  workspace: Workspace;
  member: WorkspaceMember;
  jobs: WorkspaceJob[];
  canManage: boolean;
};

export function WorkspaceMemberJobsEditor({ workspace, member, jobs, canManage }: WorkspaceMemberJobsEditorProps) {
  const [selectedJobIds, setSelectedJobIds] = useState(member.jobIds);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: updateJobs, isPending } = useUpdateWorkspaceMemberJobs();

  const isDirty =
    selectedJobIds.length !== member.jobIds.length || selectedJobIds.some(jobId => !member.jobIds.includes(jobId));

  function toggleJob(jobId: string) {
    setSelectedJobIds(previous =>
      previous.includes(jobId) ? previous.filter(value => value !== jobId) : [...previous, jobId],
    );
    setError(null);
  }

  async function handleSave() {
    setError(null);

    try {
      await updateJobs({
        workspaceId: workspace.workspaceId,
        userId: member.userId,
        jobIds: selectedJobIds,
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Member jobs could not be updated.");
    }
  }

  if (!canManage) {
    return member.jobNames.length > 0 ? (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {member.jobNames.map(jobName => (
          <span
            key={jobName}
            className="rounded-full border border-border bg-surface-strong px-2 py-0.5 text-xs text-prism-muted"
          >
            {jobName}
          </span>
        ))}
      </div>
    ) : null;
  }

  return (
    <div className="mt-3 rounded-xl border border-border/70 bg-surface-strong p-3">
      <div className="flex flex-wrap items-center gap-2">
        {jobs.length === 0 ? (
          <p className="text-xs text-prism-muted">Define workspace jobs before assigning responsibilities.</p>
        ) : (
          jobs.map(job => {
            const selected = selectedJobIds.includes(job.jobId);

            return (
              <button
                key={job.jobId}
                type="button"
                disabled={isPending}
                aria-pressed={selected}
                onClick={() => toggleJob(job.jobId)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors disabled:opacity-50",
                  selected
                    ? "border-prism-teal-500/30 bg-prism-teal-500/10 text-prism-navy"
                    : "border-border bg-surface text-prism-muted",
                )}
              >
                {selected ? <Check className="size-3" /> : <X className="size-3 opacity-50" />}
                {job.name}
              </button>
            );
          })
        )}
        {jobs.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-auto h-8 rounded-lg bg-surface px-3"
            disabled={!isDirty || isPending}
            onClick={() => void handleSave()}
          >
            <Save className="size-3.5" />
            {isPending ? "Saving..." : "Save jobs"}
          </Button>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-xs text-prism-danger">{error}</p> : null}
    </div>
  );
}
