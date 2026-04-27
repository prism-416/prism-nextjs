"use client";

import { useEffect, useState } from "react";

import { searchWorkspaceMemberCandidates } from "@/domains/workspace/api";
import type { WorkspaceMemberCandidateSearchResult } from "@/domains/workspace/types";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { getCookie } from "@/shared/utils/cookie";

const CANDIDATE_SEARCH_DEBOUNCE_MS = 250;

function parseJwtEmail(token: string | null) {
  if (!token || typeof window === "undefined" || typeof window.atob !== "function") {
    return "";
  }

  const [, payloadSegment] = token.split(".");
  if (!payloadSegment) {
    return "";
  }

  try {
    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = JSON.parse(window.atob(padded)) as { email?: unknown };

    return typeof payload.email === "string" && payload.email.trim().length > 0
      ? payload.email.trim().toLowerCase()
      : "";
  } catch {
    return "";
  }
}

function readCurrentUserEmailFromAccessToken() {
  if (typeof document === "undefined") {
    return "";
  }

  const accessToken = getCookie(ACCESS_TOKEN_COOKIE_NAME);
  return parseJwtEmail(accessToken);
}

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
  const normalizedMemberQuery = trimmedMemberQuery.toLowerCase();
  const currentUserEmail = readCurrentUserEmailFromAccessToken();
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

    if (currentUserEmail && normalizedMemberQuery === currentUserEmail) {
      setCandidateSearchResult({
        reason: "self",
        items: [],
      });
      setCandidateSearchError(null);
      setIsSearchingCandidates(false);
      setSearchedKeyword(trimmedMemberQuery);
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
  }, [currentUserEmail, normalizedMemberQuery, shouldSearchCandidates, trimmedMemberQuery]);

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
    currentUserEmail,
    isSearchingCandidates,
    memberQuery,
    shouldShowCandidateResults,
    trimmedMemberQuery,
    clearSearchState,
    handleMemberQueryChange,
    searchCandidates,
  };
}
