import { notFound } from "next/navigation";

import { getProjectBySlug, getProjectMembers } from "@/domains/projects/api";
import { ProjectClient } from "@/domains/projects/components/ProjectClient";

type ProjectContentProps = {
  slug: string;
};

export async function ProjectContent({ slug }: ProjectContentProps) {
  const initialData = await getProjectBySlug(slug);

  if (!initialData) {
    notFound();
  }

  const initialMembers = await getProjectMembers(initialData.projectId).catch(() => undefined);

  return (
    <ProjectClient
      slug={slug}
      initialData={initialData}
      initialMembers={initialMembers}
    />
  );
}
