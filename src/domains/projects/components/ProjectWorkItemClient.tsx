"use client";

import * as React from "react";

import { ProjectErrorState } from "@/domains/projects/components/ProjectErrorState";
import { ProjectWorkItemPanel } from "@/domains/projects/components/ProjectWorkItemPanel";
import { ProjectWorkItemSkeleton } from "@/domains/projects/components/ProjectWorkItemSkeleton";
import { useProjectWorkItemComments } from "@/domains/projects/hooks/useProjectWorkItemComments";
import { useProjectWorkItem } from "@/domains/projects/hooks/useProjectWorkItem";
import { useProjectWorkItemChildren } from "@/domains/projects/hooks/useProjectWorkItemChildren";
import { useUpdateProjectWorkItem } from "@/domains/projects/hooks/useUpdateProjectWorkItem";
import type {
  ProjectMemberListItem,
  ProjectWorkItem,
  ProjectWorkItemCommentSearchResult,
  ProjectWorkItemPriority,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import type { CurrentUser } from "@/shared/types/auth";

type ProjectWorkItemClientProps = {
  projectId: string;
  projectSlug: string;
  itemId: string;
  initialWorkItem?: ProjectWorkItem;
  initialChildren?: ProjectWorkItem[];
  initialComments?: ProjectWorkItemCommentSearchResult;
  initialMembers?: ProjectMemberListItem[];
  initialCurrentUser?: CurrentUser;
};

export function ProjectWorkItemClient({
  projectId,
  projectSlug,
  itemId,
  initialWorkItem,
  initialChildren,
  initialComments,
  initialMembers,
  initialCurrentUser,
}: ProjectWorkItemClientProps) {
  const [updatingItemId, setUpdatingItemId] = React.useState<string | null>(null);
  const [updateError, setUpdateError] = React.useState<string | null>(null);
  const {
    data: workItem,
    isPending: isWorkItemPending,
    isError: isWorkItemError,
    refetch: refetchWorkItem,
  } = useProjectWorkItem(projectId, itemId, initialWorkItem);
  const {
    data: childItems = [],
    isError: isChildrenError,
    refetch: refetchChildren,
  } = useProjectWorkItemChildren(projectId, itemId, initialChildren);
  const {
    data: comments,
    isError: isCommentsError,
    refetch: refetchComments,
  } = useProjectWorkItemComments(projectId, itemId, undefined, initialComments);
  const { mutateAsync: updateWorkItem, isPending: isUpdatingItem } = useUpdateProjectWorkItem();

  const handleUpdate = React.useCallback(
    async (item: ProjectWorkItem, payload: { status?: ProjectWorkItemStatus; priority?: ProjectWorkItemPriority }) => {
      if (
        (payload.status && item.status === payload.status) ||
        (payload.priority && item.priority === payload.priority)
      ) {
        return;
      }

      setUpdateError(null);
      setUpdatingItemId(item.itemId);

      try {
        await updateWorkItem({
          projectId,
          itemId: item.itemId,
          payload,
        });
      } catch (error) {
        setUpdateError(error instanceof Error ? error.message : "Work item could not be updated.");
      } finally {
        setUpdatingItemId(null);
      }
    },
    [projectId, updateWorkItem],
  );

  if (isWorkItemPending && !workItem) {
    return <ProjectWorkItemSkeleton />;
  }

  if (isWorkItemError || !workItem) {
    return (
      <ProjectErrorState
        title="Work item could not be loaded."
        description="Check the work item route or try again."
        onRetry={() => {
          void refetchWorkItem();
        }}
      />
    );
  }

  return (
    <ProjectWorkItemPanel
      projectId={projectId}
      projectSlug={projectSlug}
      workItem={workItem}
      childItems={childItems}
      comments={comments ?? { comments: [], total: 0, limit: 50, offset: 0 }}
      initialMembers={initialMembers}
      initialCurrentUser={initialCurrentUser}
      isChildrenError={isChildrenError}
      isCommentsError={isCommentsError}
      updatingItemId={updatingItemId}
      isUpdatingItem={isUpdatingItem}
      updateError={updateError}
      onStatusUpdate={(item, status) => {
        void handleUpdate(item, { status });
      }}
      onPriorityUpdate={(item, priority) => {
        void handleUpdate(item, { priority });
      }}
      onRetryChildren={() => {
        setUpdateError(null);
        void refetchChildren();
      }}
      onRetryComments={() => {
        void refetchComments();
      }}
    />
  );
}
