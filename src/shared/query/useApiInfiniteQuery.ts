import { useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData } from "@tanstack/react-query";

/**
 * Custom hook wrapper for useInfiniteQuery
 *
 * Rules:
 * - Use this instead of useInfiniteQuery directly
 * - Query keys must come from QUERY_KEYS factory
 * - initialData should be undefined (not null) if missing
 */
export function useApiInfiniteQuery<TQueryFnData = unknown, TError = Error, TData = InfiniteData<TQueryFnData>>(
  options: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, TData>, "queryKey"> & {
    queryKey: readonly unknown[];
  },
) {
  return useInfiniteQuery<TQueryFnData, TError, TData>({
    ...options,
    initialData: options.initialData ?? undefined,
  });
}
