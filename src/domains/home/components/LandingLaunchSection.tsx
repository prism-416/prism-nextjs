import { Typography } from "@/atomics/atoms/Typography";

import LandingCtaLink from "./LandingCtaLink";
import { LANDING_LAUNCH } from "../constants/content";

export default function LandingLaunchSection() {
  return (
    <div className="overflow-hidden rounded-4xl border border-white/10 bg-white/6 p-8 text-center shadow-2xl shadow-prism-navy/20 backdrop-blur md:p-12">
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
        className="mx-auto mt-4 max-w-3xl md:text-5xl"
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
      <div className="mt-10 flex flex-wrap justify-center gap-3">
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
  );
}
