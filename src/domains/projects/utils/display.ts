import { PROJECT_CARD_GRADIENTS } from "@/domains/projects/constants/display";
import type { ProjectSummary } from "@/domains/projects/types";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function hashIndex(value: string, length: number) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash % length;
}

export function getProjectGradient(project: Pick<ProjectSummary, "name" | "slug">) {
  return PROJECT_CARD_GRADIENTS[hashIndex(project.slug || project.name, PROJECT_CARD_GRADIENTS.length)];
}

export function getProjectInitials(name: string) {
  const segments = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (segments.length === 0) return "P";
  if (segments.length === 1) return segments[0].slice(0, 2).toUpperCase();

  return (segments[0][0] + segments[1][0]).toUpperCase();
}

export function formatProjectRelativeDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return `${MONTH_LABELS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function filterProjects(projects: ProjectSummary[], query: string) {
  const keyword = query.trim().toLowerCase();

  if (!keyword) return projects;

  return projects.filter(project => {
    const searchable = [project.name, project.slug, project.description ?? ""].join(" ").toLowerCase();

    return searchable.includes(keyword);
  });
}
