import type { AvatarStackUser } from "@/atomics/atoms/Avatar";
import type { ProjectParticipant } from "@/domains/projects/types";

/**
 * Resolve a work item's `assigneeUsernames` against the project member list into
 * avatar-stack users. Color seeds use the member's userId so the same person is
 * the same color everywhere; unknown usernames (e.g. removed members) fall back
 * to the username itself for both id and name.
 */
export function resolveAssigneeAvatarUsers(
  assigneeUsernames: string[],
  members: ProjectParticipant[],
): AvatarStackUser[] {
  const memberByUsername = new Map(members.map(member => [member.username.toLowerCase(), member]));

  return assigneeUsernames.map(username => {
    const member = memberByUsername.get(username.toLowerCase());
    return member ? { id: member.userId, name: member.fullName } : { id: username, name: username };
  });
}
