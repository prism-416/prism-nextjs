import { notFound } from "next/navigation";

import { getProjectParticipants, getProjectWorkItems } from "@/domains/projects/api";
import { getProjectBySlugCached } from "@/domains/projects/api/server";
import { ProjectMyTasksRoute } from "@/domains/projects/components/routes/ProjectMyTasksRoute";
import { getCurrentUserCached } from "@/shared/api/auth-server";

type ProjectMyTasksPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectMyTasksPage({ params }: ProjectMyTasksPageProps) {
  const { slug } = await params;
  const [project, initialCurrentUser] = await Promise.all([
    getProjectBySlugCached(slug),
    getCurrentUserCached().catch(() => undefined),
  ]);

  if (!project) {
    notFound();
  }

  const [initialData, initialMembers] = await Promise.all([
    initialCurrentUser
      ? getProjectWorkItems(project.projectId, { assigneeUsername: initialCurrentUser.username }).catch(() => undefined)
      : undefined,
    getProjectParticipants(project.workspaceId).catch(() => undefined),
  ]);

  return (
    <ProjectMyTasksRoute
      initialCurrentUser={initialCurrentUser}
      initialData={initialData}
      initialMembers={initialMembers}
    />
  );
}
