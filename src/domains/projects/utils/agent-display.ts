import type {
  AgentRunStatus,
  AgentRunTriggerType,
  AgentStepStatus,
  FeatureProvisioningRequestStatus,
} from "@/domains/projects/types";

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

const AGENT_STEP_STATUS_LABELS: Record<AgentStepStatus, string> = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  skipped: "Skipped",
};

const AGENT_RUN_TRIGGER_TYPE_LABELS: Record<AgentRunTriggerType, string> = {
  manual: "Manual",
  event: "Event",
  scheduled: "Scheduled",
  webhook: "Webhook",
  recursive: "Follow-up",
};

const SHORT_REFERENCE_LENGTH = 8;

function formatUnknownStatus(status: string | null | undefined, fallback: string) {
  if (!status) {
    return fallback;
  }

  return status
    .split(/[_\-\s]+/)
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

export function getAgentStepStatusLabel(status: AgentStepStatus | string | null | undefined) {
  return AGENT_STEP_STATUS_LABELS[status as AgentStepStatus] ?? formatUnknownStatus(status, "Unknown");
}

export function getAgentStepTypeLabel(stepType: string | null | undefined) {
  return formatUnknownStatus(stepType, "Step");
}

export function getAgentTypeLabel(agentType: string | null | undefined) {
  return formatUnknownStatus(agentType, "Agent");
}

export function getAgentRunTriggerTypeLabel(triggerType: AgentRunTriggerType | string | null | undefined) {
  return (
    AGENT_RUN_TRIGGER_TYPE_LABELS[triggerType as AgentRunTriggerType] ?? formatUnknownStatus(triggerType, "Manual")
  );
}

/**
 * Storage object names are blob keys like `agent-runs/<uuid>/steps/<uuid>/output.json`.
 * Show only the trailing file name so the UI reads as a document rather than a raw path.
 */
export function getAgentArtifactName(objectName: string | null | undefined) {
  if (!objectName) {
    return "";
  }

  const segments = objectName.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? objectName;
}

/**
 * Shorten an identifier (e.g. a work item UUID) to a compact reference, keeping the full
 * value available via a tooltip so it can still be copied when needed.
 */
export function getShortReference(id: string | null | undefined) {
  if (!id) {
    return "";
  }

  return id.length > SHORT_REFERENCE_LENGTH ? id.slice(0, SHORT_REFERENCE_LENGTH) : id;
}
