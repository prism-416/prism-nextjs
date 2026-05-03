"use client";

import { useCallback, useEffect, useState } from "react";

import { searchWorkspaceMemberCandidates } from "@/domains/workspaces/api";
import type { WorkspaceMemberCandidate, WorkspaceMemberCandidateSearchResult } from "@/domains/workspaces/types";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import type { CurrentUser } from "@/shared/types/auth";

const CANDIDATE_SEARCH_DEBOUNCE_MS = 250;

function createEmptySearchResult(): WorkspaceMemberCandidateSearchResult {
  return {
    reason: "no_results",
    items: [],
  };
}

function isCurrentUserCandidate(candidate: WorkspaceMemberCandidate, currentUser?: CurrentUser) {
  if (!currentUser) {
    return false;
  }

  const normalizedEmail = candidate.email.trim().toLowerCase();
  const normalizedUsername = candidate.username?.trim().toLowerCase();

  return (
    candidate.userId === currentUser.userId ||
    normalizedEmail === currentUser.email.trim().toLowerCase() ||
    normalizedUsername === currentUser.username.trim().toLowerCase()
  );
}

function excludeCurrentUser(
  result: WorkspaceMemberCandidateSearchResult,
  currentUser?: CurrentUser,
): WorkspaceMemberCandidateSearchResult {
  if (!currentUser) {
    return result;
  }

  const items = result.items.filter(candidate => !isCurrentUserCandidate(candidate, currentUser));

  return {
    ...result,
    items,
    reason: result.reason === "success" && items.length === 0 ? "no_results" : result.reason,
  };
}

export function useWorkspaceMemberCandidateSearch(workspaceId?: string) {
  const { data: currentUser, isPending: isCurrentUserPending } = useCurrentUser();
  const [memberQuery, setMemberQuery] = useState("");
  const [candidateSearchResult, setCandidateSearchResult] = useState<WorkspaceMemberCandidateSearchResult | null>(null);
  const [candidateSearchError, setCandidateSearchError] = useState<string | null>(null);
  const [isSearchingCandidates, setIsSearchingCandidates] = useState(false);
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const trimmedMemberQuery = memberQuery.trim();
  const shouldSearchCandidates = trimmedMemberQuery.length >= 2 && !isCurrentUserPending;
  const shouldShowCandidateResults =
    shouldSearchCandidates && (isSearchingCandidates || searchedKeyword === trimmedMemberQuery);

  const searchCandidates = useCallback(
    async (keyword: string) => {
      const trimmedKeyword = keyword.trim();
      const result = await searchWorkspaceMemberCandidates(
        workspaceId
          ? {
              keyword: trimmedKeyword,
              workspaceId,
            }
          : {
              keyword: trimmedKeyword,
            },
      );

      return excludeCurrentUser(result ?? createEmptySearchResult(), currentUser);
    },
    [currentUser, workspaceId],
  );

  useEffect(() => {
    if (!shouldSearchCandidates) {
      setCandidateSearchResult(null);
      setCandidateSearchError(null);
      setIsSearchingCandidates(false);
      setSearchedKeyword("");
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setIsSearchingCandidates(true);
      setCandidateSearchError(null);

      try {
        const result = await searchCandidates(trimmedMemberQuery);

        if (cancelled) {
          return;
        }

        setCandidateSearchResult(result);
        setSearchedKeyword(trimmedMemberQuery);
      } catch {
        if (cancelled) {
          return;
        }

        setCandidateSearchResult(null);
        setCandidateSearchError("Failed to search members. Please try again.");
        setSearchedKeyword(trimmedMemberQuery);
      } finally {
        if (!cancelled) {
          setIsSearchingCandidates(false);
        }
      }
    }, CANDIDATE_SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchCandidates, shouldSearchCandidates, trimmedMemberQuery]);

  function handleMemberQueryChange(value: string) {
    setMemberQuery(value);
  }

  function clearSearchState() {
    setMemberQuery("");
    setCandidateSearchResult(null);
    setCandidateSearchError(null);
    setIsSearchingCandidates(false);
    setSearchedKeyword("");
  }

  return {
    candidateSearchError,
    candidateSearchResult,
    isSearchingCandidates,
    memberQuery,
    shouldShowCandidateResults,
    trimmedMemberQuery,
    clearSearchState,
    handleMemberQueryChange,
    searchCandidates,
  };
}
