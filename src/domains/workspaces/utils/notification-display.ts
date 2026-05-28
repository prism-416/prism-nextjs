import type { Notification } from "@/domains/workspaces/types";

export function getNotificationBody(notification: Notification) {
  const commentBody = notification.metadata.commentBody;

  if (typeof commentBody === "string" && commentBody.trim()) {
    return commentBody;
  }

  return notification.body;
}
