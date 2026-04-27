import { getProjects } from "../api";
import { ProjectsClient } from "./ProjectsClient";

type ProjectsContentProps = {
  slug: string;
  workspaceId?: string;
};

export async function ProjectsContent({ slug, workspaceId }: ProjectsContentProps) {
  const initialData = await getProjects(slug);

  return (
    <ProjectsClient
      slug={slug}
      workspaceId={workspaceId}
      initialData={initialData}
    />
  );
}
