"use client";

import { Project } from "../types";
import { useProjects } from "../hooks/useProjects";
import { useParams } from "next/navigation";
import { Button } from "@/atomics/atoms/Button";

type ProjectsClientProps = {
  initialData: Project[] | undefined;
};

export function ProjectsClient({ initialData }: ProjectsClientProps) {
  const params = useParams();
  const slug = params["workspace-slug"] as string;
  const {
    data,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    refetch: refetchProjects,
  } = useProjects(slug, initialData);

  const handleRetry = () => {
    void refetchProjects();
  };

  if (isProjectsError)
    return (
      <div>
        Error <Button onClick={handleRetry}>Retry</Button>
      </div>
    ); // refetch with retry button;
  if (isProjectsLoading) return <>Loading...</>; // Skeleton;
  return (
    <div>
      {data?.map(project => (
        <div key={project.projectId}>{project.name}</div>
      ))}
    </div>
  );
}
