"use client";

import { TemplateStatus } from "../model/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";
import { getTemplateStatus } from "../api";

export function useTemplateStatusQuery(initialData?: TemplateStatus) {
  return useApiQuery<TemplateStatus>({
    queryKey: QUERY_KEYS.templateStatus.detail(),
    queryFn: getTemplateStatus,
    initialData,
    staleTime: 30 * 1000,
  });
}
