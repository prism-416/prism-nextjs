"use client";

import { Box, Building2, Check, ChevronsUpDown, FolderKanban } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import type { WorkspacePathSegment } from "@/domains/workspaces/types/path";
import { cn } from "@/shared/utils/cn";

type WorkspacePathSegmentButtonProps = {
  segment: WorkspacePathSegment;
  isCurrent?: boolean;
};

const iconByKind = {
  workspace: Building2,
  project: Box,
  section: FolderKanban,
} satisfies Record<NonNullable<WorkspacePathSegment["kind"]>, typeof Building2>;

function getStableSegmentId(segment: WorkspacePathSegment) {
  const source = `${segment.kind ?? "section"}-${segment.href ?? segment.name}`;
  const normalized = source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `workspace-path-${normalized || "segment"}`;
}

export function WorkspacePathSegmentButton({ segment, isCurrent = false }: WorkspacePathSegmentButtonProps) {
  const Icon = iconByKind[segment.kind ?? "section"];
  const className = cn(
    "group flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    segment.href || segment.switcher ? "hover:bg-prism-cream/60" : "cursor-default",
    isCurrent && "bg-prism-cream/50",
  );
  const content = (
    <>
      <Icon className="size-4 shrink-0 text-prism-muted group-hover:text-prism-navy" />
      <span className="truncate text-sm font-semibold text-prism-navy">{segment.name}</span>
      {segment.switcher ? <ChevronsUpDown className="size-3.5 shrink-0 text-prism-muted" /> : null}
    </>
  );

  if (segment.switcher) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            id={getStableSegmentId(segment)}
            type="button"
            className={className}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={segment.switcher.ariaLabel}
          >
            {content}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="max-h-[min(320px,50vh)] min-w-[220px] overflow-y-auto"
        >
          {segment.switcher.options.length > 0 ? (
            segment.switcher.options.map(option => (
              <DropdownMenuItem
                key={option.id ?? option.href}
                asChild
                className={cn(option.isCurrent && "bg-prism-navy/5 font-medium")}
              >
                <Link
                  href={option.href}
                  aria-current={option.isCurrent ? "page" : undefined}
                >
                  <span className="min-w-0 flex-1 truncate">{option.name}</span>
                  {option.isCurrent ? <Check className="size-4 shrink-0 text-prism-muted" /> : null}
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-prism-muted">{segment.switcher.emptyLabel}</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (segment.href) {
    return (
      <Link
        href={segment.href}
        aria-current={isCurrent ? "page" : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      aria-current={isCurrent ? "page" : undefined}
      className={className}
    >
      {content}
    </span>
  );
}
