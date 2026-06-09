import type { Socket } from "socket.io-client";

import type { AGENT_REALTIME_EVENTS } from "@/domains/projects/constants/agent-realtime";
import type { AgentAction, AgentActionEvent, AgentRun, AgentStep } from "@/domains/projects/types";

export type AgentRealtimeErrorPayload = {
  code: string;
  message: string;
};

export type AgentWorkspaceJoinedPayload = {
  workspaceId: string;
};

export type AgentWorkspaceLeftPayload = {
  workspaceId: string;
};

export type AgentStepRealtimePayload = AgentStep & {
  workspaceId: string;
};

export type AgentActionEventRealtimePayload = AgentActionEvent & {
  workspaceId: string;
};

export type AgentRealtimeServerToClientEvents = {
  exception: (payload: AgentRealtimeErrorPayload) => void;
  [AGENT_REALTIME_EVENTS.AGENT_WORKSPACE_JOINED]: (payload: AgentWorkspaceJoinedPayload) => void;
  [AGENT_REALTIME_EVENTS.AGENT_WORKSPACE_LEFT]: (payload: AgentWorkspaceLeftPayload) => void;
  [AGENT_REALTIME_EVENTS.AGENT_RUN_CREATED]: (payload: AgentRun) => void;
  [AGENT_REALTIME_EVENTS.AGENT_RUN_UPDATED]: (payload: AgentRun) => void;
  [AGENT_REALTIME_EVENTS.AGENT_STEP_CREATED]: (payload: AgentStepRealtimePayload) => void;
  [AGENT_REALTIME_EVENTS.AGENT_STEP_UPDATED]: (payload: AgentStepRealtimePayload) => void;
  [AGENT_REALTIME_EVENTS.AGENT_ACTION_CREATED]: (payload: AgentAction) => void;
  [AGENT_REALTIME_EVENTS.AGENT_ACTION_UPDATED]: (payload: AgentAction) => void;
  [AGENT_REALTIME_EVENTS.AGENT_ACTION_EVENT_CREATED]: (payload: AgentActionEventRealtimePayload) => void;
};

export type AgentRealtimeClientToServerEvents = {
  [AGENT_REALTIME_EVENTS.AGENT_WORKSPACE_JOIN]: (payload: { workspaceId: string }) => void;
  [AGENT_REALTIME_EVENTS.AGENT_WORKSPACE_LEAVE]: (payload: { workspaceId: string }) => void;
};

export type AgentRealtimeSocket = Socket<AgentRealtimeServerToClientEvents, AgentRealtimeClientToServerEvents>;
