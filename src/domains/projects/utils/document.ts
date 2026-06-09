import type {
  ProjectDocument,
  ProjectDocumentSearchParams,
  ProjectDocumentSearchResult,
  ProjectDocumentSourceGroup,
} from "../types";

export const DEFAULT_PROJECT_DOCUMENT_LIMIT = 50;

export function getDefinedProjectDocumentSearchParams(
  params?: ProjectDocumentSearchParams,
): ProjectDocumentSearchParams {
  const defined: ProjectDocumentSearchParams = {};

  if (params?.query) {
    defined.query = params.query;
  }

  if (params?.workItemId) {
    defined.workItemId = params.workItemId;
  }

  if (params?.source) {
    defined.source = params.source;
  }

  defined.limit = params?.limit ?? DEFAULT_PROJECT_DOCUMENT_LIMIT;
  defined.offset = params?.offset ?? 0;

  return defined;
}

export type ProjectDocumentGroupKind = "direct" | "work_item";

export type ProjectDocumentGroup = {
  kind: ProjectDocumentGroupKind;
  workItemId: string | null;
  workItemIdSnapshot: string | null;
  title: string;
  count: number;
  documents: ProjectDocument[];
};

const DIRECT_UPLOAD_GROUP_TITLE = "Direct uploads";
export function getProjectDocumentGroupKind(document: ProjectDocument): ProjectDocumentGroupKind | null {
  if (document.sourceKind === "direct") {
    return "direct";
  }

  if (!document.sourceWorkItemId || !document.sourceWorkItemTitle) {
    return null;
  }

  return "work_item";
}

/**
 * Groups documents into a "Direct uploads" section (uploaded straight to the
 * project) followed by one section per source work item, preserving the
 * incoming (recency) order of documents within each group.
 */
export function groupProjectDocumentsBySource(
  documents: ProjectDocument[],
  summaries: ProjectDocumentSourceGroup[] = [],
): ProjectDocumentGroup[] {
  const direct: ProjectDocument[] = [];
  const byWorkItem = new Map<string, ProjectDocumentGroup>();
  const summaryByKey = new Map(
    summaries.map(summary => [
      `${summary.kind}:${summary.workItemIdSnapshot ?? summary.workItemId ?? summary.title}`,
      summary,
    ]),
  );

  for (const document of documents) {
    const kind = getProjectDocumentGroupKind(document);

    if (kind === "direct") {
      direct.push(document);
      continue;
    }

    if (!kind) {
      continue;
    }

    const workItemId = document.sourceWorkItemId;
    const workItemTitle = document.sourceWorkItemTitle;

    if (!workItemId || !workItemTitle) {
      continue;
    }

    const existing = byWorkItem.get(workItemId);
    if (existing) {
      existing.documents.push(document);
    } else {
      byWorkItem.set(workItemId, {
        kind: "work_item",
        workItemId,
        workItemIdSnapshot: document.sourceWorkItemIdSnapshot,
        title: workItemTitle,
        count: 0,
        documents: [document],
      });
    }
  }

  const groups: ProjectDocumentGroup[] = [];

  if (direct.length > 0) {
    const summary = summaryByKey.get(`direct:${DIRECT_UPLOAD_GROUP_TITLE}`);
    groups.push({
      kind: "direct",
      workItemId: null,
      workItemIdSnapshot: null,
      title: DIRECT_UPLOAD_GROUP_TITLE,
      count: summary?.count ?? direct.length,
      documents: direct,
    });
  }

  groups.push(
    ...Array.from(byWorkItem.values()).map(group => {
      const summary = summaryByKey.get(`work_item:${group.workItemIdSnapshot ?? group.workItemId ?? group.title}`);
      return { ...group, count: summary?.count ?? group.documents.length };
    }),
  );

  return groups;
}

export function getEmptyProjectDocumentSearchResult(params?: ProjectDocumentSearchParams): ProjectDocumentSearchResult {
  return {
    items: [],
    total: 0,
    limit: params?.limit ?? DEFAULT_PROJECT_DOCUMENT_LIMIT,
    offset: params?.offset ?? 0,
    groups: [],
  };
}

export function formatDocumentFileSize(sizeBytes: number): string {
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(sizeBytes) / Math.log(1024)), units.length - 1);
  const value = sizeBytes / 1024 ** exponent;
  const formatted = exponent === 0 ? String(value) : value.toFixed(value >= 10 || value % 1 === 0 ? 0 : 1);

  return `${formatted} ${units[exponent]}`;
}

export function getDocumentFormat(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
    return "FILE";
  }

  const extension = fileName.slice(lastDotIndex + 1);

  if (extension.length > 5) {
    return "FILE";
  }

  return extension.toUpperCase();
}

export function triggerBlobDownload(blob: Blob, fileName: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}
