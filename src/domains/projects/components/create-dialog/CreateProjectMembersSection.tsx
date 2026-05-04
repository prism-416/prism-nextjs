"use client";

import { Check, Plus, Search, X } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Label } from "@/atomics/atoms/Label";
import { Typography } from "@/atomics/atoms/Typography";
import type { CreateProjectMemberSelection, ProjectAssignableMember, ProjectJob } from "@/domains/projects/types";
import { getProjectMemberDisplayName } from "@/domains/projects/utils/member";
import { cn } from "@/shared/utils/cn";

type CreateProjectMembersSectionProps = {
  memberQuery: string;
  availableMembers: ProjectAssignableMember[];
  selectedMembers: CreateProjectMemberSelection[];
  jobs: ProjectJob[];
  errorMessage?: string | null;
  isLoadingMembers?: boolean;
  isLoadingJobs?: boolean;
  isSubmitting?: boolean;
  showMemberResults?: boolean;
  onMemberQueryChange: (value: string) => void;
  onAddMember: (member: ProjectAssignableMember) => void;
  onRemoveMember: (userId: string) => void;
  onToggleMemberJob: (userId: string, jobId: string, checked: boolean) => void;
};

function getMemberInitial(member: ProjectAssignableMember) {
  const displayName = getProjectMemberDisplayName(member).trim();

  return (displayName[0] ?? member.username[0] ?? "?").toUpperCase();
}

function getSelectedJobText(count: number) {
  if (count === 0) {
    return "No jobs";
  }

  if (count === 1) {
    return "1 job";
  }

  return `${count} jobs`;
}

export function CreateProjectMembersSection({
  memberQuery,
  availableMembers,
  selectedMembers,
  jobs,
  errorMessage = null,
  isLoadingMembers = false,
  isLoadingJobs = false,
  isSubmitting = false,
  showMemberResults = false,
  onMemberQueryChange,
  onAddMember,
  onRemoveMember,
  onToggleMemberJob,
}: CreateProjectMembersSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Label
            htmlFor="project-members"
            className="text-prism-body"
          >
            Project members
            <span className="ml-1 text-prism-muted/80">(optional)</span>
          </Label>
          <Typography
            variant="caption"
            tone="muted"
          >
            Assign workspace members and pick the jobs they will hold on this project.
          </Typography>
        </div>
        {selectedMembers.length > 0 ? (
          <span className="inline-flex w-fit items-center rounded-full border border-border bg-surface-strong px-2.5 py-1 text-xs font-medium text-prism-muted">
            {selectedMembers.length} selected
          </span>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-prism-muted" />
          <Input
            id="project-members"
            name="memberSearch"
            maxLength={160}
            placeholder="Search by name or username"
            value={memberQuery}
            disabled={isSubmitting || isLoadingMembers}
            onChange={event => onMemberQueryChange(event.target.value)}
            className={cn(
              "h-11 rounded-xl border-border bg-surface-field pl-9 focus-visible:ring-2 focus-visible:ring-ring",
              errorMessage && "border-red-300 focus-visible:ring-red-300/60",
            )}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? "project-members-error" : undefined}
          />

          {showMemberResults && (
            <div className="mt-2 overflow-hidden rounded-xl border border-border bg-surface">
              {isLoadingMembers ? (
                <div className="px-3 py-3 text-sm text-prism-muted">Loading members...</div>
              ) : availableMembers.length === 0 ? (
                <div className="px-3 py-3 text-sm text-prism-muted">
                  {memberQuery.trim()
                    ? "No available workspace members match your search."
                    : "No available workspace members found."}
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto py-1">
                  {availableMembers.map(member => (
                    <button
                      key={member.userId}
                      type="button"
                      onClick={() => onAddMember(member)}
                      disabled={isSubmitting}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-prism-navy/5 disabled:opacity-50"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-prism-navy/8 text-xs font-semibold text-prism-navy">
                        {getMemberInitial(member)}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-prism-body">
                          {getProjectMemberDisplayName(member)}
                        </div>
                        <div className="truncate text-xs text-prism-muted">@{member.username}</div>
                      </div>
                      <span className="ml-auto grid size-7 shrink-0 place-items-center rounded-full border border-border bg-surface-strong text-prism-muted">
                        <Plus className="size-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="min-h-48 rounded-xl border border-border bg-surface">
          {selectedMembers.length === 0 ? (
            <div className="flex h-full min-h-48 flex-col items-center justify-center px-5 py-8 text-center">
              <div className="grid size-10 place-items-center rounded-full bg-prism-navy/6 text-prism-muted">
                <Search className="size-4" />
              </div>
              <Typography
                variant="bodySm"
                tone="primary"
                weight="medium"
                className="mt-3"
              >
                No members assigned
              </Typography>
              <Typography
                variant="caption"
                tone="muted"
                className="mt-1 max-w-xs"
              >
                Search workspace members, then choose one or more jobs for each member.
              </Typography>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {selectedMembers.map(member => (
                <div
                  key={member.userId}
                  className="px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-prism-navy text-sm font-semibold text-primary-foreground">
                      {getMemberInitial(member)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <div className="truncate text-sm font-medium text-prism-body">
                          {getProjectMemberDisplayName(member)}
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium",
                            member.jobIds.length > 0
                              ? "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy"
                              : "border-prism-danger-soft bg-prism-danger-soft/20 text-prism-danger",
                          )}
                        >
                          {getSelectedJobText(member.jobIds.length)}
                        </span>
                      </div>
                      <div className="truncate text-xs text-prism-muted">@{member.username}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveMember(member.userId)}
                      disabled={isSubmitting}
                      className="size-8 shrink-0 rounded-lg text-prism-muted hover:text-prism-body"
                      aria-label={`Remove ${getProjectMemberDisplayName(member)}`}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  <div className="mt-3">
                    {isLoadingJobs ? (
                      <Typography
                        variant="caption"
                        tone="muted"
                      >
                        Loading jobs...
                      </Typography>
                    ) : jobs.length === 0 ? (
                      <Typography
                        variant="caption"
                        tone="muted"
                      >
                        No jobs are available for this workspace yet.
                      </Typography>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {jobs.map(job => {
                          const selected = member.jobIds.includes(job.jobId);

                          return (
                            <button
                              key={job.jobId}
                              type="button"
                              disabled={isSubmitting}
                              aria-pressed={selected}
                              onClick={() => onToggleMemberJob(member.userId, job.jobId, !selected)}
                              className={cn(
                                "flex min-h-16 items-start gap-2 rounded-lg border px-3 py-2 text-left transition-colors disabled:opacity-50",
                                selected
                                  ? "border-prism-glow-sky/50 bg-prism-glow-sky/10 text-prism-navy"
                                  : "border-border bg-surface-field text-prism-body hover:border-prism-glow-sky/35",
                              )}
                            >
                              <span
                                className={cn(
                                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                                  selected
                                    ? "border-prism-glow-sky bg-prism-glow-sky text-white"
                                    : "border-border bg-surface",
                                )}
                              >
                                {selected ? <Check className="size-3.5" /> : null}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium">{job.name}</span>
                                <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-prism-muted">
                                  {job.description}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <Typography
          id="project-members-error"
          variant="caption"
          tone="inherit"
          className="text-red-600"
        >
          {errorMessage}
        </Typography>
      )}
    </div>
  );
}
