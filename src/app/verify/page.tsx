import { Suspense } from "react";

import { EmailVerification } from "@/domains/auth/components/EmailVerification";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <EmailVerification />
    </Suspense>
  );
}
