import LandingCapabilityCard from "./LandingCapabilityCard";
import LandingSectionIntro from "./LandingSectionIntro";
import LandingSectionShell from "./LandingSectionShell";
import { LANDING_CAPABILITIES, LANDING_CAPABILITIES_INTRO } from "../constants/content";

export default function LandingCapabilitiesSection() {
  return (
    <LandingSectionShell
      id="capabilities"
      className="scroll-mt-20 border-b border-border bg-surface-strong py-20 md:py-24"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <LandingSectionIntro {...LANDING_CAPABILITIES_INTRO} />
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {LANDING_CAPABILITIES.map(({ title, description, icon }) => (
          <LandingCapabilityCard
            key={title}
            title={title}
            description={description}
            icon={icon}
          />
        ))}
      </div>
    </LandingSectionShell>
  );
}
