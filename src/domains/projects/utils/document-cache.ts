import type { QueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/query";

export function syncProjectDocumentsChanged(queryClient: QueryClient, projectId: string): void {
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.project.documents(projectId),
  });
}
