"use client";

import { Check, ChevronDown, FolderKanban } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import { cn } from "@/shared/utils/cn";

export type AgentProjectOption = {
  projectId: string;
  name: string;
};

type AgentProjectSelectorProps = {
  id?: string;
  projects: AgentProjectOption[];
  value: string | null;
  disabled?: boolean;
  onChange: (projectId: string) => void;
};

function getSelectedProjectName(projects: AgentProjectOption[], value: string | null) {
  return projects.find(project => project.projectId === value)?.name;
}

export function AgentProjectSelector({ id, projects, value, disabled = false, onChange }: AgentProjectSelectorProps) {
  const selectedName = getSelectedProjectName(projects, value);
  const hasProjects = projects.length > 0;
  const isDisabled = disabled || !hasProjects;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={isDisabled}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-field px-3",
            "text-sm text-prism-body transition-colors hover:border-border-strong",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <FolderKanban className="size-4 shrink-0 text-prism-muted" />
            <span className="truncate">
              {selectedName ?? (hasProjects ? "Select a project" : "No project available")}
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-prism-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)] min-w-48 overflow-y-auto py-1"
      >
        {projects.map(project => (
          <DropdownMenuItem
            key={project.projectId}
            className="justify-between gap-2 px-2 py-1"
            onSelect={() => onChange(project.projectId)}
          >
            <span className="inline-flex min-w-0 items-center gap-2">
              <FolderKanban className="size-4 shrink-0 text-prism-muted" />
              <span className="truncate">{project.name}</span>
            </span>
            {project.projectId === value ? <Check className="size-3.5 shrink-0 text-prism-muted" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
