"use client";

import { useProjectRealtimeRoom } from "@/domains/projects/hooks/useProjectRealtimeRoom";

type ProjectRealtimeRoomBridgeProps = {
  projectId: string;
};

export function ProjectRealtimeRoomBridge({ projectId }: ProjectRealtimeRoomBridgeProps) {
  useProjectRealtimeRoom({ projectId });

  return null;
}
