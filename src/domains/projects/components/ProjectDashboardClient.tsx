"use client";

import { useProjectDashboard } from "@/domains/projects/hooks/useProjectDashboard";
import { CreateProjectWorkItemDialog } from "@/domains/projects/components/CreateProjectWorkItemDialog";
import { ProjectDashboardPanel } from "@/domains/projects/components/ProjectDashboardPanel";
import { ProjectDashboardSkeleton } from "@/domains/projects/components/ProjectDashboardSkeleton";
import { ProjectWorkItemDeleteDialog } from "@/domains/projects/components/ProjectWorkItemDeleteDialog";
import type { ProjectParticipant, ProjectWorkItemSearchResult } from "@/domains/projects/types";

type ProjectDashboardClientProps = {
  projectId: string;
  projectSlug: string;
  workspaceId?: string;
  initialMembers?: ProjectParticipant[];
  initialData?: ProjectWorkItemSearchResult;
};

export function ProjectDashboardClient(props: ProjectDashboardClientProps) {
  const dashboard = useProjectDashboard(props);

  if (dashboard.isPending && !dashboard.data) {
    return <ProjectDashboardSkeleton />;
  }

  return (
    <>
      <ProjectDashboardPanel
        projectSlug={props.projectSlug}
        workItems={dashboard.workItems}
        members={props.initialMembers}
        isError={dashboard.isError}
        updateError={dashboard.updateError}
        inlineEditingItemId={dashboard.inlineEditingItemId}
        inlineCreatingStatus={dashboard.inlineCreatingStatus}
        onPriorityUpdate={dashboard.onPriorityUpdate}
        onStatusUpdate={dashboard.onStatusUpdate}
        onInlineCreateWorkItem={dashboard.onInlineCreateWorkItem}
        onInlineTitleUpdate={dashboard.onInlineTitleUpdate}
        onInlineDescriptionUpdate={dashboard.onInlineDescriptionUpdate}
        onInlineScheduleUpdate={dashboard.onInlineScheduleUpdate}
        onInlineAssigneesUpdate={dashboard.onInlineAssigneesUpdate}
        onInlineEditCancel={dashboard.onInlineEditCancel}
        onEditWorkItem={dashboard.onEditWorkItem}
        onDeleteWorkItem={dashboard.onDeleteWorkItem}
        onItemsReorder={dashboard.onItemsReorder}
        onRetry={dashboard.onRetry}
        onCreateWorkItem={dashboard.onCreateWorkItem}
      />

      <CreateProjectWorkItemDialog
        open={dashboard.isCreateOpen}
        projectId={props.projectId}
        workspaceId={props.workspaceId}
        initialMembers={props.initialMembers}
        initialStatus={dashboard.createInitialStatus}
        onOpenChange={dashboard.onCreateOpenChange}
      />

      {dashboard.deletingWorkItem && (
        <ProjectWorkItemDeleteDialog
          projectId={props.projectId}
          workItem={dashboard.deletingWorkItem}
          childCount={dashboard.deletingWorkItemChildren.length}
          open
          onOpenChange={dashboard.onDeletingOpenChange}
          onDeleted={dashboard.onDeleted}
        />
      )}
    </>
  );
}
