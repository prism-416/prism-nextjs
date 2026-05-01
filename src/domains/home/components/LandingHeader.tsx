import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import LandingHeaderContent from "@/domains/home/components/LandingHeaderContent";

export default async function LandingHeader() {
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value);

  return <LandingHeaderContent isAuthenticated={isAuthenticated} />;
}
