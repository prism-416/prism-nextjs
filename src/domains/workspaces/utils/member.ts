import type { WorkspaceMember } from "@/domains/workspaces/types";

export function getWorkspaceMemberDisplayName(member: Pick<WorkspaceMember, "fullName" | "username">) {
  return member.fullName?.trim() || member.username?.trim() || "Unknown member";
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

export function getWorkspaceMemberRoleBadgeClassName(
  member: Pick<WorkspaceMember, "role" | "userId">,
  ownerId: string,
) {
  if (member.userId === ownerId) {
    return "border-prism-spectrum-lavender/45 bg-prism-spectrum-lavender/15 text-prism-navy";
  }

  if (member.role === "admin") {
    return "border-prism-danger/25 bg-prism-danger-soft/25 text-prism-navy";
  }

  if (member.role === "member") {
    return "border-prism-teal-500/30 bg-prism-teal-500/10 text-prism-navy";
  }

  return "border-border-strong/70 bg-surface-strong text-prism-body";
}
