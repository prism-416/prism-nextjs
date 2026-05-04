type WorkspaceMutationError = {
  message?: unknown;
  status?: unknown;
  data?: { message?: unknown } | null;
  response?: {
    status?: unknown;
    data?: { message?: unknown } | null;
  };
};

export function getWorkspaceMutationErrorMessage(error: unknown, fallback: string) {
  const candidate = error as WorkspaceMutationError | null;
  const message = candidate?.response?.data?.message ?? candidate?.data?.message ?? candidate?.message;

  return typeof message === "string" && message.trim().length > 0 ? message : fallback;
}

export function getDeleteWorkspaceErrorMessage(error: unknown) {
  const candidate = error as WorkspaceMutationError | null;
  const status = candidate?.response?.status ?? candidate?.status;

  if (status === 403) {
    return "Only the workspace owner can delete this workspace.";
  }

  return getWorkspaceMutationErrorMessage(error, "Failed to delete workspace.");
}
