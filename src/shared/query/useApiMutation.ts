import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

/**
 * Custom hook wrapper for useMutation
 *
 * Rules:
 * - Use this instead of useMutation directly
 */
export function useApiMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
) {
  return useMutation<TData, TError, TVariables, TContext>(options);
}
