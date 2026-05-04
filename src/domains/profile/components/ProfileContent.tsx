import { getCurrentUser } from "@/shared/api/auth";
import { ProfileClient } from "@/domains/profile/components/ProfileClient";

export async function ProfileContent() {
  const initialData = await getCurrentUser();

  return <ProfileClient initialData={initialData ?? undefined} />;
}
