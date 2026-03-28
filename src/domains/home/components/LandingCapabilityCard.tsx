import { ArrowRight, type LucideIcon } from "lucide-react";

import { Typography } from "@/atomics/atoms/Typography";

type LandingCapabilityCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function LandingCapabilityCard({ title, description, icon: Icon }: LandingCapabilityCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-(image:--gradient-capability-card) p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-prism-teal-500/60 hover:shadow-xl hover:shadow-prism-teal-500/10">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-prism-teal-500/10 blur-2xl transition group-hover:bg-prism-teal-500/20" />
      <div className="relative flex size-12 items-center justify-center rounded-2xl bg-prism-navy text-white shadow-lg shadow-prism-navy/15">
        <Icon
          className="size-5"
          aria-hidden
        />
      </div>
      <Typography
        variant="title"
        tone="inherit"
        className="relative mt-6 text-prism-navy"
      >
        {title}
      </Typography>
      <Typography
        variant="bodySm"
        tone="muted"
        lineHeight="7"
        className="relative mt-3"
      >
        {description}
      </Typography>
      <div className="relative mt-8 inline-flex items-center gap-2">
        <Typography
          as="span"
          variant="bodySm"
          tone="inherit"
          weight="medium"
          className="text-prism-navy"
        >
          Operational clarity by design
        </Typography>
        <ArrowRight
          className="size-4 text-prism-navy transition group-hover:translate-x-1"
          aria-hidden
        />
      </div>
    </article>
  );
}
