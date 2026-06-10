import { ProjectWorkItemRoute } from "@/domains/projects/components/ProjectRoutes";

type ProjectWorkItemPageProps = {
  params: Promise<{
    slug: string;
    itemId: string;
  }>;
};

export default async function ProjectWorkItemPage({ params }: ProjectWorkItemPageProps) {
  const { itemId } = await params;

  return <ProjectWorkItemRoute itemId={itemId} />;
}
