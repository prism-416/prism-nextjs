import type {
  InvitationRole,
  InviteMember,
  WorkspaceInvitationRoleOption,
  WorkspaceMemberCandidate,
  WorkspaceMemberCandidateSearchReason,
} from "@/domains/workspaces/types";

export function createExternalCandidate(email: string): WorkspaceMemberCandidate {
  return {
    kind: "external",
    userId: null,
    email,
    fullName: null,
    username: null,
  };
}

export function getInviteDisplayName(candidate: Pick<WorkspaceMemberCandidate, "email" | "fullName" | "username">) {
  if (candidate.username) {
    return candidate.username;
  }

  return candidate.fullName || candidate.email;
}

export function getRoleOptionLabel(roleOptions: WorkspaceInvitationRoleOption[], role: InvitationRole) {
  return roleOptions.find(option => option.value === role)?.label ?? role;
}

export function getWorkspaceMemberSearchFeedback(reason: WorkspaceMemberCandidateSearchReason, keyword?: string) {
  switch (reason) {
    case "self":
      return "You can't add yourself.";
    case "already_member":
      return "This member is already in the workspace.";
    case "no_results":
      return keyword ? `No members found for "${keyword}".` : "No members found.";
    case "success":
    default:
      return null;
  }
}

export function isExistingInvite(invite: InviteMember): invite is InviteMember & { kind: "existing"; userId: string } {
  return invite.kind === "existing" && typeof invite.userId === "string";
}
