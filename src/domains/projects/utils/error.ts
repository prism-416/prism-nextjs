type ProjectMutationError = {
  message?: unknown;
  status?: unknown;
  data?: { message?: unknown } | null;
  response?: {
    status?: unknown;
    data?: { message?: unknown } | null;
  };
};

export function getProjectMutationErrorMessage(error: unknown, fallback: string) {
  const candidate = error as ProjectMutationError | null;
  const message = candidate?.response?.data?.message ?? candidate?.data?.message ?? candidate?.message;

  return typeof message === "string" && message.trim().length > 0 ? message : fallback;
}

export function getDeleteProjectErrorMessage(error: unknown) {
  const candidate = error as ProjectMutationError | null;
  const status = candidate?.response?.status ?? candidate?.status;

  if (status === 403) {
    return "You don't have permission to delete this project.";
  }

  return getProjectMutationErrorMessage(error, "Failed to delete project.");
}
