import { notFound } from "next/navigation";

import { getProjectWorkItem, getProjectWorkItemChildren } from "@/domains/projects/api";
import { ProjectWorkItemClient } from "@/domains/projects/components/ProjectWorkItemClient";

type ProjectWorkItemContentProps = {
  projectId: string;
  projectSlug: string;
  itemId: string;
};

export async function ProjectWorkItemContent({ projectId, projectSlug, itemId }: ProjectWorkItemContentProps) {
  const initialWorkItem = await getProjectWorkItem(projectId, itemId);

  if (!initialWorkItem) {
    notFound();
  }

  const initialChildren = await getProjectWorkItemChildren(projectId, itemId).catch(() => undefined);

  return (
    <ProjectWorkItemClient
      projectId={projectId}
      projectSlug={projectSlug}
      itemId={itemId}
      initialWorkItem={initialWorkItem}
      initialChildren={initialChildren}
    />
  );
}
