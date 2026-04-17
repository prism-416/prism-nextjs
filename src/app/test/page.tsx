import MainLayout from "@/atomics/templates/MainLayout";
import { AppHeader } from "@/domains/workspace/components/AppHeader";
import { AppSidebar } from "@/domains/workspace/components/AppSidebar";

export default function TestPage() {
  return (
    <MainLayout
      header={
        <AppHeader
          workspace={{ name: "Prism" }}
          project={{ name: "prism" }}
        />
      }
      sidebar={<AppSidebar />}
    >
      <div>
        <h1>Test Page</h1>
      </div>
    </MainLayout>
  );
}
