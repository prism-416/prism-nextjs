"use client";

import * as React from "react";
import { RefreshCw, SendHorizontal } from "lucide-react";

import { UserAvatar } from "@/atomics/atoms/Avatar";
import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectCommentMentionTextarea } from "@/domains/projects/components/ProjectCommentMentionTextarea";
import { ProjectWorkItemCommentRow } from "@/domains/projects/components/ProjectWorkItemCommentRow";
import { useCreateProjectWorkItemComment } from "@/domains/projects/hooks/useCreateProjectWorkItemComment";
import type { ProjectParticipant, ProjectWorkItemCommentSearchResult } from "@/domains/projects/types";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import type { CurrentUser } from "@/shared/types/auth";
import { isSameCommentDay } from "@/domains/projects/utils/comment-display";
import { getCurrentUserDisplayName } from "@/shared/utils/user-display";

type ProjectWorkItemCommentsPanelProps = {
  projectId: string;
  itemId: string;
  comments: ProjectWorkItemCommentSearchResult;
  initialMembers?: ProjectParticipant[];
  initialCurrentUser?: CurrentUser;
  isError: boolean;
  onRetry: () => void;
};

const COMMENT_BODY_MAX_LENGTH = 2000;
const COMMENT_SUBMIT_BUTTON_CLASS =
  "h-10 rounded-lg bg-prism-navy px-4 text-white hover:bg-prism-navy/90 disabled:opacity-50 disabled:cursor-default";

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
  const currentUserName = currentUser ? getCurrentUserDisplayName(currentUser) : "You";
  const trimmedBody = body.trim();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedBody) return;
    setError(null);
    try {
      await createComment({ projectId, itemId, payload: { body: trimmedBody } });
      setBody("");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Comment could not be posted.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <section className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
          fontSize="lg"
          lineHeight="7"
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

      <div className="mt-4">
        {comments.comments.map((comment, index) => {
          const prev = comments.comments[index - 1];
          const isConsecutive =
            !!prev && prev.authorUserId === comment.authorUserId && isSameCommentDay(prev.createdAt, comment.createdAt);

          return (
            <div
              key={comment.commentId}
              className={isConsecutive ? "mt-0.5" : index === 0 ? "" : "mt-4"}
            >
              <ProjectWorkItemCommentRow
                projectId={projectId}
                itemId={itemId}
                comment={comment}
                currentUser={currentUser}
                memberByUserId={memberByUserId}
                members={initialMembers ?? []}
                isConsecutive={isConsecutive}
              />
            </div>
          );
        })}

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
        <div className="flex gap-2.5">
          <UserAvatar
            name={currentUserName}
            seed={currentUser?.userId}
            className="size-9 text-sm"
          />
          <div className="min-w-0 flex-1">
            <ProjectCommentMentionTextarea
              value={body}
              onValueChange={setBody}
              onKeyDown={handleKeyDown}
              members={initialMembers ?? []}
              currentUserId={currentUser?.userId}
              placeholder="Write a comment... (@ mentions supported)"
              maxLength={COMMENT_BODY_MAX_LENGTH}
              disabled={isPending}
              className="min-h-24 resize-y rounded-xl border-border bg-surface-field px-4 py-3 text-sm text-prism-body placeholder:text-prism-muted focus-visible:ring-ring disabled:cursor-default"
            />
            <div className="mt-1 flex justify-end">
              <span className="text-xs text-prism-muted">
                {trimmedBody.length}/{COMMENT_BODY_MAX_LENGTH}
              </span>
            </div>
            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                disabled={!trimmedBody || isPending}
                className={COMMENT_SUBMIT_BUTTON_CLASS}
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
