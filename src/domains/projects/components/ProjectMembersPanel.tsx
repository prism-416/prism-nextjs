"use client";

import * as React from "react";
import { Check, Plus, RefreshCw, Save, Search, Trash2, Users, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Typography } from "@/atomics/atoms/Typography";
import { useRemoveProjectMemberAssignment } from "@/domains/projects/hooks/useRemoveProjectMemberAssignment";
import { useSaveProjectMemberAssignments } from "@/domains/projects/hooks/useSaveProjectMemberAssignments";
import type { ProjectAssignableMember, ProjectJob, ProjectMemberListItem } from "@/domains/projects/types";
import { getProjectMemberDisplayName, getProjectMemberSearchText } from "@/domains/projects/utils/member";
import { cn } from "@/shared/utils/cn";

type ProjectMembersPanelProps = {
  projectId: string;
  workspaceSlug?: string;
  members: ProjectMemberListItem[];
  assignableMembers: ProjectAssignableMember[];
  jobs: ProjectJob[];
  isPending: boolean;
  isError: boolean;
  isAssignableMembersPending: boolean;
  isAssignableMembersError: boolean;
  isJobsPending: boolean;
  isJobsError: boolean;
  onRetry: () => void;
  onRetryAssignableMembers: () => void;
  onRetryJobs: () => void;
};

type EditableProjectMember = ProjectAssignableMember & {
  memberId?: string;
  jobIds: string[];
  assignedJobNames: string[];
  isPersisted: boolean;
};

const MEMBER_RESULT_LIMIT = 8;

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

function getUniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

function getJobIdsFromNames(jobNames: string[], jobs: ProjectJob[]) {
  const jobsByName = new Map(jobs.map(job => [job.name, job.jobId]));

  return getUniqueValues(jobNames.map(name => jobsByName.get(name)).filter((jobId): jobId is string => Boolean(jobId)));
}

function getJobNamesFromIds(jobIds: string[], jobs: ProjectJob[]) {
  const jobsById = new Map(jobs.map(job => [job.jobId, job.name]));

  return getUniqueValues(jobIds.map(jobId => jobsById.get(jobId)).filter((name): name is string => Boolean(name)));
}

function haveSameValues(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  const rightValues = new Set(right);

  return left.every(value => rightValues.has(value));
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function getEditableMembers(members: ProjectMemberListItem[], jobs: ProjectJob[]): EditableProjectMember[] {
  return members.map(member => ({
    memberId: member.memberId,
    userId: member.userId,
    fullName: member.fullName,
    username: member.username,
    jobIds: getJobIdsFromNames(member.jobNames, jobs),
    assignedJobNames: member.jobNames,
    isPersisted: true,
  }));
}

export function ProjectMembersPanel({
  projectId,
  workspaceSlug,
  members,
  assignableMembers,
  jobs,
  isPending,
  isError,
  isAssignableMembersPending,
  isAssignableMembersError,
  isJobsPending,
  isJobsError,
  onRetry,
  onRetryAssignableMembers,
  onRetryJobs,
}: ProjectMembersPanelProps) {
  const [memberQuery, setMemberQuery] = React.useState("");
  const [draftMembers, setDraftMembers] = React.useState<EditableProjectMember[]>([]);
  const [panelError, setPanelError] = React.useState<string | null>(null);
  const [panelMessage, setPanelMessage] = React.useState<string | null>(null);
  const [savingUserId, setSavingUserId] = React.useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = React.useState<string | null>(null);
  const saveAssignments = useSaveProjectMemberAssignments();
  const removeAssignment = useRemoveProjectMemberAssignment();
  const workspaceJobsHref = workspaceSlug ? `/workspaces/${encodeURIComponent(workspaceSlug)}/jobs` : undefined;
  const persistedMembers = React.useMemo(() => getEditableMembers(members, jobs), [jobs, members]);
  const persistedMemberByUserId = React.useMemo(
    () => new Map(persistedMembers.map(member => [member.userId, member])),
    [persistedMembers],
  );
  const draftMemberIds = React.useMemo(() => new Set(draftMembers.map(member => member.userId)), [draftMembers]);
  const availableMembers = React.useMemo(() => {
    const normalizedQuery = memberQuery.trim().toLowerCase();

    return assignableMembers
      .filter(member => !draftMemberIds.has(member.userId))
      .filter(member => (normalizedQuery ? getProjectMemberSearchText(member).includes(normalizedQuery) : true))
      .slice(0, MEMBER_RESULT_LIMIT);
  }, [assignableMembers, draftMemberIds, memberQuery]);
  const isMutating = saveAssignments.isPending || removeAssignment.isPending;
  const canAssignJobs = !isJobsPending && !isJobsError && jobs.length > 0;
  const addMemberUnavailableMessage = isJobsPending
    ? "Loading project jobs before members can be added..."
    : isJobsError
      ? "Load workspace project jobs before adding members."
      : jobs.length === 0
        ? "No workspace project jobs available."
        : null;

  React.useEffect(() => {
    setDraftMembers(persistedMembers);
  }, [persistedMembers]);

  function handleAddMember(member: ProjectAssignableMember) {
    setDraftMembers(previous => [
      ...previous,
      {
        ...member,
        jobIds: [],
        assignedJobNames: [],
        isPersisted: false,
      },
    ]);
    setMemberQuery("");
    setPanelError(null);
    setPanelMessage(null);
  }

  function handleRemoveLocalMember(userId: string) {
    setDraftMembers(previous => previous.filter(member => member.userId !== userId));
    setPanelError(null);
    setPanelMessage(null);
  }

  function handleToggleMemberJob(userId: string, jobId: string, checked: boolean) {
    setDraftMembers(previous =>
      previous.map(member => {
        if (member.userId !== userId) {
          return member;
        }

        const jobIds = checked
          ? getUniqueValues([...member.jobIds, jobId])
          : member.jobIds.filter(selectedJobId => selectedJobId !== jobId);

        return { ...member, jobIds };
      }),
    );
    setPanelError(null);
    setPanelMessage(null);
  }

  async function handleSaveMember(member: EditableProjectMember) {
    if (member.jobIds.length === 0) {
      setPanelError("Select at least one project job before saving this member.");
      return;
    }

    setSavingUserId(member.userId);
    setPanelError(null);
    setPanelMessage(null);

    try {
      const savedMembers = await saveAssignments.mutateAsync({
        projectId,
        userId: member.userId,
        jobIds: member.jobIds,
      });
      const savedMember = savedMembers.find(item => item.userId === member.userId);

      setDraftMembers(previous =>
        previous.map(item => {
          if (item.userId !== member.userId) {
            return item;
          }

          return {
            ...item,
            memberId: savedMember?.memberId ?? item.memberId,
            jobIds: savedMember?.jobIds ?? item.jobIds,
            assignedJobNames: getJobNamesFromIds(savedMember?.jobIds ?? item.jobIds, jobs),
            isPersisted: true,
          };
        }),
      );
      setPanelMessage("Project member assignments saved.");
    } catch (error) {
      setPanelError(getErrorMessage(error, "Project member assignments could not be saved."));
    } finally {
      setSavingUserId(null);
    }
  }

  async function handleRemoveMember(member: EditableProjectMember) {
    if (!member.memberId) {
      handleRemoveLocalMember(member.userId);
      return;
    }

    setRemovingMemberId(member.memberId);
    setPanelError(null);
    setPanelMessage(null);

    try {
      await removeAssignment.mutateAsync({
        projectId,
        memberId: member.memberId,
      });
      setDraftMembers(previous => previous.filter(item => item.userId !== member.userId));
      setPanelMessage("Project member removed.");
    } catch (error) {
      setPanelError(getErrorMessage(error, "Project member could not be removed."));
    } finally {
      setRemovingMemberId(null);
    }
  }

  return (
    <section
      id="members"
      className="scroll-mt-24 rounded-2xl border border-border/80 bg-surface p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-prism-navy/6 text-prism-muted">
            <Users className="size-4" />
          </span>
          <div>
            <Typography
              variant="title"
              tone="primary"
            >
              Members
            </Typography>
            <Typography
              variant="bodySm"
              tone="muted"
              className="mt-1 max-w-2xl"
            >
              Workspace members and their project job assignments.
            </Typography>
          </div>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-border bg-surface-strong px-2.5 py-1 text-xs font-medium text-prism-muted">
          {draftMembers.length} assigned
        </span>
      </div>

      {(panelError || panelMessage || isError || isJobsError || isAssignableMembersError) && (
        <div className="mt-5 space-y-2">
          {panelError ? (
            <div className="rounded-xl border border-prism-danger-soft bg-prism-danger-soft/20 px-4 py-3 text-sm text-prism-danger">
              {panelError}
            </div>
          ) : null}
          {panelMessage ? (
            <div className="rounded-xl border border-prism-teal-500/20 bg-prism-teal-500/10 px-4 py-3 text-sm text-prism-navy">
              {panelMessage}
            </div>
          ) : null}
          {isError ? (
            <RetryNotice
              message="Project members could not be loaded."
              onRetry={onRetry}
            />
          ) : null}
          {isJobsError ? (
            <RetryNotice
              message="Workspace project jobs could not be loaded."
              onRetry={onRetryJobs}
            />
          ) : null}
          {isAssignableMembersError ? (
            <RetryNotice
              message="Workspace members could not be loaded."
              onRetry={onRetryAssignableMembers}
            />
          ) : null}
        </div>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)]">
        <div className="rounded-xl border border-border/70 bg-surface-strong p-4">
          <Typography
            variant="bodySm"
            tone="primary"
            weight="semibold"
          >
            Add member
          </Typography>
          <Typography
            variant="caption"
            tone="muted"
            className="mt-1"
          >
            Available workspace members.
          </Typography>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-prism-muted" />
            <Input
              value={memberQuery}
              disabled={isAssignableMembersPending || isMutating || !canAssignJobs}
              onChange={event => setMemberQuery(event.target.value)}
              placeholder="Search by name or username"
              className="h-10 rounded-lg border-border bg-surface-field pl-9"
            />
          </div>

          <div className="mt-3 overflow-hidden rounded-xl border border-border bg-surface">
            {addMemberUnavailableMessage ? (
              <div className="px-3 py-3 text-sm text-prism-muted">{addMemberUnavailableMessage}</div>
            ) : isAssignableMembersPending ? (
              <div className="px-3 py-3 text-sm text-prism-muted">Loading workspace members...</div>
            ) : availableMembers.length === 0 ? (
              <div className="px-3 py-3 text-sm text-prism-muted">
                {memberQuery.trim() ? "No matching workspace members." : "All workspace members are already listed."}
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto py-1">
                {availableMembers.map(member => (
                  <button
                    key={member.userId}
                    type="button"
                    disabled={isMutating || !canAssignJobs}
                    onClick={() => handleAddMember(member)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-prism-navy/5 disabled:opacity-50"
                  >
                    <MemberAvatar member={member} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-prism-body">
                        {getProjectMemberDisplayName(member)}
                      </span>
                      <span className="block truncate text-xs text-prism-muted">@{member.username}</span>
                    </span>
                    <span className="ml-auto grid size-7 shrink-0 place-items-center rounded-full border border-border bg-surface-strong text-prism-muted">
                      <Plus className="size-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isJobsPending && !isJobsError && jobs.length === 0 ? (
            <div className="mt-3 rounded-xl border border-border bg-surface px-3 py-3 text-sm text-prism-muted">
              <p>No project jobs are available in this workspace yet.</p>
              {workspaceJobsHref ? (
                <Button
                  asChild
                  variant="outline"
                  className="mt-3 h-8 rounded-lg bg-surface px-3"
                >
                  <Link href={workspaceJobsHref}>Manage jobs</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="min-h-80 rounded-xl border border-border/70 bg-surface">
          {isPending ? (
            <div className="px-4 py-5 text-sm text-prism-muted">Loading project members...</div>
          ) : draftMembers.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-5 py-8 text-center">
              <div className="grid size-10 place-items-center rounded-full bg-prism-navy/6 text-prism-muted">
                <Users className="size-4" />
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
                No project member assignments yet.
              </Typography>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {draftMembers.map(member => {
                const persistedMember = persistedMemberByUserId.get(member.userId);
                const isDirty =
                  !member.isPersisted || !haveSameValues(member.jobIds, persistedMember?.jobIds ?? member.jobIds);
                const isSaving = savingUserId === member.userId;
                const isRemoving = Boolean(member.memberId && removingMemberId === member.memberId);
                const disabled = isMutating || isPending || isJobsPending || isJobsError || jobs.length === 0;

                return (
                  <div
                    key={member.userId}
                    className="px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <MemberAvatar member={member} />
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <Typography
                              variant="bodySm"
                              tone="primary"
                              weight="semibold"
                              className="truncate"
                            >
                              {getProjectMemberDisplayName(member)}
                            </Typography>
                            <span
                              className={cn(
                                "shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium",
                                member.jobIds.length > 0
                                  ? "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy"
                                  : "border-prism-danger-soft bg-prism-danger-soft/20 text-prism-danger",
                              )}
                            >
                              {getSelectedJobText(member.jobIds.length || member.assignedJobNames.length)}
                            </span>
                            {!member.isPersisted ? (
                              <span className="shrink-0 rounded-full border border-prism-glow-sky/35 bg-prism-glow-sky/10 px-2 py-0.5 text-xs font-medium text-prism-navy">
                                New
                              </span>
                            ) : null}
                          </div>
                          <Typography
                            variant="caption"
                            tone="muted"
                            className="truncate text-xs"
                          >
                            @{member.username}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!isDirty || disabled || isSaving}
                          onClick={() => {
                            void handleSaveMember(member);
                          }}
                          className="h-8 rounded-lg bg-surface px-3"
                        >
                          {isSaving ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isMutating}
                          onClick={() => {
                            void handleRemoveMember(member);
                          }}
                          className="size-8 rounded-lg text-prism-muted hover:text-prism-danger"
                          aria-label={`Remove ${getProjectMemberDisplayName(member)}`}
                        >
                          {isRemoving ? <RefreshCw className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <JobSelector
                        member={member}
                        jobs={jobs}
                        disabled={disabled}
                        isJobsPending={isJobsPending}
                        onToggleJob={handleToggleMemberJob}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type RetryNoticeProps = {
  message: string;
  onRetry: () => void;
};

function RetryNotice({ message, onRetry }: RetryNoticeProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-prism-danger-soft bg-prism-danger-soft/20 px-4 py-3 text-sm text-prism-danger sm:flex-row sm:items-center sm:justify-between">
      <span>{message}</span>
      <Button
        type="button"
        variant="outline"
        className="h-8 w-fit rounded-lg border-prism-danger-soft bg-surface px-3 text-prism-danger hover:bg-prism-danger-soft/40"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}

type MemberAvatarProps = {
  member: ProjectAssignableMember;
};

function MemberAvatar({ member }: MemberAvatarProps) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-prism-navy text-sm font-semibold text-primary-foreground">
      {getMemberInitial(member)}
    </span>
  );
}

type JobSelectorProps = {
  member: EditableProjectMember;
  jobs: ProjectJob[];
  disabled: boolean;
  isJobsPending: boolean;
  onToggleJob: (userId: string, jobId: string, checked: boolean) => void;
};

function JobSelector({ member, jobs, disabled, isJobsPending, onToggleJob }: JobSelectorProps) {
  if (isJobsPending) {
    return (
      <Typography
        variant="caption"
        tone="muted"
      >
        Loading project jobs...
      </Typography>
    );
  }

  if (jobs.length === 0) {
    if (member.assignedJobNames.length > 0) {
      return (
        <div className="flex flex-wrap gap-2">
          {member.assignedJobNames.map(jobName => (
            <span
              key={jobName}
              className="rounded-full border border-border bg-surface-strong px-2.5 py-1 text-xs font-medium text-prism-muted"
            >
              {jobName}
            </span>
          ))}
        </div>
      );
    }

    return (
      <Typography
        variant="caption"
        tone="muted"
      >
        No project jobs are available for assignment.
      </Typography>
    );
  }

  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      {jobs.map(job => {
        const selected = member.jobIds.includes(job.jobId);

        return (
          <button
            key={job.jobId}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => onToggleJob(member.userId, job.jobId, !selected)}
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
                selected ? "border-prism-glow-sky bg-prism-glow-sky text-white" : "border-border bg-surface",
              )}
            >
              {selected ? <Check className="size-3.5" /> : <X className="size-3 opacity-0" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{job.name}</span>
              <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-prism-muted">{job.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
