import { getProjects } from "../api";
import { ProjectsClient } from "./ProjectsClient";

type ProjectsContentProps = {
  slug: string;
};

export async function ProjectsContent({ slug }: ProjectsContentProps) {
  const initialData = await getProjects(slug);

  return (
    <ProjectsClient
      slug={slug}
      initialData={initialData}
    />
  );
}
