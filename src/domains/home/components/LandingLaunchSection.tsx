import Container from "@/atomics/atoms/Container";
import { Typography } from "@/atomics/atoms/Typography";

import LandingCtaLink from "./LandingCtaLink";
import { LANDING_LAUNCH } from "../constants/content";

export default function LandingLaunchSection() {
  return (
    <section
      id="launch"
      aria-labelledby="launch-heading"
      className="scroll-mt-20 bg-(image:--gradient-launch-surface) py-16 md:py-20 lg:py-24"
    >
      <Container>
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 p-6 text-center shadow-2xl shadow-prism-navy/20 backdrop-blur sm:rounded-4xl sm:p-8 md:p-12">
          <Typography
            variant="overline"
            tone="inverse"
            weight="medium"
            className="text-white/70"
          >
            {LANDING_LAUNCH.eyebrow}
          </Typography>
          <Typography
            id="launch-heading"
            variant="h2"
            tone="inverse"
            wrap="balance"
            className="mx-auto mt-4 max-w-3xl text-[2rem] sm:text-[2.25rem] md:text-5xl"
            align="center"
          >
            {LANDING_LAUNCH.title}
          </Typography>
          <Typography
            variant="body"
            tone="inverse"
            wrap="pretty"
            fontSize="lg"
            lineHeight="7"
            className="mx-auto mt-5 max-w-2xl text-white/76 md:text-lg"
            align="center"
          >
            {LANDING_LAUNCH.description}
          </Typography>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
            <LandingCtaLink
              href={LANDING_LAUNCH.primaryCta.href}
              label={LANDING_LAUNCH.primaryCta.label}
              variant="inversePrimary"
            />
            <LandingCtaLink
              href={LANDING_LAUNCH.secondaryCta.href}
              label={LANDING_LAUNCH.secondaryCta.label}
              variant="inverseSecondary"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
