import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

import type { ChangePasswordPayload, ChangePasswordResponse } from "@/domains/profile/types";

export async function changePassword(body: ChangePasswordPayload) {
  const response = await commonAxios<ChangePasswordPayload, ApiResponse<ChangePasswordResponse>>({
    url: "/auth/password/change",
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}
