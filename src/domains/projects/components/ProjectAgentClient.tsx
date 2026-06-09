"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Bot,
  Check,
  CheckCircle2,
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
} from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Label } from "@/atomics/atoms/Label";
import { Skeleton } from "@/atomics/atoms/Skeleton";
import { Textarea } from "@/atomics/atoms/Textarea";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectAgentSkeleton } from "@/domains/projects/components/ProjectAgentSkeleton";
import { useAgentRealtimeWorkspace } from "@/domains/projects/hooks/useAgentRealtimeWorkspace";
import { useAgentRunSteps } from "@/domains/projects/hooks/useAgentRunSteps";
import { useCurrentWorkspaceAgentRuns } from "@/domains/projects/hooks/useCurrentWorkspaceAgentRuns";
import { useRequestFeatureProvisioning } from "@/domains/projects/hooks/useRequestFeatureProvisioning";
import type {
  AgentRun,
  AgentRunSearchResult,
  AgentRunStatus,
  AgentRunStepsByRunId,
  AgentStep,
  AgentStepStatus,
} from "@/domains/projects/types";
import {
  getAgentRunStatusLabel,
  getAgentStepStatusLabel,
  getAgentStepTypeLabel,
  getFeatureProvisioningStatusLabel,
} from "@/domains/projects/utils/agent-display";
import { getProjectMutationErrorMessage } from "@/domains/projects/utils/error";
import { formatProjectDateTime } from "@/domains/projects/utils/work-item-display";
import { QUERY_KEYS } from "@/shared/query";
import { cn } from "@/shared/utils/cn";

type ProjectAgentClientProps = {
  projectId: string;
  workspaceId: string;
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
const EMPTY_AGENT_RUNS: AgentRun[] = [];
const EMPTY_AGENT_STEPS: AgentStep[] = [];

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

function formatNullableDateTime(value: string | null) {
  return value ? formatProjectDateTime(value) : "Not started";
}

function sortAgentStepsByOrder(a: AgentStep, b: AgentStep) {
  if (a.stepOrder !== b.stepOrder) {
    return a.stepOrder - b.stepOrder;
  }

  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function getStepTimestamp(step: AgentStep) {
  if (step.completedAt) {
    return formatProjectDateTime(step.completedAt);
  }

  if (step.startedAt) {
    return formatProjectDateTime(step.startedAt);
  }

  return formatProjectDateTime(step.createdAt);
}

function getStepSummary(step: AgentStep) {
  return step.errorMessage ?? step.outputSummary ?? step.inputSummary;
}

function AgentRunStatusBadge({ status }: { status: AgentRunStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium",
        RUN_STATUS_CLASS_NAMES[status],
      )}
    >
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
    <div className="mt-4 rounded-lg border border-border bg-surface-field-soft p-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 py-2"
        >
          <Skeleton className="size-8 rounded-full bg-prism-navy/5" />
          <div>
            <Skeleton className="h-4 w-56 max-w-full bg-prism-navy/5" />
            <Skeleton className="mt-2 h-3 w-40 max-w-full bg-prism-navy/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentRunRootNode({ run, isLast }: { run: AgentRun; isLast: boolean }) {
  return (
    <li className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-3 px-3 py-3">
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute bottom-[-1px] left-7 top-9 w-px bg-border-strong/50"
        />
      ) : null}
      <span className="relative z-10 inline-flex size-8 items-center justify-center rounded-full border border-prism-glow-sky/35 bg-prism-glow-sky/10 text-prism-navy">
        <GitBranch className="size-4" />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Typography
            variant="bodySm"
            tone="primary"
            weight="semibold"
            className="min-w-0 truncate"
          >
            {run.agentType}
          </Typography>
          <AgentRunStatusBadge status={run.status} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-prism-muted">
          <span>{run.triggerType}</span>
          <span>{formatProjectDateTime(run.createdAt)}</span>
        </div>
      </div>
    </li>
  );
}

function AgentStepDagNode({ step, isLast }: { step: AgentStep; isLast: boolean }) {
  const Icon = STEP_STATUS_ICONS[step.status];
  const summary = getStepSummary(step);

  return (
    <li className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-3 px-3 py-3">
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute bottom-[-1px] left-7 top-9 w-px bg-border-strong/50"
        />
      ) : null}
      <span
        className={cn(
          "relative z-10 inline-flex size-8 items-center justify-center rounded-full border",
          STEP_STATUS_ICON_CLASS_NAMES[step.status],
        )}
      >
        <Icon className={cn("size-4", step.status === "running" && "animate-spin")} />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Typography
            variant="bodySm"
            tone="primary"
            weight="semibold"
            className="min-w-0 truncate"
          >
            {step.title}
          </Typography>
          <AgentStepStatusBadge status={step.status} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-prism-muted">
          <span>Step {step.stepOrder + 1}</span>
          <span>{getAgentStepTypeLabel(step.stepType)}</span>
          <span>{getStepTimestamp(step)}</span>
        </div>
        {summary ? <p className="mt-2 line-clamp-2 text-sm leading-5 text-prism-body">{summary}</p> : null}
        {step.inputObjectName || step.outputObjectName ? (
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-prism-muted">
            {step.inputObjectName ? (
              <span className="max-w-full truncate rounded-md border border-border bg-surface px-1.5 py-0.5">
                Input: {step.inputObjectName}
              </span>
            ) : null}
            {step.outputObjectName ? (
              <span className="max-w-full truncate rounded-md border border-border bg-surface px-1.5 py-0.5">
                Output: {step.outputObjectName}
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
  const { data, isPending, isFetching, isError, refetch } = useAgentRunSteps(workspaceId, run.runId, initialSteps);
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
      <div className="mt-4 rounded-lg border border-dashed border-border-strong/60 bg-surface-field-soft px-4 py-5 text-center">
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
    <div className="mt-4 overflow-hidden rounded-lg border border-border bg-surface-field-soft">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-medium text-prism-muted">
          <Network className="size-3.5" />
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
        <AgentRunRootNode
          run={run}
          isLast={steps.length === 0}
        />
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
  initialSteps,
}: {
  workspaceId: string;
  run: AgentRun;
  initialSteps?: AgentStep[];
}) {
  return (
    <article className="rounded-lg border border-border/80 bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
      <div className="flex flex-wrap items-center gap-2">
        <AgentRunStatusBadge status={run.status} />
        <span className="inline-flex min-h-7 items-center rounded-full border border-border bg-surface-strong px-2.5 text-xs font-medium text-prism-muted">
          {run.agentType}
        </span>
      </div>

      <Typography
        variant="bodySm"
        tone="primary"
        weight="semibold"
        className="mt-3 line-clamp-2"
      >
        {run.objective}
      </Typography>

      <dl className="mt-4 grid gap-2 text-xs text-prism-muted sm:grid-cols-3">
        <div className="min-w-0">
          <dt className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            Created
          </dt>
          <dd className="mt-1 truncate text-prism-body">{formatProjectDateTime(run.createdAt)}</dd>
        </div>
        <div className="min-w-0">
          <dt>Started</dt>
          <dd className="mt-1 truncate text-prism-body">{formatNullableDateTime(run.startedAt)}</dd>
        </div>
        {run.workItemId ? (
          <div className="min-w-0">
            <dt>Work item</dt>
            <dd className="mt-1 truncate font-mono text-prism-body">{run.workItemId}</dd>
          </div>
        ) : (
          <div className="min-w-0">
            <dt>Trigger</dt>
            <dd className="mt-1 truncate text-prism-body">{run.triggerType}</dd>
          </div>
        )}
      </dl>

      <AgentRunStepDag
        workspaceId={workspaceId}
        run={run}
        initialSteps={initialSteps}
      />
    </article>
  );
}

export function ProjectAgentClient({
  projectId,
  workspaceId,
  initialData,
  initialStepsByRunId = {},
}: ProjectAgentClientProps) {
  const queryClient = useQueryClient();
  const { lastError: agentRealtimeError, status: agentRealtimeStatus } = useAgentRealtimeWorkspace({ workspaceId });
  const [featureSpecification, setFeatureSpecification] = React.useState("");
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const [requestFeedback, setRequestFeedback] = React.useState<RequestFeedback | null>(null);
  const {
    data,
    isPending: isRunsPending,
    isFetching: isRunsFetching,
    isError: isRunsError,
    refetch,
  } = useCurrentWorkspaceAgentRuns(workspaceId, initialData);
  const requestProvisioning = useRequestFeatureProvisioning();
  const runs = data?.items ?? EMPTY_AGENT_RUNS;
  const trimmedSpecification = featureSpecification.trim();
  const specificationLength = featureSpecification.length;
  const isSpecificationTooLong = specificationLength > FEATURE_SPECIFICATION_MAX_LENGTH;
  const canSubmit =
    trimmedSpecification.length > 0 && !isSpecificationTooLong && !requestProvisioning.isPending && !isRunsPending;
  const shouldShowAgentSyncButton = agentRealtimeStatus === "disconnected" || agentRealtimeStatus === "error";
  const agentRealtimeIssueMessage =
    agentRealtimeStatus === "error"
      ? (agentRealtimeError?.message ?? "Realtime sync is unavailable.")
      : "Realtime sync is reconnecting. You can manually sync while it recovers.";

  function refreshAgentOverview() {
    void refetch();

    for (const run of runs) {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.agentRunSteps(workspaceId, run.runId),
      });
    }
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

    setFieldError(null);

    try {
      const request = await requestProvisioning.mutateAsync({
        workspaceId,
        projectId,
        featureSpecification: trimmedSpecification,
      });
      const statusLabel = getFeatureProvisioningStatusLabel(request.status);

      if (request.status === "dispatch_failed") {
        setRequestFeedback({
          tone: "error",
          message: request.errorMessage ?? "Provisioning request was created but dispatch failed.",
          detail: `Request ${request.requestId}`,
        });
        return;
      }

      setFeatureSpecification("");
      setRequestFeedback({
        tone: "success",
        message: `Provisioning request ${statusLabel.toLowerCase()}.`,
        detail: `Request ${request.requestId}`,
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
    <section className="mx-auto grid w-full max-w-7xl gap-5 xl:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.25fr)]">
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="size-5 text-prism-muted" />
            <Typography
              variant="h3"
              tone="primary"
              className="text-xl tracking-normal md:text-xl"
            >
              Agent
            </Typography>
          </div>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1"
          >
            Generate and assign project tasks from a feature specification.
          </Typography>
        </div>

        {requestFeedback ? (
          <div
            role={requestFeedback.tone === "error" ? "alert" : "status"}
            className={cn(
              "rounded-lg border px-4 py-3 text-sm",
              requestFeedback.tone === "error"
                ? "border-prism-danger-soft bg-prism-danger-soft/20 text-prism-danger"
                : "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy",
            )}
          >
            <div className="flex gap-2">
              {requestFeedback.tone === "error" ? (
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
              ) : (
                <Check className="mt-0.5 size-4 shrink-0" />
              )}
              <div>
                <p>{requestFeedback.message}</p>
                {requestFeedback.detail ? <p className="mt-1 text-xs opacity-75">{requestFeedback.detail}</p> : null}
              </div>
            </div>
          </div>
        ) : null}

        <form
          className="rounded-lg border border-border/80 bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]"
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
                Feature specification
              </Label>
              <Typography
                variant="bodySm"
                tone="muted"
                className="mt-1"
              >
                Paste the feature specification document text.
              </Typography>
            </div>
          </div>

          <Textarea
            id="feature-specification"
            value={featureSpecification}
            rows={12}
            maxLength={FEATURE_SPECIFICATION_MAX_LENGTH + 1}
            placeholder="Paste the feature specification here."
            disabled={requestProvisioning.isPending}
            onChange={event => {
              setFeatureSpecification(event.target.value);
              setFieldError(null);
              setRequestFeedback(null);
            }}
            className={cn(
              "mt-4 min-h-72 resize-y rounded-lg border-border bg-surface-field text-sm leading-6 focus-visible:ring-2 focus-visible:ring-ring",
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
      </div>

      <aside className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Network className="size-5 text-prism-muted" />
              <Typography
                variant="h3"
                tone="primary"
                className="text-xl tracking-normal md:text-xl"
              >
                Realtime job DAG
              </Typography>
            </div>
            <Typography
              variant="bodySm"
              tone="muted"
              className="mt-1"
            >
              Active agent runs and steps
            </Typography>
          </div>
          {shouldShowAgentSyncButton ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-lg border-border bg-surface px-3 text-prism-body"
              title={agentRealtimeIssueMessage}
              onClick={refreshAgentOverview}
              disabled={isRunsFetching}
            >
              <RefreshCw className={cn("size-4", isRunsFetching && "animate-spin")} />
              Sync
            </Button>
          ) : null}
        </div>

        {shouldShowAgentSyncButton && !isRunsError ? (
          <div className="rounded-lg border border-prism-review/30 bg-prism-review/10 px-4 py-3 text-sm text-prism-navy">
            <div className="flex gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{agentRealtimeIssueMessage}</p>
            </div>
          </div>
        ) : null}

        {isRunsError ? (
          <div className="rounded-lg border border-prism-danger-soft bg-surface px-4 py-3 text-sm text-prism-danger">
            <p>Agent jobs could not be loaded.</p>
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
          <div className="rounded-lg border border-dashed border-border-strong/60 bg-surface px-5 py-8 text-center">
            <Bot className="mx-auto size-5 text-prism-muted" />
            <Typography
              variant="bodySm"
              tone="primary"
              weight="semibold"
              className="mt-3"
            >
              No active agent jobs
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="mx-auto mt-1 max-w-56"
            >
              Submitted provisioning requests will appear when the agent starts processing them.
            </Typography>
          </div>
        ) : null}

        {!isRunsError && runs.length > 0 ? (
          <div className="grid gap-3">
            {runs.map(run => (
              <AgentRunDagCard
                key={run.runId}
                workspaceId={workspaceId}
                run={run}
                initialSteps={initialStepsByRunId[run.runId]}
              />
            ))}
          </div>
        ) : null}
      </aside>
    </section>
  );
}
