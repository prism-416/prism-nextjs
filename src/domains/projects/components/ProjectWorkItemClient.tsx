"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { CreateProjectWorkItemDialog } from "@/domains/projects/components/CreateProjectWorkItemDialog";
import { ProjectErrorState } from "@/domains/projects/components/ProjectErrorState";
import { ProjectWorkItemDeleteDialog } from "@/domains/projects/components/ProjectWorkItemDeleteDialog";
import { ProjectWorkItemEditDialog } from "@/domains/projects/components/ProjectWorkItemEditDialog";
import { ProjectWorkItemPanel } from "@/domains/projects/components/ProjectWorkItemPanel";
import { ProjectWorkItemSkeleton } from "@/domains/projects/components/ProjectWorkItemSkeleton";
import { useProjectWorkItemComments } from "@/domains/projects/hooks/useProjectWorkItemComments";
import { useProjectWorkItem } from "@/domains/projects/hooks/useProjectWorkItem";
import { useProjectWorkItemChildren } from "@/domains/projects/hooks/useProjectWorkItemChildren";
import { useProjectParticipants } from "@/domains/projects/hooks/useProjectParticipants";
import { useUpdateProjectWorkItem } from "@/domains/projects/hooks/useUpdateProjectWorkItem";
import type {
  ProjectParticipant,
  ProjectWorkItem,
  ProjectWorkItemCommentSearchResult,
  ProjectWorkItemPriority,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import type { CurrentUser } from "@/shared/types/auth";
import { QUERY_KEYS } from "@/shared/query/queryKeys";

type ProjectWorkItemClientProps = {
  projectId: string;
  projectSlug: string;
  itemId: string;
  initialWorkItem?: ProjectWorkItem;
  initialChildren?: ProjectWorkItem[];
  initialComments?: ProjectWorkItemCommentSearchResult;
  initialMembers?: ProjectParticipant[];
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isCreateChildOpen, setIsCreateChildOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
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
  const { data: members = [] } = useProjectParticipants(workItem?.workspaceId, initialMembers);
  const { mutate: updateWorkItem } = useUpdateProjectWorkItem({
    mutationKey: PROJECT_MUTATION_KEYS.workItems.update(projectId),
    syncResult: false,
  });

  const applyOptimisticPatch = React.useCallback(
    (item: ProjectWorkItem, patch: Partial<ProjectWorkItem>) => {
      queryClient.setQueryData<ProjectWorkItem>(QUERY_KEYS.project.workItemDetail(projectId, item.itemId), previous =>
        previous ? { ...previous, ...patch } : previous,
      );
      if (item.parentId) {
        queryClient.setQueryData<ProjectWorkItem[]>(
          QUERY_KEYS.project.workItemChildren(projectId, item.parentId),
          previous => previous?.map(child => (child.itemId === item.itemId ? { ...child, ...patch } : child)),
        );
      }
    },
    [projectId, queryClient],
  );

  const handleUpdate = React.useCallback(
    (item: ProjectWorkItem, payload: { status?: ProjectWorkItemStatus; priority?: ProjectWorkItemPriority }) => {
      if (
        (payload.status && item.status === payload.status) ||
        (payload.priority && item.priority === payload.priority)
      ) {
        return;
      }

      setUpdateError(null);
      applyOptimisticPatch(item, payload);

      updateWorkItem(
        { projectId, itemId: item.itemId, payload },
        {
          onError: error => {
            applyOptimisticPatch(item, { status: item.status, priority: item.priority });
            setUpdateError(error instanceof Error ? error.message : "Work item could not be updated.");
          },
        },
      );
    },
    [applyOptimisticPatch, projectId, updateWorkItem],
  );

  const handleAssigneesUpdate = React.useCallback(
    (item: ProjectWorkItem, usernames: string[]) => {
      setUpdateError(null);
      const previousUsernames = item.assigneeUsernames;
      applyOptimisticPatch(item, { assigneeUsernames: usernames });

      updateWorkItem(
        { projectId, itemId: item.itemId, payload: { assigneeUsernames: usernames } },
        {
          onError: error => {
            applyOptimisticPatch(item, { assigneeUsernames: previousUsernames });
            setUpdateError(error instanceof Error ? error.message : "Work item could not be updated.");
          },
        },
      );
    },
    [applyOptimisticPatch, projectId, updateWorkItem],
  );

  const handleScheduleUpdate = React.useCallback(
    (item: ProjectWorkItem, patch: { startDate?: string | null; dueDate?: string | null }) => {
      setUpdateError(null);
      const previous = { startDate: item.startDate, dueDate: item.dueDate };
      applyOptimisticPatch(item, patch);

      updateWorkItem(
        { projectId, itemId: item.itemId, payload: patch },
        {
          onError: error => {
            applyOptimisticPatch(item, previous);
            setUpdateError(error instanceof Error ? error.message : "Work item could not be updated.");
          },
        },
      );
    },
    [applyOptimisticPatch, projectId, updateWorkItem],
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

  const afterDeleteHref = workItem.parentId
    ? `/projects/${encodeURIComponent(projectSlug)}/work-items/${encodeURIComponent(workItem.parentId)}`
    : `/projects/${encodeURIComponent(projectSlug)}`;

  return (
    <>
      <ProjectWorkItemPanel
        projectId={projectId}
        projectSlug={projectSlug}
        workItem={workItem}
        childItems={childItems}
        comments={comments ?? { comments: [], total: 0, limit: 50, offset: 0 }}
        members={members}
        initialMembers={initialMembers}
        initialCurrentUser={initialCurrentUser}
        isChildrenError={isChildrenError}
        isCommentsError={isCommentsError}
        updateError={updateError}
        onStatusUpdate={(item, status) => {
          handleUpdate(item, { status });
        }}
        onPriorityUpdate={(item, priority) => {
          handleUpdate(item, { priority });
        }}
        onAssigneesUpdate={handleAssigneesUpdate}
        onScheduleUpdate={handleScheduleUpdate}
        onRetryChildren={() => {
          setUpdateError(null);
          void refetchChildren();
        }}
        onRetryComments={() => {
          void refetchComments();
        }}
        onCreateChildWorkItem={() => setIsCreateChildOpen(true)}
        onEditWorkItem={() => setIsEditOpen(true)}
        onDeleteWorkItem={() => setIsDeleteOpen(true)}
      />

      <CreateProjectWorkItemDialog
        open={isCreateChildOpen}
        projectId={projectId}
        workspaceId={workItem.workspaceId}
        initialMembers={initialMembers}
        parentId={workItem.itemId}
        title="Create child work item"
        description="Add a child under this work item."
        onOpenChange={setIsCreateChildOpen}
      />

      {isEditOpen && (
        <ProjectWorkItemEditDialog
          key={workItem.itemId}
          projectId={projectId}
          workItem={workItem}
          open
          onOpenChange={open => {
            if (!open) setIsEditOpen(false);
          }}
        />
      )}

      <ProjectWorkItemDeleteDialog
        projectId={projectId}
        workItem={workItem}
        childCount={childItems.length}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleted={() => router.replace(afterDeleteHref)}
      />
    </>
  );
}
