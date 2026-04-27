import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

export default function TestPage() {
  return (
    <WorkspaceShell
      workspace={{ name: "Prism" }}
      project={{ name: "prism" }}
    >
      <div>
        <h1>Test Page</h1>
      </div>
    </WorkspaceShell>
  );
}
