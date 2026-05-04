import { Suspense } from "react";
import type { Metadata } from "next";

import { getWorkspaces } from "@/domains/workspaces/api";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";
import { WorkspacesContent } from "@/domains/workspaces/components/WorkspacesContent";
import { WorkspacesSkeleton } from "@/domains/workspaces/components/WorkspacesSkeleton";

export const metadata: Metadata = {
  title: "Workspaces",
};

export default async function WorkspacesPage() {
  const workspaces = await getWorkspaces();

  return (
    <WorkspaceShell
      workspace={{ name: "Workspaces", href: "/workspaces" }}
      workspaceOptions={workspaces.map(workspace => ({
        id: workspace.workspaceId,
        name: workspace.name,
        href: `/workspaces/${encodeURIComponent(workspace.slug)}`,
      }))}
      contentClassName="bg-background"
    >
      <Suspense fallback={<WorkspacesSkeleton />}>
        <WorkspacesContent />
      </Suspense>
    </WorkspaceShell>
  );
}
