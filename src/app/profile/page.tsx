import { Suspense } from "react";
import type { Metadata } from "next";

import { ProfileContent } from "@/domains/profile/components/ProfileContent";
import { ProfileSkeleton } from "@/domains/profile/components/ProfileSkeleton";
import { WorkspaceShell } from "@/domains/workspaces/components/WorkspaceShell";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <WorkspaceShell
      pathSegments={[{ name: "Profile", href: "/profile", kind: "section" }]}
      contentClassName="bg-background"
    >
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </WorkspaceShell>
  );
}
