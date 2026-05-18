import LandingCapabilityCard from "./LandingCapabilityCard";
import LandingSectionIntro from "./LandingSectionIntro";
import LandingSectionShell from "./LandingSectionShell";
import { LANDING_CAPABILITIES, LANDING_CAPABILITIES_INTRO } from "../constants/content";

export default function LandingCapabilitiesSection() {
  return (
    <LandingSectionShell
      id="capabilities"
      className="scroll-mt-20 border-b border-border bg-surface-strong py-16 md:py-20 lg:py-24"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <LandingSectionIntro {...LANDING_CAPABILITIES_INTRO} />
      </div>

      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
        {LANDING_CAPABILITIES.map(({ title, description, icon, signal }) => (
          <LandingCapabilityCard
            key={title}
            title={title}
            description={description}
            icon={icon}
            signal={signal}
          />
        ))}
      </div>
    </LandingSectionShell>
  );
}
