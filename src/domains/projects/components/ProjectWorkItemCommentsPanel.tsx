"use client";

import * as React from "react";
import { CircleCheck, RefreshCw, SendHorizontal } from "lucide-react";

import { Badge } from "@/atomics/atoms/Badge";
import { Button } from "@/atomics/atoms/Button";
import { Textarea } from "@/atomics/atoms/Textarea";
import { Typography } from "@/atomics/atoms/Typography";
import { useCreateProjectWorkItemComment } from "@/domains/projects/hooks/useCreateProjectWorkItemComment";
import type {
  ProjectParticipant,
  ProjectWorkItemComment,
  ProjectWorkItemCommentSearchResult,
} from "@/domains/projects/types";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import type { CurrentUser } from "@/shared/types/auth";
import { cn } from "@/shared/utils/cn";
import { getCurrentUserDisplayName, getCurrentUserInitial } from "@/shared/utils/user-display";

type ProjectWorkItemCommentsPanelProps = {
  projectId: string;
  itemId: string;
  comments: ProjectWorkItemCommentSearchResult;
  initialMembers?: ProjectParticipant[];
  initialCurrentUser?: CurrentUser;
  isError: boolean;
  onRetry: () => void;
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COMMENT_SUBMIT_BUTTON_BASE_CLASS = "h-10 rounded-lg border px-4 disabled:opacity-100 sm:self-end";
const COMMENT_SUBMIT_BUTTON_IDLE_CLASS =
  "border-prism-navy/30 bg-prism-navy/18 text-prism-navy/70 hover:border-prism-navy/30 hover:bg-prism-navy/18";
const COMMENT_SUBMIT_BUTTON_READY_CLASS =
  "border-prism-navy bg-prism-navy text-white hover:border-prism-navy/90 hover:bg-prism-navy/90";

function padDatePart(value: number) {
  return value.toString().padStart(2, "0");
}

function formatCommentDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  const hours = padDatePart(date.getUTCHours());
  const minutes = padDatePart(date.getUTCMinutes());

  return `${MONTH_LABELS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()} ${hours}:${minutes} UTC`;
}

function getFallbackUserLabel(userId: string) {
  return `Member ${userId.slice(0, 8)}`;
}

function getDisplayName(
  comment: ProjectWorkItemComment,
  memberByUserId: Map<string, ProjectParticipant>,
  currentUser?: CurrentUser,
) {
  if (currentUser?.userId === comment.authorUserId) {
    return getCurrentUserDisplayName(currentUser);
  }

  const member = memberByUserId.get(comment.authorUserId);

  return member?.fullName || member?.username || getFallbackUserLabel(comment.authorUserId);
}

function getInitial(displayName: string) {
  return (displayName.trim().at(0) || "U").toUpperCase();
}

function CommentAvatar({ label }: { label: string }) {
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-prism-navy text-sm font-semibold text-white"
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

function CommentRow({
  comment,
  currentUser,
  memberByUserId,
}: {
  comment: ProjectWorkItemComment;
  currentUser?: CurrentUser;
  memberByUserId: Map<string, ProjectParticipant>;
}) {
  const displayName = getDisplayName(comment, memberByUserId, currentUser);
  const isCurrentUser = currentUser?.userId === comment.authorUserId;

  return (
    <article className="flex gap-3">
      <CommentAvatar label={getInitial(displayName)} />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Typography
              as="span"
              variant="bodySm"
              tone="primary"
              weight="semibold"
              className="truncate leading-5"
            >
              {displayName}
            </Typography>
            {isCurrentUser && (
              <Badge
                icon={CircleCheck}
                size="sm"
              >
                You
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-prism-muted">
            <span>{formatCommentDate(comment.createdAt)}</span>
            {comment.updatedAt && <span className="text-xs">Edited</span>}
          </div>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-prism-body">{comment.body}</p>
      </div>
    </article>
  );
}

export function ProjectWorkItemCommentsPanel({
  projectId,
  itemId,
  comments,
  initialMembers,
  initialCurrentUser,
  isError,
  onRetry,
}: ProjectWorkItemCommentsPanelProps) {
  const [body, setBody] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const { data: currentUser } = useCurrentUser(initialCurrentUser);
  const { mutateAsync: createComment, isPending } = useCreateProjectWorkItemComment();
  const memberByUserId = React.useMemo(
    () => new Map((initialMembers ?? []).map(member => [member.userId, member])),
    [initialMembers],
  );
  const currentUserInitial = currentUser ? getCurrentUserInitial(currentUser) : "U";
  const trimmedBody = body.trim();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedBody) {
      return;
    }

    setError(null);

    try {
      await createComment({
        projectId,
        itemId,
        payload: {
          body: trimmedBody,
        },
      });
      setBody("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Comment could not be posted.");
    }
  };

  return (
    <section className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
          className="text-base"
        >
          Comments ({comments.total})
        </Typography>
        {isError && (
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-lg border-prism-danger-soft bg-surface px-3 text-xs text-prism-danger hover:bg-prism-danger-soft/40"
            onClick={onRetry}
          >
            <RefreshCw className="size-3.5" />
            Retry
          </Button>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {comments.comments.map(comment => (
          <CommentRow
            key={comment.commentId}
            comment={comment}
            currentUser={currentUser}
            memberByUserId={memberByUserId}
          />
        ))}

        {!isError && comments.comments.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-surface-strong px-4 py-6 text-center">
            <Typography
              variant="bodySm"
              tone="primary"
              weight="semibold"
            >
              No comments yet
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="mt-1"
            >
              Start the discussion for this work item.
            </Typography>
          </div>
        )}
      </div>

      <form
        className="mt-6 border-t border-border/70 pt-5"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-3">
          <CommentAvatar label={currentUserInitial} />
          <div className="min-w-0 flex-1">
            <Textarea
              value={body}
              onChange={event => setBody(event.target.value)}
              placeholder="Write a comment... (@ mentions supported)"
              maxLength={2000}
              disabled={isPending}
              className="min-h-24 resize-y rounded-xl border-border bg-surface-field px-4 py-3 text-sm text-prism-body placeholder:text-prism-muted focus-visible:ring-ring"
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-prism-muted">{trimmedBody.length}/2000</span>
              <Button
                type="submit"
                disabled={!trimmedBody || isPending}
                className={cn(
                  COMMENT_SUBMIT_BUTTON_BASE_CLASS,
                  trimmedBody && !isPending ? COMMENT_SUBMIT_BUTTON_READY_CLASS : COMMENT_SUBMIT_BUTTON_IDLE_CLASS,
                )}
              >
                <SendHorizontal className="size-4" />
                {isPending ? "Posting..." : "Post comment"}
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-prism-danger">{error}</p>}
          </div>
        </div>
      </form>
    </section>
  );
}
