import "server-only";

import { cache } from "react";

import { getProjectBySlug, getProjectsByWorkspaceId, getProjectsByWorkspaceSlug } from "@/domains/projects/api";

export const getProjectBySlugCached = cache(getProjectBySlug);
export const getProjectsByWorkspaceIdCached = cache(getProjectsByWorkspaceId);
export const getProjectsByWorkspaceSlugCached = cache(getProjectsByWorkspaceSlug);
