import type { WorkspaceMember } from "@/domains/workspaces/types";

export function getWorkspaceMemberDisplayName(member: Pick<WorkspaceMember, "fullName" | "username">) {
  return member.fullName || member.username;
}

export function getWorkspaceMemberInitial(member: Pick<WorkspaceMember, "fullName" | "username">) {
  const displayName = getWorkspaceMemberDisplayName(member);

  return displayName.trim().charAt(0).toUpperCase() || "U";
}

export function getWorkspaceMemberSortRank(member: Pick<WorkspaceMember, "role" | "userId">, ownerId: string) {
  if (member.userId === ownerId) {
    return 0;
  }

  switch (member.role) {
    case "admin":
      return 1;
    case "member":
      return 2;
    case "viewer":
      return 3;
    default:
      return 4;
  }
}
