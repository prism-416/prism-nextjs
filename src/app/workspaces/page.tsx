import type { Metadata } from "next";

import { getWorkspaces } from "@/domains/workspace/api";
import { WorkspaceContent } from "@/domains/workspace/components/WorkspaceContent";

export const metadata: Metadata = {
  title: "Workspace",
};

export default async function WorkspacePage() {
  const initialData = await getWorkspaces()
    .then(response => response?.data ?? [])
    .catch(() => []);

  return <WorkspaceContent initialData={initialData} />;
}
