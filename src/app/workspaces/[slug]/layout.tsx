import type * as React from "react";
import { notFound } from "next/navigation";

import { getProjectsByWorkspaceSlugCached } from "@/domains/projects/api/server";
import { getWorkspacesCached } from "@/domains/workspaces/api/server";
import { WorkspaceRouteShell } from "@/domains/workspaces/components/WorkspaceRouteShell";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { slug } = await params;
  const [workspaces, projects] = await Promise.all([
    getWorkspacesCached(),
    getProjectsByWorkspaceSlugCached(slug).catch(() => []),
  ]);
  const workspace = workspaces.find(item => item.slug === slug);

  if (!workspace) {
    notFound();
  }

  return (
    <WorkspaceRouteShell
      workspace={workspace}
      workspaceSlug={slug}
      workspaces={workspaces}
      projects={projects}
    >
      {children}
    </WorkspaceRouteShell>
  );
}
