"use client";

import * as React from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/atomics/atoms/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/atomics/atoms/Popover";
import { getNotificationProjectTarget, getWorkspaceInvitation } from "@/domains/workspaces/api";
import { AppHeaderNotificationItem } from "@/domains/workspaces/components/AppHeaderNotificationItem";
import { useNotificationActions } from "@/domains/workspaces/hooks/useNotificationActions";
import { useNotificationRealtime } from "@/domains/workspaces/hooks/useNotificationRealtime";
import { useNotifications } from "@/domains/workspaces/hooks/useNotifications";
import type { Notification } from "@/domains/workspaces/types";

const NOTIFICATION_LIST_PARAMS = { limit: 20, offset: 0 };

export function AppHeaderNotifications() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openingNotificationId, setOpeningNotificationId] = React.useState<string | null>(null);
  const { data, isPending } = useNotifications(NOTIFICATION_LIST_PARAMS);
  const { readNotification, readAllNotifications, clearNotification, isMarkingAllRead, isClearing } =
    useNotificationActions();
  useNotificationRealtime();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const handleOpenNotification = async (notification: Notification) => {
    setOpeningNotificationId(notification.notificationId);
    try {
      await readNotification(notification.notificationId);

      if (notification.targetType === "workspace_invitation") {
        const invitationLink = notification.metadata.invitationLink;
        const invitationToken = notification.metadata.invitationToken;

        if (typeof invitationToken === "string" && invitationToken) {
          const invitation = await getWorkspaceInvitation({ token: invitationToken }).catch(() => null);

          if (invitation?.status === "accepted") {
            router.push("/workspaces");
            setOpen(false);
            return;
          }
        }

        if (typeof invitationLink === "string" && invitationLink) {
          router.push(invitationLink);
          setOpen(false);
        }

        return;
      }

      if (notification.notificationType === "workspace_member_removed") {
        router.push("/workspaces");
        setOpen(false);
        return;
      }

      const itemId = notification.metadata.itemId;
      if (notification.projectId && typeof itemId === "string" && itemId) {
        const targetProject = await getNotificationProjectTarget(notification.projectId);
        if (targetProject?.slug) {
          router.push(`/projects/${encodeURIComponent(targetProject.slug)}/work-items/${encodeURIComponent(itemId)}`);
          setOpen(false);
        }
      }
    } finally {
      setOpeningNotificationId(null);
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        className="relative"
      >
        <Bell />
      </Button>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className="relative"
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 min-w-4 rounded-full bg-prism-danger px-1 text-[10px] font-semibold leading-4 text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(24rem,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-prism-heading">Notifications</p>
            <p className="text-xs text-prism-muted">{unreadCount} unread</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-8 rounded-lg px-2 text-xs text-prism-muted hover:text-prism-body"
            disabled={unreadCount === 0 || isMarkingAllRead}
            onClick={() => {
              void readAllNotifications();
            }}
          >
            <CheckCheck className="size-3.5" />
            Read all
          </Button>
        </div>

        <div className="max-h-[24rem] overflow-y-auto py-1">
          {isPending && (
            <div className="flex items-center gap-2 px-4 py-6 text-sm text-prism-muted">
              <Loader2 className="size-4 animate-spin" />
              Loading notifications
            </div>
          )}

          {!isPending && notifications.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium text-prism-heading">No notifications</p>
              <p className="mt-1 text-xs text-prism-muted">Mentions and updates will appear here.</p>
            </div>
          )}

          {notifications.map(notification => (
            <AppHeaderNotificationItem
              key={notification.notificationId}
              notification={notification}
              isOpening={openingNotificationId === notification.notificationId}
              isClearing={isClearing}
              onOpen={handleOpenNotification}
              onClear={notificationId => {
                void clearNotification(notificationId);
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
