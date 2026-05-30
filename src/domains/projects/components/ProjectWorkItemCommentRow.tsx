"use client";

import * as React from "react";
import { CircleCheck } from "lucide-react";

import { UserAvatar } from "@/atomics/atoms/Avatar";
import { Badge } from "@/atomics/atoms/Badge";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectWorkItemCommentActionMenu } from "@/domains/projects/components/ProjectWorkItemCommentActionMenu";
import { ProjectWorkItemCommentEditForm } from "@/domains/projects/components/ProjectWorkItemCommentEditForm";
import { useDeleteProjectWorkItemComment } from "@/domains/projects/hooks/useDeleteProjectWorkItemComment";
import type { ProjectParticipant, ProjectWorkItemComment } from "@/domains/projects/types";
import { renderCommentBodyWithMentions } from "@/domains/projects/utils/mentions";
import type { CurrentUser } from "@/shared/types/auth";
import {
  formatCommentDate,
  formatCommentTime,
  getCommentAuthorDisplayName,
} from "@/domains/projects/utils/comment-display";

type ProjectWorkItemCommentRowProps = {
  projectId: string;
  itemId: string;
  comment: ProjectWorkItemComment;
  currentUser?: CurrentUser;
  memberByUserId: Map<string, ProjectParticipant>;
  members: ProjectParticipant[];
  isConsecutive: boolean;
};

export function ProjectWorkItemCommentRow({
  projectId,
  itemId,
  comment,
  currentUser,
  memberByUserId,
  members,
  isConsecutive,
}: ProjectWorkItemCommentRowProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteProjectWorkItemComment();

  const displayName = getCommentAuthorDisplayName(comment, memberByUserId, currentUser);
  const isCurrentUser = currentUser?.userId === comment.authorUserId;

  const actionMenu = isCurrentUser && !isEditing && (
    <ProjectWorkItemCommentActionMenu
      isDeleting={isDeleting}
      onEdit={() => setIsEditing(true)}
      onDelete={() => deleteComment({ projectId, itemId, commentId: comment.commentId })}
    />
  );

  const editForm = (
    <ProjectWorkItemCommentEditForm
      projectId={projectId}
      itemId={itemId}
      comment={comment}
      members={members}
      currentUserId={currentUser?.userId}
      onClose={() => setIsEditing(false)}
    />
  );

  const bodyContent = (
    <div className="flex items-start justify-between gap-2">
      <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-prism-body">
        {renderCommentBodyWithMentions(comment.body)}
        {comment.updatedAt && !isEditing && <span className="ml-1 text-xs text-prism-muted/60">· Edited</span>}
      </p>
      {actionMenu}
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
      <UserAvatar
        name={displayName}
        seed={comment.authorUserId}
        className="size-9 text-sm"
      />
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
