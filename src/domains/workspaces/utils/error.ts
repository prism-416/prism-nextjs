type WorkspaceMutationError = {
  message?: unknown;
  data?: { message?: unknown } | null;
  response?: {
    data?: { message?: unknown } | null;
  };
};

export function getWorkspaceMutationErrorMessage(error: unknown, fallback: string) {
  const candidate = error as WorkspaceMutationError | null;
  const message = candidate?.response?.data?.message ?? candidate?.data?.message ?? candidate?.message;

  return typeof message === "string" && message.trim().length > 0 ? message : fallback;
}
