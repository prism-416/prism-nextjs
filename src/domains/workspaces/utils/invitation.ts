import type { InvitationRole } from "@/domains/workspaces/types";

export function formatInvitationRole(role: InvitationRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
