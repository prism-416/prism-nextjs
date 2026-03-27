import LandingCtaLink from "./LandingCtaLink";
import { LANDING_LAUNCH } from "../constants/content";

export default function LandingLaunchSection() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-8 text-center shadow-2xl shadow-prism-navy/20 backdrop-blur md:p-12">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/70">{LANDING_LAUNCH.eyebrow}</p>
      <h2
        id="launch-heading"
        className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl"
      >
        {LANDING_LAUNCH.title}
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-white/76 md:text-lg">
        {LANDING_LAUNCH.description}
      </p>
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
