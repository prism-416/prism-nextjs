import { useParams } from "next/navigation";
import { useProjects } from "../hooks/useProjects";
import { ProjectsClient } from "./ProjectsClient";

export function ProjectsContent() {
  const params = useParams();
  const slug = params["workspace-slug"] as string;
  const { data: initialData } = useProjects(slug ?? "");
  return <ProjectsClient initialData={initialData ?? []} />;
}
