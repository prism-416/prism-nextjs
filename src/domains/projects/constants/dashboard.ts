import type { ProjectWorkItemSearchParams } from "@/domains/projects/types";

export const PROJECT_DASHBOARD_WORK_ITEM_FILTERS = {
  topLevel: true,
  limit: 100,
} satisfies ProjectWorkItemSearchParams;
