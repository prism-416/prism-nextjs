"use client";

import * as React from "react";
import { CircleCheck, EllipsisVertical } from "lucide-react";

import { Badge } from "@/atomics/atoms/Badge";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectWorkItemCommentAvatar } from "@/domains/projects/components/ProjectWorkItemCommentAvatar";
import { ProjectWorkItemCommentEditForm } from "@/domains/projects/components/ProjectWorkItemCommentEditForm";
import type { ProjectParticipant, ProjectWorkItemComment } from "@/domains/projects/types";
import type { CurrentUser } from "@/shared/types/auth";
import {
  formatCommentDate,
  formatCommentTime,
  getCommentAuthorDisplayName,
  getCommentAuthorInitial,
} from "@/domains/projects/utils/comment-display";

type ProjectWorkItemCommentRowProps = {
  projectId: string;
  itemId: string;
  comment: ProjectWorkItemComment;
  currentUser?: CurrentUser;
  memberByUserId: Map<string, ProjectParticipant>;
  isConsecutive: boolean;
};

export function ProjectWorkItemCommentRow({
  projectId,
  itemId,
  comment,
  currentUser,
  memberByUserId,
  isConsecutive,
}: ProjectWorkItemCommentRowProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const displayName = getCommentAuthorDisplayName(comment, memberByUserId, currentUser);
  const isCurrentUser = currentUser?.userId === comment.authorUserId;

  const editButton = isCurrentUser && !isEditing && (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="shrink-0 rounded-lg p-1 text-prism-muted transition-all hover:bg-prism-navy/8 hover:text-prism-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
      aria-label="Edit comment"
    >
      <EllipsisVertical className="size-3.5" />
    </button>
  );

  const editForm = (
    <ProjectWorkItemCommentEditForm
      projectId={projectId}
      itemId={itemId}
      comment={comment}
      onClose={() => setIsEditing(false)}
    />
  );

  const bodyContent = (
    <div className="flex items-start justify-between gap-2">
      <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-prism-body">
        {comment.body}
        {comment.updatedAt && !isEditing && <span className="ml-1 text-xs text-prism-muted/60">· Edited</span>}
      </p>
      {editButton}
    </div>
  );

  if (isConsecutive) {
    return (
      <article className="group/comment flex gap-2.5">
        <div className="flex w-9 shrink-0 justify-center">
          <span className="text-[10px] leading-6 text-prism-muted/60 opacity-0 transition-opacity group-hover/comment:opacity-100">
            {formatCommentTime(comment.createdAt)}
          </span>
        </div>
        <div className="min-w-0 flex-1">{isEditing ? editForm : bodyContent}</div>
      </article>
    );
  }

  return (
    <article className="flex gap-2.5">
      <ProjectWorkItemCommentAvatar label={getCommentAuthorInitial(displayName)} />
      <div className="min-w-0 flex-1">
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
          <span className="text-xs text-prism-muted/70">{formatCommentDate(comment.createdAt)}</span>
        </div>
        <div className="mt-0.5">{isEditing ? editForm : bodyContent}</div>
      </div>
    </article>
  );
}
