import type { CurrentUser } from "@/shared/types/auth";

export function getCurrentUserDisplayName(user: CurrentUser) {
  return user.fullName || user.username || user.email || "User";
}

export function getCurrentUserInitial(user: CurrentUser) {
  const displayName = getCurrentUserDisplayName(user).trim();

  return (displayName.at(0) || "U").toUpperCase();
}
