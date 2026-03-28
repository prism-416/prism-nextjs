import { Typography } from "@/atomics/atoms/Typography";

type LandingOperatingStepCardProps = {
  step: string;
  title: string;
  description: string;
};

export default function LandingOperatingStepCard({ step, title, description }: LandingOperatingStepCardProps) {
  return (
    <li className="grid gap-4 rounded-3xl border border-border bg-surface px-5 py-5 shadow-sm backdrop-blur md:grid-cols-[auto_1fr]">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-prism-navy text-white">
        <Typography
          as="span"
          variant="bodySm"
          tone="inverse"
          weight="semibold"
          className="tracking-[0.2em]"
        >
          {step}
        </Typography>
      </div>
      <div>
        <Typography
          variant="title"
          tone="inherit"
          className="text-prism-navy"
        >
          {title}
        </Typography>
        <Typography
          variant="bodySm"
          tone="muted"
          lineHeight="7"
          className="mt-2"
        >
          {description}
        </Typography>
      </div>
    </li>
  );
}
