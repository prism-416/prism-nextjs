"use client";

import { useWorkspaceRealtimeRoom } from "@/domains/workspaces/hooks/useWorkspaceRealtimeRoom";

type WorkspaceRealtimeRoomBridgeProps = {
  workspaceId: string;
  workspaceSlug?: string;
};

export function WorkspaceRealtimeRoomBridge({ workspaceId, workspaceSlug }: WorkspaceRealtimeRoomBridgeProps) {
  useWorkspaceRealtimeRoom({ workspaceId, workspaceSlug });

  return null;
}
