import { Suspense } from "react";
import { SignInForm } from "@/domains/auth/components/SignInForm";
import { GitHubCallbackHandler } from "@/domains/auth/components/GitHubCallbackHandler";

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const hasOAuthCallback = typeof params.code === "string" && typeof params.state === "string";

  if (hasOAuthCallback) {
    return (
      <Suspense>
        <GitHubCallbackHandler />
      </Suspense>
    );
  }

  return <SignInForm />;
}
