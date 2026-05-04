import { KeyRound } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";

export function ProfileOAuthPasswordNotice() {
  return (
    <section className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-prism-heading">Password</h2>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1"
          >
            This account signs in with an OAuth provider.
          </Typography>
        </div>
        <div className="grid size-10 place-items-center rounded-full bg-prism-navy/5 text-prism-navy">
          <KeyRound className="size-5" />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-prism-navy/5 px-4 py-3">
        <Typography
          variant="bodySm"
          tone="primary"
          weight="medium"
        >
          Password changes are unavailable for OAuth accounts.
        </Typography>
        <Typography
          variant="caption"
          tone="muted"
          className="mt-1 block"
        >
          Manage sign-in credentials from the connected provider.
        </Typography>
      </div>
    </section>
  );
}
