import type { Metadata } from "next";

import { WorkspacePage } from "@/domains/workspace/components/WorkspacePage";

export const metadata: Metadata = {
  title: "Workspace",
};

export default function WorkspacePageRoute() {
  return <WorkspacePage />;
}
