"use client";

import { useEffect, useState } from "react";

import { searchWorkspaceMemberCandidates } from "@/domains/workspaces/api";
import type { WorkspaceMemberCandidateSearchResult } from "@/domains/workspaces/types";

const CANDIDATE_SEARCH_DEBOUNCE_MS = 250;

function createEmptySearchResult(): WorkspaceMemberCandidateSearchResult {
  return {
    reason: "no_results",
    items: [],
  };
}

export function useWorkspaceMemberCandidateSearch() {
  const [memberQuery, setMemberQuery] = useState("");
  const [candidateSearchResult, setCandidateSearchResult] = useState<WorkspaceMemberCandidateSearchResult | null>(null);
  const [candidateSearchError, setCandidateSearchError] = useState<string | null>(null);
  const [isSearchingCandidates, setIsSearchingCandidates] = useState(false);
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const trimmedMemberQuery = memberQuery.trim();
  const shouldSearchCandidates = trimmedMemberQuery.length >= 2;
  const shouldShowCandidateResults =
    shouldSearchCandidates && (isSearchingCandidates || searchedKeyword === trimmedMemberQuery);

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
  }, [shouldSearchCandidates, trimmedMemberQuery]);

  async function searchCandidates(keyword: string) {
    const trimmedKeyword = keyword.trim();
    const result = await searchWorkspaceMemberCandidates({
      keyword: trimmedKeyword,
    });

    return result ?? createEmptySearchResult();
  }

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
