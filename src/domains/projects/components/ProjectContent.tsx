import { notFound } from "next/navigation";

import { getProjectBySlug } from "@/domains/projects/api";
import { ProjectClient } from "@/domains/projects/components/ProjectClient";

type ProjectContentProps = {
  slug: string;
  workspaceSlug?: string;
};

export async function ProjectContent({ slug, workspaceSlug }: ProjectContentProps) {
  const initialData = await getProjectBySlug(slug);

  if (!initialData) {
    notFound();
  }

  return (
    <ProjectClient
      slug={slug}
      workspaceSlug={workspaceSlug}
      initialData={initialData}
    />
  );
}
