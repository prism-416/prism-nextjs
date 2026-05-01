import { notFound } from "next/navigation";

import { getWorkspaceBySlug } from "@/domains/workspaces/api";
import { WorkspaceSettingsClient } from "@/domains/workspaces/components/WorkspaceSettingsClient";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

type WorkspaceSettingsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspaceSettingsPage({ params }: WorkspaceSettingsPageProps) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace) {
    notFound();
  }

  return (
    <WorkspaceShell
      workspace={{ name: workspace.name }}
      workspaceSlug={slug}
    >
      <WorkspaceSettingsClient workspace={workspace} />
    </WorkspaceShell>
  );
}
