import { getWorkspaces } from "@/domains/workspace/api";
import { WorkspaceClient } from "@/domains/workspace/components/WorkspaceClient";

export async function WorkspaceContent() {
  const initialData = await getWorkspaces();

  return <WorkspaceClient initialData={initialData} />;
}
