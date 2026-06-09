"use client";

import * as React from "react";
import { Loader2, Paperclip, RefreshCw, SendHorizontal, X } from "lucide-react";

import { UserAvatar } from "@/atomics/atoms/Avatar";
import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectCommentMentionTextarea } from "@/domains/projects/components/ProjectCommentMentionTextarea";
import { ProjectWorkItemCommentRow } from "@/domains/projects/components/ProjectWorkItemCommentRow";
import { useCreateProjectWorkItemComment } from "@/domains/projects/hooks/useCreateProjectWorkItemComment";
import { useProjectDocumentPermissions } from "@/domains/projects/hooks/useProjectDocumentPermissions";
import { useProjectDocuments } from "@/domains/projects/hooks/useProjectDocuments";
import type { ProjectDocument, ProjectParticipant, ProjectWorkItemCommentSearchResult } from "@/domains/projects/types";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import type { CurrentUser } from "@/shared/types/auth";
import { isSameCommentDay } from "@/domains/projects/utils/comment-display";
import { formatDocumentFileSize } from "@/domains/projects/utils/document";
import { getCurrentUserDisplayName } from "@/shared/utils/user-display";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemCommentsPanelProps = {
  projectId: string;
  workspaceId: string;
  itemId: string;
  comments: ProjectWorkItemCommentSearchResult;
  initialMembers?: ProjectParticipant[];
  initialCurrentUser?: CurrentUser;
  isError: boolean;
  onRetry: () => void;
};

const COMMENT_BODY_MAX_LENGTH = 2000;
const MAX_DOCUMENT_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_COMMENT_ATTACHMENT_COUNT = 10;
const COMMENT_SUBMIT_BUTTON_CLASS =
  "h-9 rounded-lg bg-prism-navy px-3 text-white hover:bg-prism-navy/90 disabled:cursor-default disabled:opacity-50";

type PendingComment = {
  id: string;
  body: string;
  files: File[];
  status: "sending" | "failed";
};

function getPendingFileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

export function ProjectWorkItemCommentsPanel({
  projectId,
  workspaceId,
  itemId,
  comments,
  initialMembers,
  initialCurrentUser,
  isError,
  onRetry,
}: ProjectWorkItemCommentsPanelProps) {
  const [body, setBody] = React.useState("");
  const [pendingFiles, setPendingFiles] = React.useState<File[]>([]);
  const [pendingComment, setPendingComment] = React.useState<PendingComment | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: currentUser } = useCurrentUser(initialCurrentUser);
  const { mutateAsync: createComment, isPending } = useCreateProjectWorkItemComment();
  const { canContribute } = useProjectDocumentPermissions(workspaceId);
  const { data: documentsData } = useProjectDocuments(projectId, { workItemId: itemId, limit: 100 });

  const attachmentsByComment = React.useMemo(() => {
    const map = new Map<string, ProjectDocument[]>();
    for (const document of documentsData?.items ?? []) {
      if (!document.sourceCommentId) continue;
      const existing = map.get(document.sourceCommentId);
      if (existing) {
        existing.push(document);
      } else {
        map.set(document.sourceCommentId, [document]);
      }
    }
    return map;
  }, [documentsData]);

  const memberByUserId = React.useMemo(
    () => new Map((initialMembers ?? []).map(member => [member.userId, member])),
    [initialMembers],
  );
  const currentUserName = currentUser ? getCurrentUserDisplayName(currentUser) : "You";
  const trimmedBody = body.trim();
  const canSubmit = Boolean(trimmedBody) && !isPending;
  const lastComment = comments.comments.at(-1);
  const isPendingConsecutive = Boolean(
    lastComment &&
    currentUser?.userId &&
    lastComment.authorUserId === currentUser.userId &&
    isSameCommentDay(lastComment.createdAt, new Date().toISOString()),
  );

  const handleAttachClick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (selected.length === 0) return;

    if (selected.some(file => file.size <= 0)) {
      setError("Empty files cannot be attached.");
      return;
    }

    if (selected.some(file => file.size > MAX_DOCUMENT_FILE_SIZE_BYTES)) {
      setError("Files must be 25 MB or smaller.");
      return;
    }

    const seenKeys = new Set(pendingFiles.map(getPendingFileKey));
    const uniqueSelected: File[] = [];
    let duplicateCount = 0;

    for (const file of selected) {
      const key = getPendingFileKey(file);
      if (seenKeys.has(key)) {
        duplicateCount += 1;
        continue;
      }
      seenKeys.add(key);
      uniqueSelected.push(file);
    }

    if (uniqueSelected.length === 0) {
      setError("Those files are already attached.");
      return;
    }

    if (pendingFiles.length + uniqueSelected.length > MAX_COMMENT_ATTACHMENT_COUNT) {
      setError(`Attach up to ${MAX_COMMENT_ATTACHMENT_COUNT} files per comment.`);
      return;
    }

    setError(duplicateCount > 0 ? "Duplicate files were skipped." : null);
    setPendingFiles(previous => [...previous, ...uniqueSelected]);
  };

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles(previous => previous.filter((_, fileIndex) => fileIndex !== index));
  };

  const handleRetryPendingComment = () => {
    if (!pendingComment) {
      return;
    }

    setBody(pendingComment.body);
    setPendingFiles(pendingComment.files);
    setPendingComment(null);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedBody || isPending) return;
    setError(null);
    const filesToUpload = pendingFiles;
    const draft: PendingComment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      body: trimmedBody,
      files: filesToUpload,
      status: "sending",
    };
    setPendingComment(draft);
    setBody("");
    setPendingFiles([]);

    try {
      await createComment({
        projectId,
        itemId,
        payload: { body: trimmedBody, files: filesToUpload.length > 0 ? filesToUpload : undefined },
      });
      setPendingComment(null);
    } catch (caughtError) {
      setPendingComment({ ...draft, status: "failed" });
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
          const commentAttachments = comment.attachments ?? attachmentsByComment.get(comment.commentId) ?? [];

          return (
            <div
              key={comment.commentId}
              className={isConsecutive ? "mt-0.5" : index === 0 ? "" : "mt-4"}
            >
              <ProjectWorkItemCommentRow
                projectId={projectId}
                itemId={itemId}
                comment={comment}
                attachments={commentAttachments}
                canDownloadAttachments={canContribute}
                currentUser={currentUser}
                memberByUserId={memberByUserId}
                members={initialMembers ?? []}
                isConsecutive={isConsecutive}
              />
            </div>
          );
        })}

        {pendingComment ? (
          <div className={isPendingConsecutive ? "mt-0.5" : comments.comments.length > 0 ? "mt-4" : ""}>
            <article className="flex gap-2.5 opacity-80">
              {isPendingConsecutive ? (
                <div className="flex w-9 shrink-0 justify-center">
                  <span className="text-[10px] leading-6 text-prism-muted/60">
                    {pendingComment.status === "failed" ? "Failed" : "Sending"}
                  </span>
                </div>
              ) : (
                <UserAvatar
                  name={currentUserName}
                  seed={currentUser?.userId}
                  className="size-9 text-sm"
                />
              )}
              <div className="min-w-0 flex-1">
                {!isPendingConsecutive ? (
                  <div className="flex min-w-0 items-center gap-2">
                    <Typography
                      as="span"
                      variant="bodySm"
                      tone="primary"
                      weight="semibold"
                      className="truncate leading-5"
                    >
                      {currentUserName}
                    </Typography>
                    <span className="text-xs text-prism-muted/70">
                      {pendingComment.status === "failed" ? "Failed" : "Sending..."}
                    </span>
                  </div>
                ) : null}
                <p className="min-w-0 whitespace-pre-wrap break-words text-sm leading-6 text-prism-body">
                  {pendingComment.body}
                </p>
                {pendingComment.files.length > 0 ? (
                  <ul className="mt-1.5 flex max-w-full flex-col items-start gap-1">
                    {pendingComment.files.map(file => (
                      <li
                        key={getPendingFileKey(file)}
                        className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border/60 bg-surface px-2 py-1"
                      >
                        <Paperclip className="size-3 shrink-0 text-prism-muted" />
                        <span className="min-w-0 max-w-44 truncate text-xs font-medium text-prism-body">
                          {file.name}
                        </span>
                        <span className="shrink-0 text-[11px] text-prism-muted">
                          {formatDocumentFileSize(file.size)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {pendingComment.status === "failed" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-1 h-7 rounded-lg px-2 text-xs text-prism-danger hover:bg-prism-danger-soft/40 hover:text-prism-danger"
                    onClick={handleRetryPendingComment}
                  >
                    Retry
                  </Button>
                ) : null}
              </div>
            </article>
          </div>
        ) : null}

        {!isError && comments.comments.length === 0 && !pendingComment && (
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
            <div className="overflow-hidden rounded-xl border border-border bg-surface-field focus-within:border-prism-navy/40 focus-within:ring-2 focus-within:ring-ring/30">
              <ProjectCommentMentionTextarea
                value={body}
                onValueChange={setBody}
                onKeyDown={handleKeyDown}
                members={initialMembers ?? []}
                currentUserId={currentUser?.userId}
                placeholder="Write a comment... (@ mentions supported)"
                maxLength={COMMENT_BODY_MAX_LENGTH}
                disabled={isPending}
                className="min-h-32 resize-none rounded-none border-0 bg-transparent px-4 py-3 text-sm text-prism-body placeholder:text-prism-muted focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-default"
              />

              <div className="flex flex-wrap items-center gap-2 px-2.5 pb-2 pt-1">
                {canContribute ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFilesSelected}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9 text-prism-muted hover:text-prism-body"
                      title="Attach files"
                      aria-label="Attach files"
                      onClick={handleAttachClick}
                      disabled={isPending || pendingFiles.length >= MAX_COMMENT_ATTACHMENT_COUNT}
                    >
                      <Paperclip className="size-4" />
                    </Button>
                  </>
                ) : null}

                {pendingFiles.length > 0 ? (
                  <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                    {pendingFiles.map((file, index) => (
                      <li
                        key={`${getPendingFileKey(file)}:${index}`}
                        className="flex min-w-0 max-w-full items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-2.5 py-1 sm:max-w-72"
                      >
                        <Paperclip className="size-3 shrink-0 text-prism-muted" />
                        <span className="min-w-0 flex-1 truncate text-xs text-prism-body">{file.name}</span>
                        <span className="shrink-0 text-xs text-prism-muted">{formatDocumentFileSize(file.size)}</span>
                        <button
                          type="button"
                          className="flex size-5 shrink-0 items-center justify-center rounded-md text-prism-muted hover:bg-prism-danger-soft/40 hover:text-prism-danger disabled:opacity-50"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => handleRemovePendingFile(index)}
                          disabled={isPending}
                        >
                          <X className="size-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <span
                  className={cn(
                    "ml-auto text-xs text-prism-muted",
                    trimmedBody.length >= COMMENT_BODY_MAX_LENGTH && "text-prism-danger",
                  )}
                >
                  {trimmedBody.length}/{COMMENT_BODY_MAX_LENGTH}
                </span>

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className={COMMENT_SUBMIT_BUTTON_CLASS}
                >
                  {isPending ? <Loader2 className="size-4 animate-spin" /> : <SendHorizontal className="size-4" />}
                  {isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>

            {error && <p className="mt-2 text-sm text-prism-danger">{error}</p>}
          </div>
        </div>
      </form>
    </section>
  );
}
