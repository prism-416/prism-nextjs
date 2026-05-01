import { redirect } from "next/navigation";

type WorkspacePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { slug } = await params;

  redirect(`/workspaces/${encodeURIComponent(slug)}/projects`);
}
