import { differenceInCalendarDays, isValid } from "date-fns";

import type {
  Sprint,
  SprintStatus,
  SprintWorkItemPriority,
  SprintWorkItemSearchParams,
  SprintWorkItemSearchResult,
  SprintWorkItemStatus,
} from "@/domains/sprints/types";

export const SPRINT_STATUSES: SprintStatus[] = ["planned", "active", "closed", "cancelled"];

const SPRINT_STATUS_LABELS: Record<SprintStatus, string> = {
  planned: "Planned",
  active: "Active",
  closed: "Closed",
  cancelled: "Cancelled",
};

const WORK_ITEM_STATUS_LABELS: Record<SprintWorkItemStatus, string> = {
  todo: "Todo",
  in_progress: "In progress",
  in_review: "In review",
  done: "Done",
  archived: "Archived",
};

const WORK_ITEM_PRIORITY_LABELS: Record<SprintWorkItemPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseDate(value: string) {
  const date = new Date(value);

  return isValid(date) ? date : undefined;
}

function padDatePart(value: number) {
  return value.toString().padStart(2, "0");
}

function formatDateInputValue(date: Date) {
  return `${date.getUTCFullYear()}-${padDatePart(date.getUTCMonth() + 1)}-${padDatePart(date.getUTCDate())}`;
}

export function getDefaultSprintDates(referenceDate = new Date()) {
  const endDate = new Date(referenceDate);
  endDate.setUTCDate(endDate.getUTCDate() + 13);

  return {
    defaultStartsAt: formatDateInputValue(referenceDate),
    defaultEndsAt: formatDateInputValue(endDate),
  };
}

export function getSprintStatusLabel(status: SprintStatus) {
  return SPRINT_STATUS_LABELS[status];
}

export function getSprintWorkItemStatusLabel(status: SprintWorkItemStatus) {
  return WORK_ITEM_STATUS_LABELS[status];
}

export function getSprintWorkItemPriorityLabel(priority: SprintWorkItemPriority) {
  return WORK_ITEM_PRIORITY_LABELS[priority];
}

export function formatSprintDate(value: string) {
  const date = parseDate(value);

  if (!date) {
    return "Invalid date";
  }

  return `${MONTH_LABELS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function formatSprintRange(sprint: Pick<Sprint, "startsAt" | "endsAt">) {
  return `${formatSprintDate(sprint.startsAt)} - ${formatSprintDate(sprint.endsAt)}`;
}

export function getSprintDurationText(sprint: Pick<Sprint, "startsAt" | "endsAt">) {
  const startsAt = parseDate(sprint.startsAt);
  const endsAt = parseDate(sprint.endsAt);

  if (!startsAt || !endsAt) {
    return "Invalid duration";
  }

  const days = Math.max(differenceInCalendarDays(endsAt, startsAt) + 1, 1);

  return days === 1 ? "1 day" : `${days} days`;
}

export function getDefinedSprintWorkItemSearchParams(params?: SprintWorkItemSearchParams) {
  if (!params) {
    return undefined;
  }

  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== "");

  return entries.length ? (Object.fromEntries(entries) as SprintWorkItemSearchParams) : undefined;
}

export function getEmptySprintWorkItemSearchResult(params?: SprintWorkItemSearchParams): SprintWorkItemSearchResult {
  return {
    items: [],
    total: 0,
    limit: params?.limit ?? 50,
    offset: params?.offset ?? 0,
  };
}
