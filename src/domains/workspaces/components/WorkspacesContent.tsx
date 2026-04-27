import { getWorkspaces } from "@/domains/workspaces/api";
import { WorkspacesClient } from "@/domains/workspaces/components/WorkspacesClient";

export async function WorkspacesContent() {
  const initialData = await getWorkspaces();

  return <WorkspacesClient initialData={initialData} />;
}
