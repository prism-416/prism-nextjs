import { Suspense } from "react";

import { ProjectMembersContent } from "@/domains/projects/components/ProjectMembersContent";
import { ProjectMembersSkeleton } from "@/domains/projects/components/ProjectMembersSkeleton";

import { ProjectPageShell } from "../_components/ProjectPageShell";

type ProjectMembersPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectMembersPage({ params }: ProjectMembersPageProps) {
  const { slug } = await params;

  return (
    <ProjectPageShell
      slug={slug}
      section={{ name: "Members" }}
    >
      {({ workspaceSlug }) => (
        <Suspense fallback={<ProjectMembersSkeleton />}>
          <ProjectMembersContent
            slug={slug}
            workspaceSlug={workspaceSlug}
          />
        </Suspense>
      )}
    </ProjectPageShell>
  );
}
