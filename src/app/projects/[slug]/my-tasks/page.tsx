import { ListTodo } from "lucide-react";

import { ProjectSectionPlaceholder } from "@/domains/projects/components/ProjectSectionPlaceholder";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectMyTasksPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectMyTasksPage({ params }: ProjectMyTasksPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell
      slug={slug}
      section={{ name: "My tasks" }}
    >
      <ProjectSectionPlaceholder
        title="My tasks"
        description="No tasks assigned."
        icon={ListTodo}
      />
    </ProjectPageShell>
  );
}
