import { Suspense } from "react";
import { SignUpOnboarding } from "@/domains/auth/components/SignUpOnboarding";

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpOnboarding />
    </Suspense>
  );
}
