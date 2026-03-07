import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

/**
 * Custom hook wrapper for useQuery
 *
 * Rules:
 * - Use this instead of useQuery directly
 * - Query keys must come from QUERY_KEYS factory
 * - initialData should be undefined (not null) if missing
 */
export function useApiQuery<TData = unknown, TError = Error>(
  options: Omit<UseQueryOptions<TData, TError>, "queryKey"> & {
    queryKey: readonly unknown[];
  },
) {
  return useQuery<TData, TError>({
    ...options,
    initialData: options.initialData ?? undefined,
  });
}
