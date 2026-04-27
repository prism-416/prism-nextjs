import type { InvitationRole, WorkspaceInvitationRoleOption } from "@/domains/workspaces/types";

export const DEFAULT_WORKSPACE_INVITATION_ROLE: InvitationRole = "member";

export const WORKSPACE_INVITATION_ROLE_OPTIONS: WorkspaceInvitationRoleOption[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Administrators can manage members, workspace settings, and workspace content.",
  },
  {
    value: "member",
    label: "Member",
    description: "Members can collaborate on workspace content without administrative permissions.",
  },
  {
    value: "viewer",
    label: "Viewer",
    description: "Viewers can only view workspace content.",
  },
];
