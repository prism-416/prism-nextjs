import type { QueryClient, QueryKey } from "@tanstack/react-query";

import type { ProjectWorkItemComment, ProjectWorkItemCommentSearchResult } from "@/domains/projects/types";
import type { ProjectCommentDeletedPayload } from "@/domains/projects/types/realtime";
import { QUERY_KEYS } from "@/shared/query/queryKeys";

function isProjectWorkItemCommentListQuery(queryKey: QueryKey, projectId: string, itemId: string) {
  return (
    queryKey[0] === "project" &&
    queryKey[1] === "detail" &&
    queryKey[2] === projectId &&
    queryKey[3] === "work-items" &&
    queryKey[4] === "detail" &&
    queryKey[5] === itemId &&
    queryKey[6] === "comments" &&
    queryKey[7] === "list"
  );
}

function appendComment(previous: ProjectWorkItemCommentSearchResult | undefined, comment: ProjectWorkItemComment) {
  if (!previous || previous.comments.some(item => item.commentId === comment.commentId)) {
    return previous;
  }

  return {
    ...previous,
    comments: [...previous.comments, comment],
    total: previous.total + 1,
  };
}

function replaceComment(previous: ProjectWorkItemCommentSearchResult | undefined, comment: ProjectWorkItemComment) {
  if (!previous) {
    return previous;
  }

  return {
    ...previous,
    comments: previous.comments.map(item => (item.commentId === comment.commentId ? comment : item)),
  };
}

function removeComment(previous: ProjectWorkItemCommentSearchResult | undefined, commentId: string) {
  if (!previous) {
    return previous;
  }

  const nextComments = previous.comments.filter(comment => comment.commentId !== commentId);

  return {
    ...previous,
    comments: nextComments,
    total: nextComments.length === previous.comments.length ? previous.total : Math.max(previous.total - 1, 0),
  };
}

function setProjectCommentQueries(
  queryClient: QueryClient,
  projectId: string,
  itemId: string,
  updater: (previous: ProjectWorkItemCommentSearchResult | undefined) => ProjectWorkItemCommentSearchResult | undefined,
) {
  queryClient.setQueriesData<ProjectWorkItemCommentSearchResult>(
    {
      predicate: query => isProjectWorkItemCommentListQuery(query.queryKey, projectId, itemId),
    },
    updater,
  );
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.project.workItemComments(projectId, itemId),
  });
}

export function syncProjectCommentCreated(queryClient: QueryClient, comment: ProjectWorkItemComment) {
  setProjectCommentQueries(queryClient, comment.projectId, comment.itemId, previous =>
    appendComment(previous, comment),
  );
}

export function syncProjectCommentUpdated(queryClient: QueryClient, comment: ProjectWorkItemComment) {
  setProjectCommentQueries(queryClient, comment.projectId, comment.itemId, previous =>
    replaceComment(previous, comment),
  );
}

export function syncProjectCommentDeleted(queryClient: QueryClient, payload: ProjectCommentDeletedPayload) {
  setProjectCommentQueries(queryClient, payload.projectId, payload.itemId, previous =>
    removeComment(previous, payload.commentId),
  );
}

export function syncProjectCommentAttachmentDeleted(
  queryClient: QueryClient,
  projectId: string,
  itemId: string,
  documentId: string,
) {
  setProjectCommentQueries(queryClient, projectId, itemId, previous => {
    if (!previous) {
      return previous;
    }

    return {
      ...previous,
      comments: previous.comments.map(comment => {
        if (!comment.attachments) {
          return comment;
        }

        return {
          ...comment,
          attachments: comment.attachments.filter(attachment => attachment.documentId !== documentId),
        };
      }),
    };
  });
}
