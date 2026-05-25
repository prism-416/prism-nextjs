import { getProjects } from "../api";
import { ProjectsClient } from "./ProjectsClient";

type ProjectsContentProps = {
  slug: string;
  canCreateProject: boolean;
};

export async function ProjectsContent({ slug, canCreateProject }: ProjectsContentProps) {
  const initialData = await getProjects(slug);

  return (
    <ProjectsClient
      slug={slug}
      initialData={initialData}
      canCreateProject={canCreateProject}
    />
  );
}
