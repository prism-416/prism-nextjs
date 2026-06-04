"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateProfile } from "@/domains/profile/api";
import type { UpdateProfilePayload } from "@/domains/profile/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";
import type { CurrentUser } from "@/shared/types/auth";

type UpdateProfileVariables = UpdateProfilePayload & {
  currentUser: CurrentUser;
};

type UpdateProfileContext = {
  rollbackUser: CurrentUser;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useApiMutation<CurrentUser, unknown, UpdateProfileVariables, UpdateProfileContext>({
    mutationFn: async ({ fullName }) => {
      return updateProfile({ fullName });
    },
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.auth.me() });

      const previousUser = queryClient.getQueryData<CurrentUser>(QUERY_KEYS.auth.me());
      const rollbackUser = previousUser ?? variables.currentUser;

      queryClient.setQueryData<CurrentUser>(QUERY_KEYS.auth.me(), {
        ...rollbackUser,
        fullName: variables.fullName,
      });

      return { rollbackUser };
    },
    onError: (_error, _variables, context) => {
      if (context?.rollbackUser) {
        queryClient.setQueryData(QUERY_KEYS.auth.me(), context.rollbackUser);
      }
    },
    onSuccess: user => {
      queryClient.setQueryData(QUERY_KEYS.auth.me(), user);
    },
  });
}
