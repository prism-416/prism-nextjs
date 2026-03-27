type LandingOperatingStepCardProps = {
  step: string;
  title: string;
  description: string;
};

export default function LandingOperatingStepCard({
  step,
  title,
  description,
}: LandingOperatingStepCardProps) {
  return (
    <li className="grid gap-4 rounded-[1.5rem] border border-border bg-surface px-5 py-5 shadow-sm backdrop-blur md:grid-cols-[auto_1fr]">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-prism-navy text-sm font-semibold tracking-[0.2em] text-white">
        {step}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-prism-navy">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-prism-muted">{description}</p>
      </div>
    </li>
  );
}
