import { notFound } from "next/navigation";

import { getProjectBySlug } from "@/domains/projects/api";
import { ProjectSettingsClient } from "@/domains/projects/components/ProjectSettingsClient";
import { getWorkspaceById } from "@/domains/workspaces/api";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectSettingsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const workspace = await getWorkspaceById(project.workspaceId).catch(() => undefined);

  return (
    <ProjectPageShell slug={slug}>
      <ProjectSettingsClient
        project={project}
        workspaceOwnerId={workspace?.ownerId}
        workspaceSlug={workspace?.slug}
      />
    </ProjectPageShell>
  );
}
