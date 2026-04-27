"use client";

import { useApiQuery } from "@/shared/query/useApiQuery";
import { QUERY_KEYS } from "@/shared/query";
import { getProjects } from "../api";
import { ProjectSummary } from "../types";

export const useProjects = (slug: string, initialData?: ProjectSummary[]) => {
  return useApiQuery<ProjectSummary[]>({
    queryKey: QUERY_KEYS.project.listByWorkspaceSlug(slug),
    queryFn: () => getProjects(slug),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
};
