import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";
import type { AuthMeResponse } from "@/shared/types/auth";

export async function getCurrentUser() {
  const response = await commonAxios<null, ApiResponse<AuthMeResponse>>({
    url: "/auth/me",
    method: "GET",
    version: null,
  });

  return response?.data?.user;
}
