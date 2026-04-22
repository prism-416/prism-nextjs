import { useProjects } from "../hooks/useProjects";
import { ProjectsClient } from "./ProjectsClient";

export function ProjectsContent({ slug }: { slug: string }) {
  const { data: initialData } = useProjects(slug ?? "");
  return <ProjectsClient initialData={initialData ?? []} />;
}
