import type { Workspace } from "@/domains/workspaces/types";

import { getProjects } from "../api";
import { ProjectsClient } from "./ProjectsClient";

type ProjectsContentProps = {
  slug: string;
  workspace: Pick<Workspace, "workspaceId" | "ownerId">;
  initialCanCreateProject: boolean;
};

export async function ProjectsContent({ slug, workspace, initialCanCreateProject }: ProjectsContentProps) {
  const initialData = await getProjects(slug);

  return (
    <ProjectsClient
      slug={slug}
      workspace={workspace}
      initialData={initialData}
      initialCanCreateProject={initialCanCreateProject}
    />
  );
}
