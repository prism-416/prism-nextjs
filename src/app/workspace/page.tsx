import type { Metadata } from "next";

import { prefetchWorkspaces } from "@/domains/workspace/api";
import { WorkspaceContent } from "@/domains/workspace/components/WorkspaceContent";

export const metadata: Metadata = {
  title: "Workspace",
};

export default async function WorkspacePage() {
  const initialData = await prefetchWorkspaces();

  return <WorkspaceContent initialData={initialData} />;
}
