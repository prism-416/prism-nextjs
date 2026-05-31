import { getWorkspaceSprints } from "@/domains/sprints/api";
import { WorkspaceSprintsClient } from "@/domains/sprints/components/WorkspaceSprintsClient";
import { getDefaultSprintDates } from "@/domains/sprints/utils/sprint";

type WorkspaceSprintsContentProps = {
  workspaceId: string;
  workspaceSlug: string;
  workspaceOwnerId: string;
};

export async function WorkspaceSprintsContent({
  workspaceId,
  workspaceSlug,
  workspaceOwnerId,
}: WorkspaceSprintsContentProps) {
  const initialData = await getWorkspaceSprints(workspaceId).catch(() => undefined);
  const { defaultStartsAt, defaultEndsAt } = getDefaultSprintDates();

  return (
    <WorkspaceSprintsClient
      workspaceId={workspaceId}
      workspaceSlug={workspaceSlug}
      workspaceOwnerId={workspaceOwnerId}
      initialData={initialData}
      defaultStartsAt={defaultStartsAt}
      defaultEndsAt={defaultEndsAt}
    />
  );
}
