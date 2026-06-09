"use client";

import type { InfiniteData } from "@tanstack/react-query";

import { getProjectDocuments } from "@/domains/projects/api";
import type { ProjectDocumentSearchParams, ProjectDocumentSearchResult } from "@/domains/projects/types";
import { getDefinedProjectDocumentSearchParams } from "@/domains/projects/utils/document";
import { QUERY_KEYS, useApiInfiniteQuery } from "@/shared/query";

const PROJECT_DOCUMENT_PAGE_SIZE = 50;

export function useInfiniteProjectDocuments(
  projectId: string,
  filters?: ProjectDocumentSearchParams,
  initialData?: ProjectDocumentSearchResult,
) {
  const searchParams = getDefinedProjectDocumentSearchParams({
    ...filters,
    limit: PROJECT_DOCUMENT_PAGE_SIZE,
    offset: 0,
  });

  return useApiInfiniteQuery<
    ProjectDocumentSearchResult,
    Error,
    InfiniteData<ProjectDocumentSearchResult>,
    readonly unknown[],
    number
  >({
    queryKey: QUERY_KEYS.project.documentList(projectId, {
      ...searchParams,
      infinite: true,
    }),
    queryFn: ({ pageParam }) =>
      getProjectDocuments(projectId, {
        ...searchParams,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const nextOffset = lastPage.offset + lastPage.items.length;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [0],
        }
      : undefined,
    staleTime: 5 * 60 * 1000,
  });
}
