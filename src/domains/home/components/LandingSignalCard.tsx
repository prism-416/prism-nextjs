type LandingSignalCardProps = {
  label: string;
  value: string;
};

export default function LandingSignalCard({ label, value }: LandingSignalCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-sm backdrop-blur">
      <p className="text-xs uppercase tracking-[0.18em] text-prism-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-prism-navy">{value}</p>
    </div>
  );
}
