import { CalendarRange } from "lucide-react";

import { ProjectSectionPlaceholder } from "@/domains/projects/components/ProjectSectionPlaceholder";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectSprintsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectSprintsPage({ params }: ProjectSprintsPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell
      slug={slug}
      section={{ name: "Sprints" }}
    >
      <ProjectSectionPlaceholder
        title="Sprints"
        description="No sprints yet."
        icon={CalendarRange}
      />
    </ProjectPageShell>
  );
}
