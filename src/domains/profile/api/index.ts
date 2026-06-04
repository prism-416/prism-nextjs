import { commonAxios } from "@/shared/http/common-axios";
import { getCurrentUser } from "@/shared/api/auth";
import type { ApiResponse } from "@/shared/types/api";
import type { CurrentUser } from "@/shared/types/auth";

import type { ChangePasswordPayload, ChangePasswordResponse, UpdateProfilePayload } from "@/domains/profile/types";

function isCurrentUser(value: unknown): value is CurrentUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Partial<CurrentUser>;

  return (
    typeof user.userId === "string" &&
    typeof user.email === "string" &&
    typeof user.fullName === "string" &&
    typeof user.username === "string" &&
    typeof user.isOAuthUser === "boolean"
  );
}

export async function updateProfile(body: UpdateProfilePayload): Promise<CurrentUser> {
  await commonAxios<UpdateProfilePayload, unknown>({
    url: "/auth/me",
    method: "PATCH",
    data: body,
    version: null,
  });

  const user = await getCurrentUser();

  if (!isCurrentUser(user)) {
    throw new Error("Current user response is incomplete.");
  }

  return user;
}

export async function changePassword(body: ChangePasswordPayload) {
  const response = await commonAxios<ChangePasswordPayload, ApiResponse<ChangePasswordResponse>>({
    url: "/auth/password/change",
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}
