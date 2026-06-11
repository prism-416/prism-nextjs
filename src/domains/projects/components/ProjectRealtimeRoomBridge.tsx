"use client";

import { useProjectRealtimeRoom } from "@/domains/projects/hooks/useProjectRealtimeRoom";

type ProjectRealtimeRoomBridgeProps = {
  projectId: string;
  projectSlug: string;
  workspaceId: string;
  workspaceSlug?: string;
};

export function ProjectRealtimeRoomBridge({
  projectId,
  projectSlug,
  workspaceId,
  workspaceSlug,
}: ProjectRealtimeRoomBridgeProps) {
  useProjectRealtimeRoom({
    projectId,
    projectSlug,
    workspaceId,
    workspaceSlug,
  });

  return null;
}
