import { useApiQuery } from "@/shared/query/useApiQuery";
import { QUERY_KEYS } from "@/shared/query";
import { getProjects } from "../api";
import { Project } from "../types";

export const useProjects = (slug: string, initialData?: Project[] | null) => {
  return useApiQuery<Project[] | null>({
    queryKey: QUERY_KEYS.project.list(slug),
    queryFn: () => getProjects(slug),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
};
