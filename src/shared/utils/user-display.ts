import type { CurrentUser } from "@/shared/types/auth";

export function getCurrentUserDisplayName(user: CurrentUser) {
  return user.fullName || user.username || user.email || "User";
}
