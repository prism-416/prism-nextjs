import type { ProjectWorkItemSearchParams } from "@/domains/projects/types";

export const PROJECT_DASHBOARD_WORK_ITEM_FILTERS = {
  topLevel: true,
  limit: 100,
} satisfies ProjectWorkItemSearchParams;

/** Days a trashed work item is retained before it is permanently purged. */
export const WORK_ITEM_TRASH_RETENTION_DAYS = 30;
