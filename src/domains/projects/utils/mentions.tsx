import * as React from "react";

import type { ProjectParticipant } from "@/domains/projects/types";

const MENTION_TOKEN_PATTERN = /(^|[^\p{L}\p{N}_@])@([\p{L}\p{N}._-]{2,30})(?=$|[^\p{L}\p{N}._-])/gu;
const LIVE_MENTION_TOKEN_PATTERN = /(^|[^\p{L}\p{N}_@])@([\p{L}\p{N}._-]{0,30})/gu;

export type MentionLookup = {
  query: string;
  start: number;
  end: number;
};

export type MentionDeletionRange = {
  end: number;
  start: number;
  username: string;
};

export function getActiveMentionLookup(value: string, caretIndex: number): MentionLookup | null {
  const beforeCaret = value.slice(0, caretIndex);
  const tokenStart = beforeCaret.search(/(^|\s)@[\p{L}\p{N}._-]*$/u);

  if (tokenStart < 0) {
    return null;
  }

  const atIndex = beforeCaret.indexOf("@", tokenStart);
  if (atIndex < 0) {
    return null;
  }

  return {
    query: beforeCaret.slice(atIndex + 1).toLowerCase(),
    start: atIndex,
    end: caretIndex,
  };
}

export function getMentionDeletionRange(
  value: string,
  caretIndex: number,
  direction: "backward" | "forward",
  usernames: string[],
): MentionDeletionRange | null {
  const knownUsernames = new Set(usernames.map(username => username.toLowerCase()));

  for (const match of value.matchAll(LIVE_MENTION_TOKEN_PATTERN)) {
    const prefix = match[1] ?? "";
    const username = match[2] ?? "";
    const matchIndex = match.index ?? 0;
    const start = matchIndex + prefix.length;
    const usernameEnd = start + username.length + 1;
    const end = value[usernameEnd] === " " ? usernameEnd + 1 : usernameEnd;

    if (!knownUsernames.has(username.toLowerCase())) {
      continue;
    }

    const isDeletingBackward = direction === "backward" && caretIndex > start && caretIndex <= end;
    const isDeletingForward = direction === "forward" && caretIndex >= start && caretIndex < end;

    if (isDeletingBackward || isDeletingForward) {
      return {
        end,
        start,
        username,
      };
    }
  }

  return null;
}

export function filterMentionCandidates(
  members: ProjectParticipant[],
  query: string,
  currentUserId?: string,
  limit = 6,
) {
  const normalizedQuery = query.toLowerCase();

  return members
    .filter(member => member.userId !== currentUserId)
    .filter(member => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        member.username.toLowerCase().includes(normalizedQuery) ||
        member.fullName.toLowerCase().includes(normalizedQuery)
      );
    })
    .sort((left, right) => {
      const leftStartsWith = left.username.toLowerCase().startsWith(normalizedQuery);
      const rightStartsWith = right.username.toLowerCase().startsWith(normalizedQuery);

      if (leftStartsWith !== rightStartsWith) {
        return leftStartsWith ? -1 : 1;
      }

      return left.username.localeCompare(right.username);
    })
    .slice(0, limit);
}

export function insertMention(value: string, lookup: MentionLookup, username: string) {
  const mention = `@${username} `;
  const nextValue = `${value.slice(0, lookup.start)}${mention}${value.slice(lookup.end)}`;
  const nextCaretIndex = lookup.start + mention.length;

  return {
    nextCaretIndex,
    nextValue,
  };
}

export function renderCommentBodyWithMentions(body: string) {
  return renderBodyWithMentionPattern(
    body,
    MENTION_TOKEN_PATTERN,
    "rounded-md bg-prism-info-soft px-1 py-0.5 font-medium text-prism-info",
  );
}

export function renderLiveCommentBodyWithMentions(body: string) {
  // Highlight the in-progress mention immediately as the user types, without
  // waiting for it to match a known member, so "@" turns blue right away.
  const nodes = renderBodyWithMentionPattern(
    body,
    LIVE_MENTION_TOKEN_PATTERN,
    "rounded-md bg-prism-info-soft text-prism-info shadow-[0_0_0_2px_var(--color-prism-info-soft)]",
  );

  if (Array.isArray(nodes) && body.endsWith("\n")) {
    return [...nodes, "\u00A0"];
  }

  return nodes;
}

function renderBodyWithMentionPattern(
  body: string,
  pattern: RegExp,
  mentionClassName: string,
  allowedUsernames?: Set<string>,
) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of body.matchAll(pattern)) {
    const prefix = match[1] ?? "";
    const username = match[2];
    const matchIndex = match.index ?? 0;
    const mentionStart = matchIndex + prefix.length;

    if (
      username === undefined ||
      mentionStart < lastIndex ||
      (allowedUsernames && !allowedUsernames.has(username.toLowerCase()))
    ) {
      continue;
    }

    const mentionEnd = mentionStart + username.length + 1;

    if (mentionStart > lastIndex) {
      nodes.push(body.slice(lastIndex, mentionStart));
    }

    nodes.push(
      <span
        key={`${username}-${mentionStart}`}
        className={mentionClassName}
      >
        @{username}
      </span>,
    );
    lastIndex = mentionEnd;
  }

  if (lastIndex < body.length) {
    nodes.push(body.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : body;
}
