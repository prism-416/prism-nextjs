import type { ProjectParticipant, ProjectWorkItemComment } from "@/domains/projects/types";
import type { CurrentUser } from "@/shared/types/auth";
import { getCurrentUserDisplayName } from "@/shared/utils/user-display";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function padDatePart(value: number) {
  return value.toString().padStart(2, "0");
}

export function formatCommentDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  const hours = padDatePart(date.getHours());
  const minutes = padDatePart(date.getMinutes());
  return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${minutes}`;
}

export function formatCommentTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
}

export function isSameCommentDay(a: string, b: string) {
  const dateA = new Date(a);
  const dateB = new Date(b);
  if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) return false;
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function getCommentAuthorDisplayName(
  comment: ProjectWorkItemComment,
  memberByUserId: Map<string, ProjectParticipant>,
  currentUser?: CurrentUser,
) {
  if (currentUser?.userId === comment.authorUserId) {
    return getCurrentUserDisplayName(currentUser);
  }
  const member = memberByUserId.get(comment.authorUserId);
  return member?.fullName || member?.username || `Member ${comment.authorUserId.slice(0, 8)}`;
}
