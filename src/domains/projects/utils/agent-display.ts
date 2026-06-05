import type { AgentRunStatus, FeatureProvisioningRequestStatus } from "@/domains/projects/types";

const AGENT_RUN_STATUS_LABELS: Record<AgentRunStatus, string> = {
  queued: "Queued",
  running: "Running",
  waiting: "Waiting",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

const FEATURE_PROVISIONING_STATUS_LABELS: Record<FeatureProvisioningRequestStatus, string> = {
  pending: "Pending",
  queued: "Queued",
  dispatch_failed: "Dispatch failed",
};

function formatUnknownStatus(status: string | null | undefined, fallback: string) {
  if (!status) {
    return fallback;
  }

  return status
    .split("_")
    .filter(Boolean)
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function getAgentRunStatusLabel(status: AgentRunStatus | string | null | undefined) {
  return AGENT_RUN_STATUS_LABELS[status as AgentRunStatus] ?? formatUnknownStatus(status, "Unknown");
}

export function getFeatureProvisioningStatusLabel(
  status: FeatureProvisioningRequestStatus | string | null | undefined,
) {
  return (
    FEATURE_PROVISIONING_STATUS_LABELS[status as FeatureProvisioningRequestStatus] ??
    formatUnknownStatus(status, "Submitted")
  );
}
