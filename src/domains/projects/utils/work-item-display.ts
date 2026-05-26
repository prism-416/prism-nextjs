import { isValid } from "date-fns";

import type { ProjectWorkItemPriority, ProjectWorkItemStatus } from "@/domains/projects/types";

export const PROJECT_WORK_ITEM_STATUSES: ProjectWorkItemStatus[] = ["todo", "in_progress", "in_review", "done"];

export const PROJECT_WORK_ITEM_PRIORITIES: ProjectWorkItemPriority[] = ["low", "medium", "high", "urgent"];

const WORK_ITEM_STATUS_LABELS: Record<ProjectWorkItemStatus, string> = {
  todo: "Todo",
  in_progress: "In progress",
  in_review: "In review",
  done: "Done",
  archived: "Archived",
};

const WORK_ITEM_PRIORITY_LABELS: Record<ProjectWorkItemPriority, string> = {
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

export function getProjectWorkItemStatusLabel(status: ProjectWorkItemStatus) {
  return WORK_ITEM_STATUS_LABELS[status];
}

export function getProjectWorkItemPriorityLabel(priority: ProjectWorkItemPriority) {
  return WORK_ITEM_PRIORITY_LABELS[priority];
}

export function formatProjectDate(value: string) {
  const date = parseDate(value);

  if (!date) {
    return "Invalid date";
  }

  return `${MONTH_LABELS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function formatProjectDateTime(value: string) {
  const date = parseDate(value);

  if (!date) {
    return "Invalid date";
  }

  const hours = padDatePart(date.getUTCHours());
  const minutes = padDatePart(date.getUTCMinutes());

  return `${formatProjectDate(value)} ${hours}:${minutes} UTC`;
}

export function formatProjectRelativeDateTime(value: string) {
  return formatProjectDateTime(value);
}
