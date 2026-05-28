"use client";

import { formatDistanceToNow } from "date-fns";
import { Loader2, X } from "lucide-react";

import type { Notification } from "@/domains/workspaces/types";
import { getNotificationBody } from "@/domains/workspaces/utils/notification-display";
import { cn } from "@/shared/utils/cn";

type AppHeaderNotificationItemProps = {
  notification: Notification;
  isOpening: boolean;
  isClearing: boolean;
  onOpen: (notification: Notification) => void;
  onClear: (notificationId: string) => void;
};

export function AppHeaderNotificationItem({
  notification,
  isOpening,
  isClearing,
  onOpen,
  onClear,
}: AppHeaderNotificationItemProps) {
  const isUnread = !notification.readAt;

  return (
    <div className={cn("group relative flex transition-colors hover:bg-prism-navy/5", isUnread && "bg-prism-navy/4")}>
      <button
        type="button"
        className="flex w-full gap-3 px-4 py-3 pr-10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        onClick={() => onOpen(notification)}
      >
        <span className={cn("mt-1 size-2 shrink-0 rounded-full", isUnread ? "bg-prism-navy" : "bg-transparent")} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-prism-heading">{notification.title}</span>
            {isOpening && <Loader2 className="size-3.5 shrink-0 animate-spin text-prism-muted" />}
          </span>
          <span className="mt-0.5 line-clamp-2 text-xs leading-5 text-prism-muted">
            {getNotificationBody(notification)}
          </span>
          <span className="mt-1 block text-[11px] text-prism-muted/70">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label="Clear notification"
        className="absolute right-2 top-2 grid size-6 place-items-center rounded-md text-prism-muted opacity-0 transition-opacity hover:bg-prism-navy/10 hover:text-prism-body focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
        disabled={isClearing}
        onClick={event => {
          event.stopPropagation();
          onClear(notification.notificationId);
        }}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
