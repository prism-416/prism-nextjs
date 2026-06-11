import { Typography } from "@/atomics/atoms/Typography";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemCodeProps = {
  code: string;
  className?: string;
};

export function ProjectWorkItemCode({ code, className }: ProjectWorkItemCodeProps) {
  return (
    <Typography
      as="span"
      variant="code"
      tone="muted"
      className={cn("shrink-0 text-[11px] leading-none", className)}
    >
      {code}
    </Typography>
  );
}

type ProjectWorkItemTitleLineProps = {
  code: string;
  title: string;
  titleClassName?: string;
  layout?: "inline" | "stacked";
};

export function ProjectWorkItemTitleLine({
  code,
  title,
  titleClassName,
  layout = "stacked",
}: ProjectWorkItemTitleLineProps) {
  if (layout === "stacked") {
    return (
      <div className="min-w-0">
        <ProjectWorkItemCode code={code} />
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
          className={cn("mt-1", titleClassName)}
        >
          {title}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 items-start gap-2">
      <ProjectWorkItemCode
        code={code}
        className="mt-0.5"
      />
      <Typography
        variant="bodySm"
        tone="primary"
        weight="semibold"
        className={cn("min-w-0 flex-1", titleClassName)}
      >
        {title}
      </Typography>
    </div>
  );
}
