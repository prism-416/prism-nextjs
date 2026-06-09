export type NotificationType = "work_item_comment_mention" | "workspace_invitation";

export type NotificationTargetType = "work_item_comment" | "workspace_invitation";

export interface Notification {
  notificationId: string;
  recipientUserId: string;
  actorUserId: string | null;
  workspaceId: string;
  projectId: string | null;
  notificationType: NotificationType;
  title: string;
  body: string;
  targetType: NotificationTargetType;
  targetId: string;
  metadata: {
    itemId?: string;
    commentId?: string;
    commentBody?: string;
    workspaceId?: string;
    workspaceName?: string;
    role?: string;
    invitationLink?: string;
    expiresAt?: string;
    [key: string]: unknown;
  };
  readAt: string | null;
  createdAt: string;
}

export interface NotificationSearchParams {
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface NotificationSearchResult {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  limit: number;
  offset: number;
}

export interface NotificationProjectTarget {
  projectId: string;
  slug: string;
}
