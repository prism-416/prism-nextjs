import { ArrowRight, type LucideIcon } from "lucide-react";

type LandingCapabilityCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function LandingCapabilityCard({
  title,
  description,
  icon: Icon,
}: LandingCapabilityCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-[image:var(--gradient-capability-card)] p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-prism-teal-500/60 hover:shadow-xl hover:shadow-prism-teal-500/10">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-prism-teal-500/10 blur-2xl transition group-hover:bg-prism-teal-500/20" />
      <div className="relative flex size-12 items-center justify-center rounded-2xl bg-prism-navy text-white shadow-lg shadow-prism-navy/15">
        <Icon
          className="size-5"
          aria-hidden
        />
      </div>
      <h3 className="relative mt-6 text-xl font-semibold text-prism-navy">{title}</h3>
      <p className="relative mt-3 text-sm leading-7 text-prism-muted">{description}</p>
      <div className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-prism-navy">
        Operational clarity by design
        <ArrowRight
          className="size-4 transition group-hover:translate-x-1"
          aria-hidden
        />
      </div>
    </article>
  );
}
