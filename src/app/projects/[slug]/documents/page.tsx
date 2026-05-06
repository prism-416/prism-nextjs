import { Files } from "lucide-react";

import { ProjectSectionPlaceholder } from "@/domains/projects/components/ProjectSectionPlaceholder";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectDocumentsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDocumentsPage({ params }: ProjectDocumentsPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell
      slug={slug}
      section={{ name: "Documents" }}
    >
      <ProjectSectionPlaceholder
        title="Documents"
        description="No documents yet."
        icon={Files}
      />
    </ProjectPageShell>
  );
}
