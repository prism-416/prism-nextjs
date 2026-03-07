"use client";

import { TemplateStatus } from "@/domains/template-status/model/types";
import { SITE_URL } from "@/shared/constants/env";
import { commonAxios } from "@/shared/http/common-axios";

export const getTemplateStatus = async (): Promise<TemplateStatus> => {
  const response = await commonAxios<undefined, TemplateStatus>({
    url: "/api/example/template-status",
    method: "GET",
    version: null,
    config: {
      baseURL: SITE_URL,
      cache: "no-store",
    },
  });

  if (!response) {
    throw new Error("Failed to fetch template status.");
  }

  return response;
};
