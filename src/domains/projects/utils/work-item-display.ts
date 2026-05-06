import { differenceInCalendarDays, format, formatDistanceToNow, isValid } from "date-fns";

import type {
  ProjectSprint,
  ProjectSprintStatus,
  ProjectWorkItemPriority,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";

export const PROJECT_SPRINT_STATUSES: ProjectSprintStatus[] = ["backlog", "in_progress", "done"];

export const PROJECT_WORK_ITEM_STATUSES: ProjectWorkItemStatus[] = ["todo", "in_progress", "in_review", "done"];

export const PROJECT_WORK_ITEM_PRIORITIES: ProjectWorkItemPriority[] = ["low", "medium", "high", "urgent"];

const SPRINT_STATUS_LABELS: Record<ProjectSprintStatus, string> = {
  backlog: "Backlog",
  in_progress: "In progress",
  done: "Done",
};

const WORK_ITEM_STATUS_LABELS: Record<ProjectWorkItemStatus, string> = {
  todo: "Todo",
  in_progress: "In progress",
  in_review: "In review",
  done: "Done",
};

const WORK_ITEM_PRIORITY_LABELS: Record<ProjectWorkItemPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

function parseDate(value: string) {
  const date = new Date(value);

  return isValid(date) ? date : undefined;
}

export function getProjectSprintStatusLabel(status: ProjectSprintStatus) {
  return SPRINT_STATUS_LABELS[status];
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

  return format(date, "MMM d, yyyy");
}

export function formatProjectRelativeDateTime(value: string) {
  const date = parseDate(value);

  if (!date) {
    return "Invalid date";
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatProjectSprintRange(sprint: Pick<ProjectSprint, "startsAt" | "endsAt">) {
  return `${formatProjectDate(sprint.startsAt)} - ${formatProjectDate(sprint.endsAt)}`;
}

export function getProjectSprintDurationText(sprint: Pick<ProjectSprint, "startsAt" | "endsAt">) {
  const startsAt = parseDate(sprint.startsAt);
  const endsAt = parseDate(sprint.endsAt);

  if (!startsAt || !endsAt) {
    return "Invalid duration";
  }

  const days = Math.max(differenceInCalendarDays(endsAt, startsAt) + 1, 1);

  return days === 1 ? "1 day" : `${days} days`;
}
