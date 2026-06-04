"use client";

import * as React from "react";
import { AlertCircle, Bot, Check, Clock3, Loader2, RefreshCw, Send, Sparkles } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Label } from "@/atomics/atoms/Label";
import { Textarea } from "@/atomics/atoms/Textarea";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectAgentSkeleton } from "@/domains/projects/components/ProjectAgentSkeleton";
import { useCurrentWorkspaceAgentRuns } from "@/domains/projects/hooks/useCurrentWorkspaceAgentRuns";
import { useRequestFeatureProvisioning } from "@/domains/projects/hooks/useRequestFeatureProvisioning";
import type { AgentRun, AgentRunSearchResult, AgentRunStatus } from "@/domains/projects/types";
import { getAgentRunStatusLabel, getFeatureProvisioningStatusLabel } from "@/domains/projects/utils/agent-display";
import { getProjectMutationErrorMessage } from "@/domains/projects/utils/error";
import { formatProjectDateTime } from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectAgentClientProps = {
  projectId: string;
  workspaceId: string;
  initialData?: AgentRunSearchResult;
};

type RequestFeedback = {
  tone: "success" | "error";
  message: string;
  detail?: string;
};

const FEATURE_SPECIFICATION_MAX_LENGTH = 20000;
const EMPTY_AGENT_RUNS: AgentRun[] = [];

const RUN_STATUS_CLASS_NAMES: Record<AgentRunStatus, string> = {
  queued: "border-prism-glow-sky/35 bg-prism-glow-sky/10 text-prism-navy",
  running: "border-prism-teal-500/25 bg-prism-teal-500/10 text-prism-navy",
  waiting: "border-prism-review/30 bg-prism-review/10 text-prism-navy",
  completed: "border-prism-success/25 bg-prism-success/10 text-prism-navy",
  failed: "border-prism-danger-soft bg-prism-danger-soft/20 text-prism-danger",
  cancelled: "border-border bg-surface-strong text-prism-muted",
};

function formatNullableDateTime(value: string | null) {
  return value ? formatProjectDateTime(value) : "Not started";
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

function AgentRunCard({ run }: { run: AgentRun }) {
  return (
    <article className="rounded-xl border border-border/80 bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
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

      <dl className="mt-4 grid gap-2 text-xs text-prism-muted">
        <div className="flex items-center justify-between gap-3">
          <dt className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            Created
          </dt>
          <dd className="text-right text-prism-body">{formatProjectDateTime(run.createdAt)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Started</dt>
          <dd className="text-right text-prism-body">{formatNullableDateTime(run.startedAt)}</dd>
        </div>
        {run.workItemId ? (
          <div className="flex items-center justify-between gap-3">
            <dt>Work item</dt>
            <dd className="max-w-40 truncate text-right font-mono text-prism-body">{run.workItemId}</dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}

export function ProjectAgentClient({ projectId, workspaceId, initialData }: ProjectAgentClientProps) {
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
      void refetch();
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
    <section className="mx-auto grid w-full max-w-6xl gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
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
              "rounded-xl border px-4 py-3 text-sm",
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
          className="rounded-xl border border-border/80 bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]"
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

      <aside className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <Typography
              variant="title"
              tone="primary"
              className="text-base tracking-normal md:text-base"
            >
              Current jobs
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
            >
              Active workspace agent runs
            </Typography>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-lg border-border bg-surface px-3 text-prism-body"
            onClick={() => {
              void refetch();
            }}
            disabled={isRunsFetching}
          >
            <RefreshCw className={cn("size-4", isRunsFetching && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {isRunsError ? (
          <div className="rounded-xl border border-prism-danger-soft bg-surface px-4 py-3 text-sm text-prism-danger">
            <p>Agent jobs could not be loaded.</p>
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
        ) : null}

        {!isRunsError && runs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-strong/60 bg-surface px-5 py-8 text-center">
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
              <AgentRunCard
                key={run.runId}
                run={run}
              />
            ))}
          </div>
        ) : null}
      </aside>
    </section>
  );
}
