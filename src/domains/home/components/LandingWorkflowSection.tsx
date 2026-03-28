import { Layers } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";

import LandingOperatingStepCard from "./LandingOperatingStepCard";
import LandingSectionIntro from "./LandingSectionIntro";
import LandingSectionShell from "./LandingSectionShell";
import { LANDING_OPERATING_STEPS, LANDING_WORKFLOW_HIGHLIGHT, LANDING_WORKFLOW_INTRO } from "../constants/content";

export default function LandingWorkflowSection() {
  return (
    <LandingSectionShell
      id="workflow"
      className="scroll-mt-20 border-b border-border bg-(image:--gradient-workflow-surface) py-20 md:py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div>
          <LandingSectionIntro {...LANDING_WORKFLOW_INTRO} />

          <div className="mt-8 rounded-[1.75rem] border border-border bg-prism-navy p-6 text-white shadow-xl shadow-prism-navy/10">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
                <Layers
                  className="size-5"
                  aria-hidden
                />
              </div>
              <div>
                <Typography
                  variant="bodySm"
                  tone="inverse"
                  weight="semibold"
                >
                  {LANDING_WORKFLOW_HIGHLIGHT.title}
                </Typography>
                <Typography
                  variant="bodySm"
                  tone="inverse"
                  className="text-white/70"
                >
                  {LANDING_WORKFLOW_HIGHLIGHT.description}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <ol className="grid gap-4">
          {LANDING_OPERATING_STEPS.map(item => (
            <LandingOperatingStepCard
              key={item.step}
              step={item.step}
              title={item.title}
              description={item.description}
            />
          ))}
        </ol>
      </div>
    </LandingSectionShell>
  );
}
