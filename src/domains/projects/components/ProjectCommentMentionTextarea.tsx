"use client";

import * as React from "react";

import { Textarea } from "@/atomics/atoms/Textarea";
import type { ProjectParticipant } from "@/domains/projects/types";
import {
  filterMentionCandidates,
  getActiveMentionLookup,
  getMentionDeletionRange,
  insertMention,
  renderLiveCommentBodyWithMentions,
} from "@/domains/projects/utils/mentions";
import { getCommentAuthorInitial } from "@/domains/projects/utils/comment-display";
import { cn } from "@/shared/utils/cn";

type ProjectCommentMentionTextareaProps = Omit<
  React.ComponentProps<typeof Textarea>,
  "value" | "onChange" | "onKeyDown"
> & {
  value: string;
  members: ProjectParticipant[];
  currentUserId?: string;
  onValueChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export function ProjectCommentMentionTextarea({
  value,
  members,
  currentUserId,
  onValueChange,
  onKeyDown,
  className,
  ...props
}: ProjectCommentMentionTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const highlightRef = React.useRef<HTMLDivElement | null>(null);
  const [lookup, setLookup] = React.useState(() => getActiveMentionLookup(value, 0));
  const [activeIndex, setActiveIndex] = React.useState(0);
  const candidates = React.useMemo(
    () => (lookup ? filterMentionCandidates(members, lookup.query, currentUserId) : []),
    [currentUserId, lookup, members],
  );
  const memberUsernames = React.useMemo(() => members.map(member => member.username), [members]);
  const isMenuOpen = Boolean(lookup && candidates.length > 0);

  const refreshLookup = React.useCallback(
    (nextValue: string, caretIndex: number) => {
      setLookup(getActiveMentionLookup(nextValue, caretIndex));
      setActiveIndex(0);
    },
    [setLookup],
  );

  const selectCandidate = React.useCallback(
    (candidate: ProjectParticipant) => {
      if (!lookup) {
        return;
      }

      const { nextValue, nextCaretIndex } = insertMention(value, lookup, candidate.username);
      onValueChange(nextValue);
      setLookup(null);
      window.requestAnimationFrame(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(nextCaretIndex, nextCaretIndex);
      });
    },
    [lookup, onValueChange, value],
  );

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;
    onValueChange(nextValue);
    refreshLookup(nextValue, event.target.selectionStart);
  };

  const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = event.currentTarget.scrollTop;
      highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isCollapsedSelection = event.currentTarget.selectionStart === event.currentTarget.selectionEnd;
    const isPlainDeleteKey = !event.altKey && !event.ctrlKey && !event.metaKey;

    if (isPlainDeleteKey && isCollapsedSelection && (event.key === "Backspace" || event.key === "Delete")) {
      const deletionRange = getMentionDeletionRange(
        value,
        event.currentTarget.selectionStart,
        event.key === "Backspace" ? "backward" : "forward",
        memberUsernames,
      );

      if (deletionRange) {
        event.preventDefault();

        const nextValue = `${value.slice(0, deletionRange.start)}${value.slice(deletionRange.end)}`;
        onValueChange(nextValue);
        setLookup(null);
        window.requestAnimationFrame(() => {
          textareaRef.current?.focus();
          textareaRef.current?.setSelectionRange(deletionRange.start, deletionRange.start);
        });
        return;
      }
    }

    if (isMenuOpen) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex(index => (index + 1) % candidates.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(index => (index - 1 + candidates.length) % candidates.length);
        return;
      }

      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        selectCandidate(candidates[activeIndex]);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setLookup(null);
        return;
      }
    }

    onKeyDown?.(event);
  };

  const handleSelect = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    refreshLookup(value, textarea.selectionStart);
  };

  return (
    <div className="relative">
      <div
        ref={highlightRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words",
          className,
          "text-prism-body",
        )}
      >
        {value ? renderLiveCommentBodyWithMentions(value, memberUsernames) : null}
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        onScroll={handleScroll}
        className={cn(
          className,
          "relative z-10 bg-transparent text-transparent caret-prism-body",
          "selection:bg-prism-info-soft placeholder:text-prism-muted",
        )}
        {...props}
      />
      {isMenuOpen && (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-[min(22rem,100%)] overflow-hidden rounded-xl border border-border bg-surface-strong shadow-soft-navy">
          {candidates.map((member, index) => (
            <button
              key={member.userId}
              type="button"
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                index === activeIndex ? "bg-prism-info-soft" : "hover:bg-prism-info-soft/60",
              )}
              onMouseDown={event => {
                event.preventDefault();
                selectCandidate(member);
              }}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-prism-info-soft text-xs font-semibold text-prism-info">
                {getCommentAuthorInitial(member.fullName)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-prism-heading">{member.fullName}</span>
                <span className="block truncate text-xs text-prism-muted">@{member.username}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
