"use client";

import { getProjectBySlug } from "@/domains/projects/api";
import type { Project } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useProject(slug: string, initialData?: Project) {
  return useApiQuery<Project | undefined>({
    queryKey: QUERY_KEYS.project.detailBySlug(slug),
    queryFn: () => getProjectBySlug(slug),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
