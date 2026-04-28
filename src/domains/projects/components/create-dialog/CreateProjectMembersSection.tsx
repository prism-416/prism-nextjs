"use client";

import { Plus, Search, X } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Checkbox } from "@/atomics/atoms/Checkbox";
import { Input } from "@/atomics/atoms/Input";
import { Label } from "@/atomics/atoms/Label";
import { Typography } from "@/atomics/atoms/Typography";
import type { CreateProjectMemberSelection, ProjectAssignableMember, ProjectJob } from "@/domains/projects/types";
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

function getMemberDisplayName(member: Pick<ProjectAssignableMember, "fullName" | "username">) {
  return member.fullName || member.username;
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
    <div className="space-y-3">
      <div className="space-y-1">
        <Label
          htmlFor="project-members"
          className="text-prism-body"
        >
          Assign members
          <span className="ml-1 text-prism-muted/80">(optional)</span>
        </Label>
        <Typography
          variant="caption"
          tone="muted"
        >
          Pick from workspace members or search by name, then select at least one job for each assigned member.
        </Typography>
      </div>

      <div className="space-y-2">
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
        </div>

        {showMemberResults && (
          <div className="rounded-xl border border-border bg-surface shadow-[0_12px_32px_rgba(12,71,103,0.08)]">
            {isLoadingMembers ? (
              <div className="px-3 py-2 text-sm text-prism-muted">Loading members...</div>
            ) : availableMembers.length === 0 ? (
              <div className="px-3 py-2 text-sm text-prism-muted">
                {memberQuery.trim()
                  ? "No available workspace members match your search."
                  : "No available workspace members found."}
              </div>
            ) : (
              <div className="py-1">
                {availableMembers.map(member => (
                  <button
                    key={member.userId}
                    type="button"
                    onClick={() => onAddMember(member)}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-prism-navy/5 disabled:opacity-50"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-prism-body">{getMemberDisplayName(member)}</div>
                      <div className="truncate text-xs text-prism-muted">@{member.username}</div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-prism-navy/6 px-2 py-1 text-xs font-medium text-prism-body">
                      <Plus className="size-3" />
                      Add
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedMembers.length > 0 && (
        <div className="space-y-3">
          {selectedMembers.map(member => (
            <div
              key={member.userId}
              className="rounded-xl border border-border bg-surface px-3 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-prism-body">{getMemberDisplayName(member)}</div>
                  <div className="truncate text-xs text-prism-muted">@{member.username}</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveMember(member.userId)}
                  disabled={isSubmitting}
                  className="size-8 rounded-full text-prism-muted hover:text-prism-body"
                  aria-label={`Remove ${getMemberDisplayName(member)}`}
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
                    {jobs.map(job => (
                      <label
                        key={job.jobId}
                        className="flex items-center gap-2 rounded-lg border border-border bg-surface-field px-3 py-2 text-sm text-prism-body"
                      >
                        <Checkbox
                          checked={member.jobIds.includes(job.jobId)}
                          disabled={isSubmitting}
                          onCheckedChange={checked => onToggleMemberJob(member.userId, job.jobId, checked === true)}
                        />
                        <span className="min-w-0 truncate">{job.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
