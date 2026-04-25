"use client";

import type { WorkspaceMemberCandidate, WorkspaceMemberCandidateSearchResult } from "@/domains/workspace/types";
import { getInviteDisplayName, getWorkspaceMemberSearchFeedback } from "@/domains/workspace/utils/invite-member";
import { cn } from "@/shared/utils/cn";

type InviteMemberSearchResultsProps = {
  searchResult: WorkspaceMemberCandidateSearchResult | null;
  keyword: string;
  isLoading?: boolean;
  visible?: boolean;
  errorMessage?: string | null;
  onSelect: (candidate: WorkspaceMemberCandidate) => void;
};

export function InviteMemberSearchResults({
  searchResult,
  keyword,
  isLoading = false,
  visible = false,
  errorMessage = null,
  onSelect,
}: InviteMemberSearchResultsProps) {
  if (!visible) {
    return null;
  }

  const feedbackMessage =
    errorMessage || (searchResult ? getWorkspaceMemberSearchFeedback(searchResult.reason, keyword) : null);
  const items = searchResult?.items ?? [];

  return (
    <div className="rounded-xl border border-border bg-surface shadow-[0_12px_32px_rgba(12,71,103,0.08)]">
      {isLoading ? (
        <div className="px-3 py-2 text-sm text-prism-muted">Searching members...</div>
      ) : feedbackMessage ? (
        <div className="px-3 py-2 text-sm text-prism-muted">{feedbackMessage}</div>
      ) : items.length === 0 ? (
        <div className="px-3 py-2 text-sm text-prism-muted">No members found.</div>
      ) : (
        <div className="py-1">
          {items.map(candidate => {
            const displayName = getInviteDisplayName(candidate);

            return (
              <button
                key={`${candidate.kind}:${candidate.userId ?? candidate.email}`}
                type="button"
                onClick={() => onSelect(candidate)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-prism-navy/5"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-prism-body">{displayName}</div>
                  <div className="truncate text-xs text-prism-muted">{candidate.email}</div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                    candidate.kind === "existing" ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800",
                  )}
                >
                  {candidate.kind === "existing" ? "Existing" : "External"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
