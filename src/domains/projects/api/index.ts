import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

import type { Project } from "../types";

export async function getProjects(slug: string) {
  const response = await commonAxios<null, ApiResponse<Project[]>>({
    url: `/workspaces/${encodeURIComponent(slug)}/projects`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}
