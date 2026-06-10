import type { Notification, NotificationSearchResult } from "@/domains/workspaces/types";

export function markNotificationReadInCache(previous: NotificationSearchResult | undefined, notificationId: string) {
  if (!previous) {
    return previous;
  }

  let changedUnread = 0;
  const notifications = previous.notifications.map(notification => {
    if (notification.notificationId !== notificationId || notification.readAt) {
      return notification;
    }

    changedUnread += 1;
    return {
      ...notification,
      readAt: new Date().toISOString(),
    };
  });

  return {
    ...previous,
    notifications,
    unreadCount: Math.max(previous.unreadCount - changedUnread, 0),
  };
}

export function markAllNotificationsReadInCache(previous: NotificationSearchResult | undefined) {
  if (!previous) {
    return previous;
  }

  const readAt = new Date().toISOString();

  return {
    ...previous,
    notifications: previous.notifications.map(notification =>
      notification.readAt ? notification : { ...notification, readAt },
    ),
    unreadCount: 0,
  };
}

export function removeNotificationFromCache(previous: NotificationSearchResult | undefined, notificationId: string) {
  if (!previous) {
    return previous;
  }

  const target = previous.notifications.find(notification => notification.notificationId === notificationId);
  if (!target) {
    return previous;
  }

  const wasUnread = !target.readAt;

  return {
    ...previous,
    notifications: previous.notifications.filter(notification => notification.notificationId !== notificationId),
    total: Math.max(previous.total - 1, 0),
    unreadCount: wasUnread ? Math.max(previous.unreadCount - 1, 0) : previous.unreadCount,
  };
}

export function clearNotificationsInCache(previous: NotificationSearchResult | undefined) {
  if (!previous) {
    return previous;
  }

  return {
    ...previous,
    notifications: [],
    total: 0,
    unreadCount: 0,
    offset: 0,
  };
}

export function prependNotificationToCache(previous: NotificationSearchResult | undefined, notification: Notification) {
  if (!previous || previous.notifications.some(item => item.notificationId === notification.notificationId)) {
    return previous;
  }

  return {
    ...previous,
    notifications: [notification, ...previous.notifications].slice(0, previous.limit),
    total: previous.total + 1,
    unreadCount: notification.readAt ? previous.unreadCount : previous.unreadCount + 1,
  };
}
