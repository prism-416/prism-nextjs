import type { ProjectAssignableMember } from "@/domains/projects/types";

export function getProjectMemberDisplayName(member: Pick<ProjectAssignableMember, "fullName" | "username">) {
  return member.fullName || member.username;
}

export function getProjectMemberSearchText(member: Pick<ProjectAssignableMember, "fullName" | "username">) {
  return `${member.fullName} ${member.username}`.toLowerCase();
}
