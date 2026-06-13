import { WorkspaceSprintRoute } from "@/domains/workspaces/components/routes/WorkspaceSprintRoute";

type WorkspaceSprintPageProps = {
  params: Promise<{
    slug: string;
    sprintId: string;
  }>;
};

export default async function WorkspaceSprintPage({ params }: WorkspaceSprintPageProps) {
  const { sprintId } = await params;

  return <WorkspaceSprintRoute sprintId={sprintId} />;
}
