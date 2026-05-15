import Container from "@/atomics/atoms/Container";
import { Typography } from "@/atomics/atoms/Typography";

import { LANDING_TRUST_COMPANIES } from "../constants/content";

export default function LandingTrustBar() {
  return (
    <section
      aria-label="Trusted by product teams"
      className="border-b border-border bg-surface-strong/88 py-8"
    >
      <Container>
        <div className="flex flex-col gap-5 rounded-[1.75rem] border border-border bg-white/72 px-5 py-5 shadow-[0_14px_40px_rgba(12,71,103,0.06)] md:flex-row md:items-center md:justify-between md:px-7">
          <Typography
            variant="overline"
            tone="muted"
            weight="medium"
            className="shrink-0"
          >
            Trusted by teams shipping with
          </Typography>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:flex-1 lg:justify-end">
            {LANDING_TRUST_COMPANIES.map(company => (
              <div
                key={company}
                className="flex h-10 items-center justify-center rounded-full border border-border/70 bg-prism-sand-soft/35 px-4 text-sm font-semibold text-prism-navy"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
