import { formatDistanceToNow } from "date-fns";

import { WORKSPACE_CARD_GRADIENTS } from "@/domains/workspace/constants/display";
import type { Workspace } from "@/domains/workspace/types";

function hashIndex(value: string, length: number) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash % length;
}

export function getWorkspaceGradient(workspace: Pick<Workspace, "name" | "slug">) {
  return WORKSPACE_CARD_GRADIENTS[hashIndex(workspace.slug || workspace.name, WORKSPACE_CARD_GRADIENTS.length)];
}

export function getWorkspaceInitials(name: string) {
  const segments = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (segments.length === 0) return "W";
  if (segments.length === 1) return segments[0].slice(0, 2).toUpperCase();

  return (segments[0][0] + segments[1][0]).toUpperCase();
}

export function formatWorkspaceCount(value: number | undefined, singular: string, plural: string) {
  const safe = value ?? 0;

  return `${safe.toLocaleString()} ${safe === 1 ? singular : plural}`;
}

export function formatWorkspaceRelativeDate(value: string) {
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return new Date(value).toLocaleDateString();
  }
}

export function filterWorkspaces(workspaces: Workspace[], query: string) {
  const keyword = query.trim().toLowerCase();

  if (!keyword) return workspaces;

  return workspaces.filter(workspace => {
    const searchable = [workspace.name, workspace.slug, workspace.description ?? ""].join(" ").toLowerCase();

    return searchable.includes(keyword);
  });
}
