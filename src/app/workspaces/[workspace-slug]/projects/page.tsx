import { ProjectsContent } from "@/domains/projects/components/ProjectsContent";
import { Suspense } from "react";

export default function ProjectsPage() {
  return (
    <Suspense>
      <ProjectsContent />
    </Suspense>
  );
}
