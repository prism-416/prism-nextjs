import type * as React from "react";
import { notFound } from "next/navigation";

import { getProjects } from "@/domains/projects/api";
import { getWorkspaces } from "@/domains/workspaces/api";
import { WorkspaceRouteShell } from "@/domains/workspaces/components/WorkspaceRouteShell";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { slug } = await params;
  const [workspaces, projects] = await Promise.all([getWorkspaces(), getProjects(slug).catch(() => [])]);
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
