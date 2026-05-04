"use client";

import { changePassword } from "@/domains/profile/api";
import type { ChangePasswordPayload, ChangePasswordResponse } from "@/domains/profile/types";
import { useApiMutation } from "@/shared/query";

export function useChangePassword() {
  return useApiMutation<ChangePasswordResponse, unknown, ChangePasswordPayload>({
    mutationFn: async payload => {
      const result = await changePassword(payload);

      if (!result?.changed) {
        throw new Error("Failed to change password.");
      }

      return result;
    },
  });
}
