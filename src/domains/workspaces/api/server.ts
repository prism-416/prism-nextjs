import "server-only";

import { cache } from "react";

import { getWorkspaceById, getWorkspaces } from "@/domains/workspaces/api";

export const getWorkspaceByIdCached = cache(getWorkspaceById);
export const getWorkspacesCached = cache(getWorkspaces);

export const getWorkspaceBySlugCached = cache(async (workspaceSlug: string) => {
  const workspaces = await getWorkspacesCached();

  return workspaces.find(workspace => workspace.slug === workspaceSlug);
});
