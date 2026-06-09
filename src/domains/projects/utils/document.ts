import type { ProjectDocumentSearchParams, ProjectDocumentSearchResult } from "../types";

export const DEFAULT_PROJECT_DOCUMENT_LIMIT = 50;

export function getDefinedProjectDocumentSearchParams(
  params?: ProjectDocumentSearchParams,
): ProjectDocumentSearchParams {
  const defined: ProjectDocumentSearchParams = {};

  if (params?.query) {
    defined.query = params.query;
  }

  defined.limit = params?.limit ?? DEFAULT_PROJECT_DOCUMENT_LIMIT;
  defined.offset = params?.offset ?? 0;

  return defined;
}

export function getEmptyProjectDocumentSearchResult(params?: ProjectDocumentSearchParams): ProjectDocumentSearchResult {
  return {
    items: [],
    total: 0,
    limit: params?.limit ?? DEFAULT_PROJECT_DOCUMENT_LIMIT,
    offset: params?.offset ?? 0,
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
