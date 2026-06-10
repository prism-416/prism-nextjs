"use client";

import { useProjectDashboard } from "@/domains/projects/hooks/useProjectDashboard";
import { CreateProjectWorkItemDialog } from "@/domains/projects/components/CreateProjectWorkItemDialog";
import { ProjectDashboardPanel } from "@/domains/projects/components/ProjectDashboardPanel";
import { ProjectDashboardSkeleton } from "@/domains/projects/components/ProjectDashboardSkeleton";
import { useProjectParticipants } from "@/domains/projects/hooks/useProjectParticipants";
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
  const { data: members = props.initialMembers ?? [] } = useProjectParticipants(
    props.workspaceId,
    props.initialMembers,
  );

  if (dashboard.isPending && !dashboard.data) {
    return <ProjectDashboardSkeleton />;
  }

  return (
    <>
      <ProjectDashboardPanel
        projectSlug={props.projectSlug}
        workItems={dashboard.workItems}
        members={members}
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
        selectionMode={dashboard.selectionMode}
        selectedIds={dashboard.selectedIds}
        selectedCount={dashboard.selectedCount}
        isBulkDeleting={dashboard.isBulkDeleting}
        onToggleSelectionMode={dashboard.onToggleSelectionMode}
        onExitSelectionMode={dashboard.onExitSelectionMode}
        onToggleSelected={dashboard.onToggleSelected}
        onBulkDelete={dashboard.onBulkDelete}
      />

      <CreateProjectWorkItemDialog
        open={dashboard.isCreateOpen}
        projectId={props.projectId}
        workspaceId={props.workspaceId}
        initialMembers={members}
        initialStatus={dashboard.createInitialStatus}
        onOpenChange={dashboard.onCreateOpenChange}
      />
    </>
  );
}
