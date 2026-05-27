"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Textarea } from "@/atomics/atoms/Textarea";
import { useUpdateProjectWorkItemComment } from "@/domains/projects/hooks/useUpdateProjectWorkItemComment";
import type { ProjectWorkItemComment } from "@/domains/projects/types";

const COMMENT_BODY_MAX_LENGTH = 2000;

type ProjectWorkItemCommentEditFormProps = {
  projectId: string;
  itemId: string;
  comment: ProjectWorkItemComment;
  onClose: () => void;
};

export function ProjectWorkItemCommentEditForm({
  projectId,
  itemId,
  comment,
  onClose,
}: ProjectWorkItemCommentEditFormProps) {
  const [editBody, setEditBody] = React.useState(comment.body);
  const [editError, setEditError] = React.useState<string | null>(null);
  const { mutateAsync: updateComment, isPending: isUpdating } = useUpdateProjectWorkItemComment();

  const trimmedEditBody = editBody.trim();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedEditBody || trimmedEditBody === comment.body) {
      onClose();
      return;
    }
    setEditError(null);
    try {
      await updateComment({
        projectId,
        itemId,
        commentId: comment.commentId,
        payload: { body: trimmedEditBody },
      });
      onClose();
    } catch (caughtError) {
      setEditError(caughtError instanceof Error ? caughtError.message : "Comment could not be updated.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <form
      className="mt-1"
      onSubmit={handleSubmit}
    >
      <Textarea
        value={editBody}
        onChange={event => setEditBody(event.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={COMMENT_BODY_MAX_LENGTH}
        disabled={isUpdating}
        autoFocus
        className="min-h-20 resize-y rounded-xl border-border bg-surface-field px-4 py-3 text-sm text-prism-body placeholder:text-prism-muted focus-visible:ring-ring disabled:cursor-default"
      />
      <div className="mt-1 flex justify-end">
        <span className="text-xs text-prism-muted">
          {trimmedEditBody.length}/{COMMENT_BODY_MAX_LENGTH}
        </span>
      </div>
      {editError && <p className="mt-1 text-sm text-prism-danger">{editError}</p>}
      <div className="mt-2 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          className="h-8 rounded-lg px-3 text-xs text-prism-muted hover:text-prism-body"
          onClick={onClose}
          disabled={isUpdating}
        >
          <X className="size-3.5" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!trimmedEditBody || isUpdating}
          className="h-8 rounded-lg bg-prism-navy px-3 text-xs text-white hover:bg-prism-navy/90 disabled:cursor-default disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
