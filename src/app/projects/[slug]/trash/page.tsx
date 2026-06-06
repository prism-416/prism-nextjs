import { ProjectTrashClient } from "@/domains/projects/components/ProjectTrashClient";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectTrashPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectTrashPage({ params }: ProjectTrashPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell
      slug={slug}
      section={{ name: "Trash" }}
    >
      {({ projectId, projectSlug }) => (
        <ProjectTrashClient
          projectId={projectId}
          projectSlug={projectSlug}
        />
      )}
    </ProjectPageShell>
  );
}
