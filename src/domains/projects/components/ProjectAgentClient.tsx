"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleDashed,
  CircleSlash,
  Clock3,
  GitBranch,
  Loader2,
  Network,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Label } from "@/atomics/atoms/Label";
import { Skeleton } from "@/atomics/atoms/Skeleton";
import { Textarea } from "@/atomics/atoms/Textarea";
import { Typography } from "@/atomics/atoms/Typography";
import { AgentProjectSelector, type AgentProjectOption } from "@/domains/projects/components/AgentProjectSelector";
import { ProjectAgentSkeleton } from "@/domains/projects/components/ProjectAgentSkeleton";
import { useAgentRealtimeWorkspace } from "@/domains/projects/hooks/useAgentRealtimeWorkspace";
import { useAgentRunSteps } from "@/domains/projects/hooks/useAgentRunSteps";
import { useCancelAgentRun } from "@/domains/projects/hooks/useCancelAgentRun";
import { useRequestFeatureProvisioning } from "@/domains/projects/hooks/useRequestFeatureProvisioning";
import { useWorkspaceAgentRunHistory } from "@/domains/projects/hooks/useWorkspaceAgentRunHistory";
import type {
  AgentRun,
  AgentRunSearchResult,
  AgentRunStatus,
  AgentRunStepsByRunId,
  AgentStep,
  AgentStepStatus,
  FeatureProvisioningRequest,
} from "@/domains/projects/types";
import {
  getAgentArtifactName,
  getAgentRunStatusLabel,
  getAgentRunTriggerTypeLabel,
  getAgentStepStatusLabel,
  getAgentStepTypeLabel,
  getAgentTypeLabel,
  getShortReference,
} from "@/domains/projects/utils/agent-display";
import { getProjectMutationErrorMessage } from "@/domains/projects/utils/error";
import { formatProjectDateTimeWithSeconds } from "@/domains/projects/utils/work-item-display";
import { QUERY_KEYS } from "@/shared/query";
import { cn } from "@/shared/utils/cn";

type ProjectAgentClientProps = {
  workspaceId: string;
  projects: AgentProjectOption[];
  // When set (project scope) the target project is fixed to this id and the selector is locked.
  // When omitted (workspace scope) the user picks a target project from `projects`.
  lockedProjectId?: string;
  initialData?: AgentRunSearchResult;
  initialStepsByRunId?: AgentRunStepsByRunId;
};

type RequestFeedback = {
  tone: "success" | "error";
  message: string;
  detail?: string;
};

type StatusIcon = React.ComponentType<{ className?: string }>;

const FEATURE_SPECIFICATION_MAX_LENGTH = 20000;
const AGENT_TIMELINE_TICK_MS = 1000;
const EMPTY_AGENT_RUNS: AgentRun[] = [];
const EMPTY_AGENT_STEPS: AgentStep[] = [];
const ACTIVE_AGENT_RUN_STATUSES = new Set<AgentRunStatus>(["queued", "running", "waiting"]);

function getFeatureProvisioningRequestId(request: FeatureProvisioningRequest | undefined) {
  const requestId = request?.requestId?.trim();

  if (!requestId || requestId === "undefined" || requestId === "null") {
    return null;
  }

  return requestId;
}

function getFeatureProvisioningRequestDetail(request: FeatureProvisioningRequest | undefined) {
  const requestId = getFeatureProvisioningRequestId(request);

  return requestId ? `Request ${requestId}` : undefined;
}

const RUN_STATUS_CLASS_NAMES: Record<AgentRunStatus, string> = {
  queued: "border-prism-glow-sky/35 bg-prism-glow-sky/10 text-prism-navy",
  running: "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy",
  waiting: "border-prism-review/30 bg-prism-review/10 text-prism-navy",
  completed: "border-prism-success/25 bg-prism-success/10 text-prism-navy",
  failed: "border-prism-danger-soft bg-prism-danger-soft/20 text-prism-danger",
  cancelled: "border-border bg-surface-strong text-prism-muted",
};

const STEP_STATUS_CLASS_NAMES: Record<AgentStepStatus, string> = {
  pending: "border-border bg-surface-strong text-prism-muted",
  running: "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy",
  completed: "border-prism-success/25 bg-prism-success-soft/70 text-prism-success",
  failed: "border-prism-danger-soft bg-prism-danger-soft/20 text-prism-danger",
  skipped: "border-border bg-surface-strong text-prism-muted",
};

const STEP_STATUS_ICON_CLASS_NAMES: Record<AgentStepStatus, string> = {
  pending: "border-border bg-surface text-prism-muted",
  running: "border-prism-teal-500/30 bg-prism-teal-500/10 text-prism-teal-500",
  completed: "border-prism-success/30 bg-prism-success-soft text-prism-success",
  failed: "border-prism-danger-soft bg-prism-danger-soft/25 text-prism-danger",
  skipped: "border-border bg-surface-strong text-prism-muted",
};

const STEP_STATUS_ICONS: Record<AgentStepStatus, StatusIcon> = {
  pending: Circle,
  running: Loader2,
  completed: CheckCircle2,
  failed: AlertCircle,
  skipped: CircleSlash,
};

function formatNullableAgentDateTime(value: string | null, emptyLabel: string) {
  return value ? formatProjectDateTimeWithSeconds(value) : emptyLabel;
}

function formatElapsedSeconds(milliseconds: number) {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    return "Not available";
  }

  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

function formatElapsedBetween(start: string | null, end: string | null, emptyLabel: string) {
  if (!start || !end) {
    return emptyLabel;
  }

  return formatElapsedSeconds(new Date(end).getTime() - new Date(start).getTime());
}

function getQueueWaitLabel(run: AgentRun, now: number) {
  if (run.startedAt) {
    return formatElapsedBetween(run.createdAt, run.startedAt, "Not available");
  }

  if (isActiveAgentRun(run)) {
    return formatElapsedSeconds(now - new Date(run.createdAt).getTime());
  }

  return "Not started";
}

function getRunDurationLabel(run: AgentRun, now: number) {
  if (run.startedAt && run.completedAt) {
    return formatElapsedBetween(run.startedAt, run.completedAt, "Not available");
  }

  if (run.startedAt && isActiveAgentRun(run)) {
    return formatElapsedSeconds(now - new Date(run.startedAt).getTime());
  }

  return run.startedAt ? "Not finished" : "Not started";
}

function useAgentTimelineNow(enabled: boolean) {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    setNow(Date.now());
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, AGENT_TIMELINE_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled]);

  return now;
}

function sortAgentStepsByOrder(a: AgentStep, b: AgentStep) {
  if (a.stepOrder !== b.stepOrder) {
    return a.stepOrder - b.stepOrder;
  }

  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function getStepTimestamp(step: AgentStep) {
  if (step.completedAt) {
    return formatProjectDateTimeWithSeconds(step.completedAt);
  }

  if (step.startedAt) {
    return formatProjectDateTimeWithSeconds(step.startedAt);
  }

  return formatProjectDateTimeWithSeconds(step.createdAt);
}

function getStepTitle(step: AgentStep) {
  return step.inputSummary?.trim() || step.title;
}

function getStepSummary(step: AgentStep) {
  return step.errorMessage ?? step.outputSummary ?? step.inputSummary;
}

function isActiveAgentRun(run: AgentRun) {
  return ACTIVE_AGENT_RUN_STATUSES.has(run.status);
}

function RequestFeedbackBanner({ feedback }: { feedback: RequestFeedback }) {
  const isError = feedback.tone === "error";
  const Icon = isError ? AlertCircle : Check;
  const className = cn(
    "rounded-lg border px-4 py-3 text-sm",
    isError
      ? "border-prism-danger-soft bg-prism-danger-soft/20 text-prism-danger"
      : "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy",
  );
  const content = (
    <div className="flex gap-2">
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>
        <p>{feedback.message}</p>
        {feedback.detail ? <p className="mt-1 text-xs opacity-75">{feedback.detail}</p> : null}
      </div>
    </div>
  );

  if (isError) {
    return (
      <div
        role="alert"
        className={className}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      role="status"
      className={className}
    >
      {content}
    </div>
  );
}

function AgentRunStatusBadge({ status }: { status: AgentRunStatus }) {
  const isActive = ACTIVE_AGENT_RUN_STATUSES.has(status);
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
        RUN_STATUS_CLASS_NAMES[status],
      )}
    >
      {isActive ? <Loader2 className="size-3 animate-spin" /> : null}
      {getAgentRunStatusLabel(status)}
    </span>
  );
}

function AgentStepStatusBadge({ status }: { status: AgentStepStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border px-2 text-[11px] font-medium",
        STEP_STATUS_CLASS_NAMES[status],
      )}
    >
      {getAgentStepStatusLabel(status)}
    </span>
  );
}

function AgentRunStepDagSkeleton() {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-border bg-surface-field-soft">
      <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3 text-sm font-medium text-prism-muted">
        <Network className="size-4" />
        Execution graph
      </div>
      <div className="divide-y divide-border/60">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 px-4 py-4"
          >
            <Skeleton className="size-10 rounded-full bg-prism-navy/5" />
            <div>
              <Skeleton className="h-4 w-64 max-w-full bg-prism-navy/5" />
              <Skeleton className="mt-2 h-3 w-40 max-w-full bg-prism-navy/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentRunRootNode({ run }: { run: AgentRun }) {
  return (
    <li className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 px-4 py-4">
      <span
        aria-hidden="true"
        className="absolute bottom-[-1px] left-9 top-11 w-px bg-border-strong/50"
      />
      <span className="relative z-10 inline-flex size-10 items-center justify-center rounded-full border border-prism-glow-sky/35 bg-prism-glow-sky/10 text-prism-navy">
        <GitBranch className="size-5" />
      </span>
      <div className="min-w-0">
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
          className="min-w-0 truncate"
        >
          Request created
        </Typography>
        <div className="mt-1 text-sm text-prism-muted">{formatProjectDateTimeWithSeconds(run.createdAt)}</div>
      </div>
    </li>
  );
}

function AgentStepDagNode({ step, isLast }: { step: AgentStep; isLast: boolean }) {
  const Icon = STEP_STATUS_ICONS[step.status];
  const title = getStepTitle(step);
  const summary = getStepSummary(step);

  return (
    <li className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 px-4 py-4">
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute bottom-[-1px] left-9 top-11 w-px bg-border-strong/50"
        />
      ) : null}
      <span
        className={cn(
          "relative z-10 inline-flex size-10 items-center justify-center rounded-full border",
          STEP_STATUS_ICON_CLASS_NAMES[step.status],
        )}
      >
        <Icon className={cn("size-5", step.status === "running" && "animate-spin")} />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Typography
            variant="bodySm"
            tone="primary"
            weight="semibold"
            className="min-w-0 flex-1 basis-64 whitespace-normal break-words"
            title={title}
          >
            {title}
          </Typography>
          <AgentStepStatusBadge status={step.status} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-prism-muted">
          <span>Step {step.stepOrder + 1}</span>
          <span>{getAgentStepTypeLabel(step.stepType)}</span>
          <span>{getStepTimestamp(step)}</span>
        </div>
        {summary ? <p className="mt-2 line-clamp-3 text-sm leading-5 text-prism-body">{summary}</p> : null}
        {step.inputObjectName || step.outputObjectName ? (
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-prism-muted">
            {step.inputObjectName ? (
              <span
                className="max-w-full truncate rounded-md border border-border bg-surface px-1.5 py-0.5"
                title={step.inputObjectName}
              >
                Input: {getAgentArtifactName(step.inputObjectName)}
              </span>
            ) : null}
            {step.outputObjectName ? (
              <span
                className="max-w-full truncate rounded-md border border-border bg-surface px-1.5 py-0.5"
                title={step.outputObjectName}
              >
                Output: {getAgentArtifactName(step.outputObjectName)}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

function AgentRunStepDag({
  workspaceId,
  run,
  initialSteps,
}: {
  workspaceId: string;
  run: AgentRun;
  initialSteps?: AgentStep[];
}) {
  const { data, isPending, isFetching, isError, refetch } = useAgentRunSteps(workspaceId, run.runId, initialSteps, {
    isLive: isActiveAgentRun(run),
  });
  const steps = React.useMemo(() => [...(data ?? EMPTY_AGENT_STEPS)].sort(sortAgentStepsByOrder), [data]);

  if (isPending && !initialSteps) {
    return <AgentRunStepDagSkeleton />;
  }

  if (isError) {
    return (
      <div className="mt-4 rounded-lg border border-prism-danger-soft bg-surface px-4 py-3 text-sm text-prism-danger">
        <p>Agent steps could not be loaded.</p>
        <Button
          type="button"
          className="mt-3 h-9 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
          variant="outline"
          onClick={() => {
            void refetch();
          }}
        >
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="mt-5 rounded-xl border border-dashed border-border-strong/60 bg-surface-field-soft px-4 py-6 text-center">
        <CircleDashed className="mx-auto size-5 text-prism-muted" />
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
          className="mt-3"
        >
          Waiting for the agent plan
        </Typography>
        <Typography
          variant="caption"
          tone="muted"
          className="mx-auto mt-1 max-w-72"
        >
          Steps will appear as soon as this run publishes its execution plan.
        </Typography>
      </div>
    );
  }

  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-border bg-surface-field-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-prism-muted">
          <Network className="size-4" />
          Execution graph
        </div>
        {isFetching ? (
          <span className="inline-flex items-center gap-1 text-xs text-prism-muted">
            <Loader2 className="size-3.5 animate-spin" />
            Syncing
          </span>
        ) : null}
      </div>
      <ol className="divide-y divide-border/60">
        <AgentRunRootNode run={run} />
        {steps.map((step, index) => (
          <AgentStepDagNode
            key={step.stepId}
            step={step}
            isLast={index === steps.length - 1}
          />
        ))}
      </ol>
    </div>
  );
}

function AgentRunDagCard({
  workspaceId,
  run,
  timelineNow,
  initialSteps,
  isExpanded,
  isCancelling,
  isCancelDisabled,
  cancelError,
  onToggle,
  onCancel,
}: {
  workspaceId: string;
  run: AgentRun;
  timelineNow: number;
  initialSteps?: AgentStep[];
  isExpanded: boolean;
  isCancelling: boolean;
  isCancelDisabled: boolean;
  cancelError?: string;
  onToggle: () => void;
  onCancel: () => void;
}) {
  const graphRegionId = `agent-run-graph-${run.runId}`;
  const canCancel = isActiveAgentRun(run);

  return (
    <article className="rounded-xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <AgentRunStatusBadge status={run.status} />
          <span className="inline-flex min-h-7 items-center rounded-full border border-border bg-surface-strong px-2.5 text-xs font-medium text-prism-muted">
            {getAgentTypeLabel(run.agentType)}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {canCancel ? (
            <Button
              type="button"
              variant="outline"
              className="h-8 gap-1 rounded-lg border-prism-danger-soft bg-surface px-2.5 text-xs text-prism-danger hover:bg-prism-danger-soft/30 hover:text-prism-danger"
              disabled={isCancelDisabled}
              onClick={onCancel}
            >
              {isCancelling ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
              {isCancelling ? "Cancelling..." : "Cancel run"}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            className="h-8 gap-1 rounded-lg px-2.5 text-xs text-prism-muted hover:text-prism-body"
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-controls={graphRegionId}
          >
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            {isExpanded ? "Hide graph" : "Show graph"}
          </Button>
        </div>
      </div>

      {cancelError ? (
        <div className="mt-3 rounded-lg border border-prism-danger-soft bg-prism-danger-soft/20 px-3 py-2 text-sm text-prism-danger">
          {cancelError}
        </div>
      ) : null}

      <Typography
        variant="bodySm"
        tone="primary"
        weight="semibold"
        className="mt-3 line-clamp-2"
      >
        {run.objective}
      </Typography>

      <dl className="mt-4 grid gap-3 text-sm text-prism-muted sm:grid-cols-2 lg:grid-cols-5">
        <div className="min-w-0">
          <dt className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            Created
          </dt>
          <dd className="mt-1 truncate text-prism-body">{formatProjectDateTimeWithSeconds(run.createdAt)}</dd>
        </div>
        <div className="min-w-0">
          <dt>Started</dt>
          <dd className="mt-1 truncate text-prism-body">{formatNullableAgentDateTime(run.startedAt, "Not started")}</dd>
        </div>
        <div className="min-w-0">
          <dt>Finished</dt>
          <dd className="mt-1 truncate text-prism-body">
            {formatNullableAgentDateTime(run.completedAt, "Not finished")}
          </dd>
        </div>
        <div className="min-w-0">
          <dt>Queue wait</dt>
          <dd className="mt-1 truncate text-prism-body">{getQueueWaitLabel(run, timelineNow)}</dd>
        </div>
        <div className="min-w-0">
          <dt>Duration</dt>
          <dd className="mt-1 truncate text-prism-body">{getRunDurationLabel(run, timelineNow)}</dd>
        </div>
      </dl>

      <dl className="mt-3 grid gap-3 text-sm text-prism-muted sm:grid-cols-2">
        <div className="min-w-0">
          <dt>Trigger</dt>
          <dd className="mt-1 truncate text-prism-body">{getAgentRunTriggerTypeLabel(run.triggerType)}</dd>
        </div>
        {run.workItemId ? (
          <div className="min-w-0">
            <dt>Work item</dt>
            {run.workItemCode ? (
              <dd
                className="mt-1 truncate text-prism-body"
                title={run.workItemTitle ? `${run.workItemCode} — ${run.workItemTitle}` : run.workItemCode}
              >
                <span className="font-medium">{run.workItemCode}</span>
                {run.workItemTitle ? <span className="text-prism-muted"> — {run.workItemTitle}</span> : null}
              </dd>
            ) : (
              <dd
                className="mt-1 truncate font-mono text-prism-body"
                title={run.workItemId}
              >
                {getShortReference(run.workItemId)}
              </dd>
            )}
          </div>
        ) : null}
      </dl>

      {isExpanded ? (
        <div id={graphRegionId}>
          <AgentRunStepDag
            workspaceId={workspaceId}
            run={run}
            initialSteps={initialSteps}
          />
        </div>
      ) : null}
    </article>
  );
}

export function ProjectAgentClient({
  workspaceId,
  projects,
  lockedProjectId,
  initialData,
  initialStepsByRunId = {},
}: ProjectAgentClientProps) {
  const queryClient = useQueryClient();
  const { lastError: agentRealtimeError, status: agentRealtimeStatus } = useAgentRealtimeWorkspace({ workspaceId });
  const [featureSpecification, setFeatureSpecification] = React.useState("");
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const [requestFeedback, setRequestFeedback] = React.useState<RequestFeedback | null>(null);
  const [cancelRunErrorById, setCancelRunErrorById] = React.useState<Record<string, string>>({});
  // User-picked target project (workspace scope). Reconciled against `projects` below so a stale
  // selection (e.g. a project removed from the live list) falls back to the first available project.
  const [projectSelection, setProjectSelection] = React.useState<string | null>(null);
  // Per-run overrides for the lazily-loaded execution graph. Absent runs fall back to
  // the default policy: only the latest run (index 0) is expanded, so opening the page
  // fetches steps for one run instead of the whole 50-run history.
  const [runGraphOverrides, setRunGraphOverrides] = React.useState<Record<string, boolean>>({});
  const {
    data,
    isPending: isRunsPending,
    isError: isRunsError,
    refetch,
  } = useWorkspaceAgentRunHistory(workspaceId, initialData);
  const requestProvisioning = useRequestFeatureProvisioning();
  const cancelAgentRun = useCancelAgentRun();
  const runs = data?.items ?? EMPTY_AGENT_RUNS;
  const activeRunCount = React.useMemo(() => runs.filter(isActiveAgentRun).length, [runs]);
  const timelineNow = useAgentTimelineNow(activeRunCount > 0);
  const finishedRunCount = runs.length - activeRunCount;
  const trimmedSpecification = featureSpecification.trim();
  const specificationLength = featureSpecification.length;
  const isSpecificationTooLong = specificationLength > FEATURE_SPECIFICATION_MAX_LENGTH;
  const hasProjects = projects.length > 0;
  const isProjectLocked = Boolean(lockedProjectId);
  const targetProjectId =
    lockedProjectId ??
    (projectSelection && projects.some(project => project.projectId === projectSelection)
      ? projectSelection
      : (projects[0]?.projectId ?? null));
  const canSubmit =
    trimmedSpecification.length > 0 &&
    !isSpecificationTooLong &&
    !requestProvisioning.isPending &&
    !isRunsPending &&
    Boolean(targetProjectId);
  const hasRealtimeIssue = agentRealtimeStatus === "disconnected" || agentRealtimeStatus === "error";
  const agentRealtimeIssueMessage =
    agentRealtimeStatus === "error"
      ? (agentRealtimeError?.message ?? "Realtime sync is unavailable.")
      : "Realtime sync is reconnecting. Updates continue through periodic refresh.";

  function refreshAgentOverview() {
    void refetch();

    for (const run of runs) {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.agentRunSteps(workspaceId, run.runId),
      });
    }
  }

  function toggleRunGraph(runId: string, currentlyExpanded: boolean) {
    setRunGraphOverrides(prev => ({ ...prev, [runId]: !currentlyExpanded }));
  }

  function handleCancelRun(run: AgentRun) {
    setCancelRunErrorById(prev => {
      if (!(run.runId in prev)) {
        return prev;
      }

      const next = { ...prev };
      delete next[run.runId];
      return next;
    });

    cancelAgentRun.mutate(
      { workspaceId, runId: run.runId },
      {
        onError: error => {
          setCancelRunErrorById(prev => ({
            ...prev,
            [run.runId]: getProjectMutationErrorMessage(error, "Agent run could not be cancelled."),
          }));
        },
      },
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestFeedback(null);

    if (!trimmedSpecification) {
      setFieldError("Feature specification is required.");
      return;
    }

    if (isSpecificationTooLong) {
      setFieldError(
        `Feature specification must be ${FEATURE_SPECIFICATION_MAX_LENGTH.toLocaleString()} characters or less.`,
      );
      return;
    }

    if (!targetProjectId) {
      setFieldError("Select a project for the generated tasks.");
      return;
    }

    setFieldError(null);

    try {
      const request = await requestProvisioning.mutateAsync({
        workspaceId,
        projectId: targetProjectId,
        featureSpecification: trimmedSpecification,
      });
      const requestDetail = getFeatureProvisioningRequestDetail(request);

      if (request?.status === "dispatch_failed") {
        setRequestFeedback({
          tone: "error",
          message: request.errorMessage ?? "Provisioning request was created but dispatch failed.",
          detail: requestDetail,
        });
        return;
      }

      setFeatureSpecification("");
      setRequestFeedback({
        tone: "success",
        message: "Provisioning request queued.",
        detail: requestDetail,
      });
      refreshAgentOverview();
    } catch (error) {
      setRequestFeedback({
        tone: "error",
        message: getProjectMutationErrorMessage(error, "Feature provisioning request could not be created."),
      });
    }
  }

  if (isRunsPending && !data) {
    return <ProjectAgentSkeleton />;
  }

  return (
    <section className="mx-auto flex w-full max-w-[96rem] flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <Bot className="size-5 text-prism-muted" />
          <Typography
            variant="h3"
            tone="primary"
            className="text-xl tracking-normal md:text-2xl"
          >
            Agent overview
          </Typography>
        </div>
        <Typography
          variant="bodySm"
          tone="muted"
          className="mt-1 max-w-2xl"
        >
          Review recent agent runs, inspect each execution graph, and start a new task-generation run.
        </Typography>
      </div>

      <div className="grid w-full gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(22rem,0.85fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="rounded-xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_12px_36px_rgba(12,71,103,0.05)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Network className="size-5 text-prism-muted" />
                  <Typography
                    variant="h3"
                    tone="primary"
                    className="text-lg tracking-normal md:text-xl"
                  >
                    Agent run history
                  </Typography>
                </div>
                <Typography
                  variant="bodySm"
                  tone="muted"
                  className="mt-1 max-w-2xl"
                >
                  Recent runs stay visible after completion, with the latest execution graph shown first.
                </Typography>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                {runs.length > 0 ? (
                  <>
                    <span className="inline-flex min-h-8 items-center rounded-full border border-border bg-surface-strong px-3 text-xs font-medium text-prism-muted">
                      {activeRunCount} active
                    </span>
                    <span className="inline-flex min-h-8 items-center rounded-full border border-border bg-surface-strong px-3 text-xs font-medium text-prism-muted">
                      {finishedRunCount} finished
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            {hasRealtimeIssue && !isRunsError ? (
              <div className="mt-4 rounded-lg border border-prism-review/30 bg-prism-review/10 px-4 py-3 text-sm text-prism-navy">
                <div className="flex gap-2">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>{agentRealtimeIssueMessage}</p>
                </div>
              </div>
            ) : null}

            {isRunsError ? (
              <div className="mt-4 rounded-lg border border-prism-danger-soft bg-surface px-4 py-3 text-sm text-prism-danger">
                <p>Agent run history could not be loaded.</p>
                <Button
                  type="button"
                  className="mt-3 h-9 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
                  variant="outline"
                  onClick={refreshAgentOverview}
                >
                  <RefreshCw className="size-4" />
                  Retry
                </Button>
              </div>
            ) : null}

            {!isRunsError && runs.length === 0 ? (
              <div className="mt-5 rounded-lg border border-dashed border-border-strong/60 bg-surface-field-soft px-5 py-10 text-center">
                <Bot className="mx-auto size-5 text-prism-muted" />
                <Typography
                  variant="bodySm"
                  tone="primary"
                  weight="semibold"
                  className="mt-3"
                >
                  No agent run history yet
                </Typography>
                <Typography
                  variant="caption"
                  tone="muted"
                  className="mx-auto mt-1 max-w-72"
                >
                  Submitted provisioning requests will appear here and remain available after they finish.
                </Typography>
              </div>
            ) : null}

            {!isRunsError && runs.length > 0 ? (
              <div className="mt-5 grid gap-4">
                {runs.map((run, index) => {
                  const isExpanded = runGraphOverrides[run.runId] ?? index === 0;
                  const isCancelling = cancelAgentRun.isPending && cancelAgentRun.variables?.runId === run.runId;

                  return (
                    <AgentRunDagCard
                      key={run.runId}
                      workspaceId={workspaceId}
                      run={run}
                      timelineNow={timelineNow}
                      initialSteps={initialStepsByRunId[run.runId]}
                      isExpanded={isExpanded}
                      isCancelling={isCancelling}
                      isCancelDisabled={cancelAgentRun.isPending}
                      cancelError={cancelRunErrorById[run.runId]}
                      onToggle={() => toggleRunGraph(run.runId, isExpanded)}
                      onCancel={() => handleCancelRun(run)}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="flex min-w-0 flex-col gap-5">
          {requestFeedback ? <RequestFeedbackBanner feedback={requestFeedback} /> : null}

          <form
            className="rounded-xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]"
            onSubmit={event => {
              void handleSubmit(event);
            }}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-prism-muted" />
              <div className="min-w-0">
                <Label
                  htmlFor="feature-specification"
                  className="text-base font-semibold text-prism-heading"
                >
                  Start a new run
                </Label>
                <Typography
                  variant="bodySm"
                  tone="muted"
                  className="mt-1"
                >
                  Paste a feature specification to generate and assign project tasks.
                </Typography>
              </div>
            </div>

            <div className="mt-4">
              <Label
                htmlFor="agent-target-project"
                className="text-xs font-medium text-prism-muted"
              >
                Target project
              </Label>
              <div className="mt-1.5">
                <AgentProjectSelector
                  id="agent-target-project"
                  projects={projects}
                  value={targetProjectId}
                  disabled={isProjectLocked || requestProvisioning.isPending}
                  onChange={projectId => {
                    setProjectSelection(projectId);
                    setFieldError(null);
                  }}
                />
              </div>
            </div>

            <Textarea
              id="feature-specification"
              value={featureSpecification}
              maxLength={FEATURE_SPECIFICATION_MAX_LENGTH + 1}
              placeholder="Paste the feature specification here."
              disabled={requestProvisioning.isPending}
              onChange={event => {
                setFeatureSpecification(event.target.value);
                setFieldError(null);
                setRequestFeedback(null);
              }}
              className={cn(
                "mt-4 min-h-96 resize-y rounded-lg border-border bg-surface-field text-sm leading-6 focus-visible:ring-2 focus-visible:ring-ring",
                (fieldError || isSpecificationTooLong) && "border-red-300 focus-visible:ring-red-300/60",
              )}
              aria-invalid={Boolean(fieldError || isSpecificationTooLong)}
              aria-describedby="feature-specification-help"
            />

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div
                id="feature-specification-help"
                className={cn("text-xs text-prism-muted", (fieldError || isSpecificationTooLong) && "text-red-600")}
              >
                {fieldError ??
                  (isSpecificationTooLong
                    ? `Feature specification must be ${FEATURE_SPECIFICATION_MAX_LENGTH.toLocaleString()} characters or less.`
                    : !hasProjects
                      ? "Create a project in this workspace to start a run."
                      : "The request is submitted to the feature provisioning API.")}
              </div>
              <span className="text-xs text-prism-muted">
                {specificationLength.toLocaleString()} / {FEATURE_SPECIFICATION_MAX_LENGTH.toLocaleString()}
              </span>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                className="h-10 gap-1.5 rounded-lg px-4"
                disabled={!canSubmit}
              >
                {requestProvisioning.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {requestProvisioning.isPending ? "Submitting..." : "Generate tasks"}
              </Button>
            </div>
          </form>
        </aside>
      </div>
    </section>
  );
}
