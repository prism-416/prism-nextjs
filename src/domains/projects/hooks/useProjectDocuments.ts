"use client";

import { getProjectDocuments } from "@/domains/projects/api";
import type { ProjectDocumentSearchParams, ProjectDocumentSearchResult } from "@/domains/projects/types";
import {
  getDefinedProjectDocumentSearchParams,
  getEmptyProjectDocumentSearchResult,
} from "@/domains/projects/utils/document";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";

export function useProjectDocuments(
  projectId?: string,
  filters?: ProjectDocumentSearchParams,
  initialData?: ProjectDocumentSearchResult,
) {
  const searchParams = getDefinedProjectDocumentSearchParams(filters);
  const enabled = Boolean(projectId);

  return useApiQuery<ProjectDocumentSearchResult>({
    queryKey: QUERY_KEYS.project.documentList(projectId ?? MISSING_PROJECT_ID, searchParams),
    queryFn: () =>
      enabled && projectId
        ? getProjectDocuments(projectId, searchParams)
        : Promise.resolve(getEmptyProjectDocumentSearchResult(searchParams)),
    enabled,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
