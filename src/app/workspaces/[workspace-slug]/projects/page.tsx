import MainLayout from "@/atomics/templates/MainLayout";
import { ProjectsContent } from "@/domains/projects/components/ProjectsContent";
import { AppHeader } from "@/domains/workspace/components/AppHeader";
import AppSidebar from "@/domains/workspace/components/AppSidebar";
import { Suspense } from "react";

export default function ProjectsPage() {
  return (
    <MainLayout
      header={<AppHeader />}
      sidebar={<AppSidebar />}
    >
      <Suspense>
        <ProjectsContent />
      </Suspense>
    </MainLayout>
  );
}
