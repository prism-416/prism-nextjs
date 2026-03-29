import { Typography } from "@/atomics/atoms/Typography";

type LandingSignalCardProps = {
  label: string;
  value: string;
};

export default function LandingSignalCard({ label, value }: LandingSignalCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-sm backdrop-blur">
      <Typography
        variant="overline"
        tone="muted"
        className="tracking-[0.18em]"
      >
        {label}
      </Typography>
      <Typography
        variant="title"
        tone="inherit"
        className="mt-2 text-prism-navy"
        align="center"
      >
        {value}
      </Typography>
    </div>
  );
}
